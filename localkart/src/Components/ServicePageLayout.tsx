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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl text-blue-600 font-semibold mb-2">{title}</h2>
      <p className="mb-4 text-gray-700">{description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            className="w-full h-44 object-cover rounded-md"
          />
        ))}
      </div>

      <ul className="mb-8 list-disc list-inside text-gray-800">
        {features.map((item, i) => (
          <li key={i} className="mb-1">{item}</li>
        ))}
      </ul>

      <Contact serviceName={serviceName} />
    </div>
  );
};

export default ServicePageLayout;