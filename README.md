# Rubbsh App

An AI-powered waste classification app that helps users properly sort their garbage into the correct bins. Point your camera at waste items and get instant, accurate sorting recommendations based on Vancouver/UBC recycling guidelines.

## Features

- **AI-Powered Classification** - Uses Grok Vision AI to analyze waste items and identify materials
- **Multi-Part Decomposition** - Breaks down complex items (e.g., coffee cup with lid and sleeve) into separate components
- **Location-Aware** - Supports location-specific sorting rules via URL parameters
- **Four-Stream Sorting** - Classifies items into Food Scraps, Recyclable Containers, Paper, or Garbage
- **PWA Support** - Installable as a Progressive Web App on mobile devices
- **Dark Mode** - Automatic dark mode based on system preferences
- **Privacy-Focused** - Anonymous authentication with user-owned data

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Storage + Auth)
- **AI**: [Grok Vision API](https://x.ai/) (grok-4-fast-reasoning)
- **Validation**: [Zod](https://zod.dev/) for runtime type safety
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- A [Supabase](https://supabase.com/) account (free tier works)
- A [Grok API](https://console.x.ai/) key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rubbsh-app.git
   cd rubbsh-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   GROK_API_KEY=your_grok_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**

   Option A: Using Supabase CLI
   ```bash
   npm install -g supabase
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   Option B: Manual setup
   - Go to your Supabase dashboard → SQL Editor
   - Run each migration file in `supabase/migrations/` in order

5. **Enable Anonymous Sign-ins**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable "Anonymous Sign-Ins"

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rubbsh-app/
├── app/                          # Next.js App Router
│   ├── api/classify/             # AI classification endpoint
│   ├── location/[location]/      # Location-specific camera view
│   ├── suggestions/              # Classification results page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Home page (camera view)
│   └── globals.css               # Global styles + CSS variables
├── components/
│   ├── CameraView.tsx            # Main camera component
│   ├── AsciiHeader.tsx           # Animated ASCII logo
│   ├── HowToUseModal.tsx         # Instructions modal
│   └── reactbits/                # Reusable UI components
├── lib/
│   ├── camera-utils.ts           # Camera stream management hook
│   ├── image-compression.ts      # Client-side image compression
│   ├── supabase.ts               # Supabase helper functions
│   ├── supabase/                 # Supabase client setup
│   └── validation.ts             # Zod schemas
├── prompts/
│   └── image_system_prompt.md    # AI classification prompt
├── supabase/
│   ├── config.toml               # Supabase CLI config
│   └── migrations/               # Database migrations
└── public/
    ├── manifest.json             # PWA manifest
    └── icons/                    # App icons
```

## Database Schema

### Tables

**waste_images**
- `id` (UUID) - Primary key
- `created_at` (timestamp) - Upload timestamp
- `storage_path` (text) - Path in Supabase Storage
- `file_size` (integer) - File size in bytes
- `mime_type` (text) - Image MIME type
- `user_id` (UUID) - Owner (anonymous or permanent)

**recommendations**
- `id` (UUID) - Primary key
- `created_at` (timestamp) - Classification timestamp
- `image_id` (UUID) - Reference to waste_images
- `user_id` (UUID) - Owner
- `error` (text) - Error message if classification failed
- `summary` (text) - Brief description of waste item
- `suggestions` (JSONB) - Array of parts with bin assignments
- `location` (text) - Location context for sorting rules

### Storage

- **waste-images** bucket - Stores uploaded images organized by user ID

## How It Works

1. **User opens app** → Anonymous Supabase session is created
2. **User captures photo** → Image is compressed client-side
3. **Image uploaded** → Stored in Supabase Storage with metadata
4. **AI Classification** → Grok Vision analyzes the image using a detailed prompt
5. **Results displayed** → Each waste component shown with bin assignment and instructions

## Classification Categories

| Bin | Color | Examples |
|-----|-------|----------|
| **Food Scraps** | Green | Food waste, coffee grounds, food-soiled paper |
| **Recyclable Containers** | Blue | Plastic bottles, metal cans, glass jars, coffee cups |
| **Paper** | Yellow | Clean cardboard, paper, cup sleeves |
| **Garbage** | Gray | Plastic utensils, wrappers, foam, non-recyclables |

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROK_API_KEY` | Your Grok API key from console.x.ai |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Classification rules based on [UBC Sort-It-Out](https://planning.ubc.ca/zero-waste/sort-it-out) guidelines
- Recycling information from [Metro Vancouver](https://www.metrovancouver.org/) and [Recycle BC](https://recyclebc.ca/)
