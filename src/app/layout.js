import "./globals.css";

export const metadata = {
  title: "GEOTREXX | Info Nexus",
  description: "Your premium digital destination for global news, sports analytics, and deep editorial coverage across Ghana and the world.",
  openGraph: {
    title: "GEOTREXX | Info Nexus",
    description: "Your premium digital destination for global news, sports analytics, and deep editorial coverage.",
    url: "https://your-domain.com", // Update this when you host the site
    siteName: "GEOTREXX",
    images: [
      {
        url: "/1000447725.png", // Uses the logo you already have in the public folder
        width: 1200,
        height: 630,
        alt: "GEOTREXX Media Group",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEOTREXX | Info Nexus",
    description: "Global news, sports analytics, and deep editorial coverage.",
    images: ["/1000447725.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50">
        {/* The 'children' prop is where your page.js content automatically gets injected */}
        {children}
      </body>
    </html>
  );
}