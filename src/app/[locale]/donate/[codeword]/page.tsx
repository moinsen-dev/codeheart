import { routing } from '@/i18n/routing'
import DonateToCodewordClient from './client'

// Generate static params for all locale combinations
// We generate a placeholder - actual codewords are handled client-side
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    { locale, codeword: 'placeholder' },
  ])
}

// Enable dynamic params so any codeword works at runtime
export const dynamicParams = true

export default function DonateToCodewordPage() {
  return <DonateToCodewordClient />
}
