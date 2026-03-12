"use client"

import useFetch from '@/hooks/use-fetch'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { setAvailableSlots } from '@/actions/doctor'

const AvailableSlots = ({slots}) => {

  const [showForm, setShowForm] = useState(false);

  const {loading, fn:submitslots, data} = useFetch(setAvailableSlots);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    }
  })

  function createLocalDateFromTime(timeStr) {
    const [hours,mintues]=timeStr.split(":").map(Number);
    const now=new Date();
    const date=new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      mintues
    );
    return data;
    
  }

  const onSubmit =async(data)=>{
    if(loading) return

    const formData=new FormData();

    const startDate=createLocalDateFromTime(data.startTime);
    const endDate=createLocalDateFromTime(data.endTime);

   if(startDate >=endDate){
    toast.errors("End time must be after start time");
    return;
   }

   formData.append("startTime",startDate.toISOString());
   formData.append("endTime",endDate.toISOString());

   const result = await submitslots(formData);
   if(result?.success){
     setShowForm(false);
   }
  }

  useEffect(()=>{
    if(data && data?.success){
      toast.success("Availability slots updated successfully")
    }
  }, [data])

  return (
    <Card className="border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Clock className="h-4 w-5 mr-2 text-muted-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>Set your daily availability for patient appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? <>
        <div className='mb-6'>
          <h3 className='text-lg font-medium text-white mb-3'>
            Current Availability
          </h3>
          {slots.length === 0? <p className='text-muted-foreground'>
            you haven&apos;t set any availability slots yet. Add 
            your availability to start accepting appointments.
          </p>:(
            <div>
              {slots.map((slot)=>(
                <div key={slot.id}
                className='flex items-center p-3 rounded-md bh-muted/20 border border-emerald-900/20'>
                <div className='bg-emerald-900/20 p-2 rounded-full mr-3'>
                  <Clock className='h-4 w-4 text-ererlad-400'></Clock>

                </div>
               
                  <p className='text-white font-medium'>
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>


        <Button onClick={() => { setShowForm(true) }}
        className="w-full bg-emerald-600 hover:bg-emerald-700">

        <Plus className='h-4 w-4 mr-2' />
          Set Availability Time

        </Button>
        
        </> : <form className='space-y-4 border border-emerald-900/20 rounded-md p-4'>
        <h3 className='text-lg font-medium text-white mb-2 ' onSubmit={handleSubmit(onSubmit)}>Set Daily Availability</h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
            id="startTime"
            type="time"
            {...register("startTime", { required: "Start time is required" })}
            className="bg-background border-emerald-900/20"
            />
            {errors.startTime && (
              <p className='text-sm font-medium text-red-500'>{errors.startTime.message}</p>
            )}
          </div>



              <div>
            <Label htmlFor="EndTime">End Time</Label>
            <Input
            id="endTime"
            type="time"
            {...register("endTime", { required: "End time is required" })}
            className="bg-background border-emerald-900/20"
            />
            {errors.startTime && (
              <p className='text-sm font-medium text-red-500'>{errors.endTime.message}</p>
            )}
          </div>
        </div>

        <div>
          <Button type="button"
          variant='outline'
          className=" boarder-emerald-900/30"
          onClick={() => { setShowForm(false) }}
          disabled={loading}
          >
            Cancel
          </Button>
           <Button type="submit"
          variant='outline'
          className="bg-emerald-600 hover:bg-emerald-700"
         
          disabled={loading}
          >
           {loading ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin">Saving.....</Loader2>
            </>
           ):(
            "Save Availability"
           )
           }
          </Button>

        </div>
           
          </form>}
          <div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
          <h4 className="font-medium text-white mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
            How Availability Works
          </h4>
          <p className="text-muted-foreground text-sm">
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
 

export default AvailableSlots