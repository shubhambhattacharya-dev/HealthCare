import React from 'react'
import PageHeader from '@/components/pageHeader'
import { StethoscopeIcon } from 'lucide-react'

export const metadata = {
    title: "Doctor Dashboard-DocNow",
    description: "Your Health, Our Priority Book a Doctor Instantly"
}

const DoctorDashboardLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-12 pt-20">  {/* ← YAHI FIX HAI */}
        <PageHeader icon={<StethoscopeIcon />} title={'Doctor Dashboard'} />
        {children}
    </div>
  )
}

export default DoctorDashboardLayout