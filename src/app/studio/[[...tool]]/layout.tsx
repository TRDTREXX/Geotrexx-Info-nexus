export const metadata = {
  title: 'GEOTREXX Studio',
  description: 'Sanity Studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}