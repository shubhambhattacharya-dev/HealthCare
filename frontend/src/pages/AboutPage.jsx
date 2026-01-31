import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import Card from '../design-system/components/Card.jsx';
import Button from '../design-system/components/button.jsx';
import { 
  HeartIcon,
  UsersIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  CpuChipIcon,
  FaceSmileIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AboutPage = () => {
  const stats = [
    { value: '10,000+', label: 'Patients Served', icon: UsersIcon, color: 'text-blue-600' },
    { value: '100+', label: 'Verified Doctors', icon: UserGroupIcon, color: 'text-green-600' },
    { value: '24/7', label: 'Support Available', icon: ClockIcon, color: 'text-purple-600' },
    { value: '98%', label: 'Satisfaction Rate', icon: StarIcon, color: 'text-yellow-600' },
  ];

  const values = [
    {
      title: 'Patient-Centered Care',
      description: 'Your health and comfort are our top priorities in every interaction.',
      icon: HeartIcon,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Medical Excellence',
      description: 'Partnering with top-tier healthcare professionals and institutions.',
      icon: SparklesIcon,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Data Security',
      description: 'Enterprise-grade encryption for your medical records and personal data.',
      icon: ShieldCheckIcon,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Continuous Innovation',
      description: 'Constantly improving our platform with the latest healthcare technology.',
      icon: CpuChipIcon,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const features = [
    {
      title: 'Instant Appointments',
      description: 'Book with verified doctors in under 60 seconds',
      icon: CalendarDaysIcon,
    },
    {
      title: 'Digital Health Records',
      description: 'Secure, accessible medical history anytime',
      icon: ChartBarIcon,
    },
    {
      title: 'Video Consultations',
      description: 'Professional care from the comfort of home',
      icon: DevicePhoneMobileIcon,
    },
    {
      title: 'Medication Management',
      description: 'Track prescriptions and set reminders',
      icon: ShieldCheckIcon,
    },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Medical Director',
      image: assets.team_1,
      specialty: 'Healthcare Innovation',
      quote: 'Making healthcare accessible is our mission.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: assets.team_2,
      specialty: 'Health Tech',
      quote: 'Technology should serve humanity, especially in healthcare.',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Head of Medical Affairs',
      image: assets.team_3,
      specialty: 'Patient Experience',
      quote: 'Every patient deserves personalized, compassionate care.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Trusted Healthcare Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transforming <span className="text-primary-600">Healthcare</span> 
              <br />Through Technology
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              At Prescripto, we're revolutionizing how people access healthcare by making it 
              simpler, faster, and more human-centered. Join thousands who trust us with their health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/doctors'}
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Find a Doctor
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} variant="filled" className="text-center p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} bg-opacity-20 mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden">
              <img 
                src={assets.about_image} 
                alt="Prescripto Healthcare Team" 
                className="w-full h-64 md:h-96 object-cover rounded-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 rounded-full opacity-30" />
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                Our Story
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                From Vision to Reality in Healthcare
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2023, Prescripto emerged from a simple observation: accessing quality 
                healthcare was unnecessarily complicated. We saw the long waiting times, confusing 
                appointment systems, and fragmented patient experiences.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Our Mission</h4>
                  <p className="text-gray-700">
                    To democratize healthcare access through technology, making it intuitive, 
                    affordable, and human-centered for everyone.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Our Vision</h4>
                  <p className="text-gray-700">
                    A world where quality healthcare is instantly accessible to every person, 
                    regardless of location or circumstance.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="text-primary-600">
              Read our full story
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                hover 
                className="text-center p-8 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${value.color} bg-opacity-20 mb-6`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Prescripto?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience healthcare that works for you, not the other way around.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="accent"
                className="p-6 border-l-4 border-primary-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate team dedicated to transforming your healthcare experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} hover className="text-center p-8">
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {member.role}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.specialty}</p>
                <p className="text-gray-600 italic text-sm">"{member.quote}"</p>
                
                <div className="flex justify-center space-x-2 mt-6">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <Card 
            variant="accent" 
            className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
            
            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied patients who trust Prescripto with their health journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  className=" text-primary-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/doctors'}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Find Your Doctor
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/contact'}
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </div>
              
              <p className="text-sm text-white/70 mt-8">
                No credit card required • 30-day satisfaction guarantee • Cancel anytime
              </p>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;