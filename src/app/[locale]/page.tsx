'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { FeatureCard } from '@/components/feature-card'
import {
  Heart,
  Shield,
  Eye,
  CheckCircle,
  Users,
  TrendingUp,
} from 'lucide-react'
import { useEffect } from 'react'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Link } from '@/i18n/routing'

export default function HomePage() {
  const t = useTranslations()
  const { generateMockData, beneficiaries } = useMockDataStore()

  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CodeHeart</span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary"
              >
                {t('nav.howItWorks')}
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium hover:text-primary"
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
            <Link href="/register">
              <Button>{t('nav.register')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg">{t('hero.cta.donate')}</Button>
              <Button size="lg" variant="outline">
                {t('hero.cta.learnMore')}
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.900),transparent)]" />
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="bg-muted/50 py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title={t('features.dignity.title')}
              description={t('features.dignity.description')}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title={t('features.security.title')}
              description={t('features.security.description')}
            />
            <FeatureCard
              icon={<Eye className="h-8 w-8" />}
              title={t('features.transparency.title')}
              description={t('features.transparency.description')}
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8" />}
              title={t('features.verified.title')}
              description={t('features.verified.description')}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <TrendingUp className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{t('stats.efficiency')}</p>
            </div>
            <div>
              <Users className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{t('stats.cities')}</p>
            </div>
            <div>
              <Heart className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{t('stats.partners')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">{t('waitlist.title')}</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {t('waitlist.subtitle')}
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              {t('nav.joinWaitlist')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 CodeHeart. Made with ❤️ for those in need.
          </p>
        </div>
      </footer>
    </div>
  )
}
