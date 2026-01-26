import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star,
  Clock,
  MapPin,
  Users,
  Award,
  ChevronRight,
  Calendar,
  Shield,
  CheckCircle
} from 'lucide-react'

// Context
import { AppContext } from '../context/AppContext'

// Design System Components
import Card from '../design-system/components/Card.jsx'
import Button from '../design-system/components/button.jsx'
import Badge from '../design-system/components/Badge.jsx'

// Skeleton Loader Component
const DoctorCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="h-72 bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
)

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, loading } = useContext(AppContext)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Filter top doctors (with rating > 4.5)
  const topDoctors = doctors
    .filter(doctor => doctor.rating >= 4.5)
    .slice(0, 8)

  // Calculate experience years
  const getExperience = (doctor) => {
    if (doctor.experience) return doctor.experience
    return 5 + (doctor.id % 10) // Fallback: 5-15 years
  }

  // Calculate patient count
  const getPatientCount = (doctor) => {
    if (doctor.patientCount) return doctor.patientCount
    return 500 + (doctor.id % 500) // Fallback: 500-1000
  }

  const handleDoctorClick = (doctorId) => {
    navigate(`/appointment/${doctorId}`)
    window.scrollTo(0, 0)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="primary" className="mb-4">
            <Award className="h-4 w-4 mr-2" />
            Top Rated Professionals
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-gradient">Expert Doctors</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Highly qualified doctors with proven track records and excellent patient reviews
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Doctors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(doctor._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card
                    hover
                    animate
                    className="h-full overflow-hidden border-2 border-gray-200 hover:border-primary-300 transition-all"
                  >
                    {/* Doctor Image with Overlay */}
                    <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          hoveredCard === doctor._id ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      
                      {/* Availability Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <Badge 
                          variant={doctor.available ? "success" : "warning"} 
                          dot
                          size="sm"
                          className={doctor.available ? 'animate-pulse' : ''}
                        >
                          {doctor.available ? 'Available' : 'Busy'}
                        </Badge>
                      </div>

                      {/* Experience Badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="primary" className="bg-white/90 backdrop-blur-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {getExperience(doctor)} years
                        </Badge>
                      </div>

                      {/* Verified Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Shield className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6 space-y-4">
                      {/* Name & Speciality */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {doctor.name}
                        </h3>
                        <p className="text-primary-600 font-semibold">
                          {doctor.speciality}
                        </p>
                      </div>

                      {/* Rating & Reviews */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold text-gray-900">
                              {doctor.rating || '4.8'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({doctor.reviews || '200+'} reviews)
                          </span>
                        </div>
                        
                        <Badge variant="outline" size="sm">
                          <Users className="h-3 w-3 mr-1" />
                          {getPatientCount(doctor)}+ patients
                        </Badge>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {doctor.location || 'Apollo Hospital, Delhi'}
                        </span>
                      </div>

                      {/* Fees */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{doctor.fee || '500'}
                            <span className="text-sm text-gray-500 font-normal"> / visit</span>
                          </p>
                        </div>
                        
                        {/* Book Button */}
                        <Button
                          size="sm"
                          onClick={() => handleDoctorClick(doctor._id)}
                          className="group"
                          icon={ChevronRight}
                          iconPosition="right"
                        >
                          Book Now
                          <span className="inline-block group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </Button>
                      </div>

                      {/* Next Available Slot */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Next slot:</span>
                          </div>
                          <Badge variant="success" size="xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Today, 4:30 PM
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {topDoctors.length === 0 && (
              <div className="text-center py-16">
                <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No doctors available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Currently there are no top-rated doctors available. Please check back later.
                </p>
                <Button onClick={() => navigate('/doctors')}>
                  View All Doctors
                </Button>
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        {topDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigate('/doctors')
                window.scrollTo(0, 0)
              }}
              icon={ChevronRight}
              iconPosition="right"
              className="px-12"
            >
              View All Doctors
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
        )}
      </div>
    </section>
  )
}

export default TopDoctors