export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  // 🚀 MAINTENANCE MODE SWITCH: Change to 'false' when you want to go live again.
  const isMaintenanceMode = true; 

  if (isMaintenanceMode) {
    return (
      <html lang="en">
        <body className="bg-[#0a0b10] text-white flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-[#C8102E] mb-6 uppercase tracking-widest">
              GEOTREXX
            </h1>
            <h2 className="text-2xl text-white font-bold mb-4 uppercase tracking-widest">
              Newsroom Upgrade in Progress
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We are currently restructuring our editorial categories to bring you a cleaner, faster news experience. We will be back online shortly.
            </p>
          </div>
        </body>
      </html>
    )
  }

  // ... the rest of your normal layout code stays exactly the same down here ...
  return (
    <html lang="en">
       {/* Your normal website code */}
    </html>
  )
}