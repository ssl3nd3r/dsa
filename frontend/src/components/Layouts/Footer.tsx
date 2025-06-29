'use client'

import React, { useState, useEffect } from 'react'
import ThemeToggle from '../UI/ThemeToggle'
import MainLogo from '../UI/MainLogo'

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear().toString())

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <div className='flex justify-center items-center gap-2 p-4'>
      <div className='flex items-center gap-4'>
        <span className='text-sm'>&copy; Copyright {year} <MainLogo  size={14} /></span>
        <ThemeToggle />
      </div>
    </div>
  )
}
