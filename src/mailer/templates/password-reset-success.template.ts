export default function getPasswordResetSuccessEmailTemplate(name: string, companyName: string, logoLink: string, supportMailId: string) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            background-color: #f4f7fc;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            margin-bottom: 25px;
        }

        .email-header img {
            max-width: 120px;
        }

        .email-body h1 {
            font-size: 24px;
            margin-bottom: 15px;
            color: #222;
        }

        .email-body p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
        }

        @media (max-width: 600px) {
            .email-container {
                padding: 20px;
            }

            .email-body h1 {
                font-size: 22px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <img src=${logoLink} alt="Company Logo">
        </div>

        <div class="email-body">
            <h1>Password Reset Successful</h1>
            <p>Hi ${name},</p>
            <p>This is a confirmation that your password has been successfully changed. You can now sign in using your new password.</p>
            <p>If you did not initiate this change, please contact our support team immediately.</p>
            <p>Thank you,<br>The ${companyName} Team</p>
        </div>

        <div class="email-footer">
            <p>Need help? <a href=${supportMailId}>Contact Support</a></p>
        </div>
    </div>
</body>

</html>
`
}