<?php

/** *
 * Template Name: rsvp
 *
 * */

header('Content-Type: application/json');
// Set the allowed origin(s) for cross-origin requests
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin

// Set other headers to allow specific HTTP methods
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // $data now contains the decoded JSON data as an associative array
}

require_once 'vendor/autoload.php';

$transport = (new Swift_SmtpTransport('mail-server.h2mdns.net', 465))
    ->setUsername('simonrita@m.h2m.me')
    ->setPassword('X2(o.k~@eEcy');

$mailer = new Swift_Mailer($transport);

$message = (new Swift_Message('Test Subject'))
    ->setFrom(['simonrita@m.h2m.me' => 'Your Name'])
    ->setTo(['Kouyoumdjianmike@gmail.com' => 'Recipient Name'])
    ->setBody('<p>This is a <b>test email</b> sent with SwiftMailer.</p>', 'text/html')
    ->addPart('This is a test email sent with SwiftMailer.', 'text/plain');

$result = $mailer->send($message);
echo $result ? 'Message sent successfully' : 'Failed to send message';