import { getCurrentUser } from '@/actions/onboarding'
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata = {
  title: "DocNow - Book a Doctor Instantly",
  description: "Your Health, Our Priority Book a Doctor Instantly"
}

const onboardingLayout = async ({ children }) => {

  const user = await getCurrentUser();

  if (user) {
    if (user.role === 'PATIENT') {
      redirect("/doctors");
    }
    else if (user.role === 'DOCTOR') {
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    }
    else if (user.role === 'ADMIN') {
      redirect("/admin");
    }
  }

  return (
    <div className='container mx-auto px-4 pt-24 pb-12'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-10 flex flex-col items-center'>

          {/* Badge - teal to match your theme */}
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Onboarding
          </span>

          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-3 gradient-title'>
            Welcome to <span className="text-emerald-400">DocNow</span>
          </h1>

          <p className='text-muted-foreground text-base md:text-lg max-w-md leading-relaxed'>
            Tell us how you&apos;d like to use the platform — so we can tailor your experience.
          </p>

          {/* Subtle divider accent */}
          <div className="mt-6 flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-emerald-500/40" />
            <span className="text-emerald-500/60 text-xs">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-500/40" />
          </div>

        </div>

        {children}

      </div>
    </div>
  )
}

export default onboardingLayout;