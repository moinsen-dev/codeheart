'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import {
  Heart,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Search,
  PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Navbar } from '@/components/navbar'
import { Link } from '@/i18n/routing'
import { useMockDataStore, type Beneficiary } from '@/lib/stores/mock-data'

export default function DonateToCodewordPage() {
  const t = useTranslations('donate')
  const tBeneficiaries = useTranslations('beneficiaries')
  const router = useRouter()
  const params = useParams()
  const codeword = params.codeword as string

  const {
    getBeneficiaryByCodeword,
    currentUser,
    makeDonation,
    generateMockData,
    beneficiaries,
  } = useMockDataStore()

  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (beneficiaries.length === 0) {
      generateMockData()
    }
  }, [beneficiaries.length, generateMockData])

  useEffect(() => {
    if (beneficiaries.length > 0) {
      const found = getBeneficiaryByCodeword(codeword)
      if (found) {
        setBeneficiary(found)
      } else {
        router.push('/donate')
      }
    }
  }, [codeword, getBeneficiaryByCodeword, beneficiaries.length, router])

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!currentUser) {
      router.push('/login')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 1) {
      setError(t('minAmount'))
      return
    }
    if (amountNum > 500) {
      setError(t('maxAmount'))
      return
    }

    if (!beneficiary) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    makeDonation(beneficiary.id, amountNum, message || undefined)

    setIsProcessing(false)
    setIsDone(true)
  }

  if (!beneficiary) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container flex flex-1 items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container flex flex-1 items-center justify-center py-8">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <PartyPopper className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">{t('success')}</CardTitle>
              <CardDescription>{t('successDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  {t('donateTitle')}
                </p>
                <p className="text-lg font-semibold">{beneficiary.name}</p>
                <p className="text-2xl font-bold text-primary">€{amount}</p>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t('backToDashboard')}
                  </Button>
                </Link>
                <Link href="/donate" className="flex-1">
                  <Button className="w-full">{t('donateAgain')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const progressPercent = Math.min(
    (beneficiary.currentFunds / beneficiary.targetFunds) * 100,
    100
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-6">
          <Link href="/donate">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('tryAgain')}
            </Button>
          </Link>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Beneficiary info */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <img
                  src={beneficiary.photoUrl}
                  alt={beneficiary.name}
                  className="h-20 w-20 rounded-full bg-muted"
                />
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {beneficiary.name}
                    {beneficiary.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <span className="font-mono text-primary">
                      {beneficiary.codeword}
                    </span>
                  </CardDescription>
                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {beneficiary.location}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>
                    €{beneficiary.currentFunds} {tBeneficiaries('of')} €
                    {beneficiary.targetFunds}
                  </span>
                  <span className="text-muted-foreground">
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progressPercent} />
              </div>

              {/* Needs */}
              <div>
                <p className="mb-2 text-sm font-medium">
                  {tBeneficiaries('needs')}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {beneficiary.needs.map((need) => (
                    <Badge key={need} variant="secondary">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div>
                <p className="mb-2 text-sm font-medium">
                  {tBeneficiaries('story')}:
                </p>
                <p className="text-sm text-muted-foreground">
                  {beneficiary.story}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Donation form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                {t('donateTitle')} {beneficiary.name}
              </CardTitle>
              <CardDescription>
                {t('minAmount')} • {t('maxAmount')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonate} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {!currentUser && (
                  <div className="rounded-md bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Please{' '}
                    <Link href="/login" className="underline">
                      login
                    </Link>{' '}
                    to make a donation.
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    {t('amount')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max="500"
                      step="1"
                      placeholder="10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    placeholder={t('messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isProcessing}
                  />
                </div>

                {/* Quick amount buttons */}
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setAmount(val.toString())}
                      disabled={isProcessing}
                    >
                      €{val}
                    </Button>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!amount || isProcessing || !currentUser}
                >
                  {isProcessing ? (
                    t('processing')
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
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
