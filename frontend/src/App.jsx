import React from 'react'
import { Routes , Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import DoctorPage from './pages/DoctorPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/contactPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MyAppointmentPage from './pages/MyAppointmentPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Navbar from './components/Navbar.jsx'
import Appointment from './pages/Appointment.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar/>
      
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/doctors" element={<DoctorPage/>}/>
      <Route path="/doctors/:Specialty" element={<DoctorPage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/my-appointments" element={<MyAppointmentPage/>}/>
      <Route path="/appointment/:docId" element={<Appointment/>}/>
      <Route path="/Profile" element={<ProfilePage/>}/>
     
      </Routes>
      <Footer/>
      </div>
  )
  }




export default App