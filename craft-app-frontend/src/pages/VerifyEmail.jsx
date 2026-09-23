import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/verify-email/${token}`
        );

        setStatus('success');
        setMessage(response.data.message);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error || 'Email verification failed'
        );

        if (error.response?.data?.error?.includes('expired')) {
          setShowResendForm(true);
        }
      }
    };

    if (!token) return;
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    verifyEmail();
  }, [token, navigate]);

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/resend-verification`,
        { email }
      );

      toast.success('Verification email sent successfully!');
      setShowResendForm(false);
      setStatus('verifying');
      setMessage('');
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          'Failed to resend verification email'
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-800">
            Hastakala
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Handmade with tradition, crafted with love
          </p>
        </div>

        <h2 className="mt-8 text-center text-2xl font-bold text-stone-800">
          Email Verification
        </h2>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-stone-200 sm:rounded-xl sm:px-10">

          <div className="text-center">

            {/* Verifying */}
            {status === 'verifying' && (
              <div className="mx-auto h-12 w-12 rounded-full border-4 border-stone-200 border-t-amber-700 animate-spin"></div>
            )}

            {/* Success */}
            {status === 'success' && (
              <CheckCircleIcon className="mx-auto h-14 w-14 text-green-600" />
            )}

            {/* Error */}
            {status === 'error' && (
              <XCircleIcon className="mx-auto h-14 w-14 text-red-500" />
            )}

            <div className="mt-5">

              {/* Verifying message */}
              {status === 'verifying' && (
                <div>
                  <h3 className="text-lg font-semibold text-stone-800">
                    Verifying your email
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Please wait while we verify your email address...
                  </p>
                </div>
              )}

              {/* Success message */}
              {status === 'success' && (
                <div>
                  <h3 className="text-lg font-semibold text-green-700">
                    Email Verified Successfully!
                  </h3>

                  <p className="mt-2 text-sm text-stone-600">
                    {message}
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    Redirecting you to the login page...
                  </p>
                </div>
              )}

              {/* Error message */}
              {status === 'error' && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600">
                    Verification Failed
                  </h3>

                  <p className="mt-2 text-sm text-stone-600">
                    {message}
                  </p>

                  {showResendForm ? (
                    <div className="mt-6">

                      <p className="text-sm text-stone-600 mb-4">
                        Your verification link has expired. Enter your email
                        address to receive a new verification link.
                      </p>

                      <form
                        onSubmit={handleResendVerification}
                        className="space-y-4"
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                          required
                        />

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-lg text-white font-medium bg-amber-700 hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
                        >
                          Resend Verification Email
                        </button>
                      </form>

                    </div>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="mt-6 inline-flex justify-center items-center px-5 py-2.5 rounded-lg text-white font-medium bg-amber-700 hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
                    >
                      Go to Login
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <p className="mt-8 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Hastakala. Celebrating Indian craftsmanship.
      </p>
    </div>
  );
};

export default VerifyEmail;

