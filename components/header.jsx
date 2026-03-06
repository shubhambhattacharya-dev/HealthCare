import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import { Button } from './ui/button'
import { Badge } from './ui/badge'

import { checkUser } from '@/lib/checkUser'
import { Calendar, CreditCard, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { checkAndAllocateCredits } from '../actions/credits'

const Header = async () => {

  let user = await checkUser();

  // Initialize credits for patient users if not already done
  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user.id);
    user = await checkUser(); // refetch updated credits
  }

  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm z-10 supports-[backdrop-filter]:bg-background/80'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>

        <Link href="/">
          <Image
            src="/docnow-logo-transparent.png"
            alt="Mediment logo"
            width={200}
            height={200}
            className='h-10 w-auto object-contain'
          />
        </Link>

        <div className='flex items-center space-x-2'>

          <SignedIn>

            {/* admin */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant='outline'
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <ShieldCheck className='h-4 w-4' />
                  Admin Dashboard
                </Button>

                <Button
                  variant='ghost'
                  className='md:hidden w-10 h-10 p-0'
                >
                  <ShieldCheck className='h-4 w-4' />
                </Button>
              </Link>
            )}

            {/* doctor */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* patient */}
            {user?.role === "PATIENT" && (
              <Link href="/appointment">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>

                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* unassigned */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">

                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>

                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <User className="h-4 w-4" />
                </Button>

              </Link>
            )}

          </SignedIn>

          {/* credit button */}
          {(!user || user?.role === "PATIENT") && (
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2 text-sm font-medium backdrop-blur-sm flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />

                <span className="text-emerald-400">
                  {user && user?.role === "PATIENT" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">Credits</span>
                    </>
                  ) : (
                    <>pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          <SignedOut>
            <SignInButton>
              <Button variant='secondary'>Sign Up</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-15 h-15",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                }
              }}
            />
          </SignedIn>

        </div>
      </nav>
    </header>
  )
}

export default Header