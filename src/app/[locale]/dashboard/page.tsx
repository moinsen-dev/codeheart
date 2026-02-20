'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Heart,
  Search,
  Users,
  TrendingUp,
  ArrowRight,
  Euro,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { AuthGuard } from '@/components/auth-guard'
import { Link } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'

function DashboardContent() {
  const t = useTranslations('dashboard')
  const { currentUser, donations, beneficiaries, generateMockData } =
    useMockDataStore()

  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  // AuthGuard ensures currentUser is not null, but TypeScript doesn't know that
  if (!currentUser) return null

  const userDonations = donations.filter((d) => d.donorId === currentUser.id)
  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)
  const recentDonations = userDonations.slice(0, 5)

  const getBeneficiaryName = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId)
    return beneficiary?.name || 'Unknown'
  }

  const getBeneficiaryCodeword = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId)
    return beneficiary?.codeword || ''
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('welcome')}, {currentUser.name}!
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalDonated')}
              </CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalDonated}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('donationsCount')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userDonations.length}</div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('quickActions')}
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/donate" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  {t('searchCodeword')}
                </Button>
              </Link>
              <Link href="/beneficiaries" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  {t('browseBeneficiaries')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent donations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('recentDonations')}</CardTitle>
                <CardDescription>
                  {userDonations.length > 0
                    ? `${userDonations.length} ${t('donationsCount').toLowerCase()}`
                    : t('noDonationsDescription')}
                </CardDescription>
              </div>
              {userDonations.length > 5 && (
                <Button variant="ghost" size="sm">
                  {t('viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {getBeneficiaryName(donation.beneficiaryId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getBeneficiaryCodeword(donation.beneficiaryId)} •{' '}
                          {formatDate(donation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusVariant(donation.status)}>
                        {t(`status.${donation.status}`)}
                      </Badge>
                      <span className="font-semibold">€{donation.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 font-medium">{t('noDonations')}</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t('noDonationsDescription')}
                </p>
                <Link href="/donate">
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    {t('findBeneficiary')}
                  </Button>
                </Link>
              </div>
            )}
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

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={['donor']}>
      <DashboardContent />
    </AuthGuard>
  )
}
