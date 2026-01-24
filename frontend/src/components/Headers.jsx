import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import Button from '../design-system/components/button.jsx';
import { 
  CalendarDaysIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Headers = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [typedText, setTypedText] = useState('');
  const fullText = "in under 60 seconds";

  const stats = [
    { value: '10,000+', label: 'Patients Trusted Us', icon: UserGroupIcon },
    { value: '100+', label: 'Verified Doctors', icon: ShieldCheckIcon },
    { value: '4.8/5', label: 'Average Rating', icon: StarIcon },
    { value: '24/7', label: 'Available Support', icon: ClockIcon },
  ];

  const features = [
    { text: 'Instant Confirmation', icon: CheckCircleIcon },
    { text: 'Video Consultations', icon: PlayCircleIcon },
    { text: 'Secure Payments', icon: ShieldCheckIcon },
    { text: 'Digital Prescriptions', icon: SparklesIcon },
  ];

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Blinking cursor effect
        setTimeout(() => {
          setTypedText(fullText + '|');
          setTimeout(() => setTypedText(fullText), 500);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  // Floating animation for doctor image
  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [controls]);

  const handleBookAppointment = () => {
    navigate('/doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
    // In production, this would open a video modal
    console.log('Open demo video');
  };

  return (
    <section className="relative overflow-hidden bg-primary-600">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: (i * 5) % 100 + 'vw',
              y: (i * 7) % 100 + 'vh',
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i * 0.1),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
            >
              <SparklesIcon className="h-4 w-4 text-warning-300 mr-2" />
              <span className="text-sm font-medium text-white">
                🏆 #1 Rated Healthcare Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Book Appointments with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                  Trusted Doctors
                </span>
              </h1>
              
              <div className="mt-4 text-xl md:text-2xl text-primary-100">
                <span className="font-semibold text-white">{typedText}</span>
              </div>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl lg:max-w-none"
            >
              Skip the waiting rooms. Get instant access to verified healthcare professionals. 
              Schedule your appointment from anywhere, anytime.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                    <stat.icon className="h-5 w-5 text-warning-300" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                >
                  <feature.icon className="h-5 w-5 text-green-300" />
                  <span className="text-sm text-white">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleBookAppointment}
                className=" text-primary-700 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Book Appointment Now
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <PlayCircleIcon className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={assets.group_profiles}
                    alt="Patient"
                    className="w-10 h-10 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <div className="text-white">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid key={i} className="h-4 w-4 text-warning-300 mr-1" />
                  ))}
                  <span className="ml-2 font-semibold">4.8/5</span>
                </div>
                <p className="text-sm text-white/80">Based on 2,500+ patient reviews</p>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Doctor Image */}
          <motion.div
            animate={controls}
            className="relative"
          >
            {/* Main Doctor Image */}
            <div className="relative">
              <img
                src={assets.header_img}
                alt="Healthcare Professional"
                className="w-full max-w-2xl mx-auto lg:mx-0 rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Appointment</p>
                    <p className="font-semibold text-gray-900">Confirmed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Available</p>
                    <p className="font-semibold text-gray-900">Today, 3:30 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15 min</div>
                  <div className="text-sm text-white/80">Avg. Wait Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/80">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">₹0</div>
                  <div className="text-sm text-white/80">Booking Fee</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
            <ArrowDownIcon className="h-6 w-6 text-white/60 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-16 text-white" 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default Headers;