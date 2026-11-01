<?php
/**
 * Payment Processing Routes
 */

function handlePaymentRoutes($path, $method) {
    switch ($path) {
        case '/api/payments/initiate':
            if ($method === 'POST') {
                initiatePayment();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case '/api/payments/mpesa-callback':
            if ($method === 'POST') {
                handleMpesaCallback();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        case '/api/payments/status':
            if ($method === 'GET') {
                getPaymentStatus();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Payment route not found']);
            break;
    }
}

function initiatePayment() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($data['studentId']) || !isset($data['amount']) || !isset($data['phoneNumber'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: studentId, amount, phoneNumber'
        ]);
        return;
    }
    
    // Generate payment reference
    $reference = 'KHS' . date('Ymd') . strtoupper(uniqid());
    
    // In production, integrate with M-Pesa API here
    // For now, simulate payment initiation
    $response = [
        'success' => true,
        'data' => [
            'paymentReference' => $reference,
            'amount' => $data['amount'],
            'studentId' => $data['studentId'],
            'status' => 'pending',
            'message' => 'Payment request initiated. Please complete payment on your phone.'
        ]
    ];
    
    echo json_encode($response);
}

function handleMpesaCallback() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Process M-Pesa callback
    // In production, validate callback from M-Pesa and update payment status
    $response = [
        'success' => true,
        'message' => 'Payment callback received'
    ];
    
    echo json_encode($response);
}

function getPaymentStatus() {
    $paymentRef = $_GET['reference'] ?? null;
    
    if (!$paymentRef) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Payment reference required'
        ]);
        return;
    }
    
    // Query payment status from database
    $response = [
        'success' => true,
        'data' => [
            'paymentReference' => $paymentRef,
            'status' => 'completed', // or 'pending', 'failed'
            'amount' => 0,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ];
    
    echo json_encode($response);
}
?>
