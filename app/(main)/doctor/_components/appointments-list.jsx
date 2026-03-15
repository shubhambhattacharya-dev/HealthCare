"use client";

import { useEffect } from "react";
import { getDoctorAppointments } from "@/actions/doctor";
import { AppointmentCard } from "@/components/appointment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

export default function DoctorAppointmentsList() {
    const {
        loading,
        data,
        fn: fetchAppointments,
    } = useFetch(getDoctorAppointments);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const appointments = data?.appointments || [];

    return (
        <Card className="border-emerald-900/20 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700" />

            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-800/30">
                            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        Upcoming Appointments
                    </CardTitle>

                    {/* Appointment count badge */}
                    {!loading && appointments.length > 0 && (
                        <span className="text-xs font-semibold bg-emerald-900/30 border border-emerald-800/30 text-emerald-400 px-2.5 py-1 rounded-full">
                            {appointments.length} scheduled
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading appointments...</p>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                userRole="DOCTOR"
                                refetchAppointments={fetchAppointments}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center py-12">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/30 mb-4">
                            <Calendar className="h-7 w-7 text-zinc-500" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1.5">
                            No upcoming appointments
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            You don&apos;t have any scheduled appointments yet. Make sure
                            you&apos;ve set your availability to allow patients to book.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}