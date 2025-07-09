import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const services = [
    { name: 'AC Repair', path: 'ac-repair' },
    { name: 'Electrician', path: 'electrician' },
    { name: 'Plumbing', path: 'plumbing' },
    { name: 'Salon at Home', path: 'salon' },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575769.jpg?semt=ais_hybrid&w=740"
            alt="LocalKart Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-800">LocalKart</h1>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setMobileMenuOpen(prev => !prev)}>
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-800 font-medium items-center">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setServicesOpen(prev => !prev)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              Services ▾
            </button>
            {servicesOpen && (
              <ul className="absolute left-0 top-full mt-2 bg-white text-gray-800 border border-gray-200 shadow-lg rounded w-48 z-50">
                {services.map(service => (
                  <li key={service.path}>
                    <Link
                      to={'/services/' + service.path}
                      className="block px-4 py-2 hover:bg-gray-100 capitalize"
                      onClick={() => setServicesOpen(false)}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/provider" className="hover:text-blue-600 transition">Become a Provider</Link>
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Login</Link>
          <Link to="/signup" className="bg-white text-blue-600 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition">Signup</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-gray-800 font-medium">
          <Link to="/" className="block hover:text-blue-600">Home</Link>
          <div className="block">
            <details>
              <summary className="cursor-pointer hover:text-blue-600">Services</summary>
              <ul className="pl-4 mt-1 space-y-1">
                {services.map(service => (
                  <li key={service.path}>
                    <Link to={'/services/' + service.path} className="block hover:text-blue-600 capitalize">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          <Link to="/provider" className="block hover:text-blue-600">Become a Provider</Link>
          <Link to="/login" className="block text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Login</Link>
          <Link to="/signup" className="block text-blue-600 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50">Signup</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
