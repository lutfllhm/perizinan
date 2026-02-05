<?php
// PHP wrapper untuk Node.js backend
// Hostinger biasanya support Node.js melalui cPanel

// Cek apakah Node.js tersedia
$node_path = trim(shell_exec('which node 2>/dev/null'));

if (empty($node_path)) {
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Node.js not available',
        'message' => 'Backend memerlukan Node.js. Aktifkan Node.js di cPanel Hostinger.',
        'instructions' => [
            '1. Login ke cPanel Hostinger',
            '2. Cari "Setup Node.js App"',
            '3. Buat aplikasi Node.js baru',
            '4. Set Application Root: /backend',
            '5. Set Application Startup File: server.js',
            '6. Klik "Create"'
        ]
    ]);
    exit;
}

// Jika Node.js tersedia, proxy request ke Node.js server
$backend_url = 'http://localhost:' . (getenv('PORT') ?: '5000');
$request_uri = $_GET['request'] ?? '';

// Forward request ke Node.js backend
$ch = curl_init($backend_url . '/api/' . $request_uri);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Forward headers
$headers = [];
foreach (getallheaders() as $key => $value) {
    if (strtolower($key) !== 'host') {
        $headers[] = "$key: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Forward body untuk POST/PUT/PATCH
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http_code);
echo $response;
?>
