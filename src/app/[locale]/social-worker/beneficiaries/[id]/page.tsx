import { routing } from '@/i18n/routing'
import BeneficiaryFormClient from './client'

// Generate static params for all locale combinations
// We generate a placeholder for 'new' - actual beneficiary IDs are handled client-side
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [{ locale, id: 'new' }])
}

// Enable dynamic params so any ID works at runtime
export const dynamicParams = true

export default function BeneficiaryFormPage() {
  return <BeneficiaryFormClient />
}
