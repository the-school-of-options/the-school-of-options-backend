export const EMAIL_TEMPLATES = {
  EMAIL_VERIFICATION_OTP: {
    TemplateName: "EmailVerificationOTP",
    Subject: "Verify Your AtomClass Account",
    HtmlPart: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 32px; 
            font-weight: 300; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .header .icon { 
            font-size: 48px; 
            margin-bottom: 10px; 
        }
        .content { 
            padding: 40px 30px; 
            line-height: 1.6;
        }
        .greeting { 
            font-size: 20px; 
            color: #333; 
            margin-bottom: 20px; 
            font-weight: 500;
        }
        .otp-section { 
            text-align: center; 
            margin: 35px 0; 
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
        }
        .otp-label {
            color: #6c757d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .otp-code { 
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 6px;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            margin: 10px 0;
        }
        .info-box { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
        }
        .info-title { 
            color: #856404; 
            font-weight: bold; 
            margin-bottom: 12px;
            font-size: 16px;
        }
        .info-list { 
            margin: 0; 
            padding-left: 20px; 
            color: #856404;
        }
        .info-list li { 
            margin: 8px 0; 
        }
        .cta-section {
            text-align: center;
            margin: 30px 0;
        }
        .welcome-text {
            color: #495057;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer { 
            text-align: center; 
            padding: 30px 20px; 
            color: #6c757d; 
            font-size: 14px; 
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }
        .brand { 
            color: #667eea; 
            font-weight: bold; 
            font-size: 18px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 30px 20px; }
            .otp-code { font-size: 28px; letter-spacing: 4px; padding: 15px 30px; }
            .header h1 { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon">🎓</div>
            <h1>AtomClass</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Learning Journey Starts Here</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello {{name}}!</div>
            
            <p class="welcome-text">
                Welcome to <strong>AtomClass</strong>! We're excited to have you join our community of learners. 
                To complete your registration and unlock access to our premium courses, please verify your email address.
            </p>
            
            <div class="otp-section">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">{{otp}}</div>
                <p style="margin: 15px 0 0 0; color: #6c757d; font-size: 14px;">
                    Enter this code in the verification form
                </p>
            </div>
            
            <div class="info-box">
                <div class="info-title">⏰ Important Security Information</div>
                <ul class="info-list">
                    <li>This verification code expires in <strong>{{expiryMinutes}} minutes</strong></li>
                    <li>You have <strong>5 attempts</strong> to enter the correct code</li>
                    <li>Keep this code private and never share it with anyone</li>
                    <li>If you didn't create this account, please ignore this email</li>
                </ul>
            </div>
            
            <div class="cta-section">
                <p style="color: #495057; margin-bottom: 20px;">
                    Once verified, you'll get instant access to:
                </p>
                <ul style="text-align: left; display: inline-block; color: #495057;">
                    <li>🚀 Premium course catalog</li>
                    <li>📱 Mobile and desktop learning</li>
                    <li>🏆 Completion certificates</li>
                </ul>
            </div>
            
            <p style="color: #495057; margin-top: 30px;">
                Best regards,<br>
                <span class="brand">The AtomClass Team</span>
            </p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://atomclass.com">🌐 Website</a>
                <a href="mailto:tech@atomclass.com">✉️ Support</a>
            </div>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; 2025 AtomClass. All rights reserved.</p>
            <p style="font-size: 12px; color: #adb5bd; margin-top: 15px;">
                AtomClass Learning Platform | Building Tomorrow's Skills Today
            </p>
        </div>
    </div>
</body>
</html>`,
    TextPart: `
Hello {{name}}!

Welcome to AtomClass! To complete your registration, please verify your email address.

Your verification code: {{otp}}

Important Information:
- This code expires in {{expiryMinutes}} minutes
- You have 5 attempts to enter the correct code
- Keep this code private
- If you didn't create this account, please ignore this email

Once verified, you'll have access to our premium course catalog and learning features.

Best regards,
The AtomClass Team

This is an automated message, please do not reply.
© 2025 AtomClass. All rights reserved.
`,
  },

  PASSWORD_RESET_OTP: {
    TemplateName: "PasswordResetOTP",
    Subject: "Reset Your Password",
    HtmlPart: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .header { 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 32px; 
            font-weight: 300; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .header .icon { 
            font-size: 48px; 
            margin-bottom: 10px; 
        }
        .content { 
            padding: 40px 30px; 
            line-height: 1.6;
        }
        .greeting { 
            font-size: 20px; 
            color: #333; 
            margin-bottom: 20px; 
            font-weight: 500;
        }
        .otp-section { 
            text-align: center; 
            margin: 35px 0; 
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
        }
        .otp-code { 
            display: inline-block;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 6px;
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
            margin: 10px 0;
        }
        .warning-box { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
        }
        .warning-title { 
            color: #856404; 
            font-weight: bold; 
            margin-bottom: 12px;
            font-size: 16px;
        }
        .warning-list { 
            margin: 0; 
            padding-left: 20px; 
            color: #856404;
        }
        .warning-list li { 
            margin: 8px 0; 
        }
        .footer { 
            text-align: center; 
            padding: 30px 20px; 
            color: #6c757d; 
            font-size: 14px; 
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }
        .brand { 
            color: #dc3545; 
            font-weight: bold; 
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon">🔐</div>
            <h1>Password Reset</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure Your AtomClass Account</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello {{name}}!</div>
            
            <p>We received a request to reset your AtomClass account password. If this was you, use the verification code below to proceed with resetting your password.</p>
            
            <div class="otp-section">
                <div class="otp-code">{{otp}}</div>
                <p style="margin: 15px 0 0 0; color: #6c757d; font-size: 14px;">
                    Enter this code to reset your password
                </p>
            </div>
            
            <div class="warning-box">
                <div class="warning-title">🛡️ Security Notice</div>
                <ul class="warning-list">
                    <li>This reset code expires in <strong>{{expiryMinutes}} minutes</strong></li>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Your password will remain unchanged until you complete the reset process</li>
                    <li>Never share this code with anyone - AtomClass staff will never ask for it</li>
                </ul>
            </div>
            
            <p style="color: #495057;">
                If you continue to have problems, please contact our support team at support@atomclass.com
            </p>
            
            <p style="color: #495057; margin-top: 30px;">
                Best regards,<br>
                <span class="brand">The AtomClass Security Team</span>
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated security message, please do not reply to this email.</p>
            <p>&copy; 2025 AtomClass. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    TextPart: `
Hello {{name}}!

We received a request to reset your AtomClass account password.

Your password reset link: {{otp}}

Security Notice:
- This link expires in {{expiryMinutes}} minutes
- If you didn't request this, please ignore this email

If you need help, contact support@atomclass.com

Best regards,
The AtomClass Security Team

This is an automated security message, please do not reply.
© 2025 AtomClass. All rights reserved.
`,
  },

  WELCOME_EMAIL: {
    TemplateName: "WelcomeEmail",
    Subject: "Welcome to AtomClass! Your Learning Journey Begins 🎓",
    HtmlPart: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to AtomClass</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .header { 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 32px; 
            font-weight: 300; 
        }
        .content { 
            padding: 40px 30px; 
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .features {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .feature-list {
            list-style: none;
            padding: 0;
        }
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .footer { 
            text-align: center; 
            padding: 30px 20px; 
            color: #6c757d; 
            font-size: 14px; 
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Welcome to AtomClass!</h1>
            <p>Your learning journey starts now</p>
        </div>
        
        <div class="content">
            <h2>Hello {{name}}!</h2>
            
            <p>Congratulations! Your email has been verified and your AtomClass account is now active. We're thrilled to have you join our community of learners.</p>
            
            <div class="features">
                <h3>What's Available Now:</h3>
                <ul class="feature-list">
                    <li>🚀 Access to premium courses</li>
                    <li>📱 Learn on mobile and desktop</li>
                    <li>🏆 Earn completion certificates</li>
                    <li>👨‍🏫 Get support from expert instructors</li>
                    <li>📊 Track your learning progress</li>
                </ul>
            </div>
            
            <p>Ready to start learning?</p>
            <a href="https://atomclass.com/courses" class="cta-button">Explore Courses</a>
            
            <p>If you have any questions, our support team is here to help at support@atomclass.com</p>
            
            <p>Happy learning!<br>
            <strong>The AtomClass Team</strong></p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 AtomClass. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    TextPart: `
Welcome to AtomClass!

Hello {{name}}!

Congratulations! Your email has been verified and your AtomClass account is now active.

What's Available Now:
- Access to premium courses
- Learn on mobile and desktop  
- Earn completion certificates
- Get support from expert instructors
- Track your learning progress

Start learning: https://atomclass.com/courses

Questions? Contact support@atomclass.com

Happy learning!
The AtomClass Team

© 2025 AtomClass. All rights reserved.
`,
  },
};
