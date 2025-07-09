export default function getRegistrationEmailTemplate(name: string, dashboardLink: string) {
  return `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome Email</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .header {
      background-color: #4f46e5;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .body {
      padding: 30px;
      color: #333;
    }
    .body h2 {
      font-size: 22px;
      margin-bottom: 10px;
    }
    .body p {
      font-size: 16px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #999;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ANANT GHEE 🎉</h1>
    </div>
    <div class="body">
      <h2>Hello ${name},</h2>
      <p>
        Thank you for signing up! We're excited to have you on board. Your account has been created successfully and you're now part of our community.
      </p>
      <p>
        You can now log in and start exploring everything YourApp has to offer.
      </p>
      <a class="button" href=${dashboardLink}>Go to App</a>
    </div>
    <div class="footer">
      &copy; 2025 YourApp Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
`
}