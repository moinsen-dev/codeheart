'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { AuthGuard } from '@/components/auth-guard'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Link, useRouter } from '@/i18n/routing'
import { ArrowLeft, Save, X } from 'lucide-react'

const AVAILABLE_NEEDS = [
  'foodSupplies',
  'shelter',
  'medicalCare',
  'clothing',
  'hygieneProducts',
] as const

const AVAILABLE_LOCATIONS = [
  'hamburg',
  'berlin',
  'munich',
  'cologne',
  'frankfurt',
] as const

// Map i18n keys to actual values stored in database
const NEEDS_MAP: Record<string, string> = {
  foodSupplies: 'Lebensmittel',
  shelter: 'Unterkunft',
  medicalCare: 'Medizinische Versorgung',
  clothing: 'Kleidung',
  hygieneProducts: 'Hygieneartikel',
}

const LOCATIONS_MAP: Record<string, string> = {
  hamburg: 'Hamburg',
  berlin: 'Berlin',
  munich: 'München',
  cologne: 'Köln',
  frankfurt: 'Frankfurt',
}

interface FormData {
  name: string
  story: string
  needs: string[]
  location: string
  targetFunds: string
}

interface FormErrors {
  name?: string
  story?: string
  needs?: string
  location?: string
  targetFunds?: string
}

function BeneficiaryFormContent() {
  const t = useTranslations('socialWorker')
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNewBeneficiary = id === 'new'

  const { currentUser, beneficiaries, addBeneficiary, updateBeneficiary } =
    useMockDataStore()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    story: '',
    needs: [],
    location: '',
    targetFunds: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [generatedCodeword, setGeneratedCodeword] = useState<string | null>(
    null
  )

  // Load existing beneficiary data for edit mode
  useEffect(() => {
    if (!isNewBeneficiary) {
      const beneficiary = beneficiaries.find((b) => b.id === id)
      if (beneficiary) {
        setFormData({
          name: beneficiary.name,
          story: beneficiary.story,
          needs: beneficiary.needs,
          location: beneficiary.location,
          targetFunds: beneficiary.targetFunds.toString(),
        })
      }
    }
  }, [id, isNewBeneficiary, beneficiaries])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired')
    }

    if (!formData.story.trim()) {
      newErrors.story = t('storyRequired')
    }

    if (formData.needs.length === 0) {
      newErrors.needs = t('needsRequired')
    }

    if (!formData.location) {
      newErrors.location = t('locationRequired')
    }

    if (!formData.targetFunds || parseFloat(formData.targetFunds) < 1) {
      newErrors.targetFunds = t('targetMinimum')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !currentUser) return

    if (isNewBeneficiary) {
      // Add new beneficiary
      const newBeneficiary = addBeneficiary({
        name: formData.name.trim(),
        story: formData.story.trim(),
        needs: formData.needs,
        location: formData.location,
        targetFunds: parseFloat(formData.targetFunds),
        socialWorkerId: currentUser.id,
        verified: false,
      })

      // Show the generated codeword
      setGeneratedCodeword(newBeneficiary.codeword)
    } else {
      // Update existing beneficiary
      updateBeneficiary(id, {
        name: formData.name.trim(),
        story: formData.story.trim(),
        needs: formData.needs,
        location: formData.location,
        targetFunds: parseFloat(formData.targetFunds),
      })

      // Navigate back to list
      router.push('/social-worker/beneficiaries')
    }
  }

  const handleCancel = () => {
    router.push('/social-worker/beneficiaries')
  }

  const toggleNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }))
  }

  // If codeword was generated, show success message
  if (generatedCodeword) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="container flex-1 py-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>{t('beneficiaryAdded')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-6 text-center">
                <p className="mb-2 text-sm text-muted-foreground">
                  {t('codewordIs')}
                </p>
                <p className="text-3xl font-bold">{generatedCodeword}</p>
              </div>

              <div className="flex gap-4">
                <Link href="/social-worker/beneficiaries" className="flex-1">
                  <Button className="w-full" size="lg">
                    {t('viewBeneficiaries')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setGeneratedCodeword(null)
                    setFormData({
                      name: '',
                      story: '',
                      needs: [],
                      location: '',
                      targetFunds: '',
                    })
                    setErrors({})
                  }}
                >
                  {t('addNew')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/social-worker/beneficiaries">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('beneficiaryList')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isNewBeneficiary ? t('addNew') : t('editBeneficiary')}
          </h1>
        </div>

        {/* Form */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>
              {isNewBeneficiary ? t('addBeneficiary') : t('editBeneficiary')}
            </CardTitle>
            {isNewBeneficiary && (
              <p className="text-sm text-muted-foreground">
                {t('codewordGenerated')}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('name')} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Story */}
              <div>
                <label
                  htmlFor="story"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('story')} <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, story: e.target.value }))
                  }
                  rows={5}
                  className={errors.story ? 'border-destructive' : ''}
                />
                {errors.story && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.story}
                  </p>
                )}
              </div>

              {/* Needs */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t('needs')} <span className="text-destructive">*</span>
                </label>
                <p className="mb-3 text-sm text-muted-foreground">
                  {t('selectNeeds')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_NEEDS.map((needKey) => {
                    const needValue = NEEDS_MAP[needKey]
                    const isSelected = formData.needs.includes(needValue)
                    return (
                      <Badge
                        key={needKey}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleNeed(needValue)}
                      >
                        {t(needKey)}
                      </Badge>
                    )
                  })}
                </div>
                {errors.needs && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.needs}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('location')} <span className="text-destructive">*</span>
                </label>
                <Select
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className={errors.location ? 'border-destructive' : ''}
                >
                  <option value="">{t('selectLocation')}</option>
                  {AVAILABLE_LOCATIONS.map((locKey) => (
                    <option key={locKey} value={LOCATIONS_MAP[locKey]}>
                      {t(locKey)}
                    </option>
                  ))}
                </Select>
                {errors.location && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Target Amount */}
              <div>
                <label
                  htmlFor="targetFunds"
                  className="mb-2 block text-sm font-medium"
                >
                  {t('targetAmount')} (€){' '}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="targetFunds"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.targetFunds}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetFunds: e.target.value,
                    }))
                  }
                  className={errors.targetFunds ? 'border-destructive' : ''}
                />
                {errors.targetFunds && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.targetFunds}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {t('save')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('cancel')}
                </Button>
              </div>
            </form>
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

export default function BeneficiaryFormClient() {
  return (
    <AuthGuard allowedRoles={['socialWorker']}>
      <BeneficiaryFormContent />
    </AuthGuard>
  )
}
