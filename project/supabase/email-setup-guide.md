# Supabase Email Setup Guide

## 🔧 Setting Up Email Functionality

To make the forgot password functionality work, you need to configure email settings in your Supabase project.

### 📧 Step 1: Configure Email Provider

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com)
   - Select your project

2. **Go to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings"

3. **Configure Email Provider**
   - Scroll down to "Email Templates"
   - You can use the default Supabase email provider or configure a custom SMTP

### 📧 Step 2: Using Default Supabase Email (Recommended for Testing)

1. **Enable Email Confirmation**
   - In Authentication Settings, make sure "Enable email confirmations" is ON
   - This will use Supabase's built-in email service

2. **Test Email Sending**
   - Go to "Users" in the Authentication section
   - You can manually trigger password reset emails from here

### 📧 Step 3: Using Custom SMTP (For Production)

1. **Get SMTP Credentials**
   - Use services like Gmail, SendGrid, Mailgun, etc.
   - Get your SMTP host, port, username, and password

2. **Configure SMTP in Supabase**
   - In Authentication Settings, scroll to "SMTP Settings"
   - Enter your SMTP credentials:
     ```
     Host: smtp.gmail.com (or your provider)
     Port: 587 (or your provider's port)
     Username: your-email@gmail.com
     Password: your-app-password
     ```

### 📧 Step 4: Customize Email Templates

1. **Go to Email Templates**
   - In Authentication Settings, find "Email Templates"

2. **Customize Password Reset Template**
   - Click on "Password Reset"
   - Customize the subject and content
   - Use variables like `{{ .ConfirmationURL }}` for the reset link

### 📧 Step 5: Test the Functionality

1. **Test Password Reset**
   - Go to your app's forgot password page
   - Enter a valid email address
   - Check if the email is received

2. **Check Email Delivery**
   - Check your email inbox (and spam folder)
   - The email should contain a reset link

### 🔍 Troubleshooting

#### Email Not Sending
1. **Check Supabase Logs**
   - Go to "Logs" in your Supabase dashboard
   - Look for email-related errors

2. **Verify Email Configuration**
   - Make sure SMTP settings are correct
   - Check if email provider is working

3. **Check Rate Limits**
   - Some email providers have rate limits
   - Wait a few minutes between attempts

#### Reset Link Not Working
1. **Check URL Configuration**
   - Make sure the redirect URL is correct
   - Should be: `https://your-domain.com/reset-password`

2. **Verify Token Expiry**
   - Reset tokens expire after 1 hour by default
   - Request a new reset if token is expired

### 📋 Email Template Example

Here's a sample password reset email template:

**Subject:** Reset Your Password - EduFees Management System

**Content:**
```
Hello,

You requested to reset your password for the EduFees Management System.

Click the link below to reset your password:

{{ .ConfirmationURL }}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
EduFees Management System Team
```

### 🚀 Production Recommendations

1. **Use a Professional Email Service**
   - SendGrid, Mailgun, or AWS SES
   - Better deliverability and monitoring

2. **Set Up Email Monitoring**
   - Monitor email delivery rates
   - Set up alerts for failures

3. **Customize Email Templates**
   - Add your branding
   - Include support contact information

4. **Test Thoroughly**
   - Test with different email providers
   - Check spam folder placement

### 📞 Support

If you're still having issues:
1. Check Supabase documentation
2. Review your email provider's documentation
3. Check Supabase community forums 