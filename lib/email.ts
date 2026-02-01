export function generateVerificationEmailHTML(token: string): string {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Verify your email - puls.bio</title>
  
  <!--[if mso]>
  <style>
    * { font-family: sans-serif !important; }
  </style>
  <![endif]-->
  
  <style>
    /* Reset styles */
    body {
      margin: 0;
      padding: 0;
      min-width: 100%;
      width: 100% !important;
      height: 100% !important;
    }
    
    body, table, td, div, p, a {
      -webkit-font-smoothing: antialiased;
      text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse !important;
      border-spacing: 0;
    }
    
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    
    /* Body styles */
    body {
      background-color: #0a0a0f;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Header gradient */
    .header-gradient {
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      padding: 40px 20px;
      text-align: center;
    }
    
    /* Logo */
    .logo {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    
    .logo-text {
      font-size: 40px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    /* Content */
    .content {
      background: #1a1a1f;
      padding: 40px 30px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      margin: 0 0 16px 0;
      text-align: center;
      line-height: 1.3;
    }
    
    .subtitle {
      font-size: 16px;
      color: #a1a1aa;
      margin: 0 0 32px 0;
      text-align: center;
      line-height: 1.6;
    }
    
    /* Button */
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 18px 48px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);
      transition: transform 0.2s;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(147, 51, 234, 0.5);
    }
    
    /* Link section */
    .link-section {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    
    .link-label {
      font-size: 14px;
      color: #71717a;
      margin: 0 0 12px 0;
      text-align: center;
    }
    
    .link-url {
      color: #9333ea;
      word-break: break-all;
      font-size: 13px;
      text-decoration: none;
      display: block;
      text-align: center;
      padding: 12px;
      background: rgba(147, 51, 234, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(147, 51, 234, 0.2);
    }
    
    /* Info box */
    .info-box {
      background: rgba(234, 179, 8, 0.1);
      border: 1px solid rgba(234, 179, 8, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .info-box p {
      color: #fbbf24;
      font-size: 14px;
      margin: 0;
      line-height: 1.6;
    }
    
    .info-icon {
      font-size: 20px;
      margin-right: 8px;
    }
    
    /* Features */
    .features {
      margin: 32px 0;
    }
    
    .feature {
      display: flex;
      align-items: flex-start;
      margin: 16px 0;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .feature-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
    }
    
    .feature-text {
      flex: 1;
    }
    
    .feature-title {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    
    .feature-desc {
      font-size: 13px;
      color: #a1a1aa;
      margin: 0;
      line-height: 1.5;
    }
    
    /* Footer */
    .footer {
      background: #0f0f14;
      padding: 32px 30px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-top: none;
      border-radius: 0 0 16px 16px;
    }
    
    .footer-text {
      color: #71717a;
      font-size: 14px;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }
    
    .footer-links {
      margin: 16px 0;
    }
    
    .footer-link {
      color: #9333ea;
      text-decoration: none;
      font-size: 13px;
      margin: 0 12px;
    }
    
    .footer-link:hover {
      color: #a855f7;
    }
    
    .social-links {
      margin: 20px 0;
    }
    
    .social-link {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      margin: 0 6px;
      text-decoration: none;
      line-height: 36px;
      font-size: 18px;
    }
    
    .copyright {
      color: #52525b;
      font-size: 12px;
      margin: 16px 0 0 0;
    }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .content {
        padding: 30px 20px !important;
      }
      
      .title {
        font-size: 24px !important;
      }
      
      .button {
        padding: 16px 36px !important;
        font-size: 15px !important;
      }
      
      .feature {
        flex-direction: column;
      }
      
      .feature-icon {
        margin-bottom: 12px;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f;">
  
  <!-- Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Gradient -->
          <tr>
            <td class="header-gradient" style="background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
              <div class="logo" style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.15); border-radius: 20px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.2); line-height: 80px;">
                <span class="logo-text" style="font-size: 40px; font-weight: bold; color: #ffffff;">P</span>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="background: #1a1a1f; padding: 40px 30px;">
              
              <h1 class="title" style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0; text-align: center;">
                Verify your email
              </h1>
              
              <p class="subtitle" style="font-size: 16px; color: #a1a1aa; margin: 0 0 32px 0; text-align: center; line-height: 1.6;">
                Welcome to <strong style="color: #ffffff;">puls.bio</strong>! 🎉<br>
                Click the button below to verify your email address and activate your account.
              </p>
              
              <!-- CTA Button -->
              <div class="button-container" style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" class="button" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);">
                  Verify Email Address
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div class="link-section" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p class="link-label" style="font-size: 14px; color: #71717a; margin: 0 0 12px 0; text-align: center;">
                  Or copy and paste this link in your browser:
                </p>
                <a href="${verificationUrl}" class="link-url" style="color: #9333ea; word-break: break-all; font-size: 13px; text-decoration: none; display: block; text-align: center; padding: 12px; background: rgba(147, 51, 234, 0.1); border-radius: 8px; border: 1px solid rgba(147, 51, 234, 0.2);">
                  ${verificationUrl}
                </a>
              </div>
              
              <!-- Warning Box -->
              <div class="info-box" style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 12px; padding: 16px; margin: 24px 0;">
                <p style="color: #fbbf24; font-size: 14px; margin: 0; line-height: 1.6;">
                  <span class="info-icon">⏱️</span> <strong>This link expires in 15 minutes</strong><br>
                  For security reasons, please verify your email soon.
                </p>
              </div>
              
              <!-- Features Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="features" style="margin: 32px 0;">
                <tr>
                  <td>
                    <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin: 0 0 16px 0;">
                      What you'll get with puls.bio:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="feature" style="display: flex; margin: 12px 0; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="feature-icon" style="width: 40px; height: 40px; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); border-radius: 10px; text-align: center; line-height: 40px; margin-right: 16px;">
                      🔗
                    </div>
                    <div class="feature-text">
                      <p class="feature-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin: 0 0 6px 0;">
                        Custom Link-in-Bio
                      </p>
                      <p class="feature-desc" style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.5;">
                        Create your personalized link page with unlimited links
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="feature" style="display: flex; margin: 12px 0; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="feature-icon" style="width: 40px; height: 40px; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); border-radius: 10px; text-align: center; line-height: 40px; margin-right: 16px;">
                      📊
                    </div>
                    <div class="feature-text">
                      <p class="feature-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin: 0 0 6px 0;">
                        Analytics Dashboard
                      </p>
                      <p class="feature-desc" style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.5;">
                        Track views, clicks, and engagement in real-time
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="feature" style="display: flex; margin: 12px 0; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="feature-icon" style="width: 40px; height: 40px; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); border-radius: 10px; text-align: center; line-height: 40px; margin-right: 16px;">
                      🎨
                    </div>
                    <div class="feature-text">
                      <p class="feature-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin: 0 0 6px 0;">
                        Full Customization
                      </p>
                      <p class="feature-desc" style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.5;">
                        Personalize colors, fonts, and layouts to match your brand
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="background: #0f0f14; padding: 32px 30px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.05);">
              
              <p class="footer-text" style="color: #71717a; font-size: 14px; margin: 0 0 16px 0; line-height: 1.6;">
                If you didn't create an account with <strong style="color: #ffffff;">puls.bio</strong>,<br>
                you can safely ignore this email.
              </p>
              
              <div class="footer-links" style="margin: 16px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="footer-link" style="color: #9333ea; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
                <span style="color: #52525b;">•</span>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" class="footer-link" style="color: #9333ea; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
                <span style="color: #52525b;">•</span>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" class="footer-link" style="color: #9333ea; text-decoration: none; font-size: 13px; margin: 0 12px;">Terms</a>
              </div>
              
              <div class="social-links" style="margin: 20px 0;">
                <a href="https://twitter.com/pulsbio" class="social-link" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; margin: 0 6px; text-decoration: none; line-height: 36px; font-size: 18px;">🐦</a>
                <a href="https://instagram.com/pulsbio" class="social-link" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; margin: 0 6px; text-decoration: none; line-height: 36px; font-size: 18px;">📸</a>
                <a href="https://discord.gg/pulsbio" class="social-link" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; margin: 0 6px; text-decoration: none; line-height: 36px; font-size: 18px;">💬</a>
              </div>
              
              <p class="copyright" style="color: #52525b; font-size: 12px; margin: 16px 0 0 0;">
                © 2024 puls.bio - All rights reserved
              </p>
              
            </td>
          </tr>
          
        </table>
        <!-- End Email Container -->
        
      </td>
    </tr>
  </table>
  <!-- End Wrapper -->
  
</body>
</html>
  `.trim();
}

/**
 * Plain text version of the email
 */
export function generateVerificationEmailText(token: string): string {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return `
Verify your email - puls.bio

Welcome to puls.bio! 🎉

Click the link below to verify your email address and activate your account:

${verificationUrl}

⏱️ This link expires in 15 minutes
For security reasons, please verify your email soon.

What you'll get with puls.bio:

🔗 Custom Link-in-Bio
Create your personalized link page with unlimited links

📊 Analytics Dashboard
Track views, clicks, and engagement in real-time

🎨 Full Customization
Personalize colors, fonts, and layouts to match your brand

---

If you didn't create an account with puls.bio, you can safely ignore this email.

Need help? Visit: ${process.env.NEXT_PUBLIC_APP_URL}/help
Privacy Policy: ${process.env.NEXT_PUBLIC_APP_URL}/privacy
Terms of Service: ${process.env.NEXT_PUBLIC_APP_URL}/terms

© ${new Date().getFullYear()} puls.bio - All rights reserved
  `.trim();
}