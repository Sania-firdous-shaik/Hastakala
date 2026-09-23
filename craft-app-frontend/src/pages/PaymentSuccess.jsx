import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Razorpay payment details
        const orderId =
          searchParams.get('orderId') ||
          searchParams.get('order_id');

        const paymentId =
          searchParams.get('paymentId') ||
          searchParams.get('payment_id');

        // Store payment ID only for display/debugging if available
        if (paymentId) {
          console.log('Razorpay Payment ID:', paymentId);
        }

        // Fetch order details
        if (orderId) {
          try {
            const response = await axios.get(
              `${API_URL}/api/orders/${orderId}`
            );

            setOrderDetails(response.data);
          } catch (error) {
            console.error(
              'Error fetching order details:',
              error
            );
          }
        }

        toast.success(
          'Payment successful! Your order has been confirmed.'
        );
      } catch (error) {
        console.error(
          'Payment success processing error:',
          error
        );

        toast.success(
          'Payment successful! Your order has been confirmed.'
        );
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Processing your payment...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">

      <div className="max-w-md w-full px-4">

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Success Icon */}
          <div className="text-center">

            <CheckCircleIcon className="mx-auto h-20 w-20 text-green-600" />

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful!
            </h2>

            <p className="mt-3 text-gray-600">
              Thank you for your purchase. Your Razorpay payment
              has been processed successfully.
            </p>

          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="mt-8 bg-gray-50 rounded-lg p-5">

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>

              {/* Order ID */}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">
                  Order ID
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  #{orderDetails._id?.slice(-6)}
                </span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">
                  Total Amount
                </span>

                <span className="text-lg font-semibold text-gray-900">
                  ₹
                  {Number(
                    orderDetails.totalAmount || 0
                  ).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">
                  Payment Method
                </span>

                <span className="text-sm font-medium text-gray-900">
                  Razorpay
                </span>
              </div>

              {/* Order Status */}
              <div className="flex justify-between items-center py-2">

                <span className="text-sm text-gray-500">
                  Order Status
                </span>

                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                  {orderDetails.status || 'confirmed'}
                </span>

              </div>

              {/* Order Date */}
              {orderDetails.createdAt && (
                <div className="flex justify-between items-center py-2">

                  <span className="text-sm text-gray-500">
                    Order Date
                  </span>

                  <span className="text-sm text-gray-900">
                    {new Date(
                      orderDetails.createdAt
                    ).toLocaleDateString('en-IN')}
                  </span>

                </div>
              )}

            </div>
          )}

          {/* Success Message */}
          <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">

            <div className="flex">

              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />

              <div className="ml-3">

                <p className="text-sm font-medium text-green-800">
                  Your order has been confirmed.
                </p>

                <p className="mt-1 text-sm text-green-700">
                  You can track your order status from the My Orders
                  section.
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

              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentSuccess;