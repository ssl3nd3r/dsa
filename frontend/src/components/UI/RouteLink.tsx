'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import { setLoading } from '@/lib/slices/uiSlice'

interface Props {
  href: string
  children?: React.ReactNode
  className?: string
}

export function RouteLink({ href, children, className = "" }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading(isPending))
  }, [isPending])

  return (
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault()
          startTransition(() => {
            router.push(href)
          })
        }}
        className={`${className}`}
      >
        {children}
      </Link>
  )
}
