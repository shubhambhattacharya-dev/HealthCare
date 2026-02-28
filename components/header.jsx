import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  SignIn,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
import { Calendar, User } from 'lucide-react'


const Header = async() => {

const user =await checkUser();


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

          <SignedOut>
            <SignInButton >
           
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
