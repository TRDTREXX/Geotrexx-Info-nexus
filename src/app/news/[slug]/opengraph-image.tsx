import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'GEOTREXX Article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: { slug: string } }) {
  // We format the slug directly into a capitalized title for blazing-fast Edge generation
  const title = params.slug.replace(/-/g, ' ').toUpperCase()

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        backgroundColor: '#0a0b10', padding: '80px', justifyContent: 'space-between',
        borderTop: '20px solid #C8102E'
      }}>
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#C8102E', letterSpacing: '0.1em' }}>
          GEOTREXX <span style={{ color: '#fff', marginLeft: '10px' }}>NEXUS</span>
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          WWW.GEOTREXX.COM
        </div>
      </div>
    ),
    { ...size }
  )
}