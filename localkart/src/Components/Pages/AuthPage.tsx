import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  });

  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `What is ${a} + ${b}?`, answer: a + b });
    setFormData((prev) => ({ ...prev, captcha: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(formData.captcha) !== captcha.answer) {
      alert('Incorrect human verification answer.');
      generateCaptcha();
      return;
    }

    if (isLogin) {
      if (formData.username && formData.password) {
        login();
        navigate('/');
      }
    } else {
      if (
        formData.username &&
        formData.email &&
        formData.dob &&
        formData.password &&
        formData.confirmPassword
      ) {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        login();
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 px-4">
      {/* Left Side Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="https://jungleworks.com/wp-content/uploads/2021/07/HyperLocalImg.png"
          alt="illustration"
          className="w-full max-w-[500px] max-h-[400px] object-contain"
        />
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 max-w-md bg-white p-8 shadow-lg rounded-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {isLogin ? 'Login to LocalKart' : 'Create your LocalKart account'}
        </h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded"
        />

        {/* Signup Only */}
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
          </>
        )}

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Confirm Password */}
        {!isLogin && (
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded pr-10"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>
        )}

        {/* Remember Me & Forgot Password */}
        {isLogin && (
          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" />
              Remember Me
            </label>
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>
        )}

        {/* Captcha */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Human Verification: {captcha.question}
          </label>
          <input
            type="text"
            name="captcha"
            value={formData.captcha}
            onChange={handleChange}
            placeholder="Enter answer"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>

        {/* Switch Login/Signup */}
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => navigate(isLogin ? '/signup' : '/login')}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? 'Signup here' : 'Login here'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
