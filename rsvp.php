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

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';


function sendEmail($to, $subject, $message)
{
    // ob_start(); // Start output buffering
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Mailer = "smtp";
    $mail->SMTPDebug  = 1;
    $mail->SMTPAuth   = TRUE;
    $mail->SMTPSecure = "ssl";
    $mail->Port       = 465;
    $mail->Host       = "mail-server.h2mdns.net";
    $mail->Username   = "simonrita@m.h2m.me";
    $mail->Password   = "X2(o.k~@eEcy";
    $mail->IsHTML(true);
    $mail->AddAddress($to, "RSVP SIMON AND RITA");
    $mail->SetFrom("simonrita@m.h2m.me", "SIMON AND RITA");
    // $mail->AddReplyTo($to, "reply-to-name");
    // $mail->AddCC("cc-recipient-email@domain", "cc-recipient-name");
    $mail->Subject = $subject;
    $content = $message;
    $mail->MsgHTML($content);

    if ($mail->send()) {
        // ob_end_clean(); // Discard the output buffer
        header("HTTP/1.1 200 OK");
    } else {
        echo "Error sending email";
    }
}

sendEmail(
    $data['email'],
    "RSVP SIMON AND RITA",
    "<b>  name:" . $data['name'] . "</b>" .
        "<b>  isAttending:" . $data['guests'] . "  </b>" .
        "<b>  numberof guests:" . $data['n_persons'] . "  </b>"
);
