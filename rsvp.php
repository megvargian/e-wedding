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

// Define the email recipients, subject, and message
$to = $data['email'];
$subject = 'RSVP SIMON AND RITA';
$message =  "<b>  name:" . $data['name'] . "</b>" .
"<b>  isAttending:" . $data['guests'] . "  </b>" .
"<b>  numberof guests:" . $data['n_persons'] . "  </b>"
$headers = array('Content-Type: text/html; charset=UTF-8');

// Send the email
if (wp_mail($to, $subject, $message, $headers)) {
    echo 'Email sent successfully!';
} else {
    echo 'Failed to send email.';
}
?>
