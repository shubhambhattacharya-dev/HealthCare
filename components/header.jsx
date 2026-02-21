import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const header = () => {
  return (
    <header>
        <nav>
           <Link  href="/" >
           <Image src="/logo.png" alt="Mediment logo" width={200} height={200} className='h-10 w-auto object-contain'/>
           </Link>
            </nav> 
      </header>
  )
}

export default header