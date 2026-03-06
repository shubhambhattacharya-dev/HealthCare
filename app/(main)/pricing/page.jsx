import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricing";

const PricingPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute right-0 bottom-1/3 w-[400px] h-[400px] rounded-full bg-emerald-800/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12 mt-6">
        {/* Back link */}
        <div className="flex justify-start mb-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Hero header */}
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-5">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/40 px-4 py-1.5 text-emerald-400 text-xs font-semibold tracking-widest uppercase"
            >
              <Sparkles className="inline w-3 h-3 mr-1.5 opacity-80" />
              Affordable Healthcare
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold gradient-title leading-tight tracking-tight">
            Simple, Transparent
            <br />
            <span className="text-emerald-400">Pricing</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Choose the consultation package that fits your healthcare needs —
            no hidden fees, no long-term commitments, just honest care.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-700/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-700/50" />
          </div>
        </div>

        {/* Pricing component */}
        <Pricing />

        {/* Support footer */}
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 px-8 py-10 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-900/40 p-3 border border-emerald-800/40">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Have Questions? We&apos;re Here to Help.
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Our support team is available around the clock to assist you
              with any questions about plans, coverage, or your account.
            </p>

            <a
              href="mailto:support@docnow.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-sm font-medium hover:bg-emerald-800/50 hover:border-emerald-600/60 transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              support@DocNow.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;