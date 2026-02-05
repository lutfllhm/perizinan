<?php
// Redirect ke frontend build atau backend API
$request_uri = $_SERVER['REQUEST_URI'];

// Jika request ke /api, redirect ke backend
if (strpos($request_uri, '/api') === 0) {
    header('Location: /backend' . $request_uri);
    exit;
}

// Jika file static ada di frontend/build, serve file tersebut
$file_path = __DIR__ . '/frontend/build' . $request_uri;
if (file_exists($file_path) && is_file($file_path)) {
    $mime_types = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];
    
    $ext = pathinfo($file_path, PATHINFO_EXTENSION);
    $mime = isset($mime_types[$ext]) ? $mime_types[$ext] : 'application/octet-stream';
    
    header('Content-Type: ' . $mime);
    readfile($file_path);
    exit;
}

// Default: serve index.html untuk React Router
if (file_exists(__DIR__ . '/frontend/build/index.html')) {
    header('Content-Type: text/html');
    readfile(__DIR__ . '/frontend/build/index.html');
} else {
    echo '<!DOCTYPE html>
<html>
<head>
    <title>IWARE Perizinan</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .error { color: #d32f2f; }
        .info { color: #1976d2; margin-top: 20px; }
    </style>
</head>
<body>
    <h1 class="error">Build Not Found</h1>
    <p>Frontend belum di-build. Jalankan:</p>
    <div class="info">
        <code>cd frontend && npm install && npm run build</code>
    </div>
</body>
</html>';
}
?>
