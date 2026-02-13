'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Coins } from 'lucide-react'

export default function CreditCounter() {
  const t = useTranslations()
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      setCredits(data.credits || 0)
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <Coins size={18} className="text-gray-400" />
        <span className="text-sm text-gray-600">...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg">
      <Coins size={18} className="text-amber-600" />
      <span className="text-sm font-semibold text-amber-900">
        {credits} {t('credits')}
      </span>
    </div>
  )
}
