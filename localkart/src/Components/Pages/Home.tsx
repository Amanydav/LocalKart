import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';

const popularServices = [
  { name: 'Plumbing', img: 'https://img.freepik.com/free-vector/plumbing-service-advertising-banner-repairman-uniform-standing-with-wrench-hand-tools-box-near-sink_575670-1705.jpg?semt=ais_hybrid&w=740', to: '/services/plumbing' },
  { name: 'Electrician', img: 'https://t4.ftcdn.net/jpg/11/66/04/09/360_F_1166040934_x8kGgvbpoMfatoBqu60I9lhDeiaomEHC.jpg', to: '/services/electrician' },
  { name: 'Salon at Home', img: 'https://media.gettyimages.com/id/pop033/vector/man-getting-haircut.jpg?s=612x612&w=0&k=20&c=EOkSuxsdxpM4toekb0fROqunydH1Gjhx0d271RpFgLg=', to: '/services/salon' },
  { name: 'AC Repair', img: 'https://media.istockphoto.com/id/1323570577/vector/air-conditioner-repair-service-friendly-smiling-repairman.jpg?s=612x612&w=0&k=20&c=Tt3aD0QyuJlcJlv6N093tezEFD5v8tS22VpvxBdAnBs=', to: '/services/ac-repair' },
  { name: 'House Cleaning', img: 'https://thumbs.dreamstime.com/b/smiling-cartoon-cleaning-woman-mop-bucket-384145220.jpg', to: '/services/cleaning' },
  { name: 'Painting', img: 'https://media.istockphoto.com/id/578576392/vector/painter-coloring-wall-by-paint-roller-people-occupations.jpg?s=612x612&w=0&k=20&c=pj4JtRaGsU66VRS8o49X-uS0ZWqYV98qDocq4zpk61Y=', to: '/services/painting' },
  { name: 'Carpentry', img: 'https://i.pinimg.com/originals/15/b4/07/15b4070ae324c30e412f413076c0f79b.jpg', to: '/services/carpentry' },
  { name: 'Pest Control', img: 'https://thumbs.dreamstime.com/b/pest-control-symbol-rat-silhouette-pest-control-symbol-rat-silhouette-white-background-350446798.jpg', to: '/services/pest-control' }
];

const steps = [
  {
    icon: '📍',
    title: 'Choose Location',
    desc: 'Enter your city or area to view available services nearby.',
    img: 'https://img.icons8.com/clouds/500/marker.png'
  },
  {
    icon: '🛠️',
    title: 'Select Service',
    desc: 'Pick the service you need from verified local providers.',
    img: 'https://img.icons8.com/clouds/500/maintenance.png'
  },
  {
    icon: '📅',
    title: 'Schedule Booking',
    desc: 'Pick your preferred time slot and confirm instantly.',
    img: 'https://img.icons8.com/clouds/500/calendar.png'
  },
  {
    icon: '✅',
    title: 'Get Work Done',
    desc: 'A trusted professional will arrive at your doorstep.',
    img: 'https://img.icons8.com/clouds/500/checked.png'
  }
];

const whyLocalKart = [
  ['🔍', 'Easy Search', 'Find services quickly with our smart search'],
  ['📅', 'Book Instantly', 'Select time slots that work for you'],
  ['👤', 'Trusted Providers', 'All service providers are verified'],
  ['✅', 'Quality Assured', '100% satisfaction guarantee'],
  ['💸', 'Affordable Pricing', 'Transparent and competitive rates'],
  ['🔐', 'Secure Payments', 'Pay safely with encrypted transactions'],
  ['📞', '24/7 Support', 'Always here to help via chat or call'],
  ['🌐', 'Wide Reach', 'Available across multiple cities and towns']
];

const Home = () => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    stepsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      stepsRef.current.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="font-sans text-gray-800">
      <Hero />
      

     

      {/* Popular Services */}
      <section className="max-w-screen-xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl text-blue-600 font-semibold mb-6">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((svc) => (
            <Link key={svc.name} to={svc.to} className="bg-white rounded-lg shadow-md hover:-translate-y-1 transition-transform">
              <img src={svc.img} alt={svc.name} className="w-[90%] h-40 object-cover mx-auto mt-4 rounded" />
              <div className="p-3">
                <h3 className="text-lg font-medium">{svc.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
       {/* Call to Action */}
      <section className="bg-blue-400 text-white py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-lg mb-8">Join thousands of satisfied customers and service providers</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/book" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition">Book Services</Link>
          <Link to="/provider" className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition">Become a Provider</Link>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-12">Why Choose LocalKart?</h2>
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-8">
          {whyLocalKart.map(([icon, title, desc], i) => (
            <div key={i} className="bg-white max-w-xs w-full p-6 rounded-xl shadow-md hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full text-xl mx-auto mb-4">
                {icon}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{title}</div>
              <div className="text-sm text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </section>
       {/* How It Works */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-blue-600">How LocalKart Works</h2>
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => stepsRef.current[i] = el}
              className={`flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center gap-8 transform transition-all duration-700 opacity-0 translate-y-10`}
            >
              <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/2">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
              <div className="w-full md:w-1/2 text-center">
                <img
                  src={step.img}
                  alt={step.title}
                  className="rounded-xl w-full max-w-[300px] mx-auto shadow"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

     

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 text-center py-12 px-4">
        <h2 className="text-white text-xl mb-2">LocalKart</h2>
        <p className="text-slate-400 mb-4">Your trusted local service marketplace</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
