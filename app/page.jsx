import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { creditBenefits, features, testimonials } from "@/lib/data";

export default function Home() {
  return (
    <div className="relative bg-background overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-400/20 blur-[120px] rounded-full"></div>

      {/* HERO */}
      <section className="relative px-6 py-24 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                Healthcare made simple
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Connect with doctor <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-transparent bg-clip-text">
                  anytime, anywhere
                </span>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult via video, and manage your healthcare journey all in one secure and seamless platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                >
                  <Link href="/onboarding">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Link href="/doctors">
                    Explore Doctors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              <Image
                src="/banner.png"
                alt="Doctor consultation"
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes healthcare accessible with just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group bg-card/60 backdrop-blur-lg border border-border hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <CardHeader>
                    <div className="bg-emerald-500/10 p-3 rounded-lg w-fit mb-4">
                      <Icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* CREDIT SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge className="bg-emerald-900/30 border-emerald-700/30 text-white px-4 py-1 text-sm font-medium mb-4">
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Consultation Package
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect consultation package that fits your healthcare needs.
            </p>
          </div>

          <Card className="mt-12 bg-muted/20 border-emerald-900/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
                How Our Credit System Works
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full flex">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-sm font-medium mb-4"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from patients and doctors who use our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <Card
                key={index}
                className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4">
                      <span className="text-emerald-400 font-bold">
                        {item.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;{item.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
       <section className="py-24">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes healthcare accessible with just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group bg-card/60 backdrop-blur-lg border border-border hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <CardHeader>
                    <div className="bg-emerald-500/10 p-3 rounded-lg w-fit mb-4">
                      <Icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* CREDIT SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge className="bg-emerald-900/30 border-emerald-700/30 text-white px-4 py-1 text-sm font-medium mb-4">
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Consultation Package
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect consultation package that fits your healthcare needs.
            </p>
          </div>

          <Card className="mt-12 bg-muted/20 border-emerald-900/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
                How Our Credit System Works
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full flex">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* TESTIMONIALS */}
     {/* FINAL CTA */}
<section className="py-24">
  <div className="container mx-auto px-4">

    <Card className="relative overflow-hidden border border-emerald-800/30 bg-gradient-to-r from-emerald-900/40 via-emerald-950/30 to-black backdrop-blur-xl">

      {/* subtle glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/20 blur-[100px] rounded-full"></div>

      <CardContent className="relative py-16 text-center max-w-3xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Take Control of Your Health?
        </h2>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Join thousands of users who have simplified their healthcare journey with our platform.
          Get started today and experience healthcare the way it should be.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Button
            asChild
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Link href="/sign-up">
              Get Started
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-emerald-700/40 hover:bg-emerald-900/20 transition-all hover:scale-105"
          >
            <Link href="/pricing">
              View Pricing
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