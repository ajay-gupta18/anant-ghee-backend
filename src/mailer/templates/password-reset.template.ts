export default function getPasswordResetEmailTemplate(name: string, resetLink: string, logoLink: string, supportMailId: string) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .email-header img {
            max-width: 150px;
        }

        .email-body {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }

        .email-body h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .email-body p {
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            padding: 12px 25px;
            background-color: #5c6bc0;
            color: #fff;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            transition: background-color 0.3s ease;
        }

        .btn:hover {
            background-color: #3f51b5;
        }

        .email-footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777;
        }

        .email-footer p {
            margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                padding: 15px;
            }

            .email-body h1 {
                font-size: 22px;
            }

            .btn {
                width: 100%;
                padding: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="email-header">
            <img src=${logoLink} alt="Brand Logo">
        </div>

        <!-- Body Section -->
        <div class="email-body">
            <h1>Password Reset Request</h1>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. To proceed, please click the button below:</p>
            <a href=${resetLink} class="btn">Reset Your Password</a>
            <p>If you didn't request a password reset, please ignore this email. Your password won't be changed.</p>
            <p>Thank you,<br>Your Company Team</p>
        </div>

        <!-- Footer Section -->
        <div class="email-footer">
            <p>If you have any questions, feel free to contact us at <a href=${supportMailId}>support@example.com</a></p>
        </div>
    </div>
</body>

</html>
`
}