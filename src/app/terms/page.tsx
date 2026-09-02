import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | GEOTREXX',
  description: 'Terms of service for utilizing the GEOTREXX platform.',
}

export default function TermsAndConditions() {
  return (
    <main className="w-full bg-[#faf9f6] text-[#121826] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b-2 border-gray-900 pb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Terms & Conditions
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold font-mono">
            Last Updated: August 2026
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-800 font-serif space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-4 font-sans text-sm border-b border-gray-300 pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing GEOTREXX, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service. These terms apply to all visitors, users, and others who access our digital media platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-4 font-sans text-sm border-b border-gray-300 pb-2">2. Intellectual Property</h2>
            <p>
              All editorial content, original graphics, digital media assets, and technical architecture on this website are the exclusive property of GEOTREXX MEDIA GROUP. You may not reproduce, distribute, or create derivative works from our original content without explicit, written permission from our editorial board.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-4 font-sans text-sm border-b border-gray-300 pb-2">3. User Conduct</h2>
            <p>
              You agree to use the site only for lawful purposes. You are strictly prohibited from utilizing the site to transmit any malicious software, engage in unauthorized scraping of our news databases, or attempt to compromise our content management systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-4 font-sans text-sm border-b border-gray-300 pb-2">4. Editorial Disclaimer</h2>
            <p>
              The news, sports analytics, political editorials, and general information provided on GEOTREXX are for informational purposes only. While our team strives for relentless accuracy, we make no warranties regarding the completeness or reliability of the information. Opinion columns represent the views of the individual authors and do not necessarily reflect the official stance of GEOTREXX MEDIA GROUP.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-4 font-sans text-sm border-b border-gray-300 pb-2">5. External Links</h2>
            <p>
              Our platform may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center border-t border-gray-300 pt-8">
           <Link href="/" className="inline-block bg-[#121826] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-[#C8102E] transition-colors shadow-sm text-xs font-mono">
             Return Home
           </Link>
        </div>
      </div>
    </main>
  )
}