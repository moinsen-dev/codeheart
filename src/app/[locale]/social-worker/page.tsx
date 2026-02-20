'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/navbar'
import { AuthGuard } from '@/components/auth-guard'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, AlertCircle, Plus, List } from 'lucide-react'
import { Link } from '@/i18n/routing'

function SocialWorkerDashboardContent() {
  const t = useTranslations('socialWorker')
  const { currentUser, donations, getMyBeneficiaries, generateMockData } =
    useMockDataStore()
  const beneficiaries = useMockDataStore((state) => state.beneficiaries)

  // Generate mock data if empty
  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  // Compute stats
  const stats = useMemo(() => {
    if (!currentUser) {
      return {
        activeBeneficiaries: 0,
        totalDonations: 0,
        openNeeds: 0,
      }
    }

    // Get beneficiaries managed by this social worker
    const myBeneficiaries = getMyBeneficiaries(currentUser.id)
    const myBeneficiaryIds = new Set(myBeneficiaries.map((b) => b.id))

    // Calculate total donations to these beneficiaries
    const totalDonations = donations
      .filter(
        (d) => myBeneficiaryIds.has(d.beneficiaryId) && d.status === 'completed'
      )
      .reduce((sum, d) => sum + d.amount, 0)

    // Calculate distinct unmet needs across all beneficiaries
    const allNeeds = new Set<string>()
    myBeneficiaries.forEach((b) => {
      // A need is "unmet" if current funds < target funds
      if (b.currentFunds < b.targetFunds) {
        b.needs.forEach((need) => allNeeds.add(need))
      }
    })

    return {
      activeBeneficiaries: myBeneficiaries.length,
      totalDonations,
      openNeeds: allNeeds.size,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, donations, getMyBeneficiaries, beneficiaries])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('welcome')}, {currentUser?.name}!
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('activeBeneficiaries')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeBeneficiaries}
              </div>
              <p className="text-xs text-muted-foreground">{t('overview')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalDonations')}
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalDonations}</div>
              <p className="text-xs text-muted-foreground">{t('funds')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('openNeeds')}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openNeeds}</div>
              <p className="text-xs text-muted-foreground">{t('needs')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Link href="/social-worker/beneficiaries/new" className="flex-1">
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                {t('addBeneficiary')}
              </Button>
            </Link>
            <Link href="/social-worker/beneficiaries" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <List className="mr-2 h-4 w-4" />
                {t('viewBeneficiaries')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

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

export default function SocialWorkerDashboardPage() {
  return (
    <AuthGuard allowedRoles={['socialWorker']}>
      <SocialWorkerDashboardContent />
    </AuthGuard>
  )
}
