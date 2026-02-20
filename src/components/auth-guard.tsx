'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: Array<'donor' | 'socialWorker' | 'investor' | 'admin'>
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const currentUser = useMockDataStore((state) => state.currentUser)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wait for store hydration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading) return

    // No user logged in - redirect to login
    if (!currentUser) {
      router.push('/login')
      return
    }

    // User logged in but not authorized for this page
    if (!allowedRoles.includes(currentUser.role)) {
      // Redirect to role-appropriate dashboard
      const dashboardMap = {
        donor: '/dashboard',
        socialWorker: '/social-worker',
        investor: '/dashboard', // Investors use donor dashboard for now
        admin: '/admin',
      } as const

      const targetPath = dashboardMap[currentUser.role]

      // Only redirect if we're not already on the target path
      if (pathname !== targetPath) {
        router.push(targetPath)
      }
    }
  }, [currentUser, allowedRoles, isLoading, router, pathname])

  // Show loading spinner during hydration
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated or not authorized
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null
  }

  return <>{children}</>
}
