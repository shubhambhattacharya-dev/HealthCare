import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import Card from '../design-system/components/Card.jsx';
import Button from '../design-system/components/button.jsx';
import { 
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingStep] = useState(1); // 1: Select time, 2: Confirm
  const [appointmentType, setAppointmentType] = useState('clinic'); // clinic, video, phone
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Generate next 14 days for booking
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        date: date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        available: true,
        isToday: i === 0,
      });
    }
    
    return dates;
  };

  // Generate time slots (every 30 minutes)
  const generateTimeSlots = (selectedDate) => {
    if (!selectedDate) return [];
    
    const timeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(selectedDate.date);
        time.setHours(hour, minute, 0, 0);
        
        // Don't show past times for today
        if (selectedDate.isToday && time < new Date()) {
          continue;
        }
        
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        // Simulate availability (in real app, check with backend)
        const available = Math.random() > 0.3;
        
        timeSlots.push({
          time: formattedTime,
          datetime: time,
          available,
          isPopular: (hour === 10 || hour === 14) && available, // 10 AM & 2 PM popular
        });
      }
    }
    
    return timeSlots;
  };

  const [availableDates] = useState(generateAvailableDates());
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const fetchDocInfo = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const docInfo = doctors?.find(doc => doc._id === docId);
      setDocInfo(docInfo);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    } finally {
      setLoading(false);
    }
  }, [doctors, docId]);

  useEffect(() => {
    fetchDocInfo();
  }, [fetchDocInfo]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setShowConfirmation(true);
    
    // In real app, call your backend API here
    // await bookAppointment({ doctorId: docId, date: selectedDate, time: selectedTime });
  };

  const renderDoctorDetails = () => (
    <Card className="overflow-hidden" animate>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Doctor Image */}
        <div className="lg:w-1/3">
          <div className="relative">
            <img
              src={docInfo.image || assets.doctor_placeholder}
              alt={docInfo.name}
              className="w-full h-64 lg:h-full object-cover rounded-2xl"
            />
            {/* Online Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Available Today
              </span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-xs text-gray-600">Patients</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{docInfo.experience}</p>
              <p className="text-xs text-gray-600">Experience</p>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="lg:w-2/3">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                {docInfo.name}
                <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
              </h1>
              <p className="text-lg text-primary-600 font-medium mt-1">
                {docInfo.specialty} • {docInfo.degree}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid 
                  key={i} 
                  className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-gray-700 font-medium">4.8 (120 reviews)</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600">98% Patient Satisfaction</span>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                <UserGroupIcon className="h-4 w-4 text-primary-600" />
              </span>
              About Doctor
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {docInfo.about || "Specialized in providing comprehensive healthcare with a patient-centered approach. Committed to delivering exceptional medical care with years of experience in diagnosis and treatment."}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Prescripto Medical Center</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-medium text-2xl text-primary-600">
                    {currencySymbol}{docInfo.fees}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Available For</p>
                  <p className="font-medium">Video & Clinic Consultations</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Avg. Wait Time</p>
                  <p className="font-medium">15-20 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Verified Doctor
            </span>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center">
              <CheckBadgeIcon className="h-4 w-4 mr-2" />
              Licensed Practitioner
            </span>
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center">
              <StarIcon className="h-4 w-4 mr-2" />
              Top Rated
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderBookingSection = () => (
    <Card className="mt-8" animate>
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {['Select Time', 'Confirm Details', 'Payment'].map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center font-semibold border-2
                ${index + 1 <= bookingStep 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-400 border-gray-300'
                }
                transition-all duration-300
              `}>
                {index + 1}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">{step}</span>
              {index < 2 && (
                <div className="h-1 w-24 mx-4 bg-gray-200">
                  <div 
                    className={`h-full bg-primary-600 transition-all duration-500 ${
                      index + 1 < bookingStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Date & Time Selection */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Appointment Type</h2>
          
          {/* Appointment Type */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { type: 'clinic', label: 'Clinic Visit', icon: MapPinIcon, desc: 'In-person consultation' },
              { type: 'video', label: 'Video Call', icon: VideoCameraIcon, desc: 'Virtual appointment' },
              { type: 'phone', label: 'Phone Call', icon: PhoneIcon, desc: 'Audio consultation' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setAppointmentType(option.type)}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all duration-200
                  ${appointmentType === option.type
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <option.icon className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.dateNumber}
                  onClick={() => setSelectedDate(date)}
                  disabled={!date.available}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    flex flex-col items-center justify-center
                    ${!date.available 
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : selectedDate?.dateNumber === date.dateNumber
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-xs text-gray-500">{date.day}</div>
                  <div className="text-xl font-bold mt-1">{date.dateNumber}</div>
                  <div className="text-xs text-gray-500">{date.month}</div>
                  {date.isToday && (
                    <div className="mt-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Today
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Time Slots
              {selectedDate?.isToday && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Today, {selectedDate?.date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot.available && setSelectedTime(slot)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                    flex flex-col items-center justify-center
                    ${!slot.available
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : selectedTime?.time === slot.time
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {slot.time}
                  {slot.isPopular && slot.available && (
                    <span className="text-xs text-green-600 mt-1">Popular</span>
                  )}
                </button>
              ))}
            </div>
            
            {timeSlots.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarDaysIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No available slots for this date</p>
                <p className="text-sm mt-2">Please select another date</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <Card variant="accent" className="sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Summary</h2>
            
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl">
                <img 
                  src={docInfo.image || assets.doctor_placeholder} 
                  alt={docInfo.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{docInfo.name}</h4>
                  <p className="text-sm text-gray-600">{docInfo.specialty}</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Appointment Type</span>
                  <span className="font-semibold capitalize">{appointmentType} Visit</span>
                </div>
                
                {selectedDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">
                      {selectedDate.date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">{selectedTime.time}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">30 minutes</span>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any symptoms, concerns, or special requests..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">{currencySymbol}{docInfo.fees}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Platform Fee</span>
                  <span>{currencySymbol}50</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>{currencySymbol}{(docInfo.fees * 0.18).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {currencySymbol}{(parseFloat(docInfo.fees) + 50 + (docInfo.fees * 0.18)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!selectedDate || !selectedTime}
                onClick={handleBookAppointment}
              >
                {selectedDate && selectedTime ? 'Confirm Appointment' : 'Select Date & Time'}
              </Button>

              {/* Additional Info */}
              <div className="text-center text-sm text-gray-500">
                <p className="flex items-center justify-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                  Your payment is secure and encrypted
                </p>
                <p className="mt-2">Free cancellation up to 24 hours before appointment</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );

  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckBadgeIcon className="h-10 w-10 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Appointment Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your appointment with {docInfo?.name} has been successfully scheduled.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">
                  {selectedDate?.date?.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{selectedTime?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold capitalize">{appointmentType} Visit</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setShowConfirmation(false);
                  navigate('/my-appointments');
                }}
              >
                View My Appointments
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowConfirmation(false)}
              >
                Book Another Appointment
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold text-gray-700">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-12 max-w-md">
          <XMarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for is not available.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/doctors')}
          >
            Browse All Doctors
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Back to Doctors
        </button>

        {/* Main Content */}
        {renderDoctorDetails()}
        {renderBookingSection()}

        {/* Related Doctors */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Doctors You Might Like</h2>
          <RelatedDoctors specialty={docInfo.specialty} docId={docInfo._id} />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};

export default Appointment;