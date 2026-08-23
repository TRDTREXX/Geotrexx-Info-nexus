import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | GEOTREXX',
  description: 'How GEOTREXX Media Group handles and protects your data.',
}

export default function PrivacyPolicy() {
  return (
    <main className="w-full bg-white dark:bg-[#0a0b10] min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b-2 border-gray-100 dark:border-gray-900 pb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">
            Last Updated: August 2026
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-serif space-y-8">
          
          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">1. Information We Collect</h2>
            <p>
              GEOTREXX MEDIA GROUP ("we," "our," or "us") is committed to protecting your privacy. When you visit our website, we may collect certain information automatically, including your IP address, browser type, operating system, and browsing behavior. If you subscribe to our newsletters or contact us, we may collect personal information such as your name and email address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">2. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies allow us to remember your preferences, analyze site traffic, and serve relevant advertisements. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">3. Third-Party Advertising and Analytics</h2>
            <p>
              We partner with third-party vendors, including Google AdSense, to display advertisements on our site. These vendors may use personalized advertising cookies to serve ads based on your prior visits to our website or other websites on the internet. We also utilize analytics tools to measure audience engagement and improve our editorial content. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">4. Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact our editorial team via our official contact channels.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
           <Link href="/" className="inline-block bg-[#dc143c] text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-red-800 transition-colors shadow-sm">
             Return Home
           </Link>
        </div>
      </div>
    </main>
  )
}