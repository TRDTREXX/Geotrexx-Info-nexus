import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | GEOTREXX',
  description: 'Privacy Policy and data collection practices for GEOTREXX Media Group.',
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 bg-[#faf9f6] text-[#121826] min-h-screen font-sans">
      <header className="border-b-2 border-gray-900 pb-6 mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] font-mono">Legal</span>
        <h1 className="text-4xl md:text-5xl font-black text-black mt-2 uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-4 font-mono">
          Last Updated: August 2026
        </p>
      </header>
      
      <div className="prose prose-lg max-w-none text-gray-800 font-serif space-y-8 leading-relaxed">
        
        <section>
          <h2 className="text-sm font-black mb-4 text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 font-sans">1. Introduction</h2>
          <p>
            Welcome to GEOTREXX Media Group. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (geotrexx.com) and use our digital journalism services.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black mb-4 text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 font-sans">2. Information We Collect</h2>
          <p className="mb-4">We may collect, use, and store different kinds of personal data about you, including:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#C8102E]">
            <li><strong>Identity & Contact Data:</strong> Name and email address if you subscribe to our newsletters or contact us directly.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, and operating system.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, articles, and services to help us improve our journalism.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-black mb-4 text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 font-sans">3. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black mb-4 text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 font-sans">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact our desk at:
          </p>
          <div className="mt-6 p-6 bg-white border border-gray-300 shadow-sm relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#C8102E]"></div>
            <p className="font-bold text-gray-900 font-sans tracking-wide">GEOTREXX Media Group</p>
            <p className="text-gray-600">Accra, Greater Accra Region, Ghana</p>
            <p className="text-gray-600 mt-2">Email: <a href="mailto:INFO@GEOTREXX.COM" className="text-[#C8102E] hover:underline font-mono">INFO@GEOTREXX.COM</a></p>
            <p className="text-gray-600">Phone: <span className="font-mono">0535531860</span></p>
          </div>
        </section>

      </div>
    </main>
  );
}