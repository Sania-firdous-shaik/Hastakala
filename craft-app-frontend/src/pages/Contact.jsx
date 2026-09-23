import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiBase}/api/contact`, formData);
      toast.success(response.data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="/hastakala-contact-hero.png"
            alt="Indian handicrafts and artisans"
          />

          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl">
            Get in Touch
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white drop-shadow-md sm:text-xl">
            Have questions about Hastakala? Want to become an artisan? Need
            support with your order? We'd love to hear from you. Send us a
            message and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form and Info */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="message"
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          support@hastakala.com
                        </p>
                        <p className="text-sm text-gray-600">
                          info@hastakala.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <PhoneIcon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          +91 90000 00000
                        </p>
                        <p className="text-sm text-gray-600">
                          Monday - Friday, 9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <MapPinIcon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Address
                        </p>
                        <p className="text-sm text-gray-600">
                          Hastakala Craft Marketplace
                          <br />
                          Andhra Pradesh
                          <br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        How do I become an artisan?
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Register for an account and select the artisan option
                        during signup. You can then create and manage your
                        handmade product listings.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        How can I make a payment?
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Hastakala supports secure online payments through
                        Razorpay, including UPI, cards, and net banking.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        How do I track my orders?
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        After logging in, you can view your orders from the
                        My Orders section and check the current order status.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                    Support Hours
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Monday - Friday:</span>{' '}
                      9:00 AM - 6:00 PM IST
                    </p>

                    <p>
                      <span className="font-medium">Saturday:</span>{' '}
                      10:00 AM - 4:00 PM IST
                    </p>

                    <p>
                      <span className="font-medium">Sunday:</span> Closed
                    </p>

                    <p className="mt-4 text-xs text-gray-500">
                      For urgent matters outside support hours, please send us
                      an email and we'll respond as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Location
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              Hastakala is focused on connecting Indian artisans and customers
              through a modern online marketplace.
            </p>
          </div>

          <div className="mt-16 aspect-w-16 aspect-h-9">
            <div className="h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <p className="text-gray-500">
                  Hastakala Craft Marketplace
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Andhra Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}