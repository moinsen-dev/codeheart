'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Link } from '@/i18n/routing'
import { useMockDataStore } from '@/lib/stores/mock-data'

export default function DonatePage() {
  const t = useTranslations('donate')
  const router = useRouter()
  const { getBeneficiaryByCodeword } = useMockDataStore()

  const [codeword, setCodeword] = useState('')
  const [error, setError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)

    if (!codeword.trim()) return

    setIsSearching(true)

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const beneficiary = getBeneficiaryByCodeword(codeword.trim())

    if (beneficiary) {
      router.push(`/donate/${beneficiary.codeword}`)
    } else {
      setError(true)
    }

    setIsSearching(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex flex-1 items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t('searchTitle')}</CardTitle>
            <CardDescription>{t('searchSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={codeword}
                  onChange={(e) => {
                    setCodeword(e.target.value)
                    setError(false)
                  }}
                  className="text-center text-lg"
                  disabled={isSearching}
                />
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                    <p className="font-medium">{t('notFound')}</p>
                    <p className="text-xs">{t('notFoundDescription')}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!codeword.trim() || isSearching}
              >
                {isSearching ? (
                  '...'
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t('search')}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                {t('notFoundDescription')}
              </p>
              <Link href="/beneficiaries">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  {t('browseBeneficiaries')}
                </Button>
              </Link>
            </div>
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
