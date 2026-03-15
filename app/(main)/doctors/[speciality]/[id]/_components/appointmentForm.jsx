"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import { bookAppointment } from "@/actions/appointment";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

export function AppointmentForm({ doctorId, slot, onBack, onComplete }) {
  const [description, setDescription] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);
    await submitBooking(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Appointment Summary Card */}
      <div className="rounded-xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/40 to-zinc-900/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-emerald-800/20 bg-emerald-900/20">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Appointment Summary
          </p>
        </div>
        <div className="p-4 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/30 shrink-0">
              <Calendar className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Date</p>
              <p className="text-sm font-medium text-white">
                {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-900/20" />

          {/* Time */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/30 shrink-0">
              <Clock className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Time Slot</p>
              <p className="text-sm font-medium text-white">{slot.formatted}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-900/20" />

          {/* Cost */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/30 shrink-0">
              <CreditCard className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Cost</p>
                <p className="text-sm font-medium text-white">2 Credits</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-sm font-medium text-white/80">
            Medical Concern
          </Label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your symptoms or what you'd like to discuss in the appointment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-zinc-900/50 border-emerald-900/30 focus:border-emerald-600/50 focus:ring-emerald-600/20 h-28 resize-none text-sm placeholder:text-zinc-600 rounded-xl transition-colors"
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This helps the doctor prepare before your appointment.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all rounded-xl h-10 px-4 text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Slot
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl h-10 px-6 text-sm transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-800/40 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </form>
  );
}