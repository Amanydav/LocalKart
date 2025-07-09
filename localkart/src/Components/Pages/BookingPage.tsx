import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import MapPicker from "./MapPicker";

emailjs.init("_ifDJ94YMPffwWLlN");

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    address: "",
    captcha: "",
  });

  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `What is ${a} + ${b}?`, answer: a + b });
    setFormData((prev) => ({ ...prev, captcha: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(formData.captcha) !== captcha.answer) {
      alert("Captcha incorrect. Please try again.");
      generateCaptcha();
      return;
    }

    const templateParams = {
      user_name: formData.name,
      user_phone: formData.phone,
      user_email: formData.email,
      user_service: formData.service,
      user_date: formData.date,
      user_address: formData.address,
    };

    try {
      await emailjs.send("service_lfwrs5j", "template_7ab41ra", templateParams);
      alert("Booking submitted successfully!");
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        address: "",
        captcha: "",
      });
      generateCaptcha();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to submit booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Book a Service</h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select a Service</option>
              <option>Plumbing</option>
              <option>Electrician</option>
              <option>AC Repair</option>
              <option>Salon at Home</option>
              <option>House Cleaning</option>
              <option>Painting</option>
              <option>Carpentry</option>
              <option>Pest Control</option>
              <option>Groceries</option>
              <option>Tutors</option>
              <option>Tailors</option>
            </select>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              name="address"
              placeholder="Your Full Address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
            ></textarea>

            {/* CAPTCHA */}
            <div>
              <label className="block text-gray-700 mb-1">Human Verification: {captcha.question}</label>
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                placeholder="Enter answer"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </form>
        </div>

        {/* Map Picker Section */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-blue-50">
          <div className="w-full">
            <MapPicker onLocationSelect={(address) => setFormData((prev) => ({ ...prev, address }))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
