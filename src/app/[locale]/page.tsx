'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { FeatureCard } from '@/components/feature-card'
import { Navbar } from '@/components/navbar'
import {
  Heart,
  Shield,
  Eye,
  CheckCircle,
  Users,
  TrendingUp,
  ClipboardCheck,
  FileText,
  BarChart3,
} from 'lucide-react'
import { useEffect } from 'react'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Link } from '@/i18n/routing'

export default function HomePage() {
  const t = useTranslations()
  const { generateMockData, beneficiaries, currentUser } = useMockDataStore()

  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Shared Navigation */}
      <Navbar />

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
              <Link href="/beneficiaries">
                <Button size="lg">{t('hero.cta.donate')}</Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  {t('hero.cta.learnMore')}
                </Button>
              </Link>
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

      {/* Social Worker Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-12">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                    <Shield className="h-4 w-4" />
                    {t('socialWorkerSection.title')}
                  </div>
                  <h2 className="text-2xl font-bold md:text-3xl">
                    {t('socialWorkerSection.subtitle')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('socialWorkerSection.description')}
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <ClipboardCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {t('socialWorkerSection.feature1')}
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {t('socialWorkerSection.feature2')}
                    </li>
                    <li className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      {t('socialWorkerSection.feature3')}
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {currentUser?.role === 'socialWorker' ? (
                      <Link href="/social-worker">
                        <Button>{t('socialWorkerSection.cta')}</Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button>{t('socialWorkerSection.cta')}</Button>
                        </Link>
                        <Link href="/register">
                          <Button variant="outline">
                            {t('socialWorkerSection.ctaRegister')}
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="bg-muted/50 py-24">
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
