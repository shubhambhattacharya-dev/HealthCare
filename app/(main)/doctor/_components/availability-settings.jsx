"use client"

import useFetch from '@/hooks/use-fetch'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, Loader2, AlertCircle, CheckCircle2, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { setAvailableSlots } from '@/actions/doctor'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const AvailabilitySettings = ({ slots }) => {

    const [showForm, setShowForm] = useState(false);

    const { loading, fn: submitslots, data } = useFetch(setAvailableSlots);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            startTime: "",
            endTime: "",
        }
    })

    function createLocalDateFromTime(timeStr) {
        const [hours, mintues] = timeStr.split(":").map(Number);
        const now = new Date();
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            mintues
        );
        return date;
    }

    const onSubmit = async (data) => {
        if (loading) return

        const formData = new FormData();

        const startDate = createLocalDateFromTime(data.startTime);
        const endDate = createLocalDateFromTime(data.endTime);

        if (startDate >= endDate) {
            toast.error("End time must be after start time");
            return;
        }

        formData.append("startTime", startDate.toISOString());
        formData.append("endTime", endDate.toISOString());

        const result = await submitslots(formData);
        if (result?.success) {
            setShowForm(false);
        }
    }

    useEffect(() => {
        if (data && data?.success) {
            toast.success("Availability slots updated successfully")
        }
    }, [data])

    return (
        <Card className="border border-emerald-900/30 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 shadow-xl shadow-black/20 backdrop-blur-sm overflow-hidden">
            {/* Top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-600/0 via-emerald-500 to-emerald-600/0" />

            <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <CalendarClock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-white tracking-tight">
                                Availability Settings
                            </CardTitle>
                            <CardDescription className="text-zinc-400 text-sm mt-0.5">
                                Set your daily availability for patient appointments.
                            </CardDescription>
                        </div>
                    </div>
                    {slots.length > 0 && (
                        <Badge variant="outline" className="border-emerald-700/50 text-emerald-400 bg-emerald-950/50 text-xs font-medium px-2.5 py-1">
                            {slots.length} {slots.length === 1 ? 'slot' : 'slots'} active
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <Separator className="bg-zinc-800/60" />

            <CardContent className="px-6 pt-5 pb-6">
                {!showForm ? (
                    <>
                        <div className="mb-5">
                            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
                                Current Availability
                            </h3>

                            {slots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/40 text-center">
                                    <div className="p-3 rounded-full bg-zinc-800/80 border border-zinc-700/50 mb-3">
                                        <Clock className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                                        You haven&apos;t set any availability slots yet. Add your availability to start accepting appointments.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="group flex items-center gap-3 p-3.5 rounded-xl border border-emerald-900/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-800/50 transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/40 shrink-0">
                                                <Clock className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className="text-white font-medium text-sm tabular-nums">{slot.startTime}</span>
                                                <span className="text-zinc-600 text-xs">—</span>
                                                <span className="text-white font-medium text-sm tabular-nums">{slot.endTime}</span>
                                            </div>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500/60 shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={() => { setShowForm(true) }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-10 rounded-lg transition-all duration-200 shadow-md shadow-emerald-900/30 hover:shadow-emerald-800/40"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Set Availability Time
                        </Button>
                    </>
                ) : (
                    <form
                        className="space-y-5 rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <h3 className="text-sm font-semibold text-white">Set Daily Availability</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="startTime" className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                                    Start Time
                                </Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    {...register("startTime", { required: "Start time is required" })}
                                    className="bg-zinc-800/80 border-zinc-700/60 text-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 h-10 rounded-lg transition-colors [color-scheme:dark]"
                                />
                                {errors.startTime && (
                                    <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3 shrink-0" />
                                        {errors.startTime.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="endTime" className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                                    End Time
                                </Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    {...register("endTime", { required: "End time is required" })}
                                    className="bg-zinc-800/80 border-zinc-700/60 text-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 h-10 rounded-lg transition-colors [color-scheme:dark]"
                                />
                                {errors.endTime && (
                                    <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3 shrink-0" />
                                        {errors.endTime.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/60 hover:text-white hover:border-zinc-600 h-9 px-4 rounded-lg transition-all duration-200"
                                onClick={() => { setShowForm(false) }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white h-9 px-5 rounded-lg font-medium transition-all duration-200 shadow-md shadow-emerald-900/30 min-w-[130px]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Availability"
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                {/* Info section */}
                <div className="mt-5 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <h4 className="font-medium text-zinc-200 text-sm mb-1.5 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        How Availability Works
                    </h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        Setting your daily availability allows patients to book appointments
                        during those hours. The same availability applies to all days. You
                        can update your availability at any time, but existing booked
                        appointments will not be affected.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}