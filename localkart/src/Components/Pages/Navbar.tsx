import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, userInfo } = useAuth();

  const services = [
    { name: 'AC Repair', path: 'ac-repair' },
    { name: 'Electrician', path: 'electrician' },
    { name: 'Plumbing', path: 'plumbing' },
    { name: 'Salon at Home', path: 'salon' },
    { name: 'House Cleaning', path: 'cleaning' },
    { name: 'Painting', path: 'painting' },
    { name: 'Carpentry', path: 'carpentry' },
    { name: 'Groceries', path: 'groceries' },
    { name: 'Tutors', path: 'tutors' },
    { name: 'Tailors', path: 'tailors' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
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
      setMobileMenuOpen(false);
    } else {
      alert('Service not found.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575769.jpg?semt=ais_hybrid&w=740"
            alt="LocalKart Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-800">LocalKart</h1>
        </Link>

        <button className="md:hidden text-2xl" onClick={() => setMobileMenuOpen(prev => !prev)}>
          ☰
        </button>

        <div className="hidden md:flex gap-6 text-gray-800 font-medium items-center">
          <Link to="/" className={`${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''} hover:text-blue-600`}>
            Home
          </Link>

          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setServicesOpen(prev => !prev)}
              className={`flex items-center gap-1 hover:text-blue-600 transition ${location.pathname.startsWith('/services') ? 'text-blue-600 font-semibold' : ''}`}
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

          {isLoggedIn && (
            <Link to="/booking" className={`px-4 py-2 rounded transition ${location.pathname === '/booking' ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}>
              Book
            </Link>
          )}

          <Link to="/provider" className={`${location.pathname === '/provider' ? 'text-blue-600 font-semibold' : ''} hover:text-blue-600`}>
            Become a Provider
          </Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className={`px-4 py-2 rounded transition ${location.pathname === '/login' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                Login
              </Link>
              <Link to="/signup" className={`px-4 py-2 rounded border ${location.pathname === '/signup' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'}`}>
                Signup
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white font-semibold flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-10 h-10"
                aria-label="User menu"
              >
                👤
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="p-4 text-sm text-gray-800 space-y-1">
                    <p><strong>Username:</strong> {userInfo?.username}</p>
                    <p><strong>Email:</strong> {userInfo?.email}</p>
                    <p><strong>Role:</strong> {userInfo?.role}</p>
                  </div>
                  <div className="border-t p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <div className="flex flex-col gap-2 p-4 text-gray-800">
            <Link to="/" className="py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <div className="relative">
              <button onClick={() => setServicesOpen(prev => !prev)} className="w-full flex justify-between items-center py-2 hover:text-blue-600">
                <span>Services</span>
                <span>{servicesOpen ? '▴' : '▾'}</span>
              </button>
              {servicesOpen && (
                <ul className="pl-4 space-y-1">
                  {services.map(service => (
                    <li key={service.path}>
                      <Link
                        to={`/services/${service.path}`}
                        className="block py-1 hover:text-blue-600 capitalize"
                        onClick={() => {
                          setServicesOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {isLoggedIn && (
              <Link to="/booking" className="py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                Book
              </Link>
            )}
            <Link to="/provider" className="py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Become a Provider
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="py-2 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                  Signup
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="py-2 text-left text-red-600 hover:text-red-800">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
