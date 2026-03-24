# Al-NOOR Online Quran & Hadees Academy

**World's First Complete Islamic Knowledge Web App**

A comprehensive online Islamic education platform offering 24 structured courses from Noorani Qaida to Takhassus fil Hadees, all under the scholarly supervision of Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh).

## 🌟 Features

### Public Panel (Marketing Site)
- **Animated Splash Screen** with Islamic geometric patterns and gold rings
- **Hero Section** with Bismillah calligraphy overlay and video background
- **24 Complete Courses** across 5 disciplines with filtering by category/level
- **Course Detail Pages** with full descriptions, prerequisites, and progression paths
- **Admission Form** with course selection, timing preferences, and guardian info for minors
- **About Page** with scholar profile, mission/vision, and methodology
- **Contact Page** with form, WhatsApp integration, and FAQ
- **SEO Optimized** with meta tags, Open Graph, and structured data
- **Multi-Language Ready** (English, Urdu, Arabic) with RTL support
- **Three Themes** (Islamic Green, Light, Dark)

### Admin Panel
- Dashboard with KPI cards and recent admissions
- Student Management (CRUD operations)
- Teacher Management with assignment controls
- Course Management (all 24 courses)
- Admission Review System (approve/reject/defer)
- Payment Tracking and reporting

### Student Panel
- Personal dashboard with enrolled courses
- Progress tracking with visual bars
- Attendance history
- Certificate downloads
- Schedule management
- Course materials access

### Teacher Panel
- Dashboard with assigned students
- Today's schedule view
- Attendance marking
- Session notes and materials upload
- Student progress tracking
- Performance statistics

## 🚀 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth)
- **Database:** PostgreSQL with RLS policies
- **Icons:** Lucide React
- **Fonts:** Amiri (Arabic), Cormorant Garamond, Cinzel

## 📦 Project Structure

```
alnoor-academy/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities and data
│   ├── types/                  # TypeScript types
│   └── app/globals.css         # Global styles
├── supabase/
│   └── migrations/             # Database migrations
├── public/images/              # Static images
└── next.config.ts              # Next.js configuration
```

## 🎨 Design System

### Color Palette
- **Primary Green:** #1A7A4A
- **Primary Dark:** #0D4D2F
- **Gold Accent:** #C9A84C

### Typography
- **Arabic/Urdu:** Amiri, Noto Naskh Arabic
- **English Display:** Cormorant Garamond

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run the SQL migration in Supabase:
`supabase/migrations/001_initial_schema.sql`

## 📁 Building for Production

```bash
npm run build
```

Static export will be in the `dist` folder.

## 📚 24 Courses Offered

### Quran (7 courses)
1. Noorani Qaida → 7. Advanced Tafseer

### Arabic Language (4 courses)
8. Beginner Arabic → 11. Advanced Ilm-e-Balaghat

### Fiqh (6 courses)
12. Basic Fiqh → 17. Advanced Usool Fiqh

### Sarf & Nahw (3 courses)
18. Basic Sarf & Nahw → 20. Advanced Sarf & Nahw

### Hadith (4 courses)
21. Basic Hadith → 24. Takhassus fil Hadith

## 📄 License

© 2025 Al-NOOR Online Quran & Hadees Academy. All Rights Reserved.

---

**Under the scholarly supervision of Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh)**
