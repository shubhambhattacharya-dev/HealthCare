import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false) // future use
  const [token, setToken] = useState(true)

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      
      {/* Logo */}
      <img
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt="logo"
        onClick={() => navigate('/')}
      />

      {/* Desktop Menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className='border-none h-0.5 bg-primary w-3/5 hidden'/>
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className='border-none h-0.5 bg-primary w-3/5 hidden'/>
        </NavLink>

        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className='border-none h-0.5 bg-primary w-3/5 hidden'/>
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className='border-none h-0.5 bg-primary w-3/5 hidden'/>
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4 cursor-pointer group relative'>
        {token ? (
          <div className='flex items-center gap-2'>
            <img
              className='w-8 rounded-full'
              src={assets.profile_pic}
              alt="profile"
            />

            <img
              className='w-2.5'
              src={assets.dropdown_icon}
              alt="dropdown"
            />

            {/* Dropdown */}
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/profile')} className='hover:text-black'>
                  My Profile
                </p>

                <p onClick={() => navigate('/my-appointments')} className='hover:text-black'>
                  My Appointments
                </p>

                <p onClick={() => setToken(false)} className='hover:text-black'>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
