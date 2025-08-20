import React from 'react'

export default function MainLogo({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
      <span style={{fontSize: `${size}px`}} className={`font-light tracking-tighter inline logo ${className}`}>
        <span className='text-dsa-blue'>D</span><span className='text-dsa-blue'>S</span><span className='text-dsa-orange'>A</span>
      </span>
  )
}
