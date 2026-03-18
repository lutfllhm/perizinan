# Deploy ke VPS Hostinger KVM (Nginx + PM2) untuk `license.iwareid.com`

Panduan ini memakai **1 cara paling stabil**:

- **Backend**: Node.js + Express + MySQL, jalan di `127.0.0.1:5000` (tidak dibuka publik) via **PM2**
- **Frontend**: React build diserve oleh **Nginx**
- **Reverse proxy**: Nginx meneruskan request **`/api/*`** ke backend, dan **`/uploads/*`** ke backend
- **HTTPS**: Let’s Encrypt (Certbot)

> Asumsi OS VPS: **Ubuntu 22.04/24.04**. Semua perintah dijalankan lewat SSH dan butuh akses `sudo`.

---

## 0) DNS (wajib sebelum SSL)

Di DNS domain `iwareid.com`, buat **A record**:

- **Host/Name**: `license`
- **Value**: `IP VPS`
- **TTL**: bebas (mis. 300)

Tunggu propagasi (biasanya 1–15 menit).

---

## 1) Login ke VPS & install kebutuhan

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git ufw certbot python3-certbot-nginx
```

Install Node.js 18 dan PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
node -v
npm -v
pm2 -v
```

Firewall (opsional tapi disarankan):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## 2) Taruh project di VPS

Rekomendasi: letakkan code di `/var/www/perizinan`.

```bash
sudo mkdir -p /var/www/perizinan
sudo chown -R $USER:$USER /var/www/perizinan
cd /var/www/perizinan
git clone <URL_REPO_GIT_KAMU> .
```

Pastikan struktur ini ada:

- `/var/www/perizinan/backend`
- `/var/www/perizinan/frontend`

---

## 3) Siapkan MySQL

### Opsi A (paling mudah): MySQL di VPS

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

Buat database & user:

```bash
sudo mysql -e "CREATE DATABASE perizinan CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
sudo mysql -e "CREATE USER 'perizinan_user'@'localhost' IDENTIFIED BY 'PASSWORD_KUAT';"
sudo mysql -e "GRANT ALL PRIVILEGES ON perizinan.* TO 'perizinan_user'@'localhost'; FLUSH PRIVILEGES;"
```

### Opsi B: MySQL managed (Hostinger/Remote)

Gunakan host/user/pass/db dari panel. Pastikan **akses dari IP VPS diizinkan** (whitelist) jika diperlukan.

---

## 4) Konfigurasi `.env` backend

```bash
cd /var/www/perizinan/backend
nano .env
```

Isi contoh (sesuaikan):

```env
PORT=5000

MYSQLHOST=127.0.0.1
MYSQLPORT=3306
MYSQLUSER=perizinan_user
MYSQLPASSWORD=PASSWORD_KUAT
MYSQLDATABASE=perizinan

JWT_SECRET=GANTI_SECRET_PANJANG_RANDOM
```

Catatan:

- Wajib ganti `JWT_SECRET` (jangan pakai default).
- Backend otomatis membuat tabel & mengisi data awal saat start (sesuai implementasi `backend/server.js`).

---

## 5) Jalankan backend dengan PM2

```bash
cd /var/www/perizinan/backend
npm install
pm2 start server.js --name perizinan-backend
pm2 save
pm2 startup systemd -u $USER --hp $HOME
```

Tes backend dari VPS (harus sukses):

```bash
curl -i http://127.0.0.1:5000/health
curl -i http://127.0.0.1:5000/api/health
```

Kalau gagal:

```bash
pm2 logs perizinan-backend --lines 200
```

---

## 6) Build frontend untuk produksi

Frontend akan memanggil API via path **`/api`** di domain yang sama (Nginx yang meneruskan ke backend).

```bash
cd /var/www/perizinan/frontend
nano .env
```

Isi:

```env
REACT_APP_API_URL=/api
```

Build:

```bash
npm install
npm run build
```

---

## 7) Konfigurasi Nginx untuk `license.iwareid.com`

Buat config:

```bash
sudo nano /etc/nginx/sites-available/license.iwareid.com
```

Isi:

```nginx
server {
  listen 80;
  server_name license.iwareid.com;

  root /var/www/perizinan/frontend/build;
  index index.html;

  # React SPA
  location / {
    try_files $uri /index.html;
  }

  # API -> backend Node
  location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Uploads (bukti foto)
  location /uploads/ {
    proxy_pass http://127.0.0.1:5000/uploads/;
    proxy_set_header Host $host;
  }
}
```

Aktifkan & reload:

```bash
sudo ln -s /etc/nginx/sites-available/license.iwareid.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Tes HTTP:

- `http://license.iwareid.com`
- `http://license.iwareid.com/api/health`

---

## 8) Pasang SSL (HTTPS) Let’s Encrypt

```bash
sudo certbot --nginx -d license.iwareid.com
```

Saat diminta, pilih **redirect ke HTTPS**.

Tes HTTPS:

- `https://license.iwareid.com`
- `https://license.iwareid.com/api/health`

Auto-renew:

```bash
sudo systemctl status certbot.timer
```

---

## 9) Checklist “berhasil”

- Frontend bisa diakses: `https://license.iwareid.com`
- API OK: `https://license.iwareid.com/api/health` mengembalikan JSON
- Form pengajuan: pilih kantor -> **data karyawan muncul**
- Upload bukti: setelah submit, file bisa diakses `https://license.iwareid.com/uploads/<file>`

---

## Troubleshooting cepat

### A) `https://license.iwareid.com/api/health` 502/504

Cek backend:

```bash
pm2 status
pm2 logs perizinan-backend --lines 200
curl -i http://127.0.0.1:5000/api/health
```

### B) Frontend tampil, tapi “Gagal memuat data karyawan”

Biasanya request API tidak sampai ke backend atau base URL salah. Cek:

- Buka `https://license.iwareid.com/api/karyawan?kantor=RBM-IWARE%20SURABAYA`
  - Kalau error -> masalah proxy/backend.
- Pastikan Nginx punya block `location /api/ { ... }`.

### C) Backend gagal konek DB

Umumnya env salah atau MySQL belum dibuat. Cek:

```bash
pm2 logs perizinan-backend --lines 200
```

Jika MySQL di VPS:

```bash
sudo systemctl status mysql
sudo mysql -e "SHOW DATABASES;"
```

---

## Perintah update (kalau ada perubahan code)

Backend:

```bash
cd /var/www/perizinan
git pull
cd backend
npm install
pm2 restart perizinan-backend
```

Frontend:

```bash
cd /var/www/perizinan
git pull
cd frontend
npm install
npm run build
sudo systemctl reload nginx
```

