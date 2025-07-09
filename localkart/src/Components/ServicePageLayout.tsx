import React from 'react';
import Contact from './Pages/Contact';

type Props = {
  title: string;
  description: string;
  images: string[];
  features: string[];
  serviceName: string;
};

const ServicePageLayout = ({ title, description, images, features, serviceName }: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-14 font-sans">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">{description}</p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section - Gallery & Features */}
        <div className="md:w-1/2 space-y-8">
          {/* Gallery */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={src}
                  alt={`${title} ${i + 1}`}
                  className="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Why Choose This Service?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {features.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 md:mt-4">
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">Book Your Service</h3>
            <Contact serviceName={serviceName} />
          </div>
        </div>
      </div>

      {/* Optional CTA Section */}
      <div className="text-center mt-16">
        <p className="text-gray-600 mb-4">Need help choosing the right service?</p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ServicePageLayout;
