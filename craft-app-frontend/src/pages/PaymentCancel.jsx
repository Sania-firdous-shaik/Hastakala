import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XCircleIcon,
  ArrowLeftIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error(
      'Payment was cancelled. Your order is still pending.'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">

      <div className="max-w-md w-full px-4">

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Cancel Icon */}
          <div className="text-center">

            <XCircleIcon className="mx-auto h-20 w-20 text-red-500" />

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Cancelled
            </h2>

            <p className="mt-3 text-gray-600">
              Your Razorpay payment was cancelled.
            </p>

          </div>

          {/* Information */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

            <div className="flex">

              <CreditCardIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />

              <div className="ml-3">

                <p className="text-sm font-medium text-yellow-800">
                  Your order is still pending
                </p>

                <p className="mt-1 text-sm text-yellow-700">
                  No payment was completed. You can return to your
                  orders and try the payment again whenever you're ready.
                </p>

              </div>

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-3">

            <button
              onClick={() => navigate('/orders')}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Cart
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentCancel;