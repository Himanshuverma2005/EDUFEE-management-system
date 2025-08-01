import React from 'react';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface EmailVerificationPageProps {
  email: string;
  onBackToLogin: () => void;
  onResendEmail: () => void;
  isResending?: boolean;
}

export default function EmailVerificationPage({ 
  email, 
  onBackToLogin, 
  onResendEmail, 
  isResending = false 
}: EmailVerificationPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification link to your email address
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-900">Email Sent</span>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Verification email sent to:</p>
            <p className="text-sm font-medium text-blue-900 break-all">{email}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Next Steps:
          </h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-200 text-blue-800 rounded-full mr-2 mt-0.5">
                1
              </span>
              Check your email inbox (and spam folder)
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-200 text-blue-800 rounded-full mr-2 mt-0.5">
                2
              </span>
              Click the verification link in the email
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-200 text-blue-800 rounded-full mr-2 mt-0.5">
                3
              </span>
              Return here and sign in to your account
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onResendEmail}
            disabled={isResending}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </button>

          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={onResendEmail}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 