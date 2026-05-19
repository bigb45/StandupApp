# StandupApp

A friction-less daily standup web application for teams.

## Tech Stack

- Next.js 14 (App Router)
- Supabase (DB, Auth, RLS)
- Tailwind CSS
- Resend (Email)
- Phosphor Icons

## Local Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   SUPABASE_SECRET_KEY=your_secret_key
   RESEND_API_KEY=your_resend_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Run `npm run dev`

## Database Setup

Run the contents of `supabase/schema.sql` in your Supabase SQL Editor.

## Seed Data

Demo users are documented in `supabase/schema.sql`.

## Python Script Integration

Endpoint: `POST /api/standup/prefill`
Payload: `{ "user_email": "string", "date": "YYYY-MM-DD", "today_items": ["item1", "item2"] }`
