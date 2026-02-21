import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'

const Header = () => {
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm z-10 supports-[backdrop-filter]:bg-background/80'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href="/">
          <Image
            src="/logo-single.png"
            alt="Mediment logo"
            width={200}
            height={200}
            className='h-10 w-auto object-contain'
          />
        </Link>

        <div className='flex items-center space-x-2'>
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
