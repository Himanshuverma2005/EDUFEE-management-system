# Fix Email Configuration in Supabase

## 🚨 Problem: Confirmation emails not being sent after signup

This guide will help you configure Supabase to send confirmation emails.

## 🔧 Step-by-Step Fix

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Configure Authentication Settings

1. **Click on "Authentication"** in the left sidebar
2. **Click on "Settings"** (gear icon)
3. **Scroll down to "Email Templates"**

### Step 3: Enable Email Confirmation

1. **Find "Enable email confirmations"**
2. **Turn it ON** (toggle switch should be blue)
3. **Save the changes**

### Step 4: Configure Email Provider

You have two options:

#### Option A: Use Supabase Default Email (Easiest)

1. **Leave SMTP settings empty** (default)
2. **Supabase will use their built-in email service**
3. **This works for testing and small applications**

#### Option B: Use Custom SMTP (Recommended for Production)

1. **Get SMTP credentials** from your email provider:
   - Gmail: Use App Password
   - SendGrid: Use API Key
   - Mailgun: Use SMTP credentials

2. **Fill in SMTP settings:**
   ```
   Host: smtp.gmail.com (or your provider)
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```

### Step 5: Customize Email Templates

1. **Click on "Email Templates"**
2. **Find "Confirm signup" template**
3. **Customize the content:**

**Subject:** Confirm Your Email - EduFees Management System

**Content:**
```
Hello,

Thank you for signing up for the EduFees Management System!

Please click the link below to confirm your email address:

{{ .ConfirmationURL }}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
EduFees Management System Team
```

### Step 6: Test the Configuration

1. **Go back to your application**
2. **Try signing up with a new email**
3. **Check your email inbox** (and spam folder)
4. **You should receive a confirmation email**

## 🔍 Troubleshooting

### If emails still don't send:

1. **Check Supabase Logs:**
   - Go to "Logs" in your Supabase dashboard
   - Look for email-related errors
   - Check for rate limiting or configuration errors

2. **Verify Email Settings:**
   - Make sure "Enable email confirmations" is ON
   - Check SMTP settings if using custom provider
   - Verify email templates are saved

3. **Test with Supabase Dashboard:**
   - Go to "Authentication" → "Users"
   - Find a user
   - Click "..." → "Send email confirmation"
   - Check if email is received

### Common Issues:

1. **"Enable email confirmations" is OFF**
   - Solution: Turn it ON in Authentication Settings

2. **SMTP credentials are wrong**
   - Solution: Double-check your SMTP settings
   - Test with a simple email client first

3. **Email going to spam**
   - Solution: Check spam folder
   - Add your email to contacts

4. **Rate limiting**
   - Solution: Wait a few minutes between attempts
   - Check your email provider's limits

## 📧 Quick Test

To quickly test if email is working:

1. **Go to Supabase Dashboard**
2. **Authentication → Users**
3. **Find any user**
4. **Click "..." → "Send email confirmation"**
5. **Check if email is received**

If this works, your email is configured correctly. If not, follow the steps above.

## 🚀 Production Setup

For production, consider:

1. **Use a professional email service** (SendGrid, Mailgun, AWS SES)
2. **Set up email monitoring**
3. **Configure proper SPF/DKIM records**
4. **Monitor email delivery rates**

## 📞 Need Help?

If you're still having issues:

1. Check Supabase documentation: https://supabase.com/docs/guides/auth/auth-email
2. Check your email provider's documentation
3. Look at Supabase community forums
4. Check the logs in your Supabase dashboard

## ✅ Success Checklist

- [ ] "Enable email confirmations" is ON
- [ ] Email templates are customized
- [ ] SMTP settings are correct (if using custom)
- [ ] Test email sends successfully
- [ ] Confirmation emails are received after signup 