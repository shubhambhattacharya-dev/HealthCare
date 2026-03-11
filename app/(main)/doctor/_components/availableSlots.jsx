"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calender";
import { Clock, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAvailabilitySlots } from "@/actions/doctor";

export default function AvailableSlots({ slots = [] }) {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddSlot = async (e) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);

      const result = await setAvailabilitySlots(formData);
      
      if (result.success) {
        toast.success("Availability slot added successfully");
        setStartTime("");
        setEndTime("");
      } else {
        toast.error(result.error || "Failed to add availability slot");
      }
    } catch (error) {
      toast.error("Error adding availability slot");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Set Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-muted-foreground">Start Time</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-muted-foreground">End Time</label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Available Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No availability slots set</p>
              <p className="text-sm">Add your available time slots above</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(slot.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slot.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : slot.status === "BOOKED"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {slot.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
