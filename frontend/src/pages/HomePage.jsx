import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  const [stats, setStats] = useState([
    { value: 500, label: 'Verified Doctors', icon: Stethoscope, suffix: '+' },
    { value: 10000, label: 'Happy Patients', icon: Users, suffix: '+' },
    { value: 98, label: 'Satisfaction Rate', icon: Star, suffix: '%' },
    { value: 24, label: 'Support', icon: Clock, suffix: '/7' },
  ])

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
      icon: Clock,
      title: 'No Waiting',
      desc: 'Skip queues',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: HeartPulse,
      title: 'Health Records',
      desc: 'Digital prescriptions',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Booked in 2 minutes. Doctor was professional!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      text: 'Streamlined my practice completely.',
      rating: 5,
    },
    {
      name: 'Robert Williams',
      text: 'Digital prescriptions are a game-changer!',
      rating: 5,
    },
  ]

  // const specialties = [
  //   { icon: Stethoscope, name: 'General Physician', doctors: 120 },
  //   { icon: Brain, name: 'Neurology', doctors: 45 },
  //   { icon: HeartPulse, name: 'Cardiology', doctors: 65 },
  //   { icon: Smile, name: 'Dentistry', doctors: 85 },
  //   { icon: Eye, name: 'Ophthalmology', doctors: 55 },
  //   { icon: Activity, name: 'Orthopedics', doctors: 75 },
  // ]

  return (
    <div className="min-h-screen bg-white">
      <Headers />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  <h3 className="text-4xl font-bold text-gray-900">
                    {stat.value}
                    <span className="text-blue-600">{stat.suffix}</span>
                  </h3>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Section - Using your component but with wrapper */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find by <span className="text-blue-600">Specialty</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with top specialists across various medical fields
            </p>
          </div>
          <Specialty />
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top <span className="text-blue-600">Doctors</span> to Book
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Highly rated doctors available for consultation
            </p>
          </div>
          <TopDoctors />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-blue-600">Patients</span> Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real experiences from our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust Prescripto for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => navigate('/doctors')}
            >
              Browse Doctors
            </Button>
          </div>
        </div>
      </section>

      {/* Original Banner component at bottom if needed */}
      <Banner />
    </div>
  )
}

export default HomePage