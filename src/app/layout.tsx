import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider as ClientThemeProvider } from '@/components/context/ThemeContext';
import { GlobalStateProvider } from '@/components/context/GlobalStateContext';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mattenarle.vercel.app'),
  title: {
    default: 'Matt Enarle',
    template: '%s | Matt Enarle',
  },
  description: 'Matt Enarle — Cloud Engineer and endurance athlete. Projects, resume, and contact.',
  applicationName: 'Matt Enarle',
  alternates: {
    canonical: 'https://mattenarle.vercel.app',
  },
  openGraph: {
    title: 'Matt Enarle',
    description: 'Cloud Engineer and endurance athlete. Projects, resume, and contact.',
    url: 'https://mattenarle.vercel.app',
    siteName: 'Matt Enarle',
    images: [
      {
        url: 'https://mattenarle.vercel.app/twitter-img.png',
        alt: 'Matt Enarle',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matt Enarle',
    description: 'Cloud Engineer and endurance athlete. Projects, resume, and contact.',
    images: ['https://mattenarle.vercel.app/twitter-img.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'Matt Enarle',
    'Cloud Engineer',
    'Software Engineer',
    'Portfolio',
    'Projects',
    'Resume',
  ],
  authors: [{ name: 'Matt Enarle', url: 'https://mattenarle.vercel.app' }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value === 'light' ? 'light' : 'dark';
  const isDark = cookieTheme === 'dark';
  return (
    <html lang="en" className={`scroll-smooth ${isDark ? 'dark' : ''}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-200`}>
        <ClientThemeProvider initialTheme={cookieTheme}>
          <GlobalStateProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Analytics />
            {/* JSON-LD: Person */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'Matt Enarle',
                  url: 'https://mattenarle.vercel.app',
                  jobTitle: 'Cloud Engineer',
                  image: 'https://mattenarle.vercel.app/about/matt-grad.png',
                  sameAs: [
                    'https://github.com/mattenarle',
                    'https://www.linkedin.com/in/mattenarle',
                  ],
                  description:
                    'Cloud Engineer and endurance athlete. Projects, resume, and contact.',
                }),
              }}
            />
            {/* JSON-LD: WebSite with SearchAction (helps sitelinks search box) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'WebSite',
                  name: 'Matt Enarle',
                  url: 'https://mattenarle.vercel.app',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target:
                      'https://mattenarle.vercel.app/?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                }),
              }}
            />
          </GlobalStateProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
