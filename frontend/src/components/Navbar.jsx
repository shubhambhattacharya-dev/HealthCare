import React, { useState, useEffect, useContext } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, Calendar, LogOut, Bell, ChevronDown, Search } from 'lucide-react'

// Design System Components
import Button from '../design-system/components/button.jsx'
import Badge from '../design-system/components/Badge.jsx'

// Assets
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [token, setToken] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const { darkMode, toggleDarkMode } = useContext(AppContext)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showProfileDropdown])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Appointments', path: '/my-appointments' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleLogout = () => {
    setToken(false)
    navigate('/login')
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'
        } text-gray-900 dark:text-gray-100`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer group hover:scale-105 transition-transform"
              onClick={() => navigate('/')}
            >
              <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-md border-2 border-blue-700">
                <span className="text-primary-100 font-black text-xl drop-shadow-lg">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescripto</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Appointments</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
                    }`
                  }
                >
                  <span className="block">
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95"
              >
                <img src={darkMode === 'dark' ? assets.sun_icon : assets.moon_icon} alt="Toggle dark mode" className="w-5 h-5" />
              </button>
              
              {/* Search Bar (Desktop) */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    className="w-80 px-10 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate('/doctors');
                      }
                    }}
                  />
                </div>
              </div>

              {/* Notification Bell */}
              {token && (
                <button
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <Badge
                    variant="error"
                    size="xs"
                    className="absolute -top-1 -right-1"
                  >
                    3
                  </Badge>
              </button>
              )}

              {/* Profile Section */}
              {token ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group hover:scale-105 active:scale-95"
                  >
                    <div className="relative">
                      <img
                        src={assets.profile_pic}
                        alt="Profile"
                        className="h-10 w-10 rounded-full ring-2 ring-primary-500 ring-offset-2 object-cover"
                      />
                      <Badge
                        variant="success"
                        size="xs"
                        dot
                        className="absolute -top-1 -right-1"
                      >
                        <span className="sr-only">Online</span>
                      </Badge>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Dr. John Doe
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                        showProfileDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        {/* Profile Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <img
                              src={assets.profile_pic}
                              alt="Profile"
                              className="h-12 w-12 rounded-full ring-2 ring-primary-500 object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Dr. John Doe
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                johndoe@example.com
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              navigate('/profile')
                              setShowProfileDropdown(false)
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              navigate('/my-appointments')
                              setShowProfileDropdown(false)
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Appointments</span>
                            <Badge variant="primary" size="sm" className="ml-auto">
                              2
                            </Badge>
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signup')}>
                    Book Appointment
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMenu(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
          />

          {/* Mobile Menu Panel */}
          <div
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
          >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-6">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <span className="font-medium">{link.name}</span>
                      {location.pathname === link.path && (
                        <div className="h-2 w-2 bg-primary-500 rounded-full" />
                      )}
                    </NavLink>
                  ))}
                </div>

                {/* Auth Buttons */}
                {!token && (
                  <div className="mt-8 space-y-3">
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/login')
                        setShowMenu(false)
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        navigate('/signup')
                        setShowMenu(false)
                      }}
                    >
                      Create Account
                    </Button>
                  </div>
                )}

                {/* Profile Section */}
                {token && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-6">
                      <img
                        src={assets.profile_pic}
                        alt="Profile"
                        className="h-12 w-12 rounded-full ring-2 ring-primary-500 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Dr. John Doe</p>
                        <Badge variant="success" size="sm" dot>
                          Online
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate('/profile')
                          setShowMenu(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-gray-700 dark:text-gray-300">My Profile</span>
                        <User className="h-5 w-5 text-gray-400" />
                      </button>

                      <button
                        onClick={() => {
                          navigate('/my-appointments')
                          setShowMenu(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-gray-700 dark:text-gray-300">Appointments</span>
                        <Badge variant="primary" size="sm">
                          2
                        </Badge>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <span>Logout</span>
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  © 2024 Prescripto. All rights reserved.
                </p>
              </div>
            </div>
          </>
        )}
    </>
  )
}

export default Navbar