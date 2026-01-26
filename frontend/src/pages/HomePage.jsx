import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Star,
  Calendar,
  HeartPulse,
  Stethoscope,
  Brain,
  Smile,
  Eye,
  Activity
} from 'lucide-react'

// Design System Components
import Button from '../design-system/components/button.jsx'
import Badge from '../design-system/components/Badge.jsx'

// Your existing components
import Headers from '../components/Headers'
import Specialty from '../components/Specialty'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

// Assets
import { assets } from '../assets/assets_frontend/assets'

const HomePage = () => {
  const navigate = useNavigate()

  // Simplified stats - reduced cognitive load
  const stats = [
    { value: 500, label: 'Verified Doctors', icon: Stethoscope, suffix: '+' },
    { value: 10000, label: 'Happy Patients', icon: Users, suffix: '+' },
    { value: 98, label: 'Satisfaction', icon: Star, suffix: '%' },
  ]

  // Core features only - reduced from 4 to 3
  const features = [
    {
      icon: Calendar,
      title: 'Instant Booking',
      desc: 'Book in 60 seconds',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Verified Doctors',
      desc: '100% verified credentials',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: HeartPulse,
      title: 'Digital Health',
      desc: 'Digital prescriptions & records',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  // Single testimonial - reduced from 3 to 1 for focus
  const testimonial = {
    name: 'Sarah Johnson',
    text: 'Booked in 2 minutes. Doctor was professional and caring!',
    rating: 5,
  }

  return (
    <div className="min-h-screen bg-white">
      <Headers />

      {/* Hero Section with integrated stats - reduced redundancy */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              Your Health, <span className="text-primary-600">Simplified</span>
            </h1>
            <p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
            >
              Connect with verified doctors instantly. Book appointments, access digital prescriptions, and manage your health records all in one place.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/doctors')}
              >
                Browse Doctors
              </Button>
            </div>
          </div>

          {/* Integrated stats - moved here to reduce sections */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                  <h3 className="text-4xl font-bold text-gray-900">
                    {stat.value}
                    <span className="text-primary-600">{stat.suffix}</span>
                  </h3>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features - simplified */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-600">Prescripto</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for modern healthcare, simplified
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-16 w-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find by <span className="text-primary-600">Specialty</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with top specialists across various medical fields
            </p>
          </div>
          <Specialty />
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top <span className="text-primary-600">Doctors</span> to Book
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Highly rated doctors available for consultation
            </p>
          </div>
          <TopDoctors />
        </div>
      </section>

      {/* Single Testimonial - reduced cognitive load */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-primary-600">Patients</span> Say
            </h2>
          </div>

          <div
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
          >
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
              "{testimonial.text}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonial.name.charAt(0)}
              </div>
              <div className="ml-6">
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-gray-600">Verified Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - simplified */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-primary-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of patients who trust Prescripto for their healthcare needs
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      <Banner />
    </div>
  )
}

export default HomePage