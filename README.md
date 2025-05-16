# What If Music?

What If Music? is a web platform that provides royalty-free music and visual assets for content creators. Users can access original beats, remixes, and cover art through a responsive download system.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technical Architecture](#technical-architecture)
* [Database Schema](#database-schema)
* [Component Documentation](#component-documentation)
* [API Documentation](#api-documentation)
* [Administration Guide](#administration-guide)

## Overview

What If Music? provides royalty-free:

* **Beats**: Original compositions for multimedia projects
* **Remixes**: Non-commercial remixed versions of popular tracks (Fair Use)
* **Cover Art**: High-quality artwork

## Features

### 1. Content Discovery

* Browse by category
* Filter by BPM, key, tags
* Featured content highlights
* Fully responsive design

### 2. Audio Playback

* Inline audio player
* YouTube embeds for remixes
* Progress & volume control

### 3. Download System

* Ad view or email subscription to unlock downloads
* Analytics-enabled download tracking
* Fair use disclosures

### 4. User Engagement

* Email subscription
* Social links
* Donation options
* Cookie consent manager

### 5. Responsive Design

* Mobile-first
* Touch-friendly
* Optimized for all screen sizes

## Technical Architecture

### Frontend

* **React** with TypeScript
* **Routing**: React Router DOM
* **UI**: Shadcn/UI + Tailwind CSS
* **State**: React Hooks, Context API

### Backend

* **Database**: Supabase (PostgreSQL)
* **Auth**: Supabase Auth
* **Storage**: Supabase Storage
* **API**: Supabase client

### Performance

* Lazy loading
* Code splitting
* Responsive images
* Asset optimization

## Database Schema

### Tables

#### `beats`

* `id` (UUID, PK)
* `title`, `producer`, `image_url`, `audio_url`
* `bpm`, `key`, `tags[]`, `description`
* `downloads`, `created_at`, `updated_at`

#### `remixes`

* `id`, `title`, `remixer`, `original_artist`, `youtube_id`
* `tags[]`, `description`, `downloads`

#### `cover_art`

* `id`, `title`, `artist`, `image_url`, `tags[]`, `downloads`

#### `downloads`

* `id`, `item_id`, `item_type`, `email`, `ip_address`, `user_agent`, `created_at`

#### `newsletter_subscribers`

* `id`, `email`, `opted_in`, `created_at`

#### `profiles`

* `id`, `avatar_url`, `username`, `created_at`, `updated_at`

## Component Documentation

### Layout

#### `Header`

* File: `src/components/layout/Header.tsx`
* Features: Navigation, logo, mobile menu, donate/support link

#### `Footer`

* File: `src/components/layout/Footer.tsx`
* Features: Legal/social links, newsletter signup

#### `PageLayout`

* Wraps all pages with header/footer

### Content Cards

#### `BeatCard`

* Props: `id`, `title`, `producer`, `image`, `audio`, `bpm?`, `key_signature?`, `tags[]`

#### `RemixCard`

* Props: `id`, `title`, `remixer`, `originalArtist`, `youtubeId`, `tags[]`

#### `ArtCard`

* Props: `id`, `title`, `artist`, `image`, `tags[]`

### Utilities

#### `AudioPlayer`

* Audio preview for beats

#### `DownloadGate`

* Modal for ad or email-based download access

#### `AdBanner`

* Props: `type`, `className?`

#### `CookieConsent`

* Handles cookie banners and preferences

## API Documentation

### Fetching

```ts
const beats = await fetchBeats();
const remixes = await fetchRemixes();
const coverArt = await fetchCoverArt();
```

### Actions

```ts
await recordDownload('beat-123', 'beat', 'user@example.com');
const success = await subscribeToNewsletter('user@example.com');
const url = await getDownloadURL('beats', 'beat-123/track.mp3');
```

## Administration Guide

### Add Beat

```ts
supabase.from('beats').insert({ title: 'New Beat', ... });
```

### Add Remix

```ts
supabase.from('remixes').insert({ title: 'New Remix', ... });
```

### Add Cover Art

```ts
supabase.from('cover_art').insert({ title: 'New Cover Art', ... });
```

## Support

* [React Docs](https://reactjs.org/docs/getting-started.html)
* [Supabase Docs](https://supabase.com/docs)
* [Tailwind CSS](https://tailwindcss.com/docs)
* [Shadcn UI](https://ui.shadcn.com/docs)

---

> For deeper implementation details, see the source code and in-file comments.
