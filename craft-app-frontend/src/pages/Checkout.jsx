import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  MapPinIcon,
  CreditCardIcon,
  CheckCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { items: cart, clearCart, total: cartTotal } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [touched, setTouched] = useState({});

  // Backend URL
  const API_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
  ).replace(/\/$/, '');

  // Build product image URL
  const buildImageUrl = (path) => {
    if (!path) {
      return '/placeholder-product.jpg';
    }

    if (
      path.startsWith('http://') ||
      path.startsWith('https://')
    ) {
      return path;
    }

    if (path.startsWith('/')) {
      return `${API_URL}${path}`;
    }

    return `${API_URL}/${path}`;
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setShippingForm((prev) => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true
    }));
  };

  const getFieldError = (name) => {
    if (!touched[name]) return null;

    if (!shippingForm[name]) {
      return 'This field is required';
    }

    if (
      name === 'email' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)
    ) {
      return 'Invalid email address';
    }

    if (
      name === 'phone' &&
      shippingForm.phone.length < 10
    ) {
      return 'Must be at least 10 digits';
    }

    return null;
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode'
    ];

    for (const field of requiredFields) {
      if (!shippingForm[field]) {
        toast.error(
          `Please fill in ${field
            .replace(/([A-Z])/g, ' $1')
            .toLowerCase()}`
        );

        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(shippingForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (shippingForm.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  // Load Razorpay Checkout script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // Open Razorpay payment popup
  const initializeRazorpayPayment = async (order) => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error(
          'Unable to load Razorpay. Please check your internet connection.'
        );

        return;
      }

      // Create Razorpay order on backend
      const response = await axios.post(
        `${API_URL}/api/payments/create-order`,
        {
          orderId: order._id
        }
      );

      const {
        razorpayOrderId,
        amount,
        currency,
        keyId
      } = response.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Hastakala',
        description: 'Hastakala Order',
        order_id: razorpayOrderId,

        prefill: {
          name: `${shippingForm.firstName} ${shippingForm.lastName}`,
          email: shippingForm.email,
          contact: shippingForm.phone
        },

        handler: async function (paymentResponse) {
          try {
            setLoading(true);

            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API_URL}/api/payments/verify`,
              {
                orderId: order._id,
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature
              }
            );

            if (verifyResponse.data.success) {
              setOrderId(order._id);
              setOrderPlaced(true);

              clearCart();

              toast.success(
                'Payment successful! Order confirmed.'
              );
            }
          } catch (error) {
            console.error(
              'Payment verification error:',
              error
            );

            toast.error(
              error.response?.data?.error ||
                'Payment verification failed'
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        'payment.failed',
        function (response) {
          console.error(
            'Razorpay payment failed:',
            response.error
          );

          setLoading(false);

          toast.error(
            response.error?.description ||
              'Payment failed. Please try again.'
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        'Razorpay initialization error:',
        error
      );

      toast.error(
        error.response?.data?.error ||
          'Failed to initialize payment'
      );

      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),

        totalAmount: cartTotal,

        shippingAddress:
          `${shippingForm.firstName} ${shippingForm.lastName}, ` +
          `${shippingForm.address}, ` +
          `${shippingForm.city}, ` +
          `${shippingForm.state} ` +
          `${shippingForm.zipCode}, ` +
          `${shippingForm.country}`,

        customerName:
          `${shippingForm.firstName} ${shippingForm.lastName}`,

        customerEmail: shippingForm.email,
        customerPhone: shippingForm.phone,
        paymentMethod: 'razorpay'
      };

      // Create application order
      const response = await axios.post(
        `${API_URL}/api/orders`,
        orderData
      );

      if (response.data.order) {
        setOrderId(response.data.order._id);

        // Start Razorpay payment
        await initializeRazorpayPayment(
          response.data.order
        );
      }
    } catch (error) {
      console.error(
        'Order creation error:',
        error
      );

      toast.error(
        error.response?.data?.error ||
          'Failed to place order'
      );

      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Order Confirmed!
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Thank you for shopping with Hastakala.
              Your payment was successful and your order
              has been confirmed.
            </p>

            <div className="mt-4 bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">
                Order ID:
              </p>

              <p className="text-lg font-semibold text-gray-900">
                #{orderId?.slice(-6)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/orders')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Order Details
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Complete your purchase from Hastakala
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart?.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={buildImageUrl(
                        item.product.images?.[0]
                      )}
                      alt={item.product.title}
                      className="w-16 h-16 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          '/placeholder-product.jpg';
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(
                        item.product.price *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>

                  <span>
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Shipping and taxes will be calculated
                  at the next step.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <form
              onSubmit={handlePlaceOrder}
              className="space-y-8"
            >

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('firstName')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('firstName') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('firstName')}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('lastName')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('lastName') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('lastName')}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('email')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('email') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      placeholder="10-digit mobile number"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('phone')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('phone') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('phone')}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      placeholder="House / Flat No., Street, Area"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('address')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('address') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('address')}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Vijayawada"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('city')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('city') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('city')}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Andhra Pradesh"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('state')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('state') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('state')}
                      </p>
                    )}
                  </div>

                  {/* PIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      PIN Code{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="zipCode"
                      value={shippingForm.zipCode}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      maxLength="6"
                      placeholder="6-digit PIN code"
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                        getFieldError('zipCode')
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      required
                    />

                    {getFieldError('zipCode') && (
                      <p className="mt-1 text-xs text-red-600">
                        {getFieldError('zipCode')}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={shippingForm.country}
                      onChange={handleShippingChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center">
                    <input
                      id="razorpay"
                      name="paymentMethod"
                      type="radio"
                      value="razorpay"
                      checked={
                        paymentMethod === 'razorpay'
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />

                    <label
                      htmlFor="razorpay"
                      className="ml-3 flex items-center"
                    >
                      <CreditCardIcon className="h-5 w-5 mr-2" />

                      <span className="text-sm font-medium text-gray-900">
                        Razorpay
                      </span>
                    </label>
                  </div>

                  <div className="ml-7 text-sm text-gray-500">
                    <p>• Secure online payment</p>
                    <p>• UPI, Cards and Net Banking</p>
                    <p>• Payment confirmation after checkout</p>
                  </div>

                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                <div className="flex items-center">
                  <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />

                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      Secure Checkout
                    </h3>

                    <p className="text-sm text-blue-700 mt-1">
                      Your checkout information is protected.
                      We never store your payment details.
                    </p>
                  </div>
                </div>

              </div>

              {/* Place Order */}
              <div className="bg-white rounded-lg shadow p-6">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                <p className="mt-3 text-sm text-gray-500 text-center">
                  By placing your order, you agree to our
                  terms and conditions.
                </p>

              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;