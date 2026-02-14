import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourstudio.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendOTPEmail(email: string, otp: string) {
  const subject = 'Your AI Studio Verification Code';
  const expirationMinutes = 10;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #eef2f6; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background-color: #1a73e8; padding: 12px; border-radius: 12px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
      </div>
      
      <h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #0f172a;">Verify your identity</h2>
      <p style="font-size: 16px; text-align: center; color: #64748b; margin-bottom: 32px;">Use the following one-time code to sign in to your AI Studio account.</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1a73e8;">${otp}</span>
      </div>
      
      <div style="border-left: 4px solid #f59e0b; background-color: #fffbeb; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
        <p style="font-size: 14px; color: #92400e; margin: 0;"><strong>Security Notice:</strong> This code expires in <strong>${expirationMinutes} minutes</strong>. For your security, never share this code with anyone. AI Studio employees will never ask for your code.</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">
      
      <p style="font-size: 12px; text-align: center; color: #94a3b8; line-height: 1.6;">
        This is an automated message. If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  if (SENDGRID_API_KEY && SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
    try {
      await sgMail.send({
        to: email,
        from: FROM_EMAIL,
        subject: subject,
        html: htmlContent,
      });
      console.log(`[AUTH] Production: OTP email sent to ${email} via SendGrid`);
      return true;
    } catch (error) {
      console.error('[AUTH] SendGrid Error:', error);
      // Fallback to console if API fails
      console.log('-----------------------------------------');
      console.log(`[AUTH] FALLBACK (API Error): OTP for ${email}: ${otp}`);
      console.log('-----------------------------------------');
      return true; // Return true to allow development flow to continue
    }
  } else {
    // Development fallback
    console.log('-----------------------------------------');
    console.log(`[AUTH] DEVELOPMENT MODE (No Valid SendGrid Key)`);
    console.log(`[AUTH] OTP for ${email}: ${otp}`);
    console.log(`[AUTH] Expires in: ${expirationMinutes} minutes`);
    console.log('-----------------------------------------');
    return true;
  }
}
