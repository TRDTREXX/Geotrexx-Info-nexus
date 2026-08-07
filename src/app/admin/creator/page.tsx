'use client'
import { useRef, useState, useEffect } from 'react'

export default function CreatorAdmin() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headline, setHeadline] = useState('BREAKING NEWS')
  const [summary, setSummary] = useState('Enter your subtext or summary here...')
  const [category, setCategory] = useState('Politics')
  
  // Brand color mapping
  const categoryColors: Record<string, string> = {
    Politics: '#C8102E',
    Sports: '#1a1b23',
    Entertainment: '#d97706',
    'Codes of the Day': '#16a34a'
  }

  useEffect(() => {
    drawCanvas()
  }, [headline, summary, category])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup Canvas (1200x630 for standard social sharing)
    canvas.width = 1200
    canvas.height = 630

    // 1. Draw Background
    ctx.fillStyle = '#0a0b10' // Rich dark base
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Draw Category Brand Accent (Top Bar)
    ctx.fillStyle = categoryColors[category] || '#C8102E'
    ctx.fillRect(0, 0, canvas.width, 24)

    // 3. Draw GEOTREXX Branding
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 48px sans-serif'
    ctx.fillText('GEO', 80, 120)
    ctx.fillStyle = '#C8102E'
    ctx.fillText('TREXX', 185, 120)

    // 4. Draw Category Badge
    ctx.fillStyle = categoryColors[category] || '#C8102E'
    ctx.fillRect(80, 160, 200, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(category.toUpperCase(), 100, 188)

    // 5. Draw Headline (With basic text wrapping)
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 72px sans-serif'
    wrapText(ctx, headline.toUpperCase(), 80, 320, 1040, 80)

    // 6. Draw Summary
    ctx.fillStyle = '#9ca3af' // gray-400
    ctx.font = '400 32px serif'
    wrapText(ctx, summary, 80, 500, 1040, 40)
  }

  // Utility for canvas text wrapping
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ')
    let line = ''
    let currentY = y

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `GEOTREXX-${category}-${Date.now()}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-geo-dark p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white mb-6">Creator Studio</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category / Brand Color</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                {Object.keys(categoryColors).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Headline</label>
              <textarea 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)}
                rows={3}
                className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Summary Subtext</label>
              <textarea 
                value={summary} 
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button 
              onClick={downloadImage}
              className="w-full bg-geo-red text-white font-black uppercase tracking-widest py-4 rounded-lg hover:bg-red-800 transition-colors shadow-lg"
            >
              Download HD Graphic
            </button>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center bg-gray-200 dark:bg-[#050508] p-8 rounded-2xl border border-gray-300 dark:border-gray-800">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">Live Render Preview (1200x630)</p>
          <canvas 
            ref={canvasRef} 
            className="w-full max-w-[800px] h-auto shadow-2xl rounded"
          />
        </div>

      </div>
    </div>
  )
}