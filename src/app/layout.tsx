import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://itqaninstitute.com"),
  title: "Al-Itqan Institute for Islamic & Arabic Studies",
  description: "Al-Itqan Institute for Islamic & Arabic Studies is a premier online academy offering a structured learning path from foundational Qur'an recitation to advanced studies in Arabic, Fiqh, and Hadith sciences.",
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
  authors: [{ name: "Al-Itqan Institute" }],
  creator: "Al-Itqan Institute",
  publisher: "Al-Itqan Institute",
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
    url: "https://itqaninstitute.com",
    title: "Al-Itqan Institute for Islamic & Arabic Studies",
    description: "Al-Itqan Institute for Islamic & Arabic Studies is a premier online academy offering a structured learning path from foundational Qur'an recitation to advanced studies in Arabic, Fiqh, and Hadith sciences.",
    locale: "en_US",
    alternateLocale: ["ar_SA", "ur_PK"],
    siteName: "Al-Itqan Institute for Islamic & Arabic Studies",
    images: [
      {
        url: "https://i.ibb.co/RGwjjCBj/logo-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "Al-Itqan Institute for Islamic & Arabic Studies"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Itqan Institute for Islamic & Arabic Studies",
    description: "Al-Itqan Institute for Islamic & Arabic Studies is a premier online academy offering a structured learning path from foundational Qur'an recitation to advanced studies in Arabic, Fiqh, and Hadith sciences.",
    images: ["https://i.ibb.co/RGwjjCBj/logo-removebg-preview.png"],
    creator: "@itqaninstitute",
    site: "@itqaninstitute"
  },
  alternates: {
    canonical: "https://itqaninstitute.com",
    languages: {
      'en-US': 'https://itqaninstitute.com',
      'ar-SA': 'https://itqaninstitute.com/?lang=ar',
      'ur-PK': 'https://itqaninstitute.com/?lang=ur',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
        <meta name="apple-mobile-web-app-title" content="Al-Itqan Institute" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://itqaninstitute.com/#organization",
                  "name": "*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies",
                  "url": "https://itqaninstitute.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://itqaninstitute.com/logo.png",
                    "width": 1200,
                    "height": 630
                  },
                  "description": "*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization.",
                  "sameAs": [
                    "https://www.facebook.com/itqaninstitute",
                    "https://www.youtube.com/itqaninstitute",
                    "https://wa.me/923434487450"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+923434487450",
                    "contactType": "customer service",
                    "email": "info@itqaninstitute.com",
                    "availableLanguage": ["English", "Arabic", "Urdu"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://itqaninstitute.com/#website",
                  "url": "https://itqaninstitute.com",
                  "name": "*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies",
                  "publisher": {
                    "@id": "https://itqaninstitute.com/#organization"
                  },
                  "inLanguage": ["en", "ar", "ur"]
                },
                {
                  "@type": "WebPage",
                  "@id": "https://itqaninstitute.com/#webpage",
                  "url": "https://itqaninstitute.com",
                  "name": "*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies | Complete Islamic Knowledge Web App",
                  "isPartOf": {
                    "@id": "https://itqaninstitute.com/#website"
                  },
                  "about": {
                    "@id": "https://itqaninstitute.com/#organization"
                  },
                  "description": "Learn complete Islamic knowledge online with *الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies—from Noorani Qaida, Hifz-ul-Qur'an, Tafseer, Arabic language, Fiqh, Hadith, to Takhassus fil Hadees under qualified scholars.",
                  "inLanguage": "en-US"
                },
                {
                  "@type": "EducationalOrganization",
                  "name": "*الإتقان للدراسات الإسلامية والعربية* Al-Itqan Institute for Islamic & Arabic Studies",
                  "description": "Complete Islamic education from Noorani Qaida to Takhassus fil Hadees",
                  "url": "https://itqaninstitute.com/courses",
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
                    "@id": "https://itqaninstitute.com/#organization"
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JKKWV7MKJ5" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JKKWV7MKJ5');
        `}</Script>
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
