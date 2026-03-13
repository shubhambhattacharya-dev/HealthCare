"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Clerk Price IDs to Plan mapping - UPDATE THESE
const PRICE_TO_PLAN = {
  "price_basic": "basic",
  "price_starter": "starter",
  "price_pro": "pro",
};

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");

  async function updatePlan(priceId) {
    const plan = PRICE_TO_PLAN[priceId] || "basic";
    
    const response = await fetch("/api/subscription/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId, plan }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus("success");
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } else {
      setStatus("error");
    }
  }

  useEffect(() => {
    async function updateSubscription() {
      try {
        // Get Clerk checkout session data from URL
        const checkoutSessionId = searchParams.get("checkout_session_id");
        const priceId = searchParams.get("price_id");
        
        if (!checkoutSessionId && !priceId) {
          // Try to get from session storage (set by Clerk)
          const storedPriceId = sessionStorage.getItem("clerk_price_id");
          if (storedPriceId) {
            await updatePlan(storedPriceId);
          } else {
            setStatus("no_data");
          }
          return;
        }

        if (priceId) {
          // Store for future reference
          sessionStorage.setItem("clerk_price_id", priceId);
          await updatePlan(priceId);
        } else if (checkoutSessionId) {
          // Fetch checkout session to get price ID
          const response = await fetch(`/api/subscription/verify?sessionId=${checkoutSessionId}`);
          const data = await response.json();
          
          if (data.priceId) {
            sessionStorage.setItem("clerk_price_id", data.priceId);
            await updatePlan(data.priceId);
          } else {
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
        setStatus("error");
      }
    }

    updateSubscription();
  }, [searchParams]);

  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mx-auto" />
          <p className="text-muted-foreground">Updating your subscription...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold">Subscription Activated!</h2>
          <p className="text-muted-foreground">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || status === "no_data") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            {status === "no_data" 
              ? "No subscription data found. Please try purchasing again."
              : "Failed to update your subscription. Please contact support."}
          </p>
          <Button onClick={() => router.push("/pricing")}>
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
