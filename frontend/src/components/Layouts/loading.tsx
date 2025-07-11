import { Fade } from '@mui/material'
import React from 'react'

interface LoadingProps {
  loading?: boolean
}

export default function Loading({ loading }: LoadingProps) {

  return (
    <Fade in={loading} timeout={200}>
      <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 dark:border-white border-black mx-auto mb-4"></div>
        </div>
      </div>
    </Fade>
  )
}
