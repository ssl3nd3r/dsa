import React from 'react'

export default function MainLogo({ size = 24, className = '' }: { size?: number, className?: string }) {
  return (
      <span style={{fontSize: `${size}px`}} className={`font-light inline logo ${className}`}>DSA</span>
  )
}
