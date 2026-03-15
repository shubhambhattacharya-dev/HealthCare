"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SlotPicker({ days, onSelectSlot }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const firstDayWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);

  const handleSlotSelect = (slot) => setSelectedSlot(slot);

  const confirmSelection = () => {
    if (selectedSlot) onSelectSlot(selectedSlot);
  };

  return (
    <div className="space-y-5">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Day Tabs */}
        <TabsList className="w-full justify-start overflow-x-auto bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-1 gap-1 h-auto">
          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              disabled={day.slots.length === 0}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed data-[state=active]:bg-emerald-700/30 data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-700/40 transition-all"
            >
              <div className="flex flex-col items-center leading-tight">
                <span className="text-xs text-muted-foreground font-normal">
                  {format(new Date(day.date), "EEE")}
                </span>
                <span className="font-semibold">
                  {format(new Date(day.date), "MMM d")}
                </span>
              </div>
              {day.slots.length > 0 && (
                <span className="bg-emerald-900/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                  {day.slots.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Slot Grids */}
        {days.map((day) => (
          <TabsContent key={day.date} value={day.date} className="pt-4">
            {day.slots.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No available slots for this day.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium pl-0.5">
                  {day.displayDate}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {day.slots.map((slot) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => handleSlotSelect(slot)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all cursor-pointer w-full text-left
                          ${isSelected
                            ? "bg-emerald-900/30 border-emerald-600/60 text-white shadow-sm shadow-emerald-900/20"
                            : "bg-zinc-900/40 border-zinc-800/50 text-muted-foreground hover:border-emerald-800/50 hover:text-white hover:bg-zinc-800/40"
                          }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 shrink-0 text-zinc-500" />
                        )}
                        <span className="font-medium">
                          {format(new Date(slot.startTime), "h:mm a")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">
          {selectedSlot ? (
            <span className="text-emerald-400 font-medium">
              ✓ {format(new Date(selectedSlot.startTime), "h:mm a")} selected
            </span>
          ) : (
            "Select a time slot to continue"
          )}
        </p>

        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl h-10 px-5 text-sm shadow-md shadow-emerald-900/30 transition-all disabled:opacity-50"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}