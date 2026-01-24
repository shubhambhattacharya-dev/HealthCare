import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../design-system/components/button.jsx';
import Input from '../design-system/components/Input.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../design-system/components/Card.jsx';
import Badge from '../design-system/components/Badge.jsx';
import Modal from '../design-system/components/Modal.jsx';
import { User, Mail, Lock, Calendar, Heart, Star } from 'lucide-react';

export default function DesignSystemTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Prescripto Design System
        </h1>
        <p className="text-gray-600 mb-8">
          Complete production-ready UI components
        </p>

        {/* Section: Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>All button styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="error">Error</Button>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button icon={Heart} iconPosition="left">
                    With Icon
                  </Button>
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>Form inputs with validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  helperText="We'll never share your email"
                />
                
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error="Password must be at least 8 characters"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section: Cards & Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards & Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover animate>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Doctor Card</CardTitle>
                  <Badge variant="success" dot>
                    Available
                  </Badge>
                </div>
                <CardDescription>Card with hover animation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This card has hover effects and entrance animation.
                </p>
              </CardContent>
              <CardFooter>
                <Button fullWidth>Book Appointment</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge size="xs">XS Size</Badge>
                  <Badge size="sm">SM Size</Badge>
                  <Badge size="md">MD Size</Badge>
                  <Badge size="lg">LG Size</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Upcoming</span>
                  <Badge variant="primary" dot>Confirmed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed</span>
                  <Badge variant="success">Done</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cancelled</span>
                  <Badge variant="error">Cancelled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pending</span>
                  <Badge variant="warning">Waiting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section: Modal */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Modal Dialog</h2>
          <Card>
            <CardHeader>
              <CardTitle>Modal Example</CardTitle>
              <CardDescription>Click button to open modal</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsModalOpen(true)}>
                Open Booking Modal
              </Button>
            </CardContent>
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Book Appointment"
            size="md"
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Input
                  label="Select Date"
                  icon={Calendar}
                  type="date"
                  placeholder="Choose date"
                />
                
                <div className="grid grid-cols-4 gap-2">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                    <button
                      key={time}
                      className="p-3 text-center border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" fullWidth onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button fullWidth onClick={() => setIsModalOpen(false)}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <CardContent className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Design System Active! ✅
            </h3>
            <p className="opacity-90">
              All components are working perfectly. Now implement in your pages.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}