export const metadata = {
  title: 'GEOTREXX Newsroom | Sanity Studio',
  description: 'Backend newsroom management.',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
      {children}
    </div>
  )
}