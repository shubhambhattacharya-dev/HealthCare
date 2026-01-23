import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'

const MyAppointmentPage = () => {
  const {doctors}=useContext(AppContext)
  return (
    <div>MyAppointmentPage</div>
  )
}

export default MyAppointmentPage
