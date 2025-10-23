import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Rubbish App',
  description: 'Privacy Policy for Rubbish App waste classification service'
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> January 23, 2025<br />
          <strong>Last Updated:</strong> January 23, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Rubbish App, operated as a sole proprietorship. This Privacy Policy explains
              how we collect, use, store, and share your information when you use our waste classification
              service. By using Rubbish App, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.1 Images</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect and store all images you capture or upload through the Rubbish App. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Photos taken using your device camera through our app</li>
              <li>Image metadata (file size, format, timestamp)</li>
              <li>Associated waste classification results</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.2 User Identification</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically create anonymous user accounts to enable our service. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Anonymous user IDs stored in browser cookies</li>
              <li>Session data for authentication</li>
              <li>Usage timestamps and activity logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.3 Technical Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We may collect technical information including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>IP address and general location data</li>
              <li>App performance and error logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To provide waste classification and recycling recommendations</li>
              <li>To improve our AI models and service accuracy</li>
              <li>To maintain and improve app functionality</li>
              <li>To analyze usage patterns and app performance</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Storage</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.1 Database Storage</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>All images taken using the Rubbish App are permanently stored in our database.</strong>
              We use Supabase, a secure cloud database provider, to store:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Original images you capture or upload</li>
              <li>Image metadata and classification results</li>
              <li>User session and activity data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.2 Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We retain your images and associated data indefinitely for service improvement and
              research purposes. Images are organized by anonymous user ID in our storage system.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.3 Security Measures</h3>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure cloud storage with access controls</li>
              <li>Row-level security policies to isolate user data</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Third-Party Data Sharing</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.1 AI Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Important:</strong> All images you upload are sent to third-party artificial intelligence
              providers for analysis and classification. Currently, we use:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>xAI (X.AI)</strong> - for image analysis and waste classification using their Grok AI models</li>
              <li>Other large language model (LLM) providers as we integrate additional services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3 mb-3">
              These providers may:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Process and analyze your images on their servers</li>
              <li>Use your images to improve their AI models (subject to their privacy policies)</li>
              <li>Store your images temporarily or permanently according to their data retention policies</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-yellow-800 font-medium">
                <strong>User Responsibility:</strong> It is your responsibility to avoid uploading images
                that you do not want shared with these third-party AI providers. Do not upload images containing:
              </p>
              <ul className="list-disc pl-6 text-yellow-800 mt-2 space-y-1">
                <li>Personal identifying information (PII)</li>
                <li>Sensitive or confidential documents</li>
                <li>Private or intimate content</li>
                <li>Proprietary or copyrighted material you do not own</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.2 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed">
              We share data with the following service providers who help us operate our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Supabase</strong> - database and file storage hosting</li>
              <li><strong>Vercel</strong> (if applicable) - web hosting and deployment</li>
              <li>Analytics providers for app performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.3 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order, or legal process, or
              to protect the rights, property, or safety of Rubbish App, our users, or others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use browser cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Maintain your anonymous user session</li>
              <li>Remember your authentication status</li>
              <li>Provide a seamless user experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our cookies typically persist for 7 days and are essential for the app to function.
              By using Rubbish App, you consent to the use of these cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Data Ownership and Usage Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By using Rubbish App, you understand and agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All images uploaded become part of our dataset and are owned by Rubbish App</li>
              <li>All AI-generated classifications and recommendations are owned by Rubbish App</li>
              <li>We have the right to use your images for service improvement, research, and model training</li>
              <li>We may use anonymized or aggregated data for any purpose</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              See our <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">Terms and Conditions</Link> for
              more details on intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">8.1 Anonymous Users</h3>
            <p className="text-gray-700 leading-relaxed">
              Since we use anonymous authentication, we do not collect personally identifiable information
              by default. However, any images you upload may contain such information if you choose to
              include it.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">8.2 Data Deletion</h3>
            <p className="text-gray-700 leading-relaxed">
              Currently, we do not offer self-service data deletion. If you wish to request deletion of
              your data, you may contact us at the information provided in Section 12. We will review
              such requests on a case-by-case basis, but we cannot guarantee deletion as data may be
              retained for legitimate business purposes or legal requirements.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">8.3 Cookie Management</h3>
            <p className="text-gray-700 leading-relaxed">
              You can clear your browser cookies at any time, which will create a new anonymous user
              session. However, your previously uploaded images will remain in our database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Rubbish App is not intended for use by children under the age of 13. We do not knowingly
              collect personal information from children under 13. If we become aware that we have
              collected such information, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country
              of residence. These countries may have data protection laws that differ from those of your
              jurisdiction. By using Rubbish App, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are
              advised to review this Privacy Policy periodically for any changes. Continued use of the
              service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Rubbish App</strong><br />
                Sole Proprietorship<br />
                Email: <a href="mailto:privacy@rubbish-app.com" className="text-blue-600 hover:text-blue-800">privacy@rubbish-app.com</a>
              </p>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm italic">
              By using Rubbish App, you acknowledge that you have read, understood, and agree to be
              bound by this Privacy Policy.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/terms"
              className="text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
