import { redirect } from 'next/navigation'

// Root page redirects to default locale
// This is needed for GitHub Pages where /codeheart/ must serve content
export default function RootPage() {
  redirect('/de')
}
