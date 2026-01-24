import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Shield,
  Smartphone,
  Heart,
  Facebook,
  Globe,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// Design System Components
import Button from '../design-system/components/button.jsx'
import Input from '../design-system/components/Input.jsx'
import Card from '../design-system/components/Card.jsx'
import Badge from '../design-system/components/Badge.jsx'

// Assets
import { assets } from '../assets/assets_frontend/assets'

const LoginPage = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    agreeTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (state === 'Sign Up') {
      if (!formData.name.trim()) newErrors.name = 'Full name is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors below')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success(
        state === 'Sign Up'
          ? 'Account created successfully!'
          : 'Logged in successfully!'
      )

      // Navigate to home or dashboard
      navigate('/')

    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    toast.loading(`Connecting with ${provider}...`)
    // Implement social login logic
  }

  const benefits = [
    { icon: Heart, text: 'Book appointments instantly' },
    { icon: Shield, text: 'Secure health records' },
    { icon: CheckCircle, text: 'Digital prescriptions' },
    { icon: Smartphone, text: 'Manage on mobile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-card border-0 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-white rounded-2xl mb-4 shadow-lg">
                  <img
                    src={assets.logo}
                    alt="Prescripto"
                    className="h-8 w-8"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-white/90">
                  {state === 'Sign Up'
                    ? 'Join our healthcare community'
                    : 'Sign in to your account'}
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Globe}
                    onClick={() => handleSocialLogin('Google')}
                    className="border-gray-300 hover:bg-gray-50"
                    fullWidth
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Facebook}
                    onClick={() => handleSocialLogin('Facebook')}
                    className="border-gray-300 hover:bg-gray-50"
                    fullWidth
                  >
                    Facebook
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {state === 'Sign Up' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Input
                          label="Full Name"
                          icon={User}
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={errors.name}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />

                  {state === 'Sign Up' && (
                    <>
                      <Input
                        label="Phone Number"
                        icon={Smartphone}
                        placeholder="Enter your phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        required
                      />

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary-600 hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-sm text-error-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.agreeTerms}
                        </p>
                      )}
                    </>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    className="mt-6"
                  >
                    {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                      className="text-primary-600 hover:underline font-medium"
                    >
                      {state === 'Sign Up' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefits Section */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <benefit.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600">{benefit.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage