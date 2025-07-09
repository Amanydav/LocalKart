import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('_ifDJ94YMPffwWLlN');

const SERVICE_ID = 'service_lfwrs5j';
const TEMPLATE_ID = 'template_7ab41ra';
const PUBLIC_KEY = '_ifDJ94YMPffwWLlN';

const Contact = ({ serviceName = 'General Inquiry' }) => {
  const [form, setForm] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_address: '',
    user_message: '',
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.user_email)) {
      setStatus({ loading: false, error: 'Please enter a valid email.', success: false });
      return;
    }

    setStatus({ loading: true, error: '', success: false });

    const templateParams = {
      service_name: serviceName,
      user_name: form.user_name,
      user_email: form.user_email,
      user_phone: form.user_phone,
      user_address: form.user_address,
      user_message: form.user_message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus({ loading: false, error: '', success: true });
      setForm({
        user_name: '',
        user_email: '',
        user_phone: '',
        user_address: '',
        user_message: '',
      });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus({ loading: false, error: 'Failed to send message.', success: false });
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-md text-gray-800 font-sans">
      <h2 className="text-2xl text-blue-600 font-semibold mb-2 text-center">Get in Touch</h2>
      <p className="text-center mb-6 text-sm text-gray-600">
        Have a question or need help? Fill out the form below and we’ll get back to you.
      </p>

      {status.success && (
        <p className="text-green-600 text-center mb-4 text-sm">
          ✅ Your message about <strong>{serviceName}</strong> was sent! We’ll reply to{' '}
          <strong>{form.user_email}</strong> shortly.
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          value={form.user_name}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          name="user_email"
          placeholder="Your Email"
          value={form.user_email}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
        />
        <input
          type="tel"
          name="user_phone"
          placeholder="Your Phone Number"
          value={form.user_phone}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="user_address"
          placeholder="Your Address"
          value={form.user_address}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
        />
        <textarea
          name="user_message"
          placeholder="Your Message"
          rows={4}
          value={form.user_message}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-md text-base resize-y focus:outline-none focus:border-blue-500"
        ></textarea>

        {status.error && <p className="text-red-600 text-center text-sm">{status.error}</p>}

        <button
          type="submit"
          disabled={status.loading}
          className="py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm font-medium text-blue-600">
        <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-blue-900">
          📞 +91 12345 67890
        </a>
        <a href="mailto:ak7519240651@gmail.com" className="flex items-center gap-2 hover:text-blue-900">
          📧 support@localkart.com
        </a>
        <a
          href="https://wa.me/917061188736"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-900"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-5 h-5"
          />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Contact;
