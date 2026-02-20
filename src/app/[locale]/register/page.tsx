'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
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

type UserRole = User['role']

// Only show donor, socialWorker, and admin for registration
const ROLES: UserRole[] = ['donor', 'socialWorker', 'admin']

// Role-to-route mapping
const ROLE_ROUTES: Record<UserRole, string> = {
  donor: '/dashboard',
  socialWorker: '/social-worker',
  admin: '/admin',
  investor: '/dashboard', // Default to dashboard
}

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const tRoles = useTranslations('waitlist.roles')
  const tRoleDescriptions = useTranslations('auth.register.roleDescriptions')
  const tErrors = useTranslations('auth.errors')
  const router = useRouter()
  const { login } = useMockDataStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('donor')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name) {
      setError(tErrors('nameRequired'))
      return
    }

    if (!email) {
      setError(tErrors('emailRequired'))
      return
    }

    if (!password) {
      setError(tErrors('passwordRequired'))
      return
    }

    if (password.length < 8) {
      setError(tErrors('passwordTooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(tErrors('passwordMismatch'))
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration - in real app this would create user in backend
    login(email, role)

    // Redirect based on role
    const route = ROLE_ROUTES[role]
    router.push(route)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8">
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
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
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
            <div className="space-y-3">
              <Label htmlFor="role">{t('role')}</Label>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <div
                    key={r}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      role === r
                        ? 'border-primary bg-primary/5'
                        : 'border-input hover:border-primary/50'
                    }`}
                    onClick={() => !isLoading && setRole(r)}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        id={`role-${r}`}
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        disabled={isLoading}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${r}`}
                          className="cursor-pointer font-medium"
                        >
                          {tRoles(r)}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {tRoleDescriptions(r)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '...' : t('submit')}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t('hasAccount')}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {t('loginLink')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
