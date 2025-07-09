import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext'; // Adjust path if needed

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
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            A feature-rich hyperlocal marketplace platform for every business
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Ensure on-time delivery for your local target audience by leveraging a local marketplace platform for your business.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
        <div className="flex-1">
          <img
            src="https://jungleworks.com/wp-content/uploads/2021/07/HyperLocalImg.png"
            alt="Hero"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
