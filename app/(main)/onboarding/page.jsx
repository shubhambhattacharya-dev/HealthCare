"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, Loader2, AlertCircle, CheckCircle2, Shield, Star, Clock, BadgeCheck, Users } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { setUserRole } from '@/actions/onboarding';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';

import { SPECIALTIES } from '@/lib/specialities';

// ─── Zod schema (UNTOUCHED) ────────────────────────────────────────────────────
const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Please select your medical specialty"),
  experience: z.number({
    required_error: "Years of experience is required",
    invalid_type_error: "Please enter a valid number",
  })
    .min(1, "Experience must be at least 1 year")
    .max(70, "Experience must be less than 70 years"),
  credentialUrl: z.string()
    .min(1, "Credential URL is required")
    .url("Please enter a valid URL (e.g. https://example.com/credential.pdf)"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),
});

// ─── Helper: field error (UNTOUCHED) ──────────────────────────────────────────
const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
      <p className="text-sm text-red-500 font-medium">{message}</p>
    </div>
  );
};

// ─── Helper: char counter (UNTOUCHED) ─────────────────────────────────────────
const CharCounter = ({ value = "", max }) => {
  const len = value.length;
  const near = len > max * 0.85;
  return (
    <p className={`text-xs mt-1 text-right ${near ? "text-amber-400" : "text-muted-foreground"}`}>
      {len}/{max}
    </p>
  );
};

// ─── NEW: Badge component ──────────────────────────────────────────────────────
const Badge = ({ icon: Icon, label, variant = "default" }) => {
  const styles = {
    default:  "bg-emerald-950/60 border-emerald-800/50 text-emerald-300",
    gold:     "bg-amber-950/60  border-amber-700/50  text-amber-300",
    blue:     "bg-sky-950/60    border-sky-700/50    text-sky-300",
    verified: "bg-emerald-900/40 border-emerald-500/40 text-emerald-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${styles[variant]}`}>
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {label}
    </span>
  );
};

