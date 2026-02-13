# AI Product Studio - SaaS Platform

A production-ready AI-powered product photography SaaS platform built with Next.js, Supabase, Replicate, and Lemon Squeezy.

## 🚀 Features

- **AI Background Generation**: Transform product photos with AI-powered background replacement
- **Multiple Styles**: Choose from luxury marble, minimal studio, or outdoor nature backgrounds
- **Multi-language Support**: 10 languages (EN, ZH-TW, ZH-CN, JA, KO, ES, PT, DE, FR, IT)
- **Credit System**: Built-in credit management with automatic deduction
- **Payment Integration**: Lemon Squeezy integration for credit purchases
- **Async Job Processing**: Non-blocking background processing with Vercel Cron
- **Google OAuth**: Secure authentication via Supabase Auth
- **Image Storage**: Supabase Storage for user uploads
- **Rate Limiting**: Built-in protection against abuse
- **Responsive Design**: Beautiful UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Replicate account
- Lemon Squeezy account (for payments)
- Google OAuth credentials

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd ai-product-saas
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration from `SUPABASE_MIGRATION.sql`
3. Go to **Authentication > Providers** and enable Google OAuth
4. Go to **Storage** and create a public bucket named `uploads`
5. Set bucket policy to public read access

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in the following values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (from Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Replicate (from replicate.com/account/api-tokens)
REPLICATE_API_TOKEN=your_replicate_token

# Lemon Squeezy (from Settings > API)
LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_api_key
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add credentials to Supabase Authentication settings

### 5. Set Up Lemon Squeezy

1. Create a product and checkout link
2. In checkout link settings, add custom data field: `user_id`
3. Set webhook URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
4. Enable `order_created` event

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Deploy to Vercel

1. Install Vercel CLI or connect GitHub repository
2. Set all environment variables in Vercel dashboard
3. Deploy:

```bash
vercel
```

### Important Notes

- The `vercel.json` cron job will automatically process pending jobs every minute
- Make sure to set `maxDuration` in your Vercel plan (Pro required for 5min timeout)
- Supabase Storage bucket must be set to public for image access

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **AI**: Replicate (BRIA RMBG 1.4 + FLUX 1.1 Pro)
- **Payments**: Lemon Squeezy
- **i18n**: next-intl

### Job Processing Flow

1. User uploads image and selects style
2. Image uploaded to Supabase Storage
3. Job created in database with `pending` status
4. Vercel Cron triggers `/api/jobs/process` every minute
5. Background processor:
   - Removes background using Replicate
   - Generates new background with AI
   - Deducts credit (atomic operation)
   - Updates job status to `done`
6. Frontend polls job status and displays result

### Database Schema

```sql
profiles (id, credits, created_at)
jobs (id, user_id, image_url, style_id, status, result_url, created_at)
lemonsqueezy_events (id, created_at)
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Rate limiting (3 requests per minute per user)
- Webhook signature verification
- Idempotent webhook processing
- Atomic credit deduction
- Server-side validation

## 🌍 Supported Languages

- English (en)
- Traditional Chinese (zh-TW)
- Simplified Chinese (zh-CN)
- Japanese (ja)
- Korean (ko)
- Spanish (es)
- Portuguese (pt)
- German (de)
- French (fr)
- Italian (it)

## 📝 API Routes

- `POST /api/generate` - Create generation job
- `GET /api/jobs/[id]` - Get job status
- `POST /api/jobs/process` - Process pending jobs (cron)
- `GET /api/profile` - Get user profile
- `POST /api/webhooks/lemonsqueezy` - Handle payment webhooks

## 🎨 Customization

### Adding New Styles

Edit `lib/styles.ts`:

```typescript
export const STYLE_PROMPTS: Record<string, string> = {
  your_style: "Your custom prompt in English"
}
```

Add translations in `messages/*.json`:

```json
{
  "style_your": "Your Style Name",
  "style_your_style_desc": "Description"
}
```

### Adjusting Credit Costs

Modify the credit deduction logic in `app/api/jobs/process/route.ts`.

## 🐛 Troubleshooting

### Jobs stuck in pending

- Check Vercel Cron logs
- Manually trigger: `curl https://yourdomain.com/api/jobs/process`
- Verify Replicate API token

### Authentication not working

- Verify Google OAuth redirect URI
- Check Supabase Auth settings
- Ensure environment variables are set

### Image upload fails

- Verify Supabase Storage bucket is public
- Check bucket name is `uploads`
- Verify storage policies

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📧 Support

For issues and questions, please open a GitHub issue.
