'use client'

import { useTranslations } from 'next-intl'
import { Heart, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { Link } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const t = useTranslations('nav')
  const { currentUser, logout } = useMockDataStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                href="/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                {t('dashboard')}
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          {currentUser ? (
            <>
              <span className="text-sm text-muted-foreground">
                {currentUser.name}
              </span>
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
                href="/dashboard"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dashboard')}
              </Link>
            )}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            {currentUser ? (
              <Button variant="outline" onClick={handleLogout}>
                {t('logout')}
              </Button>
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
