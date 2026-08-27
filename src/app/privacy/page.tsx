import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | GEOTREXX',
  description: 'Privacy Policy and data collection practices for GEOTREXX Media Group.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-300">
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-black dark:text-white uppercase tracking-tighter">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 font-medium tracking-widest uppercase mb-12">
        Last Updated: August 2026
      </p>
      
      <div className="space-y-10 text-sm md:text-base leading-relaxed font-medium">
        
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#C8102E] uppercase tracking-widest">1. Introduction</h2>
          <p>
            Welcome to GEOTREXX Media Group. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (geotrexx.com) and use our digital journalism services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#C8102E] uppercase tracking-widest">2. Information We Collect</h2>
          <p className="mb-4">We may collect, use, and store different kinds of personal data about you, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity & Contact Data:</strong> Name and email address if you subscribe to our newsletters or contact us directly.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, and operating system.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, articles, and services to help us improve our journalism.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#C8102E] uppercase tracking-widest">3. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-[#C8102E] uppercase tracking-widest">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact our desk at:
          </p>
          <div className="mt-4 p-6 bg-gray-50 dark:bg-[#1a1b23] border-l-4 border-[#C8102E]">
            <p><strong>GEOTREXX Media Group</strong></p>
            <p>Accra, Greater Accra Region, Ghana</p>
            <p>Email: <a href="mailto:INFO@GEOTREXX.COM" className="text-[#C8102E] hover:underline">INFO@GEOTREXX.COM</a></p>
            <p>Phone: 0535531860</p>
          </div>
        </section>

      </div>
    </div>
  );
}