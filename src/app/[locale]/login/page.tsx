'use client'

import { useState, useEffect, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter as useI18nRouter } from '@/i18n/routing'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { useMockDataStore, type User } from '@/lib/stores/mock-data'
import { Link } from '@/i18n/routing'
import { devLogin, isDevAuthEnabled } from '@/lib/auth/dev-auth'

// Role-to-route mapping
const ROLE_ROUTES: Record<User['role'], string> = {
  donor: '/dashboard',
  socialWorker: '/social-worker',
  admin: '/admin',
  investor: '/dashboard', // Default to dashboard for now
}

// Component that handles auto-login from URL params
function AutoLoginHandler() {
  const searchParams = useSearchParams()
  const i18nRouter = useI18nRouter()
  const { currentUser } = useMockDataStore()
  const devAuthEnabled = isDevAuthEnabled()

  useEffect(() => {
    if (devAuthEnabled && !currentUser) {
      const devParam = searchParams.get('dev')
      if (
        devParam === 'donor' ||
        devParam === 'socialWorker' ||
        devParam === 'admin'
      ) {
        devLogin(devParam)
        const route = ROLE_ROUTES[devParam]
        i18nRouter.push(route)
      }
    }
  }, [devAuthEnabled, searchParams, currentUser, i18nRouter])

  return null
}

function LoginForm() {
  const t = useTranslations('auth.login')
  const tErrors = useTranslations('auth.errors')
  const tDevMode = useTranslations('auth.login.devMode')
  const i18nRouter = useI18nRouter()
  const { login } = useMockDataStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const devAuthEnabled = isDevAuthEnabled()

  const handleQuickLogin = (role: 'donor' | 'socialWorker' | 'admin') => {
    setIsLoading(true)
    devLogin(role)
    const route = ROLE_ROUTES[role]
    i18nRouter.push(route)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(tErrors('emailRequired'))
      return
    }

    if (!password) {
      setError(tErrors('passwordRequired'))
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock login - in real app this would validate against backend
    // For now, we'll default to donor role, but this should come from backend
    const role: User['role'] = 'donor'
    login(email, role)

    // Redirect based on role
    const route = ROLE_ROUTES[role]
    i18nRouter.push(route)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '...' : t('submit')}
            </Button>

            {devAuthEnabled && (
              <>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {tDevMode('title')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('donor')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {tDevMode('donor')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('socialWorker')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {tDevMode('socialWorker')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {tDevMode('admin')}
                  </Button>
                </div>
              </>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <Link href="/register" className="text-primary hover:underline">
                {t('registerLink')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AutoLoginHandler />
      </Suspense>
      <LoginForm />
    </>
  )
}
