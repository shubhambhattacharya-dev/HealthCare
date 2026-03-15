// /app/doctors/[id]/_components/doctor-profile.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  Medal,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SlotPicker } from "./slotPicker";
import { AppointmentForm } from "./appointmentForm";

export function DoctorProfile({ doctor, availableDays }) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const router = useRouter();

  const totalSlots = availableDays?.reduce(
    (total, day) => total + day.slots.length,
    0
  );

  const toggleBooking = () => {
    setShowBooking(!showBooking);
    if (!showBooking) {
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSlotSelect = (slot) => setSelectedSlot(slot);
  const handleBookingComplete = () => router.push("/appointments");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column — sticky profile card */}
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">
          <Card className="border-emerald-900/20 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700" />

            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-4 ring-2 ring-emerald-700/40 shadow-lg shadow-emerald-900/30 bg-emerald-900/20">
                  {doctor.imageUrl ? (
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-emerald-400" />
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">
                  Dr. {doctor.name}
                </h2>

                <Badge
                  variant="outline"
                  className="bg-emerald-900/20 border-emerald-700/40 text-emerald-400 text-xs mb-4 px-3 py-0.5"
                >
                  {doctor.specialty}
                </Badge>

                {/* Experience pill */}
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-5 bg-zinc-800/50 border border-zinc-700/40 rounded-full px-3 py-1">
                  <Medal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{doctor.experience} yrs experience</span>
                </div>

                <Separator className="bg-emerald-900/20 mb-5" />

                {/* Availability pill */}
                {totalSlots > 0 ? (
                  <div className="w-full flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/30 rounded-lg px-3 py-2 mb-5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{totalSlots} slots available</span>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 bg-zinc-800/30 border border-zinc-700/30 rounded-lg px-3 py-2 mb-5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>No slots available</span>
                  </div>
                )}

                <Button
                  onClick={toggleBooking}
                  disabled={totalSlots === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl h-10 text-sm shadow-md shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showBooking ? (
                    <>
                      Hide Booking
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right column — details + booking */}
      <div className="md:col-span-2 space-y-5">
        {/* About Card */}
        <Card className="border-emerald-900/20 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-white tracking-tight">
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription className="text-sm">
              Professional background and expertise
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30">
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Description</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed pl-9">
                {doctor.description}
              </p>
            </div>

            <Separator className="bg-emerald-900/20" />

            {/* Availability */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Availability</h3>
              </div>

              <div className="pl-9">
                {totalSlots > 0 ? (
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-emerald-900/10 border border-emerald-900/20 rounded-lg px-3 py-2">
                    <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      <span className="text-white font-medium">{totalSlots} time slots</span>{" "}
                      available over the next 4 days
                    </span>
                  </div>
                ) : (
                  <Alert className="border-zinc-700/40 bg-zinc-800/30">
                    <AlertCircle className="h-4 w-4 text-zinc-400" />
                    <AlertDescription className="text-zinc-400 text-sm">
                      No available slots for the next 4 days. Please check back later.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Section */}
        {showBooking && (
          <div id="booking-section">
            <Card className="border-emerald-900/20 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white tracking-tight">
                      Book an Appointment
                    </CardTitle>
                    <CardDescription className="text-sm mt-0.5">
                      {!selectedSlot
                        ? "Select a time slot for your consultation"
                        : "Confirm your booking details"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {totalSlots > 0 ? (
                  <>
                    {!selectedSlot && (
                      <SlotPicker
                        days={availableDays}
                        onSelectSlot={handleSlotSelect}
                      />
                    )}
                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={doctor.id}
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)}
                        onComplete={handleBookingComplete}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/30 mx-auto mb-4">
                      <Calendar className="h-7 w-7 text-zinc-500" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      No available slots
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      This doctor doesn&apos;t have any available slots for the
                      next 4 days. Please check back later or try another doctor.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}