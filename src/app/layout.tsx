import './globals.css';
import SiteNavigation from '../components/SiteNavigation';
import Footer from '../components/Footer';
import { ThemeProvider } from '../components/ThemeProvider';
import { createClient } from '@sanity/client';

export const metadata = {
  title: 'GEOTREXX | Unbiased, Accurate and Authoritative',
  description: 'GEOTREXX Media Group - Premium news, politics, business, and sports.',
};

const client = createClient({
  projectId: 'x0tpoga9',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-01',
});

export const revalidate = 10;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let liveHeadlines = "GEOTREXX: UNBIASED, ACCURATE AND AUTHORITATIVE • ";
  try {
    const titles = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...5].title`);
    if (titles && titles.length > 0) {
      liveHeadlines = titles.join(" • ") + " • GEOTREXX: THE TRUTH FIRST • ";
    }
  } catch (e) {
    console.error("Ticker fetch error", e);
  }

  return (
    <html lang="en" suppressHydrationWarning> 
      <head>
        {/* YOUR EXACT ADSENSE PUBLISHER SCRIPT */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557" crossOrigin="anonymous"></script>
      </head>
      <body className="bg-white dark:bg-[#0a0b10] text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteNavigation tickerText={liveHeadlines} />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}