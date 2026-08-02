<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Update these values for your local/production database. Do not put production credentials in Git.
$host = getenv('PORTFOLIO_DB_HOST') ?: 'localhost';
$dbname = getenv('PORTFOLIO_DB_NAME') ?: 'portfolio';
$username = getenv('PORTFOLIO_DB_USER') ?: 'root';
$password = getenv('PORTFOLIO_DB_PASSWORD') ?: '';

// Hidden honeypot field: bots commonly fill it, while real visitors never see it.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Unable to process this request.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete every field.']);
    exit;
}
if (mb_strlen($name) > 100 || mb_strlen($email) > 254 || mb_strlen($message) > 5000 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please provide valid contact details.']);
    exit;
}

// Optional Cloudflare Turnstile verification. Enable it by setting TURNSTILE_SECRET_KEY.
$turnstileSecret = getenv('TURNSTILE_SECRET_KEY') ?: '';
if ($turnstileSecret !== '') {
    $token = (string) ($_POST['cf-turnstile-response'] ?? '');
    $verification = stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/x-www-form-urlencoded\r\n", 'content' => http_build_query(['secret' => $turnstileSecret, 'response' => $token]), 'timeout' => 8]]);
    $response = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $verification);
    $result = $response ? json_decode($response, true) : null;
    if (!is_array($result) || empty($result['success'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Spam check could not be verified. Please try again.']);
        exit;
    }
}

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $statement = $pdo->prepare('INSERT INTO contact_messages (name, email, message) VALUES (:name, :email, :message)');
    $statement->execute([':name' => $name, ':email' => $email, ':message' => $message]);
    echo json_encode(['success' => true, 'message' => 'Message saved.']);
} catch (PDOException $exception) {
    error_log('Portfolio contact database error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to save your message right now.']);
}
