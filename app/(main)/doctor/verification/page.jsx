import { getCurrentUser } from '@/actions/onboarding'
import React from 'react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ClipboardCheck, Clock, FileText, Mail, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const VerificationPage = async () => {

  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="px-4 py-8">

      <div className='max-w-2xl mx-auto w-full'>

        <Card className="border-emerald-900/20">

          <CardHeader className="text-center">

            <div className={`mx-auto px-4 ${
              isRejected ? "bg-red-900/20" : "bg-amber-900/20"
            } rounded-full mb-4 w-fit p-4`}>
              {isRejected ? (
                <XCircle className='h-8 w-8 text-red-400'/>
              ) : (
                <ClipboardCheck className='h-8 w-8 text-amber-400'/>
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              {isRejected ? "Verification Declined" : "Verification in Progress"}
            </CardTitle>

            <CardDescription className="text-lg">
              {isRejected
                ? "Unfortunately, your application needs revision"
                : "Thank you for submitting your information"}
            </CardDescription>

          </CardHeader>

          <CardContent>
            {isRejected ? (
              <div className="flex flex-col gap-4">

                {/* Rejection reason box */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                  <AlertCircle className='h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0'/>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-red-400">Reason for Rejection</p>
                    <p className="text-sm text-muted-foreground">
                      Your submitted documents did not meet our verification requirements.
                      Please review and resubmit with valid credentials.
                    </p>
                  </div>
                </div>

                {/* What to do next */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-white">What to do next:</p>
                  <ul className="flex flex-col gap-2">
                    {[
                      { icon: <FileText className="h-4 w-4 text-emerald-400" />, text: "Review your submitted documents for accuracy" },
                      { icon: <Mail className="h-4 w-4 text-emerald-400" />,     text: "Contact support if you need help with resubmission" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        {item.icon}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            ) : (
              <div className="flex flex-col gap-4">

                {/* Steps list */}
                {[
                  { icon: <FileText className="h-4 w-4 text-amber-400" />, label: "Documents Received",   desc: "We have received your submitted documents."         },
                  { icon: <Clock    className="h-4 w-4 text-amber-400" />, label: "Under Review",         desc: "Our team is currently reviewing your credentials."  },
                  { icon: <Mail     className="h-4 w-4 text-amber-400" />, label: "Decision via Email",   desc: "You will be notified once the review is complete."  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-amber-900/10 border border-amber-900/20">
                    <div className="mt-0.5 flex-shrink-0">{step.icon}</div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Info note */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-900/10 border border-emerald-900/20 mt-1">
                  <AlertCircle className='h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5'/>
                  <p className="text-sm text-muted-foreground">
                    Verification typically takes <span className="text-emerald-400 font-medium">1–3 business days</span>.
                    Please check your email regularly for updates.
                  </p>
                </div>

              </div>
            )}

            <p className='text-muted-foreground mb-6 mt-4'>
               {isRejected 
               ? "You can update your doctor profile and resubmit for verification." 
               : "While you wait, you can familiarize yourself with our platform or reach out to our support team if you have any questions or concerns."}
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>

              {/* ── REJECTED: show two buttons — resubmit form + return home ── */}
              {isRejected ? (
                <>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    <Link href="/onboarding">Edit Profile & Resubmit</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-900/30">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </>
              ) : (
                /* ── PENDING: only return home ── */
                <Button
                  asChild
                  variant="outline"
                  className="border-emerald-900/30">
                  <Link href="/">Return to Home</Link>
                </Button>
              )}

            </div>
          </CardContent>

        </Card>

      </div>
    </div>
  )
}

export default VerificationPage