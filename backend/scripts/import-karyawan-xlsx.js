/**
 * Import karyawan dari file Excel (xlsx) ke tabel `karyawan`.
 *
 * Expected columns (case-insensitive, tolerant):
 * - kantor
 * - nama
 * - jabatan
 * - departemen
 * Optional:
 * - no_telp / notelp / phone
 * - status (aktif/nonaktif)
 *
 * Usage:
 *   cd backend
 *   npm install
 *   node scripts/import-karyawan-xlsx.js
 *
 * Notes:
 * - Default file path: ../data karyawan.xlsx (repo root)
 * - You can override with env: KARYAWAN_XLSX="C:\path\file.xlsx"
 */

const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const xlsx = require('xlsx');

// Load env from common locations (repo ignores .env).
(() => {
  const candidates = [
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '..', '.env.production'),
    path.resolve(__dirname, '..', '.env.vps'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.production'),
  ];
  const envPath = candidates.find((p) => fs.existsSync(p));
  if (envPath) {
    require('dotenv').config({ path: envPath });
    console.log('🔐 Loaded env from:', envPath);
  } else {
    require('dotenv').config();
    console.log('⚠️  No .env file found. Using process env only.');
  }
})();

function normalizeHeader(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[_-]/g, '');
}

function pickValue(row, headerMap, candidates) {
  for (const key of candidates) {
    const colName = headerMap.get(key);
    if (colName && row[colName] != null && String(row[colName]).trim() !== '') {
      return String(row[colName]).trim();
    }
  }
  return '';
}

async function main() {
  const defaultXlsxPath = path.resolve(__dirname, '..', '..', 'data karyawan.xlsx');
  const cliArgPath = process.argv.slice(2).find((a) => a && !a.startsWith('-'));
  const xlsxPathRaw = cliArgPath || process.env.KARYAWAN_XLSX || defaultXlsxPath;
  const xlsxPath = path.resolve(xlsxPathRaw);

  console.log('📄 Excel file:', xlsxPath);

  if (!fs.existsSync(xlsxPath)) {
    const usage = [
      '',
      'File Excel tidak ditemukan.',
      '',
      'Cara pakai:',
      '  npm run import-karyawan-xlsx -- "D:\\\\perizinan\\\\data karyawan.xlsx"',
      '',
      'Atau set env (di backend/.env):',
      '  KARYAWAN_XLSX="D:\\\\perizinan\\\\data karyawan.xlsx"',
      '',
      `Default (tanpa arg/env): ${defaultXlsxPath}`,
      '',
    ].join('\n');
    throw new Error(usage);
  }

  const workbook = xlsx.readFile(xlsxPath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Excel tidak punya sheet');
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false });

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('ℹ️  Tidak ada data di sheet pertama');
    return;
  }

  // Build a header normalization map based on the first row keys.
  const headerMap = new Map(); // normalized -> original
  for (const originalHeader of Object.keys(rows[0])) {
    headerMap.set(normalizeHeader(originalHeader), originalHeader);
  }

  const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
  };
  console.log('🗄️  DB config:', { host: dbConfig.host, port: dbConfig.port, user: dbConfig.user, database: dbConfig.database });

  const connection = await mysql.createConnection(dbConfig);

  let imported = 0;
  let skipped = 0;
  let updated = 0;
  let invalid = 0;

  try {
    console.log(`🔄 Memulai import dari sheet: ${sheetName} (${rows.length} baris)`);

    for (const row of rows) {
      const kantor = pickValue(row, headerMap, ['kantor', 'office', 'cabang']);
      const nama = pickValue(row, headerMap, ['nama', 'name', 'karyawan', 'namakaryawan']);
      const jabatan = pickValue(row, headerMap, ['jabatan', 'posisi', 'position']);
      const departemen = pickValue(row, headerMap, ['departemen', 'department', 'dept', 'divisi', 'division']);
      const noTelp = pickValue(row, headerMap, ['notelp', 'no_telp', 'telp', 'telepon', 'whatsapp', 'phone', 'hp']);
      const statusRaw = pickValue(row, headerMap, ['status']);
      const status = (statusRaw || 'aktif').toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif';

      if (!kantor || !nama || !jabatan || !departemen) {
        invalid++;
        continue;
      }

      try {
        await connection.query(
          `INSERT INTO karyawan (kantor, nama, jabatan, departemen, no_telp, jatah_cuti, sisa_cuti, tahun_cuti, status)
           VALUES (?, ?, ?, ?, ?, 12, 12, YEAR(CURDATE()), ?)
           ON DUPLICATE KEY UPDATE
             jabatan = VALUES(jabatan),
             departemen = VALUES(departemen),
             no_telp = CASE
               WHEN VALUES(no_telp) IS NULL OR VALUES(no_telp) = '' THEN no_telp
               ELSE VALUES(no_telp)
             END,
             status = VALUES(status)`,
          [kantor, nama, jabatan, departemen, noTelp || null, status]
        );

        // mysql2 doesn't reliably expose affectedRows for ON DUPLICATE in all cases;
        // we'll count "updated" when the row already exists.
        // Best-effort check:
        const [existing] = await connection.query(
          'SELECT id FROM karyawan WHERE kantor = ? AND nama = ? LIMIT 1',
          [kantor, nama]
        );
        if (existing.length > 0) {
          // If we inserted first time, it also exists now; so treat as imported unless duplicate key path.
          // We'll approximate by attempting insert without relying on affectedRows.
          imported++;
        } else {
          skipped++;
        }
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          skipped++;
          continue;
        }
        console.error(`❌ Gagal import "${nama}" (${kantor}):`, err.message);
      }
    }

    console.log('✅ Import selesai');
    console.log(`📥 Imported (approx): ${imported}`);
    console.log(`♻️  Updated (not tracked precisely): ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⚠️  Invalid rows (missing required cols): ${invalid}`);
  } finally {
    await connection.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Fatal error while importing Excel.');
    console.error(e && e.stack ? e.stack : e);
    process.exit(1);
  });

