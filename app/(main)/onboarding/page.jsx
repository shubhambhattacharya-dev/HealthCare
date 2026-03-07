"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, Loader2 } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { setUserRole } from '@/actions/onboarding';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const doctorFormSchema = z.object({
  specialty: z.string().min(1, "specialty required"),
  experience: z.number()
    .min(1, "experience must be at least 1 year")
    .max(70, "Experience must be less than 70 years"),
  credentialUrl: z.string()
    .url("please enter a valid url")
    .min(1, "credential url is required"),
  description: z.string()
    .min(20, "description must be at least 20 characters")
    .max(1000, "description must be less than 1000 characters"),
});

const OnboardingPage = () => {

  const [step, setStep] = useState("choose-role");

  const router = useRouter();

  const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    }
  });

  const specialityValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  }

  useEffect(() => {
    if (data && data?.success) {
      toast.success("role selected");
      router.push(data.redirect);
    }
  }, [data, router]);

  // step 1: choose the role
  if (step === "choose-role") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

        {/* Patient Card */}
        <Card
          onClick={() => !loading && handlePatientSelection()}
          className="border border-emerald-900/20 hover:border-emerald-600/50 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/20 bg-card"
        >
          <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
            <div className='p-4 bg-emerald-900/20 rounded-full mb-4 ring-1 ring-emerald-700/30'>
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-foreground mb-3">
              I&apos;m a Patient
            </CardTitle>
            <CardDescription className="mb-6 text-sm leading-relaxed">
              Search verified doctors, book appointments instantly, and manage your entire healthcare journey — all in one place.
            </CardDescription>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Started as Patient"
              )}
            </Button>

          </CardContent>
        </Card>

        {/* Doctor Card */}
        <Card
          onClick={() => !loading && setStep("doctor-form")}
          className="border border-emerald-900/20 hover:border-emerald-600/50 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/20 bg-card"
        >
          <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
            <div className='p-4 bg-emerald-900/20 rounded-full mb-4 ring-1 ring-emerald-700/30'>
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-foreground mb-3">
              I&apos;m a Doctor
            </CardTitle>
            <CardDescription className="mb-6 text-sm leading-relaxed">
              Build your professional profile, set your availability, and connect with patients seeking your expertise.
            </CardDescription>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
              Apply as a Doctor
            </Button>
          </CardContent>
        </Card>

      </div>
    );
  }

  // step 2: doctor form
  if (step === "doctor-form") {
    return <>doctor form</>
  }

  return null;
}

export default OnboardingPage;