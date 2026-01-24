import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';
import {
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  CheckCircle,
  Heart,
  Facebook
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'Book Appointment', path: '/appointment' },
    { label: 'Video Consultation', path: '/telemedicine' },
    { label: 'Health Packages', path: '/packages' },
  ];

  const companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Blog', path: '/blog' },
    { label: 'Testimonials', path: '/testimonials' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ];

  const healthResources = [
    { label: 'Health Articles', path: '/articles' },
    { label: 'Symptoms Checker', path: '/symptoms' },
    { label: 'Medicine Guide', path: '/medicines' },
    { label: 'Find Hospitals', path: '/hospitals' },
    { label: 'Health Calculators', path: '/calculators' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/prescripto', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/prescripto', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/prescripto', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/prescripto', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/prescripto', label: 'YouTube' },
  ];

  const appStores = [
    { 
      name: 'App Store', 
      icon: 'https://cdn-icons-png.flaticon.com/512/179/179309.png',
      href: 'https://apps.apple.com/app/prescripto'
    },
    { 
      name: 'Google Play', 
      icon: 'https://cdn-icons-png.flaticon.com/512/300/300218.png',
      href: 'https://play.google.com/store/apps/prescripto'
    },
  ];

  const trustBadges = [
    { text: 'HIPAA Compliant', icon: ShieldCheck },
    { text: 'ISO 27001 Certified', icon: CheckCircle },
    { text: '100% Secure', icon: ShieldCheck },
    { text: 'Verified Doctors', icon: CheckCircle },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Stay Updated with Health Tips
              </h3>
              <p className="text-white/90">
                Subscribe to our newsletter for the latest health insights and offers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={assets.logo} 
                alt="Prescripto" 
                className="h-12 w-12"
              />
              <div>
                <div className="text-2xl font-bold text-gray-900">Prescripto</div>
                <div className="text-sm text-primary-600 font-medium">Healthcare Made Simple</div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-md">
              We're on a mission to make quality healthcare accessible and affordable for everyone. 
              Join millions who trust Prescripto for their health journey.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">24/7 Helpline</p>
                  <a href="tel:+9118001234567" className="text-gray-600 hover:text-primary-600">
                    +91 1800 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <a href="mailto:support@prescripto.com" className="text-gray-600 hover:text-primary-600">
                    support@prescripto.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Support Hours</p>
                  <p className="text-gray-600">24/7 for emergencies</p>
                </div>
              </div>
            </div>

            {/* App Stores */}
            <div className="space-y-3">
              <p className="font-medium text-gray-900">Get our mobile app</p>
              <div className="flex gap-3">
                {appStores.map((store) => (
                  <a
                    key={store.name}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:shadow-md transition-shadow"
                  >
                    <img src={store.icon} alt={store.name} className="h-5 w-5" />
                    <div>
                      <div className="text-xs text-gray-500">Download on</div>
                      <div className="text-sm font-semibold">{store.name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Resources</h3>
              <ul className="space-y-3">
                {healthResources.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 inline-flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <badge.icon className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Language & Country Selector */}
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
              
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 text-sm text-center md:text-left">
                © {currentYear} Prescripto Healthcare Technologies Pvt. Ltd. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <a href="/sitemap" className="hover:text-primary-600">Sitemap</a>
                <a href="/accessibility" className="hover:text-primary-600">Accessibility</a>
                <a href="/legal" className="hover:text-primary-600">Legal</a>
                <a href="/disclaimer" className="hover:text-primary-600">Medical Disclaimer</a>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 text-xs text-gray-500 text-center max-w-3xl mx-auto">
              <p>
                Prescripto is a healthcare technology platform that connects patients with healthcare providers. 
                We do not provide medical advice, diagnosis, or treatment. In case of a medical emergency, 
                please contact your nearest hospital or call emergency services immediately.
              </p>
              <p className="mt-2">
                All doctors on Prescripto are verified by our medical team. However, we do not guarantee 
                the quality of medical services provided by individual practitioners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Emergency Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <a
          href="tel:+9118001234567"
          className="flex items-center justify-center h-14 w-14 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors animate-pulse"
          aria-label="Emergency Call"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-t border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Medical Emergency?</p>
                <p className="text-sm text-red-700">
                  Call emergency services or visit the nearest hospital immediately.
                </p>
              </div>
            </div>
            <a
              href="tel:108"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 108 (Emergency)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;