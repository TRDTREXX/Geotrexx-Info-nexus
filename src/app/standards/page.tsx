import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Guidelines & Standards | GEOTREXX',
  description: 'Read the foundational journalism charter, fact-checking protocols, and corrections policy of GEOTREXX Media Group.',
};

export default function EditorialStandardsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 font-sans">
      <header className="border-b-2 border-slate-900 pb-6 mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b0000]">Governance & Ethics</span>
        <h1 className="font-headline text-4xl font-black text-slate-950 mt-2">Editorial Guidelines & Code of Conduct</h1>
        <p className="text-sm font-mono text-slate-500 mt-2">GEOTREXX Media Group Institutional Charter • Revised August 2026</p>
      </header>

      <div className="prose prose-lg max-w-none font-serif text-slate-800 space-y-6">
        <h2 className="font-headline text-2xl font-bold text-slate-900">1. Editorial Independence</h2>
        <p>
          GEOTREXX operates under strict editorial independence. Our correspondents and specialized bureau editors do not accept corporate honoraria, subsidized travel from audited entities, or personal financial stakes in covered commodities or securities.
        </p>

        <h2 className="font-headline text-2xl font-bold text-slate-900">2. Primary Source Verification & Fact-Checking</h2>
        <p>
          Every report published across our global channels undergoes primary-source review by certified topic specialists prior to publication. Scientific and macroeconomic data are reconciled directly with primary statistical bulletins from recognized institutional archives.
        </p>

        <h2 className="font-headline text-2xl font-bold text-slate-900">3. Corrections Desk</h2>
        <p>
          When an error of fact or misstatement occurs, GEOTREXX publishes a clear correction at the top of the article within two hours of confirmation. Submit correction requests directly to our editorial board at <span className="font-mono text-[#8b0000]">corrections@geotrexx.media</span>.
        </p>
      </div>
    </main>
  );
}