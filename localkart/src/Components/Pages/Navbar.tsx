import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const servicesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const services = [
    { name: 'AC Repair', path: 'ac-repair' },
    { name: 'Electrician', path: 'electrician' },
    { name: 'Plumbing', path: 'plumbing' },
    { name: 'Salon at Home', path: 'salon' },
    { name: 'House Cleaning', path: 'cleaning' },
    { name: 'Painting', path: 'painting' },
    { name: 'Carpentry', path: 'carpentry' },
    { name: 'Pest Control', path: 'pest-control' },
    { name: 'Groceries', path: 'groceries' },
    { name: 'Tutors', path: 'tutors' },
    { name: 'Tailors', path: 'tailors' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = services.find(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (match) {
      navigate(`/services/${match.path}`);
      setSearchTerm('');
      setServicesOpen(false);
    } else {
      alert('Service not found.');
    }
  };

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
          <Link
            to="/"
            className={`hover:text-blue-600 transition ${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setServicesOpen(prev => !prev)}
              className={`flex items-center gap-1 hover:text-blue-600 transition ${
                location.pathname.startsWith('/services') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <ul className="absolute left-0 top-full mt-2 bg-white text-gray-800 border border-gray-200 shadow-lg rounded w-56 z-50 max-h-96 overflow-y-auto">
                {services.map(service => (
                  <li key={service.path}>
                    <Link
                      to={`/services/${service.path}`}
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

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              🔍
            </button>
          </form>

          <Link
            to="/provider"
            className={`hover:text-blue-600 transition ${location.pathname === '/provider' ? 'text-blue-600 font-semibold' : ''}`}
          >
            Become a Provider
          </Link>

          <Link
            to="/login"
            className={`px-4 py-2 rounded transition ${
              location.pathname === '/login'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`px-4 py-2 rounded transition border ${
              location.pathname === '/signup'
                ? 'bg-blue-50 text-blue-600 border-blue-500'
                : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
            }`}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-gray-800 font-medium">
          <Link
            to="/"
            className={`block hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}
          >
            Home
          </Link>

          <div className="block">
            <details open={location.pathname.startsWith('/services')}>
              <summary className="cursor-pointer hover:text-blue-600">Services</summary>
              <ul className="pl-4 mt-1 space-y-1">
                {services.map(service => (
                  <li key={service.path}>
                    <Link
                      to={`/services/${service.path}`}
                      className={`block capitalize hover:text-blue-600 ${location.pathname === `/services/${service.path}` ? 'text-blue-600 font-semibold' : ''}`}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <Link
            to="/provider"
            className={`block hover:text-blue-600 ${location.pathname === '/provider' ? 'text-blue-600 font-semibold' : ''}`}
          >
            Become a Provider
          </Link>

          <Link
            to="/login"
            className={`block px-4 py-2 rounded ${location.pathname === '/login' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`block px-4 py-2 rounded border ${location.pathname === '/signup' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'}`}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
