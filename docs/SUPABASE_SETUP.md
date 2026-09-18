# ZAYATHON 2026 - Supabase Database & Security Guide

## Database Schema Architecture

The database migrations are located under `supabase/migrations/`:
1. `20260917_initial_schema.sql` (Profiles, Teams, Registrations, Sponsors, FAQ, Contacts)
2. `20260918_production_features.sql` (Check-ins, Certificates, Announcements, Audit Logs, Email Logs)
3. `20260918_judge_ai_leaderboard.sql` (Judges, Assignments, Scoring Rubric, AI Chat History)

## Applying Migrations

Execute the SQL migration files sequentially in your Supabase SQL Editor or using Supabase CLI:

```bash
supabase db push
```

## Storage Buckets
Ensure the following buckets exist and are public:
- `proposals`
- `ppts`
- `sponsor-logos`
- `avatars`
- `certificates`
- `logos`

## Realtime Enablement
Ensure Realtime replication is enabled for:
- `registrations`
- `contacts`
- `teams`
- `announcements`
- `checkins`
- `judge_scores`
