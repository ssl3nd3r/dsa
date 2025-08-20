'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../UI/ThemeToggle'
import MainLogo from '../UI/MainLogo'
import AIChat from '../UI/AIChat'

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const pathname = usePathname()
  
  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  // Don't show AIChat on login or register pages
  const shouldShowAIChat = pathname !== '/login' && pathname !== '/register'

  return (
    <div className='flex justify-center items-center gap-2 p-4'>
      <div className='flex items-center gap-4'>
        <span className='text-sm'>&copy; Copyright {year} <MainLogo  size={14} /></span>
        <ThemeToggle />
        
        {shouldShowAIChat && <AIChat />}
      </div>
    </div>
  )
}
