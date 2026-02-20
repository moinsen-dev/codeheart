'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Navbar } from '@/components/navbar'
import { AuthGuard } from '@/components/auth-guard'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Link } from '@/i18n/routing'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

function BeneficiariesListContent() {
  const t = useTranslations('socialWorker')
  const {
    currentUser,
    getMyBeneficiaries,
    removeBeneficiary,
    generateMockData,
    beneficiaries: allBeneficiaries,
  } = useMockDataStore()

  // Generate mock data if empty
  useEffect(() => {
    if (allBeneficiaries.length === 0) {
      generateMockData()
    }
  }, [allBeneficiaries.length, generateMockData])

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [needsFilter, setNeedsFilter] = useState<string[]>([])

  // Get beneficiaries for current social worker
  const myBeneficiaries = useMemo(() => {
    if (!currentUser) return []
    return getMyBeneficiaries(currentUser.id)
  }, [currentUser, getMyBeneficiaries, allBeneficiaries])

  // Get unique locations and needs for filters
  const { locations, allNeeds } = useMemo(() => {
    const locationSet = new Set<string>()
    const needsSet = new Set<string>()

    myBeneficiaries.forEach((b) => {
      locationSet.add(b.location)
      b.needs.forEach((need) => needsSet.add(need))
    })

    return {
      locations: Array.from(locationSet).sort(),
      allNeeds: Array.from(needsSet).sort(),
    }
  }, [myBeneficiaries])

  // Filter beneficiaries
  const filteredBeneficiaries = useMemo(() => {
    return myBeneficiaries.filter((b) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        b.name.toLowerCase().includes(searchLower) ||
        b.codeword.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Location filter
      if (locationFilter !== 'all' && b.location !== locationFilter) {
        return false
      }

      // Verified filter
      if (verifiedFilter === 'verified' && !b.verified) return false
      if (verifiedFilter === 'unverified' && b.verified) return false

      // Needs filter
      if (
        needsFilter.length > 0 &&
        !needsFilter.some((need) => b.needs.includes(need))
      ) {
        return false
      }

      return true
    })
  }, [
    myBeneficiaries,
    searchQuery,
    locationFilter,
    verifiedFilter,
    needsFilter,
  ])

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(t('confirmRemove'))) {
      removeBeneficiary(id)
    }
  }

  const toggleNeedFilter = (need: string) => {
    setNeedsFilter((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('beneficiaryList')}</h1>
            <p className="text-muted-foreground">{t('manageBeneficiaries')}</p>
          </div>
          <Link href="/social-worker/beneficiaries/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              {t('addNew')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('search')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Location filter */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t('filterByLocation')}
                </label>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">{t('allLocations')}</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Verified filter */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t('filterByStatus')}
                </label>
                <Select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="verified">{t('verified')}</option>
                  <option value="unverified">{t('unverified')}</option>
                </Select>
              </div>

              {/* Needs filter */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t('filterByNeeds')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {allNeeds.map((need) => (
                    <Badge
                      key={need}
                      variant={
                        needsFilter.includes(need) ? 'default' : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleNeedFilter(need)}
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredBeneficiaries.length} {t('noBeneficiaries')}
        </div>

        {/* Beneficiaries list */}
        {filteredBeneficiaries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium">{t('noBeneficiaries')}</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {myBeneficiaries.length === 0
                  ? t('addNew')
                  : t('noBeneficiaries')}
              </p>
              {myBeneficiaries.length === 0 && (
                <Link href="/social-worker/beneficiaries/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('addNew')}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBeneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{beneficiary.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {beneficiary.codeword}
                        </Badge>
                        <Badge
                          variant={beneficiary.verified ? 'success' : 'outline'}
                        >
                          {beneficiary.verified
                            ? t('verified')
                            : t('unverified')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Location */}
                  <div>
                    <p className="text-sm font-medium">{t('location')}</p>
                    <p className="text-sm text-muted-foreground">
                      {beneficiary.location}
                    </p>
                  </div>

                  {/* Funds progress */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{t('funds')}</span>
                      <span className="text-muted-foreground">
                        €{beneficiary.currentFunds} / €{beneficiary.targetFunds}
                      </span>
                    </div>
                    <Progress
                      value={beneficiary.currentFunds}
                      max={beneficiary.targetFunds}
                    />
                  </div>

                  {/* Needs */}
                  <div>
                    <p className="mb-2 text-sm font-medium">{t('needs')}</p>
                    <div className="flex flex-wrap gap-2">
                      {beneficiary.needs.map((need) => (
                        <Badge key={need} variant="outline">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Link
                      href={`/social-worker/beneficiaries/${beneficiary.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('edit')}
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemove(beneficiary.id, beneficiary.name)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

export default function BeneficiariesListPage() {
  return (
    <AuthGuard allowedRoles={['socialWorker']}>
      <BeneficiariesListContent />
    </AuthGuard>
  )
}
