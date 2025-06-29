import React from 'react'

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 dark:border-white border-black mx-auto mb-4"></div>
      </div>
    </div>
  )
}
