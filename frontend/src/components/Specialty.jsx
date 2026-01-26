import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  Brain,
  Heart,
  Smile,
  Eye,
  Activity,
  Baby,
  Bone,
  Ear,
  Scissors,
  Thermometer,
  User,
  Star,
  ChevronRight
} from 'lucide-react'

// Design System Components
import Card from '../design-system/components/Card.jsx'
import Button from '../design-system/components/button.jsx'

// If you have specialityData from assets, use it, otherwise use this
import { specialityData } from '../assets/assets_frontend/assets'

const Specialty = () => {
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Icon mapping for specialties
  const iconMap = {
    'Cardiology': Heart,
    'Neurology': Brain,
    'Dentistry': Smile,
    'Ophthalmology': Eye,
    'Orthopedics': Activity,
    'Pediatrics': Baby,
    'Dermatology': User,
    'Gynecology': User,
    'Psychiatry': Brain,
    'ENT': Ear,
    'Surgery': Scissors,
    'General Physician': Stethoscope,
    'Pulmonology': Heart,
    'Rheumatology': Bone,
    'Endocrinology': Thermometer
  }

  // Default specialties if no data
  const defaultSpecialties = [
    { specialty: 'Cardiology', doctors: 65, color: 'from-red-500 to-pink-500', icon: Heart },
    { specialty: 'Neurology', doctors: 45, color: 'from-purple-500 to-indigo-500', icon: Brain },
    { specialty: 'Dentistry', doctors: 85, color: 'from-blue-500 to-cyan-500', icon: Smile },
    { specialty: 'Ophthalmology', doctors: 55, color: 'from-green-500 to-emerald-500', icon: Eye },
    { specialty: 'Orthopedics', doctors: 75, color: 'from-amber-500 to-orange-500', icon: Activity },
    { specialty: 'Pediatrics', doctors: 60, color: 'from-pink-500 to-rose-500', icon: Baby },
    { specialty: 'Dermatology', doctors: 50, color: 'from-indigo-500 to-blue-500', icon: User },
    { specialty: 'ENT', doctors: 40, color: 'from-teal-500 to-green-500', icon: Ear },
    { specialty: 'General Physician', doctors: 120, color: 'from-sky-500 to-blue-500', icon: Stethoscope },
    { specialty: 'Psychiatry', doctors: 35, color: 'from-violet-500 to-purple-500', icon: Brain },
    { specialty: 'Gynecology', doctors: 55, color: 'from-fuchsia-500 to-pink-500', icon: User },
    { specialty: 'Surgery', doctors: 45, color: 'from-gray-600 to-gray-800', icon: Scissors },
  ]

  // Use data from assets or default
  const specialties = specialityData?.map((item, index) => {
    const Icon = iconMap[item.specialty] || Stethoscope
    const defaultSpec = defaultSpecialties.find(s => s.specialty === item.specialty)

    return {
      specialty: item.specialty,
      image: item.image,
      icon: Icon,
      doctors: defaultSpec?.doctors || 30 + (index * 5),
      color: defaultSpec?.color || 'from-primary-500 to-secondary-500'
    }
  }) || defaultSpecialties

  const handleSpecialtyClick = (specialty) => {
    navigate(`/doctors/${specialty}`)
    window.scrollTo(0, 0)
  }

  return (
    <section className="py-16 bg-white" id="specialty">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white mb-4">
            <Star className="h-4 w-4 mr-2" />
            12+ Specialties
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find by <span className="text-gradient">Medical Specialty</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with top specialists across various medical fields. Browse by specialty to find the right doctor for your needs.
          </p>
        </motion.div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {specialties.slice(0, 12).map((item, index) => {
            const IconComponent = item.icon
            
            return (
              <motion.div
                key={item.specialty}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative"
              >
                <Card
                  hover
                  padding="md"
                  className="h-full flex flex-col items-center text-center group cursor-pointer"
                  onClick={() => handleSpecialtyClick(item.specialty)}
                >
                  {/* Icon/Image Container */}
                  <div className={`relative mb-4 transition-all duration-300 ${
                    hoveredIndex === index ? 'transform -translate-y-2' : ''
                  }`}>
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.specialty}
                          className="h-10 w-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <IconComponent
                        className="h-8 w-8 text-white"
                        style={{ display: item.image ? 'none' : 'block' }}
                      />
                    </div>
                    
                    {/* Badge for doctor count */}
                    <span className="absolute -top-2 -right-2 bg-white text-primary-600 border border-primary-200 px-2 py-1 rounded-full text-xs font-medium">
                      {item.doctors}+
                    </span>
                  </div>

                  {/* Specialty Name */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {item.specialty}
                  </h3>

                  {/* Arrow indicator */}
                  <div className={`mt-2 transition-all duration-300 ${
                    hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}>
                    <ChevronRight className="h-4 w-4 text-primary-500" />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/doctors')}
            icon={ChevronRight}
            iconPosition="right"
            className="px-12"
          >
            View All Specialties
          </Button>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Specialty