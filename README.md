# 一周菜单管家 v3 — OpenAI + Supabase Google Login

## What this version adds

- Google login through Supabase Auth
- User-specific recipe database
- OpenAI API recipe generation through a secure server route
- Save generated recipes to the user's account
- Weekly plan and automatic shopping list

## Required environment variables

Set these in Vercel > Project > Settings > Environment Variables:

```text
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase setup

1. Create a Supabase project.
2. Go to SQL Editor.
3. Run `supabase/schema.sql`.
4. Go to Authentication > Providers.
5. Enable Google.
6. Add your Vercel domain to allowed redirect URLs.

## OpenAI setup

Create an OpenAI API key from the OpenAI platform and add it to Vercel as `OPENAI_API_KEY`.

## Deploy

Upload all files to GitHub. Vercel will redeploy automatically.
