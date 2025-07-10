import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; // Update if your path differs

const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/getstarted');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            A Feature-Rich Hyperlocal Marketplace Platform for Every Business
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Ensure on-time delivery for your local target audience by leveraging a powerful local marketplace solution tailored for your business.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src="https://jungleworks.com/wp-content/uploads/2021/07/HyperLocalImg.png"
            alt="Hyperlocal Marketplace"
            className="w-full max-w-md mx-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
