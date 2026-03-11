import { redirect } from 'next/navigation';
import React from 'react';
import { getCurrentUser } from '@/actions/onboarding';
import { getDoctorAppointments, getDoctorsAvailability, getDoctorPayouts } from '@/actions/doctor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Calendar, CreditCard } from 'lucide-react';
import AvailableSlots from './_components/availableSlots';
import Appointments from './_components/appointments';
import Payouts from './_components/payouts';

const DoctorDashboard = async () => {
  const user = await getCurrentUser();

  if (user?.role !== 'DOCTOR') {
    redirect('/onboarding');
  }

  if (user?.verificationStatus !== 'VERIFIED') {
    redirect('/doctor/verification');
  }

  const [appointmentsData, availabilityData, payoutsData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorsAvailability(),
    getDoctorPayouts(),
  ]);

  return (
    <Tabs
      defaultValue="appointments"
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
    >
      {/* Sidebar */}
      <TabsList
        className="
          md:col-span-1
          flex flex-row md:flex-col
          w-full h-auto
          bg-transparent
          p-0 gap-1
          items-start
        "
      >
        <TabsTrigger
          value="appointments"
          className="
            w-full justify-start px-4 py-3 rounded-lg
            text-sm font-medium
            text-muted-foreground
            bg-transparent
            hover:bg-muted/40 hover:text-foreground
            data-[state=active]:bg-muted/50
            data-[state=active]:text-foreground
            data-[state=active]:font-semibold
            transition-all duration-150
            flex items-center gap-3
          "
        >
          <Calendar className="h-4 w-4 shrink-0" />
          Appointments
        </TabsTrigger>

        <TabsTrigger
          value="availability"
          className="
            w-full justify-start px-4 py-3 rounded-lg
            text-sm font-medium
            text-muted-foreground
            bg-transparent
            hover:bg-muted/40 hover:text-foreground
            data-[state=active]:bg-muted/50
            data-[state=active]:text-foreground
            data-[state=active]:font-semibold
            transition-all duration-150
            flex items-center gap-3
          "
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Availability
        </TabsTrigger>

        <TabsTrigger
          value="payouts"
          className="
            w-full justify-start px-4 py-3 rounded-lg
            text-sm font-medium
            text-muted-foreground
            bg-transparent
            hover:bg-muted/40 hover:text-foreground
            data-[state=active]:bg-muted/50
            data-[state=active]:text-foreground
            data-[state=active]:font-semibold
            transition-all duration-150
            flex items-center gap-3
          "
        >
          <CreditCard className="h-4 w-4 shrink-0" />
          Payouts
        </TabsTrigger>
      </TabsList>

      {/* Content */}
      <div className="md:col-span-3">
        <TabsContent value="appointments" className="border-none p-0 mt-0">
          <Appointments appointments={appointmentsData?.appointments || []} />
        </TabsContent>

        <TabsContent value="availability" className="border-none p-0 mt-0">
          <AvailableSlots slots={availabilityData?.slots || []} />
        </TabsContent>

        <TabsContent value="payouts" className="border-none p-0 mt-0">
          <Payouts payouts={payoutsData?.payouts || []} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DoctorDashboard;
