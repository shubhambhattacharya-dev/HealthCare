"use client"

import { SPECIALTIES } from "@/lib/specialities"
import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const SpecialityPage = () => {
 

  return (
    <>
      <div className="flex flex-col items-center mb-12 text-center relative">
        {/* Ambient glow behind heading */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-72 h-16 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-3 opacity-80">
          Healthcare Directory
        </span>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Doctor
          </span>
        </h1>
        <p className="text-muted-foreground text-base max-w-md leading-relaxed">
          Browse by speciality or view all available healthcare providers.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((speciality) => (
          <Link key={speciality.name} href={`/doctors/${speciality.name}`}>
            <Card className="group relative overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer border-emerald-900/20 h-full bg-white/[0.02] hover:bg-emerald-950/30 hover:shadow-lg hover:shadow-emerald-950/30 hover:-translate-y-0.5">
              {/* Subtle corner accent on hover */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-3xl" />

              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-800/30 group-hover:border-emerald-600/40 group-hover:bg-emerald-800/30 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-900/40">
                  <div className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
                    {speciality.icon}
                  </div>
                </div>
                <h3 className="font-medium text-white/80 group-hover:text-white text-sm leading-tight transition-colors duration-200">
                  {speciality.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}

export default SpecialityPage