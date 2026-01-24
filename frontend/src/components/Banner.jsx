import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import Button from '../design-system/components/button.jsx';
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  HeartIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Banner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const features = [
    { text: 'Same-Day Appointments', icon: CalendarDaysIcon },
    { text: 'Verified Doctors', icon: ShieldCheckIcon },
    { text: 'Video Consultations', icon: UserGroupIcon },
    { text: 'Free Follow-ups', icon: HeartIcon },
  ];

  const stats = [
    { value: '15 min', label: 'Avg. Wait Time' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '₹0', label: 'Booking Fee' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.querySelector('#banner');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const handleCreateAccount = () => {
    navigate('/signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindDoctors = () => {
    navigate('/doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="banner" className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-white/10" />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            initial={{
              x: (i * 8.33) + 'vw',
              y: (i * 8.33) + 'vh',
            }}
            animate={{
              y: [null, -15, 0],
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={variants}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <SparklesIcon className="h-4 w-4 text-warning-300 mr-2" />
                <span className="text-sm font-medium text-white">
                  Trusted by 10,000+ Patients
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find & Book{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                  Trusted Healthcare
                </span>
                <br />
                Professionals Near You
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 max-w-2xl"
            >
              Skip the waiting rooms. Connect with verified doctors and specialists 
              in minutes. Your health journey starts here.
            </motion.p>

            {/* Features */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                >
                  <feature.icon className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm text-white">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateAccount}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Create Free Account
                <motion.div
                  animate={{ x: hovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </motion.div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleFindDoctors}
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Browse Doctors
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-4 pt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-white">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid key={i} className="h-4 w-4 text-warning-300 mr-1" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.8/5 from 2,500+ reviews</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <motion.div
            variants={itemVariants}
            className="relative lg:pl-8"
          >
            {/* Main Image Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-primary-700/20 to-transparent rounded-3xl" />
              
              <img
                src={assets.appointment_img}
                alt="Healthcare professional with patient"
                className="w-full max-w-2xl mx-auto lg:mx-0 rounded-3xl shadow-2xl"
              />

              {/* Floating Elements */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-2xl max-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Instant</p>
                    <p className="font-semibold text-gray-900">Confirmation</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-2xl max-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="font-semibold text-gray-900">Today, 10 AM</p>
                  </div>
                </div>
              </motion.div>

              {/* Doctor Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl max-w-[250px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Sarah Johnson</p>
                    <p className="text-sm text-primary-600">Cardiologist</p>
                    <div className="flex items-center mt-1">
                      <StarIconSolid className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-600">4.9 • 320 reviews</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-white/80">Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">10+</div>
                  <div className="text-sm text-white/80">Specialties</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Trust Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-white/20"
        >
          <p className="text-center text-white/80 text-sm mb-6">Trusted by leading healthcare providers</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-white/10 rounded-lg backdrop-blur-sm"
              />
            ))}
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

export default Banner;