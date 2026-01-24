import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Card from '../design-system/components/Card.jsx';
import Button from '../design-system/components/button.jsx';
import { 
  StarIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const RelatedDoctors = ({ specialty, docId, limit = 4 }) => {
  const { doctors, currencySymbol } = useContext(AppContext);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedDoctors = async () => {
      setLoading(true);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (doctors.length > 0 && specialty) {
        const filteredDoctors = doctors.filter(
          (doc) => doc.specialty === specialty && doc._id !== docId
        );
        
        // Sort by rating (if available) or experience
        const sortedDoctors = filteredDoctors.sort((a, b) => {
          const ratingA = a.rating || 4.5;
          const ratingB = b.rating || 4.5;
          return ratingB - ratingA;
        });
        
        setRelatedDoctors(sortedDoctors.slice(0, limit));
      }
      
      setLoading(false);
    };

    fetchRelatedDoctors();
  }, [doctors, specialty, docId, limit]);

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Similar Doctors
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Finding doctors with similar expertise...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} variant="filled" className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedDoctors.length === 0) {
    return (
      <div className="py-12 text-center">
        <Card variant="filled" className="max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Similar Doctors Found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find other doctors with the same specialty. 
            Try browsing all doctors.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              navigate('/doctors');
              window.scrollTo(0, 0);
            }}
          >
            Browse All Doctors
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          Related Professionals
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Other Top Doctors in <span className="text-primary-600">{specialty}</span>
        </h2>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your interest in {specialty}, you might also like these highly-rated professionals
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedDoctors.map((doctor, index) => (
          <motion.div
            key={doctor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="h-full"
          >
            <Card
              hover
              animate
              className="h-full flex flex-col overflow-hidden group"
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                window.scrollTo(0, 0);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View profile of ${doctor.name}, ${doctor.specialty}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/appointment/${doctor._id}`);
                  window.scrollTo(0, 0);
                }
              }}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Available
                  </span>
                </div>
                
                {/* Experience Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-semibold shadow-sm">
                    {doctor.experience || '10+ years'}
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Name and Specialty */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium">
                    {doctor.specialty}
                  </p>
                  {doctor.degree && (
                    <p className="text-xs text-gray-500 mt-1">{doctor.degree}</p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid 
                        key={i} 
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-700 font-medium">
                    4.8
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    120+ reviews
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>15 min wait</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-3 w-3 mr-1" />
                    <span>500+ patients</span>
                  </div>
                </div>

                {/* Fees */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Consultation Fee</p>
                      <p className="text-lg font-bold text-primary-600">
                        {currencySymbol}{doctor.fees || '500'}
                      </p>
                    </div>
                    
                    {/* Quick Action Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600 hover:text-primary-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/appointment/${doctor._id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View More CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-10"
      >
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <HeartIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                Need more options?
              </p>
              <p className="text-xs text-gray-600">
                Browse our full directory of {specialty} specialists
              </p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={() => {
              navigate('/doctors', { state: { specialtyFilter: specialty } });
              window.scrollTo(0, 0);
            }}
            className="whitespace-nowrap"
          >
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            View All {specialty} Doctors
          </Button>
        </div>
        
        {/* Alternative CTA for mobile */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm text-gray-600">
            Or explore other specialties
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate('/doctors');
              window.scrollTo(0, 0);
            }}
          >
            Browse All Specialties
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-50 rounded-full mb-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Verified Doctors</p>
            <p className="text-xs text-gray-600">All professionals are licensed</p>
          </div>
          <div className="p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full mb-3">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Same-Day Appointments</p>
            <p className="text-xs text-gray-600">Available for urgent care</p>
          </div>
          <div className="p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-50 rounded-full mb-3">
              <StarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">4.8/5 Average Rating</p>
            <p className="text-xs text-gray-600">From thousands of patients</p>
          </div>
          <div className="p-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-full mb-3">
              <UserGroupIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">100,000+ Patients</p>
            <p className="text-xs text-gray-600">Trusted by families nationwide</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default RelatedDoctors;