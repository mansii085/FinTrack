export const getResetPasswordTemplate = (resetURL) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e293b;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid #334155;
        }
        .header {
          padding: 30px 40px;
          text-align: center;
          border-bottom: 1px solid #334155;
        }
        .header h1 {
          margin: 0;
          color: #14b8a6; /* FinTrack Teal/Mint */
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px;
        }
        .content h2 {
          color: #f8fafc;
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .content p {
          color: #94a3b8;
          font-size: 15px;
          margin-bottom: 24px;
        }
        .btn-container {
          text-align: center;
          margin: 32px 0;
        }
        .btn {
          display: inline-block;
          background-color: #14b8a6;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #0d9488;
        }
        .fallback {
          font-size: 13px;
          color: #64748b;
          word-break: break-all;
          margin-bottom: 30px;
          padding: 16px;
          background-color: #0f172a;
          border-radius: 6px;
          border: 1px dashed #334155;
        }
        .fallback a {
          color: #14b8a6;
        }
        .warning {
          font-size: 13px;
          color: #64748b;
          border-top: 1px solid #334155;
          padding-top: 24px;
        }
        .footer {
          text-align: center;
          padding: 24px 40px;
          background-color: #0f172a;
          font-size: 13px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FinTrack</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your FinTrack account. Click the button below to choose a new password. This link will expire in <strong>10 minutes</strong>.</p>
          
          <div class="btn-container">
            <a href="${resetURL}" class="btn">Reset Password</a>
          </div>

          <div class="fallback">
            If the button doesn't work, copy and paste this URL into your browser:<br>
            <a href="${resetURL}">${resetURL}</a>
          </div>

          <div class="warning">
            If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} FinTrack Team. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
