import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://alnooronlineacademy.com"),
  title: "World's First Complete Islamic Knowledge Web App",
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
  openGraph: {
    type: "website",
    url: "https://alnooronlineacademy.com/",
    title: "World's First Complete Islamic Knowledge Web App",
    description: "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization. The academy offers an authentic and continuous learning journey starting from Noorani Qaida, progressing through Qur'an Nazra, Tajweed, Hifz-ul-Qur'an, Tarjuma & Tafseer, Balaghat, Ilm-us-Sarf, Ilm-un-Nahw, Spoken & Advanced Arabic, and advancing into Fiqh, Usool-ul-Fiqh, Hadith sciences, culminating in Takhassus fil Hadees.",
    locale: "en_US",
    alternateLocale: ["ar_SA", "ur_PK"],
    siteName: "Al-NOOR Online Quran & Hadees Academy",
    images: [
      {
        url: "https://i.ibb.co/V0pRN6XT/logo.png",
        width: 1200,
        height: 630,
        alt: "Al-NOOR Online Quran & Hadees Academy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "World's First Complete Islamic Knowledge Web App",
    description: "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization.",
    images: ["https://i.ibb.co/V0pRN6XT/logo.png"]
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://alnooronlineacademy.com/"
  }
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
        <link rel="canonical" href="https://alnooronlineacademy.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Al-NOOR Online Quran & Hadees Academy",
              "url": "https://alnooronlineacademy.com",
              "description": "Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing complete and structured Islamic knowledge from the foundational level to advanced scholarly specialization. The academy offers an authentic and continuous learning journey starting from Noorani Qaida, progressing through Qur'an Nazra, Tajweed, Hifz-ul-Qur'an, Tarjuma & Tafseer, Balaghat, Ilm-us-Sarf, Ilm-un-Nahw, Spoken & Advanced Arabic, and advancing into Fiqh, Usool-ul-Fiqh, Hadith sciences, culminating in Takhassus fil Hadees.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "brand": {
                "@type": "Brand",
                "name": "Al-NOOR Online Quran & Hadees Academy"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Alnoor-academy",
                "url": "https://alnooronlineacademy.com"
              },
              "logo": "https://alnooronlineacademy.com/logo.png",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
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
