"use client"

import React, { useSyncExternalStore } from 'react'
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

import { Calendar, CreditCard, ShieldCheck, Stethoscope, User } from 'lucide-react'

// Hook to check if we're on the client
function useHydrated() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
}

const Header = ({ user: serverUser }) => {
  const isHydrated = useHydrated();


  const user = serverUser;


  const showRoleContent = isHydrated && user;

  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm z-10 supports-[backdrop-filter]:bg-background/80'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>

        <Link href="/">
          <Image
            src="/docnow-logo-transparent.png"
            alt="DocNow logo"
            width={200}
            height={200}
            className='h-10 w-auto object-contain'
            priority
          />
        </Link>

        <div className='flex items-center space-x-2'>

          <SignedIn>

            {/* admin */}
            {showRoleContent && user?.role === "ADMIN" && (
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
            {showRoleContent && user?.role === "DOCTOR" && (
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
            {showRoleContent && user?.role === "PATIENT" && (
              <Link href="/appointments">
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
            {showRoleContent && user?.role === "UNASSIGNED" && (
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
          {(!showRoleContent || user?.role === "PATIENT" || user?.role === "UNASSIGNED") && (
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2 text-sm font-medium backdrop-blur-sm flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />

                <span className="text-emerald-400">
                  {showRoleContent && user && user?.role === "PATIENT" ? (
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

          {isHydrated && (
            <>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "shadow-xl",
                      userPreviewMainIdentifier: "font-semibold",
                    }
                  }}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton>
                  <Button variant='secondary'>Sign Up</Button>
                </SignInButton>
              </SignedOut>
            </>
          )}

        </div>
      </nav>
    </header>
  )
}

export default Header
