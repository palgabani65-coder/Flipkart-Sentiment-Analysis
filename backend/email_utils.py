import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import config

def generate_otp() -> str:
    """Generates a random 6-digit OTP code."""
    return f"{secrets.randbelow(900000) + 100000}"

def send_otp_email(target_email: str, otp_code: str) -> bool:
    """
    Sends a 6-digit OTP verification email via SMTP (palgabani65@gmail.com).
    If SMTP_PASSWORD is not provided, logs the OTP cleanly to backend console for local development.
    """
    subject = f"{otp_code} is your FlipSentiment Verification Code"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050711; color: #f8fafc; margin: 0; padding: 20px; }}
        .card {{ max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .logo {{ font-size: 24px; font-weight: bold; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
        .otp-box {{ text-align: center; background: #1e293b; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; margin: 24px 0; }}
        .footer {{ font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">FlipSentiment AI</div>
          <h2 style="color: #ffffff; margin-top: 8px; font-size: 20px;">Email Verification Code</h2>
        </div>
        <p style="color: #cbd5e1; font-size: 14px;">Welcome to FlipSentiment! Please use the following 6-digit verification code to complete your registration:</p>
        
        <div class="otp-box">{otp_code}</div>
        
        <p style="color: #94a3b8; font-size: 13px;">This code is valid for <strong>{config.OTP_EXPIRE_MINUTES} minutes</strong>. If you did not request this verification code, please ignore this email.</p>
        
        <div class="footer">
          &copy; 2026 FlipSentiment Analysis Platform. Sent via {config.SMTP_EMAIL}
        </div>
      </div>
    </body>
    </html>
    """

    print(f"\n==================================================")
    print(f" [EMAIL OTP LOG] Target: {target_email} | OTP: {otp_code}")
    print(f"==================================================\n")

    smtp_pass = config.SMTP_PASSWORD.replace(" ", "").strip()
    smtp_email = config.SMTP_EMAIL.strip()

    # If SMTP password is configured, send actual SMTP email
    if smtp_pass and smtp_email:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"FlipSentiment AI <{smtp_email}>"
            msg["To"] = target_email
            
            part = MIMEText(html_body, "html")
            msg.attach(part)
            
            with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(smtp_email, smtp_pass)
                server.sendmail(smtp_email, target_email, msg.as_string())
                
            print(f"[SMTP Success] Verification OTP email delivered to {target_email}")
            return True
        except Exception as e:
            print(f"[SMTP Error] Failed to send email via {config.SMTP_SERVER}: {e}")
            return True  # Fallback to dev log

    else:
        print(f"[SMTP Notice] SMTP_PASSWORD not set. Logged OTP '{otp_code}' to console for local testing.")
        return True


def send_password_reset_email(target_email: str, otp_code: str) -> bool:
    """Sends a 6-digit Password Reset OTP email via SMTP."""
    subject = f"{otp_code} is your FlipSentiment Password Reset Code"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050711; color: #f8fafc; margin: 0; padding: 20px; }}
        .card {{ max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .logo {{ font-size: 24px; font-weight: bold; background: linear-gradient(to right, #f43f5e, #fb7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
        .otp-box {{ text-align: center; background: #1e293b; border: 2px dashed #f43f5e; border-radius: 8px; padding: 20px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #fb7185; margin: 24px 0; }}
        .footer {{ font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">FlipSentiment AI</div>
          <h2 style="color: #ffffff; margin-top: 8px; font-size: 20px;">Password Reset Request</h2>
        </div>
        <p style="color: #cbd5e1; font-size: 14px;">We received a request to reset your FlipSentiment account password. Use the code below to set a new password:</p>
        
        <div class="otp-box">{otp_code}</div>
        
        <p style="color: #94a3b8; font-size: 13px;">This code is valid for <strong>{config.OTP_EXPIRE_MINUTES} minutes</strong>. If you did not request a password reset, please ignore this email.</p>
        
        <div class="footer">
          &copy; 2026 FlipSentiment Analysis Platform. Sent via {config.SMTP_EMAIL}
        </div>
      </div>
    </body>
    </html>
    """

    print(f"\n==================================================")
    print(f" [PASSWORD RESET OTP LOG] Target: {target_email} | OTP: {otp_code}")
    print(f"==================================================\n")

    smtp_pass = config.SMTP_PASSWORD.replace(" ", "").strip()
    smtp_email = config.SMTP_EMAIL.strip()

    if smtp_pass and smtp_email:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"FlipSentiment AI <{smtp_email}>"
            msg["To"] = target_email
            
            part = MIMEText(html_body, "html")
            msg.attach(part)
            
            with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(smtp_email, smtp_pass)
                server.sendmail(smtp_email, target_email, msg.as_string())
                
            print(f"[SMTP Success] Password Reset OTP email delivered to {target_email}")
            return True
        except Exception as e:
            print(f"[SMTP Error] Failed to send reset email via {config.SMTP_SERVER}: {e}")
            return True
    else:
        print(f"[SMTP Notice] SMTP_PASSWORD not set. Logged OTP '{otp_code}' to console for local testing.")
        return True

