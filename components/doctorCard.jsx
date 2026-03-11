import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from './ui/card'
import { User, Star, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'


const DoctorCard = ({ doctor }) => {
  // Derive computed properties from the user object
  const isVerified = doctor.verificationStatus === 'VERIFIED';
  const isAvailable = doctor.availability?.some(slot => slot.status === 'AVAILABLE') || false;

  return (
    <Link href={`/doctors/profile/${doctor.id}`}>
      
      <Card className="group relative overflow-hidden border-emerald-900/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer bg-white/[0.02] hover:bg-emerald-950/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/40">
        
        {/* Hover corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-3xl pointer-events-none" />

        <CardContent className="p-5">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-800/30 group-hover:border-emerald-600/40 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105">
                {doctor.imageUrl ? (
                  <Image
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-emerald-400" />
                )}
              </div>
              {/* Online/verified dot */}
              {isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-background rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-emerald-100 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-emerald-400/80 text-xs mt-0.5 font-medium">
                    {doctor.specialty}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 mt-0.5" />
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {doctor.experience && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    {doctor.experience} yrs exp
                  </span>
                )}
                {isAvailable && (
                  <span className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                    Available Today
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DoctorCard
