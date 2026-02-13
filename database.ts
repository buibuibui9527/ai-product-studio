export interface Profile {
  id: string
  credits: number
  created_at: string
}

export interface Job {
  id: string
  user_id: string
  image_url: string
  style_id: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  result_url: string | null
  created_at: string
}

export interface LemonSqueezyEvent {
  id: string
  created_at: string
}
