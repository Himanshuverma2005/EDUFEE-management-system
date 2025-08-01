import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function EmailDebugComponent() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testEmailConfirmation = async () => {
    if (!email) {
      setResult('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      console.log('Testing email confirmation for:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('Email test error:', error);
        setResult(`Error: ${error.message}`);
      } else {
        console.log('Email test successful');
        setResult('Email sent successfully! Check your inbox (and spam folder).');
      }
    } catch (error) {
      console.error('Email test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Email Debug Tool</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email to test"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={testEmailConfirmation}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Sending...' : 'Test Email Confirmation'}
        </button>
      </div>

      {result && (
        <div className={`p-3 rounded-md ${
          result.startsWith('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {result}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Enter the email address you used for signup</li>
          <li>Click "Test Email Confirmation"</li>
          <li>Check your email inbox and spam folder</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> If this test works, the issue is with the automatic email sending during signup. 
          If it doesn't work, the issue is with your Supabase email configuration.
        </p>
      </div>
    </div>
  );
} 