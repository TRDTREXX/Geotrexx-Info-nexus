import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'GEOTREXX | Info Nexus',
  description: 'Premium digital destination for global news, sports analytics, and deep editorial coverage.',
  themeColor: '#C8102E',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6716191654210557"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased selection:bg-[#C8102E] selection:text-white flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}