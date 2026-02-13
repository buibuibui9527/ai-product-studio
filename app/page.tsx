export const dynamic = 'force-dynamic';
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { getSupabaseClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import CreditCounter from '@/components/CreditCounter'
import { Upload, Sparkles, LogOut } from 'lucide-react'

export default function Dashboard() {
  const t = useTranslations()
  const router = useRouter()
  const supabase = getSupabaseClient()
  
  const [user, setUser] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>()
  const [style, setStyle] = useState<string>()
  const [jobId, setJobId] = useState<string>()
  const [result, setResult] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    })
  }, [router, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
      setResult(undefined)
      setError(undefined)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(data.path)

    return publicUrl
  }

  const generate = async () => {
    if (!imageFile || !style) return

    setLoading(true)
    setError(undefined)

    try {
      // Upload image to Supabase Storage
      const uploadedUrl = await uploadImage(imageFile)

      // Create generation job
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedUrl, style_id: style })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setJobId(data.jobId)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        const data = await res.json()

        if (data.status === 'done') {
          setResult(data.result_url)
          setLoading(false)
          clearInterval(interval)
        }

        if (data.status === 'failed') {
          setError('Generation failed. Please try again.')
          setLoading(false)
          clearInterval(interval)
        }
      } catch (err) {
        console.error(err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Product Studio</h1>
          <div className="flex items-center gap-4">
            <CreditCounter />
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={18} />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">{t('upload_image')}</h2>
          
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-2" />
                <p className="text-gray-600">{t('click_to_upload')}</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Style Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">{t('select_style')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['luxury_marble', 'minimal_studio', 'outdoor_nature'].map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`p-6 border-2 rounded-xl transition-all ${
                  style === s 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold text-lg mb-2">
                  {t(`style_${s.split('_')[0]}`)}
                </div>
                <div className="text-sm text-gray-600">
                  {t(`style_${s}_desc`)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          disabled={!imageFile || !style || loading}
          onClick={generate}
          className="w-full px-8 py-4 bg-black text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
        >
          <Sparkles size={24} />
          {loading ? t('processing') : t('generate')}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Result Comparison */}
        {result && imageUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">{t('result')}</h2>
            
            <div className="rounded-xl overflow-hidden">
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={imageUrl} alt="Original" />}
                itemTwo={<ReactCompareSliderImage src={result} alt="Result" />}
              />
            </div>

            <div className="mt-4 flex gap-4">
              <a
                href={result}
                download
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-center font-medium"
              >
                {t('download')}
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

