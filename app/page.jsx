import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { features } from "@/lib/data";
import Pricing from "@/components/pricing";

export default function Home() {
  return (
    <div className="relative bg-background overflow-hidden">

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* HERO */}
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
                <br />Book a Doctor Instantly
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed">
                Skip the queues. Connect with verified doctors via video or
                in-person anytime, anywhere. Your health journey starts in
                seconds.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Verified Doctors
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  24/7 Available
                </span>

                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-emerald-400" />
                  Video Consult
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
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 px-4 py-1 text-sm mb-4"
            >
              Simple Process
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How DocNow Works
            </h2>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From search to consultation in under 2 minutes — healthcare has
              never been this easy.
            </p>
          </div>

          {/* Pricing Table */}
          <Pricing />

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

    </div>
  );
}