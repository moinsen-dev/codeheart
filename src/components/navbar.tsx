'use client'

import { useTranslations } from 'next-intl'
import { Heart, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { Link } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { useRouter } from '@/i18n/routing'

export function Navbar() {
  const t = useTranslations('nav')
  const { currentUser, logout } = useMockDataStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getDashboardLink = () => {
    if (!currentUser) return '/dashboard'

    switch (currentUser.role) {
      case 'donor':
        return '/dashboard'
      case 'socialWorker':
        return '/social-worker'
      case 'admin':
        return '/admin'
      default:
        return '/dashboard'
    }
  }

  const getDashboardLabel = () => {
    if (!currentUser) return t('dashboard')

    switch (currentUser.role) {
      case 'donor':
        return t('dashboard')
      case 'socialWorker':
        return t('dashboard')
      case 'admin':
        return 'Admin Panel'
      default:
        return t('dashboard')
    }
  }

  const getRoleBadge = () => {
    if (!currentUser) return null

    const roleColors = {
      donor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      socialWorker:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      admin:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      investor:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    }

    const roleLabels = {
      donor: 'Donor',
      socialWorker: 'Social Worker',
      admin: 'Admin',
      investor: 'Investor',
    }

    return {
      color:
        roleColors[currentUser.role] ||
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      label: roleLabels[currentUser.role] || currentUser.role,
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CodeHeart</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-primary"
            >
              {t('howItWorks')}
            </Link>
            <Link
              href="/beneficiaries"
              className="text-sm font-medium hover:text-primary"
            >
              {t('donate')}
            </Link>
            {currentUser && (
              <Link
                href={getDashboardLink()}
                className="text-sm font-medium hover:text-primary"
              >
                {getDashboardLabel()}
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          {currentUser ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentUser.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadge()?.color}`}
                >
                  {getRoleBadge()?.label}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t('login')}</Button>
              </Link>
              <Link href="/register">
                <Button>{t('register')}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b bg-background p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('howItWorks')}
            </Link>
            <Link
              href="/beneficiaries"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('donate')}
            </Link>
            {currentUser && (
              <Link
                href={getDashboardLink()}
                className="text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {getDashboardLabel()}
              </Link>
            )}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {currentUser.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadge()?.color}`}
                  >
                    {getRoleBadge()?.label}
                  </span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full">{t('register')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
