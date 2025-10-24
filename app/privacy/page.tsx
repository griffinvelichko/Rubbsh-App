import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Rubbsh App',
  description: 'Privacy Policy for Rubbsh App waste classification service'
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
          <strong>Effective Date:</strong> October 23, 2025<br />
          <strong>Last Updated:</strong> October 23, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Rubbsh App. We are a sole-proprietorship ("We", "Us", "Our") operating the waste
              classification service. This Privacy Policy explains how we collect, use, store and share your
              data when you use the Service. By using the Service, you consent to this Policy and our Terms
              & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Definitions</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              "Service", "You", "We", "Content" as defined in the Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              "AI-Providers" means third-party AI/LLM services to which we send your images for analysis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.1 Images & Metadata</h3>
            <p className="text-gray-700 leading-relaxed">
              We collect all images you capture or upload, plus metadata (file size, format, timestamp) and
              associated classification results.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.2 Anonymous User Data</h3>
            <p className="text-gray-700 leading-relaxed">
              We generate anonymous user IDs, session data (cookies), timestamps, activity logs to support
              the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.3 Technical Data</h3>
            <p className="text-gray-700 leading-relaxed">
              We may collect browser type, device type, operating system, IP address and approximate location,
              performance logs and error reports.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your data to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide the classification service and recommendations.</li>
              <li>Improve our AI models and Service accuracy.</li>
              <li>Maintain, secure and enhance the Service.</li>
              <li>Analyse usage patterns and performance.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Storage, Ownership & Security</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.1 Ownership of Data</h3>
            <p className="text-gray-700 leading-relaxed">
              When you upload images, those uploads become our data. You grant us all rights to use, reproduce,
              store, analyse, and derive output from those images. All AI outputs are exclusively our property.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.2 Storage Location & Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We store images and data in our cloud database. We retain this data indefinitely unless you
              request deletion (see section 8).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.3 Security Measures</h3>
            <p className="text-gray-700 leading-relaxed">
              We use industry-standard security (e.g., encrypted HTTPS, secure cloud storage, access controls)
              but no system is 100% secure; you acknowledge residual risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Third-Party Data Sharing</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.1 AI-Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              All uploaded images are sent to AI-Providers (e.g., xAI and others) for processing. These
              providers may store or use the images as per their own policies. You are responsible for not
              uploading any images you would not want shared.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.2 Other Service Providers</h3>
            <p className="text-gray-700 leading-relaxed">
              We may share data with our infrastructure providers (database, hosting, analytics) subject to
              confidentiality obligations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.3 Legal Disclosures</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your data when required by law, to protect our rights, users, or public safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies & Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies to maintain anonymous sessions, manage login state, track usage and app performance.
              These may persist for a fixed period (for example 7 days). You may clear cookies but that will
              create a new anonymous session; previously uploaded images remain stored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Because you are anonymous, we do not by default collect identifiable personal data.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you upload content with identifying information, that data may become part of our stored dataset.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Data deletion requests:</strong> We do not provide automated self-service deletion. You
              may contact us at <a href="mailto:rubbshapp@gmail.com" className="text-blue-600 hover:text-blue-800">rubbshapp@gmail.com</a> to
              request deletion; we will review but cannot guarantee full removal because of model-training and
              legal obligations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Managing cookies:</strong> You may clear or block cookies. That ends your current session
              but does not delete previously uploaded images.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service is not intended for users under 13 years old. We do not knowingly collect data from
              children under 13. If we become aware of such data, we will endeavour to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be stored or processed in jurisdictions outside your country of residence. These
              jurisdictions may have different data protection laws. By using the Service you consent to such
              transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy at any time. We will post the updated version with the new
              "Last Updated" date. Continued use of the Service after updates constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Rubbsh App</strong><br />
                Sole Proprietorship<br />
                Email: <a href="mailto:rubbshapp@gmail.com" className="text-blue-600 hover:text-blue-800">rubbshapp@gmail.com</a>
              </p>
            </div>
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
