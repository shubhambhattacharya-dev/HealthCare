import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Check, Stethoscope, ShieldCheck, Clock, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { creditBenefits, features, testimonials } from "@/lib/data";

export default function Home() {
  return (
    <div className="relative bg-background overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative px-6 py-28 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                🩺 India&apos;s Fastest Doctor Booking Platform
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Health, Our{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text">
                  Priority
                </span>
                <br/>Book a Doctor Instantly
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed">
                Skip the queues. Connect with verified doctors via video or in-person  anytime, anywhere. Your health journey starts in seconds.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Verified Doctors
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" /> 24/7 Available
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-emerald-400" /> Video Consult
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                >
                  <Link href="/onboarding">
                    Book a Doctor Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-md bg-white/5 border-white/15 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <Link href="/doctors">
                    Browse Doctors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/10">
              <Image
                src="/poster2.png"
                alt="DocNow - Book a Doctor Instantly"
                fill
                priority
                className="object-cover rounded-3xl"
              />
              {/* Stat overlay card */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-emerald-500/20 rounded-2xl px-5 py-3">
                <p className="text-emerald-400 font-bold text-xl">10,000+</p>
                <p className="text-muted-foreground text-sm">Consultations completed</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 px-4 py-1 text-sm mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How DocNow Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From search to consultation in under 2 minutes — healthcare has never been this easy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group bg-card/60 backdrop-blur-lg border border-border hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-2"
                >
                  <CardHeader>
                    <div className="bg-emerald-500/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CONSULTATION PACKAGE ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge className="bg-emerald-900/30 border-emerald-700/30 text-emerald-300 px-4 py-1 text-sm font-medium mb-4">
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transparent Consultation Pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No hidden charges. Buy credits and consult top doctors at the most affordable rates.
            </p>
          </div>

          <Card className="mt-12 bg-muted/20 border-emerald-900/30 hover:border-emerald-700/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
                How Our Credit System Works
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-emerald-900/30 p-1 rounded-full flex shrink-0">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 px-4 py-1 text-sm font-medium mb-4"
            >
              Real Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Patients and doctors love DocNow — here&apos;s what they have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <Card
                key={index}
                className="border-emerald-900/20 hover:border-emerald-700/40 hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-emerald-400 text-sm">★</span>
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &quot;{item.quote}&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="w-11 h-11 rounded-full bg-emerald-900/30 border border-emerald-700/30 flex items-center justify-center mr-3">
                      <span className="text-emerald-400 font-bold text-sm">
                        {item.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">

          <Card className="relative overflow-hidden border border-emerald-800/30 bg-gradient-to-br from-emerald-900/40 via-emerald-950/30 to-black backdrop-blur-xl">

            <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

            <CardContent className="relative py-20 text-center max-w-3xl mx-auto">

              <Badge className="bg-emerald-900/50 border-emerald-700/40 text-emerald-300 px-4 py-1 text-sm mb-6">
                Get Started Today — It&apos;s Free
              </Badge>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Your Doctor is Just a{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text">
                  Click Away
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Join 10,000+ users who trust DocNow for fast, affordable, and reliable healthcare.
                Sign up free and book your first consultation today.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  <Link href="/sign-up">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-emerald-700/40 hover:bg-emerald-900/20 transition-all hover:scale-105"
                >
                  <Link href="/pricing">
                    View Pricing Plans
                  </Link>
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </section>

    </div>
  );
}