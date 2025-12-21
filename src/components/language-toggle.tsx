'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('language')

  const switchLanguage = () => {
    const newLocale = locale === 'de' ? 'en' : 'de'
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">
        {t(locale === 'de' ? 'en' : 'de')}
      </span>
    </Button>
  )
}
