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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
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
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">Get in Touch</h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Need help or want to schedule a service? Fill out the form and we’ll respond shortly.
      </p>

      {status.success && (
        <p className="text-green-600 text-center text-sm mb-4">
          ✅ Your message about <strong>{serviceName}</strong> was sent successfully!
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          value={form.user_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <input
          type="email"
          name="user_email"
          placeholder="Your Email"
          value={form.user_email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <input
          type="tel"
          name="user_phone"
          placeholder="Your Phone"
          value={form.user_phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <input
          type="text"
          name="user_address"
          placeholder="Your Address"
          value={form.user_address}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <textarea
          name="user_message"
          placeholder="Your Message"
          rows={4}
          value={form.user_message}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border rounded-lg border-gray-300 resize-y focus:ring focus:ring-blue-200 focus:outline-none"
        ></textarea>

        {status.error && (
          <p className="text-red-600 text-center text-sm">{status.error}</p>
        )}

        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Contact Options */}
      <div className="mt-6 space-y-3 text-blue-600 text-sm text-center">
        <a href="tel:+911234567890" className="block hover:text-blue-800 transition">📞 +91 12345 67890</a>
        <a href="mailto:ak7519240651@gmail.com" className="block hover:text-blue-800 transition">📧 support@localkart.com</a>
        <a
          href="https://wa.me/917061188736"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 hover:text-blue-800 transition"
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

