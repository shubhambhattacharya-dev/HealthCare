import { redirect } from 'next/navigation';  // ✅ fix
import React from 'react'
import { getCurrentUser } from '@/actions/onboarding';  // ✅ add
import { getDoctorAppointments, getDoctorAvailability } from '@/actions/doctor';  // ✅ add

const DoctorDashboard = async() => {
    const user = await getCurrentUser();

    // ✅ Pehle checks karo — unnecessary calls se bachao
    if(user?.role !== "DOCTOR"){
        redirect("/onboarding");
    }

    if(user?.verificationStatus !== "VERIFIED"){  // ✅ typo fix - removed 'c'
        redirect("/doctor/verification");
    }

    const [appointmentsData, availabilityData] = await Promise.all([  // ✅ capital P
        getDoctorAppointments(),
        getDoctorAvailability()
    ])

  return (
    <div>DoctorDashboard</div>
  )
}

export default DoctorDashboard  // ✅ sahi jagah