// ─── NEW: Section divider ──────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-emerald-900/30" />
    {label && <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">{label}</span>}
    <div className="flex-1 h-px bg-emerald-900/30" />
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────
const OnboardingPage = () => {

  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
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
  const descriptionValue = watch("description");

  // ── Handlers (UNTOUCHED) ────────────────────────────────────────────────────
  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    await submitUserRole(formData);
  };

  const onDoctorSubmit = async (formValues) => {
    if(loading) return;
    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", formValues.specialty);
    formData.append("experience", String(formValues.experience));
    formData.append("credentialUrl", formValues.credentialUrl);
    formData.append("description", formValues.description);
    await submitUserRole(formData);
  };

  const onInvalid = () => {
    toast.error("Please fix the errors below before submitting.");
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Role selected successfully!");
      router.push(data.redirect);
    }
  }, [data, router]);

  // ── STEP 1 — Role selection ─────────────────────────────────────────────────
  if (step === "choose-role") {
    return (
      <div className="space-y-5">

       

        <Divider label="Choose your role to get started" />

        {/* ── Role cards (original grid — logic UNTOUCHED) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Patient card */}
          <Card
            onClick={() => !loading && handlePatientSelection()}
            className="border border-emerald-900/20 hover:border-emerald-600/50 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/20 bg-card"
          >
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              <div className="p-4 bg-emerald-900/20 rounded-full mb-4 ring-1 ring-emerald-700/30">
                <User className="h-8 w-8 text-emerald-400" />
              </div>

              {/* ── Card badge ── */}
              <div className="mb-3">
                <Badge label="Free" variant="gold" />
              </div>

              <CardTitle className="text-xl font-semibold text-foreground mb-3">
                I&apos;m a Patient
              </CardTitle>

              {/* ── Improved description ── */}
              <CardDescription className="mb-6 text-sm leading-relaxed">
                Find verified specialists, book same-day appointments, and manage your complete healthcare journey — securely, in one place.
              </CardDescription>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Get Started as Patient"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Doctor card */}
          <Card
            onClick={() => !loading && setStep("doctor-form")}
            className="border border-emerald-900/20 hover:border-emerald-600/50 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/20 bg-card"
          >
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              <div className="p-4 bg-emerald-900/20 rounded-full mb-4 ring-1 ring-emerald-700/30">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
              </div>

              {/* ── Card badge ── */}
              <div className="mb-3">
                <Badge icon={BadgeCheck} label="Verified Professional" variant="verified" />
              </div>

              <CardTitle className="text-xl font-semibold text-foreground mb-3">
                I&apos;m a Doctor
              </CardTitle>

              {/* ── Improved description ── */}
              <CardDescription className="mb-6 text-sm leading-relaxed">
                Create your verified profile, set your own schedule, and grow your practice by reaching thousands of patients who need your expertise.
              </CardDescription>

              <Button
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Apply as a Doctor
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    );
  }

  // ── STEP 2 — Doctor profile form ───────────────────────────────────────────
  if (step === "doctor-form") {

    const errorCount = Object.keys(errors).length;

    return (
      <Card className="border border-emerald-900/20">
        <CardContent className="pt-8">

          {/* ── Section heading ── */}
          <div className="mb-2 pb-5 border-b border-emerald-900/25">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-emerald-900/25 rounded-xl ring-1 ring-emerald-700/30">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-500">
                Doctor Onboarding
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2 leading-tight">
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed max-w-md">
              Provide accurate professional details so our team can verify your credentials quickly. All fields are required.
            </CardDescription>
          </div>

         

          

          {/* ── Error banner (UNTOUCHED logic) ── */}
          {isSubmitted && errorCount > 0 && (
            <div className="flex items-start gap-3 mb-6 mt-5 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-500">
                  {errorCount} field{errorCount > 1 ? "s need" : " needs"} your attention
                </p>
                <p className="text-xs text-red-400 mt-0.5">
                  Please review the highlighted fields below before submitting.
                </p>
              </div>
            </div>
          )}

          {/* ── Form (ALL logic UNTOUCHED) ── */}
          <form
            onSubmit={handleSubmit(onDoctorSubmit, onInvalid)}
            className="space-y-6 mt-5"
            noValidate
          >

            {/* SPECIALTY */}
            <div className="space-y-1.5">
              <Label htmlFor="specialty" className="flex items-center gap-1">
                Medical Specialty
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Select
                value={specialityValue}
                onValueChange={(value) => setValue("specialty", value, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="specialty"
                  className={errors.specialty ? "border-red-500 focus:ring-red-500/30" : ""}
                >
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec.name} value={spec.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">{spec.icon}</span>
                        {spec.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.specialty?.message} />
            </div>

            {/* EXPERIENCE */}
            <div className="space-y-1.5">
              <Label htmlFor="experience" className="flex items-center gap-1">
                Years of Experience
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                min={1}
                max={70}
                className={errors.experience ? "border-red-500 focus-visible:ring-red-500/30" : ""}
                {...register("experience", { valueAsNumber: true })}
              />
              <FieldError message={errors.experience?.message} />
            </div>

            {/* CREDENTIAL URL */}
            <div className="space-y-1.5">
              <Label htmlFor="credentialUrl" className="flex items-center gap-1">
                Link to Credential
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://example.com/my-credential.pdf"
                className={errors.credentialUrl ? "border-red-500 focus-visible:ring-red-500/30" : ""}
                {...register("credentialUrl")}
              />
              <FieldError message={errors.credentialUrl?.message} />
              <p className="text-xs text-muted-foreground">
                Share a publicly accessible link to your medical degree, board certification, or licence document.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="flex items-center gap-1">
                Professional Summary
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe your clinical expertise, the conditions you treat, and what patients can expect from a consultation with you…"
                className={errors.description ? "border-red-500 focus-visible:ring-red-500/30" : ""}
                {...register("description")}
              />
              <div className="flex items-start justify-between">
                <FieldError message={errors.description?.message} />
                <CharCounter value={descriptionValue} max={1000} />
              </div>
            </div>

            {/* REQUIRED NOTE */}
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">*</span> All fields are required. Your information is reviewed by our team and never shared publicly without consent.
            </p>

            {/* BUTTONS (logic UNTOUCHED) */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30 hover:bg-emerald-900/10"
                disabled={loading}
              >
                Back
              </Button>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit for Verification
                  </>
                )}
              </Button>
            </div>

          </form>

        </CardContent>
      </Card>
    );
  }

  return null;
}

export default OnboardingPage;