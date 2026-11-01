<?php
/**
 * PHP Backend for Payment Processing and Reports
 * Kitoo High School SMS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';
require_once 'routes/payments.php';
require_once 'routes/reports.php';

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove /php-backend prefix if present
$path = str_replace('/php-backend', '', $path);

// Route handling
if (strpos($path, '/api/payments') === 0) {
    handlePaymentRoutes($path, $method);
} elseif (strpos($path, '/api/reports') === 0) {
    handleReportRoutes($path, $method);
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Route not found'
    ]);
}
?>
