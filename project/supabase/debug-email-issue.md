# Debug Email Issue - Email Confirmation is Enabled

## 🔍 Step-by-Step Debugging

Since email confirmation is enabled but emails aren't being sent, let's debug this systematically.

### Step 1: Check Browser Console

1. **Open your application**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Try to sign up with a new email**
5. **Look for these debug messages:**

```
Starting signup process for: your-email@example.com
Supabase signup response: { authData: {...}, authError: null }
User created successfully: user-id-here
Email confirmation status: null
```

### Step 2: Check Supabase Logs

1. **Go to Supabase Dashboard**
2. **Click on "Logs"** in the left sidebar
3. **Look for email-related errors**
4. **Check for any failed email attempts**

### Step 3: Test Email Manually

1. **Go to Supabase Dashboard**
2. **Authentication → Users**
3. **Find a user that was created**
4. **Click "..." → "Send email confirmation"**
5. **Check if email is received**

### Step 4: Check Email Templates

1. **Go to Authentication → Settings**
2. **Scroll to "Email Templates"**
3. **Click on "Confirm signup"**
4. **Make sure the template is not empty**
5. **Check if it contains: `{{ .ConfirmationURL }}`**

### Step 5: Check SMTP Settings

1. **In Authentication Settings**
2. **Scroll to "SMTP Settings"**
3. **If using custom SMTP, verify credentials**
4. **If using default, make sure SMTP fields are empty**

## 🚨 Common Issues & Solutions

### Issue 1: Email Template is Empty
**Solution:** Add content to the email template:
```
Hello,

Thank you for signing up for the EduFees Management System!

Please click the link below to confirm your email address:

{{ .ConfirmationURL }}

This link will expire in 24 hours.

Best regards,
EduFees Management System Team
```

### Issue 2: SMTP Configuration Problem
**Solution:** 
- If using default Supabase email: Leave SMTP fields empty
- If using custom SMTP: Double-check credentials

### Issue 3: Email Going to Spam
**Solution:**
- Check spam/junk folder
- Add your email to contacts
- Check if email provider is blocking Supabase

### Issue 4: Rate Limiting
**Solution:**
- Wait 5-10 minutes between signup attempts
- Check email provider's rate limits

### Issue 5: Wrong Redirect URL
**Solution:**
- Check if redirect URL is correct in email template
- Should be your app's domain

## 🔧 Quick Fixes to Try

### Fix 1: Reset Email Configuration
1. **Turn OFF email confirmations**
2. **Save changes**
3. **Turn ON email confirmations**
4. **Save changes**
5. **Test signup again**

### Fix 2: Use Different Email
1. **Try signing up with a different email address**
2. **Use Gmail, Outlook, or other major providers**
3. **Avoid temporary email services**

### Fix 3: Check Project Settings
1. **Go to Project Settings**
2. **Check if project is active**
3. **Verify API keys are correct**

## 📧 Test Email Configuration

### Test 1: Manual Email Send
1. **Go to Authentication → Users**
2. **Find any user**
3. **Click "..." → "Send email confirmation"**
4. **Check if email is received**

### Test 2: Check Email Logs
1. **Go to Logs in Supabase**
2. **Filter by "email" or "auth"**
3. **Look for email sending attempts**
4. **Check for any error messages**

### Test 3: Verify Email Template
1. **Go to Authentication → Settings → Email Templates**
2. **Click "Confirm signup"**
3. **Make sure template has content**
4. **Save any changes**

## 🆘 Still Not Working?

If emails still aren't sending:

1. **Check Supabase Status**: Go to https://status.supabase.com
2. **Try Different Email Provider**: Use Gmail or Outlook
3. **Contact Supabase Support**: If issue persists
4. **Check Community Forums**: For similar issues

## 📋 Debug Checklist

- [ ] Email confirmation is ON
- [ ] Email template has content
- [ ] SMTP settings are correct (or empty for default)
- [ ] Browser console shows successful signup
- [ ] Supabase logs show no errors
- [ ] Manual email send works
- [ ] Email not in spam folder
- [ ] Using valid email address

## 🎯 Next Steps

1. **Try the manual email test** (Step 3 above)
2. **Check browser console** when signing up
3. **Look at Supabase logs** for errors
4. **Let me know what you find** in the console and logs 