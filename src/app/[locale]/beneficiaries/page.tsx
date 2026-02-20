'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Search, MapPin, CheckCircle, Heart, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Navbar } from '@/components/navbar'
import { Link } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'

const LOCATIONS = ['Hamburg', 'Berlin', 'München', 'Köln', 'Frankfurt']
const NEEDS = [
  'Lebensmittel',
  'Unterkunft',
  'Medizinische Versorgung',
  'Kleidung',
  'Hygieneartikel',
]

export default function BeneficiariesPage() {
  const t = useTranslations('beneficiaries')
  const { beneficiaries, generateMockData } = useMockDataStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedNeed, setSelectedNeed] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !b.name.toLowerCase().includes(query) &&
          !b.codeword.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Location filter
      if (selectedLocation && b.location !== selectedLocation) {
        return false
      }

      // Needs filter
      if (selectedNeed && !b.needs.includes(selectedNeed)) {
        return false
      }

      return true
    })
  }, [beneficiaries, searchQuery, selectedLocation, selectedNeed])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLocation('')
    setSelectedNeed('')
  }

  const hasActiveFilters = searchQuery || selectedLocation || selectedNeed

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-accent' : ''}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">
                  {t('filterByLocation')}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{t('allLocations')}</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">
                  {t('filterByNeeds')}
                </label>
                <select
                  value={selectedNeed}
                  onChange={(e) => setSelectedNeed(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{t('allNeeds')}</option>
                  {NEEDS.map((need) => (
                    <option key={need} value={need}>
                      {need}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredBeneficiaries.length} {t('title').toLowerCase()}
        </p>

        {/* Beneficiary grid */}
        {filteredBeneficiaries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBeneficiaries.map((beneficiary) => {
              const progressPercent = Math.min(
                (beneficiary.currentFunds / beneficiary.targetFunds) * 100,
                100
              )

              return (
                <Card key={beneficiary.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={beneficiary.photoUrl}
                        alt={beneficiary.name}
                        width={400}
                        height={128}
                        className="h-32 w-full bg-muted object-cover"
                      />
                      {beneficiary.verified && (
                        <Badge
                          variant="success"
                          className="absolute right-2 top-2"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t('verified')}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{beneficiary.name}</h3>
                        <p className="font-mono text-sm text-primary">
                          {beneficiary.codeword}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {beneficiary.location}
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>
                          €{beneficiary.currentFunds} {t('of')} €
                          {beneficiary.targetFunds}
                        </span>
                        <span>{progressPercent.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>

                    {/* Needs */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {beneficiary.needs.slice(0, 2).map((need) => (
                        <Badge
                          key={need}
                          variant="secondary"
                          className="text-xs"
                        >
                          {need}
                        </Badge>
                      ))}
                      {beneficiary.needs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{beneficiary.needs.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <Link href={`/donate/${beneficiary.codeword}`}>
                      <Button className="w-full" size="sm">
                        <Heart className="mr-2 h-4 w-4" />
                        {t('donate')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 font-medium">{t('noResults')}</p>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('noResultsDescription')}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
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
