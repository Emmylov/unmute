import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Check, Mail, RefreshCw } from 'lucide-react';

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Auto-populate email from navigation state
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  // Set up countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle verification code submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate verification API call
    setTimeout(() => {
      // In a real app, you would verify the code with your backend
      // For demonstration, we'll accept any 6-digit code
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Mark user as verified in localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser) {
        currentUser.emailVerified = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Also update users collection
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex].emailVerified = true;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
      
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    }, 1500);
  };

  // Handle resend code
  const handleResendCode = () => {
    setIsResending(true);
    
    // Simulate API call to resend code
    setTimeout(() => {
      toast.success('Verification code resent. Please check your email.');
      setCountdown(60);
      setIsResending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <Link to="/login" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
        </div>

        {!isVerified ? (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
                <Mail size={28} className="text-purple-600" />
              </div>
              <p className="text-gray-600">
                We've sent a verification code to <span className="font-medium text-purple-600">{email}</span>.
                Please check your inbox and enter the code below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  maxLength={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-center text-xl tracking-widest font-medium"
                  placeholder="******"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || verificationCode.length !== 6}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-purple-600 hover:text-purple-500 font-medium disabled:opacity-50"
                  >
                    {isResending ? 'Resending...' : 'Resend Code'}
                  </button>
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
              <Check size={30} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-8">
              Your email has been successfully verified. Redirecting you to the onboarding process...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
