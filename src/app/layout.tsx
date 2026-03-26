import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://alnooronlineacademy.com"),
  title: "Al-NOOR Online Quran & Hadees Academy",
  description: "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization. The academy offers an authentic and continuous learning journey starting from Noorani Qaida, progressing through Qur'an Nazra, Tajweed, Hifz-ul-Qur'an, Tarjuma & Tafseer, Balaghat, Ilm-us-Sarf, Ilm-un-Nahw, Spoken & Advanced Arabic, and advancing into Fiqh, Usool-ul-Fiqh, Hadith sciences, culminating in Takhassus fil Hadees.",
  keywords: [
    "Online Quran Academy",
    "Online Hadees Academy",
    "Islamic Knowledge Web App",
    "Noorani Qaida Online",
    "Hifz-ul-Quran Online",
    "Tafseer Quran Course",
    "Arabic Language Online",
    "Ilm-us-Sarf & Nahw",
    "Fiqh and Usool-ul-Fiqh",
    "Hadith Studies Online",
    "Takhassus fil Hadees",
    "Islamic Studies Online"
  ],
  authors: [{ name: "Al-NOOR Academy" }],
  creator: "Al-NOOR Online Quran & Hadees Academy",
  publisher: "Al-NOOR Online Quran & Hadees Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://alnooronlineacademy.com/",
    title: "Al-NOOR Online Quran & Hadees Academy",
    description: "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization.",
    locale: "en_US",
    alternateLocale: ["ar_SA", "ur_PK"],
    siteName: "Al-NOOR Online Quran & Hadees Academy",
    images: [
      {
        url: "https://i.ibb.co/V0pRN6XT/logo.png",
        width: 1200,
        height: 630,
        alt: "Al-NOOR Online Quran & Hadees Academy - Complete Islamic Knowledge Web App"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-NOOR Online Quran & Hadees Academy",
    description: "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization.",
    images: ["https://i.ibb.co/V0pRN6XT/logo.png"],
    creator: "@alnooracademy",
    site: "@alnooracademy"
  },
  alternates: {
    canonical: "https://alnooronlineacademy.com/",
    languages: {
      'en-US': 'https://alnooronlineacademy.com/',
      'ar-SA': 'https://alnooronlineacademy.com/?lang=ar',
      'ur-PK': 'https://alnooronlineacademy.com/?lang=ur',
    },
  },
  icons: {
    icon: [
      { url: 'https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon.ico', sizes: 'any' },
      { url: 'https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: 'https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: 'https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon.ico',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'googlea84c96879db9b759',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0D4D2F" />
        <meta name="msapplication-TileColor" content="#0D4D2F" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Al-NOOR Academy" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://alnooronlineacademy.com/#organization",
                  "name": "Al-NOOR Online Quran & Hadees Academy",
                  "url": "https://alnooronlineacademy.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://alnooronlineacademy.com/logo.png",
                    "width": 1200,
                    "height": 630
                  },
                  "description": "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization.",
                  "sameAs": [
                    "https://www.facebook.com/alnooracademy",
                    "https://www.youtube.com/alnooracademy",
                    "https://wa.me/923434487450"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+923434487450",
                    "contactType": "customer service",
                    "email": "waqas@alnooronlineacademy.com",
                    "availableLanguage": ["English", "Arabic", "Urdu"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://alnooronlineacademy.com/#website",
                  "url": "https://alnooronlineacademy.com",
                  "name": "Al-NOOR Online Quran & Hadees Academy",
                  "publisher": {
                    "@id": "https://alnooronlineacademy.com/#organization"
                  },
                  "inLanguage": ["en", "ar", "ur"]
                },
                {
                  "@type": "WebPage",
                  "@id": "https://alnooronlineacademy.com/#webpage",
                  "url": "https://alnooronlineacademy.com",
                  "name": "Al-NOOR Online Quran & Hadees Academy | Complete Islamic Knowledge Web App",
                  "isPartOf": {
                    "@id": "https://alnooronlineacademy.com/#website"
                  },
                  "about": {
                    "@id": "https://alnooronlineacademy.com/#organization"
                  },
                  "description": "Learn complete Islamic knowledge online with Al-NOOR Online Quran & Hadees Academy—from Noorani Qaida, Hifz-ul-Qur'an, Tafseer, Arabic language, Fiqh, Hadith, to Takhassus fil Hadees under qualified scholars.",
                  "inLanguage": "en-US"
                },
                {
                  "@type": "EducationalOrganization",
                  "name": "Al-NOOR Online Quran & Hadees Academy",
                  "description": "Complete Islamic education from Noorani Qaida to Takhassus fil Hadees",
                  "url": "https://alnooronlineacademy.com/courses",
                  "teaches": [
                    "Noorani Qaida",
                    "Quran Nazra",
                    "Tajweed",
                    "Hifz-ul-Quran",
                    "Tafseer",
                    "Arabic Language",
                    "Fiqh",
                    "Hadith Studies",
                    "Takhassus fil Hadees"
                  ],
                  "hasCourse": [
                    {
                      "@type": "Course",
                      "name": "Noorani Qaida Online",
                      "description": "Foundation course for Quran reading"
                    },
                    {
                      "@type": "Course",
                      "name": "Hifz-ul-Quran Online",
                      "description": "Quran memorization program"
                    },
                    {
                      "@type": "Course",
                      "name": "Tafseer Quran Course",
                      "description": "Quran translation and interpretation"
                    },
                    {
                      "@type": "Course",
                      "name": "Arabic Language Online",
                      "description": "Learn Arabic from basics to advanced"
                    },
                    {
                      "@type": "Course",
                      "name": "Hadith Studies Online",
                      "description": "Study of Prophetic traditions"
                    },
                    {
                      "@type": "Course",
                      "name": "Takhassus fil Hadees",
                      "description": "Specialization in Hadith sciences"
                    }
                  ]
                },
                {
                  "@type": "Person",
                  "name": "Dr. Noor Ur Rahman Hazarvi",
                  "jobTitle": "Scholar in Charge",
                  "worksFor": {
                    "@id": "https://alnooronlineacademy.com/#organization"
                  },
                  "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "International Islamic University Islamabad"
                  },
                  "knowsAbout": ["Islamic Studies", "Hadith", "Fiqh", "Quranic Studies"]
                }
              ]
            })
          }}
        />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RVJ0MFTMY6"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RVJ0MFTMY6');
          `
        }} />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="green"
          enableSystem={false}
          themes={["green", "light", "dark"]}
        >
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
