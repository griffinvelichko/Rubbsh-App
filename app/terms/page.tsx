import Link from 'next/link'

export const metadata = {
  title: 'Terms and Conditions - Rubbish App',
  description: 'Terms and Conditions for using Rubbish App waste classification service'
}

export default function TermsAndConditions() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> October 23, 2025<br />
          <strong>Last Updated:</strong> October 23, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Rubbsh App, a waste classification service operated as a sole proprietorship.
              By accessing or using our service, you agree to be bound by these Terms and Conditions
              ("Terms"). If you do not agree to these Terms, do not use the service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              These Terms constitute a legally binding agreement between you and Rubbsh App. Your use
              of the service signifies your acceptance of these Terms and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Definitions</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For the purposes of these Terms:
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>"Rubbsh App," "We," "Us," and "Our"</strong> refer to the sole proprietorship operating
              under the name Rubbsh App, including its owner, affiliates, agents, contractors, and service providers.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>"You," "Your," and "User"</strong> refer to the individual or entity accessing or using
              the Rubbsh App service.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>"Service"</strong> refers to the Rubbsh App website, web application, and any related
              services, software, content, or functionality provided by or on behalf of Rubbsh App.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>"Content"</strong> includes any images, text, data, or other materials uploaded, submitted,
              or generated through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Rubbsh App is a web-based service that uses artificial intelligence to classify waste items from
              images captured by users. The service provides recommendations on how to properly dispose of, recycle,
              or reuse materials.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The service is provided "as is", and classifications should be viewed as recommendations only, not
              definitive guidance. You are responsible for verifying appropriate disposal methods according to your
              local regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Acceptable Use Policy</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.1 Permitted Use</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may use Rubbsh App solely for its intended purpose: identifying and classifying waste or
              recyclable materials and receiving disposal recommendations. You agree to comply with all
              applicable laws and regulations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.2 Prohibited Content</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You are strictly prohibited from uploading images that contain:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Non-waste items:</strong> Images that do not depict waste, trash, recyclables,
                or reusable materials.
              </li>
              <li>
                <strong>Illegal content:</strong> Images depicting illegal activity, controlled substances,
                weapons, explosives, or materials violating criminal laws.
              </li>
              <li>
                <strong>Personally Identifiable Information (PII):</strong> Any documents or materials showing
                names, addresses, ID cards, financial information, medical data, or other personal identifiers.
              </li>
              <li>
                <strong>Sensitive or private content:</strong> Images containing nudity, intimate material,
                or private personal moments.
              </li>
              <li>
                <strong>Confidential or proprietary information:</strong> Business secrets, private documents,
                or intellectual property belonging to others.
              </li>
              <li>
                <strong>Harmful or violent content:</strong> Content showing self-harm, gore, or physical violence.
              </li>
              <li>
                <strong>Harassment or hate content:</strong> Content promoting discrimination, harassment,
                or hate speech.
              </li>
              <li>
                <strong>Spam or malicious uploads:</strong> Repetitive, manipulative, or virus-infected content.
              </li>
              <li>
                <strong>Copyright violations:</strong> Material you do not own or lack permission to use.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.3 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the service for unlawful purposes.</li>
              <li>Attempt to circumvent or disable security features.</li>
              <li>Reverse engineer or disassemble any part of the service.</li>
              <li>Use automated scripts, bots, or scrapers without authorization.</li>
              <li>Interfere with service functionality or servers.</li>
              <li>Collect data or impersonate other users.</li>
              <li>Upload malware or harmful code.</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <p className="text-red-800 font-medium">
                Violation of these terms may result in immediate suspension or permanent termination of your
                account and possible legal action. Illegal content may be reported to authorities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.1 Uploaded Images</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              By uploading any image, you grant Rubbsh App an irrevocable, worldwide, royalty-free, perpetual,
              sublicensable, and transferable license to use, reproduce, modify, and distribute the image for
              any purpose related to service improvement, AI training, research, or marketing.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> This clause grants broad usage rights while maintaining your underlying
                ownership. A full "transfer" of ownership is not recommended for user-generated content under
                copyright law.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of your uploaded content but grant Rubbsh App full usage rights as described
              above. You waive any claims to compensation or attribution related to such use.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.2 AI-Generated Outputs</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              All AI-generated outputs (classifications, recommendations, or derivative data) are the exclusive
              property of Rubbsh App. You have no ownership or rights in these materials.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Rubbsh App may use such outputs for model improvement, analytics, and commercial applications.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.3 Service IP</h3>
            <p className="text-gray-700 leading-relaxed">
              All trademarks, source code, design, and algorithms of Rubbsh App remain the exclusive property
              of Rubbsh App. No rights are transferred to users through service usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. User Representations and Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You confirm that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You own or have rights to the content you upload.</li>
              <li>Your uploads comply with laws and do not infringe third-party rights.</li>
              <li>You are at least 13 years old and legally capable of agreeing to these Terms.</li>
              <li>Your submissions contain only acceptable content under Section 4.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Rubbsh App uses third-party AI providers (such as xAI or others) for image processing.
              By using the service, you agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your images may be transmitted to and processed by these providers.</li>
              <li>You are responsible for not uploading content you do not wish to share.</li>
              <li>Rubbsh App is not liable for the actions or policies of third-party services.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              See our <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link> for
              full details on data sharing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree to indemnify and hold harmless Rubbsh App, its owner, affiliates, and partners from all
              claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your use or misuse of the service</li>
              <li>Your content or conduct</li>
              <li>Any legal violations, including IP or privacy breaches</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED. RUBBSH APP DISCLAIMS
              ALL WARRANTIES INCLUDING:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>ACCURACY OR RELIABILITY OF RESULTS</li>
              <li>CONTINUOUS OR ERROR-FREE SERVICE</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              All waste classifications are AI-generated recommendations and should not be considered professional
              advice. You are solely responsible for verifying disposal requirements with your local municipality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RUBBSH APP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              OR CONSEQUENTIAL DAMAGES INCLUDING:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Loss of data, profits, or goodwill</li>
              <li>Reliance on incorrect AI recommendations</li>
              <li>Damage caused by unauthorized access or third parties</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Total aggregate liability shall not exceed the amount you paid for the service (currently $0 as the
              service is free).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">11.1 By You</h3>
            <p className="text-gray-700 leading-relaxed">
              You may stop using the service at any time. Uploaded data may be retained as described in the
              Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">11.2 By Us</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may suspend or terminate your access at any time without notice for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violating these Terms</li>
              <li>Uploading prohibited or illegal content</li>
              <li>Security or operational concerns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">11.3 Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Termination ends your access immediately but does not affect rights related to intellectual property,
              disclaimers, or limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Modifications to Service and Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may change or discontinue the service or these Terms at any time. Updates will be reflected in
              the "Last Updated" date above. Continued use after updates constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.1 Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree to contact Rubbsh App to resolve any disputes informally before pursuing legal remedies.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.2 Governing Law & Jurisdiction</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              These Terms are governed by the laws of the country and state/province where the sole proprietor
              resides, without regard to conflicts of law.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All disputes shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. General Provisions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Entire Agreement:</strong> These Terms and the Privacy Policy form the full agreement.</li>
              <li><strong>Severability:</strong> Invalid provisions do not affect the remainder.</li>
              <li><strong>Waiver:</strong> Failure to enforce a right does not waive it.</li>
              <li><strong>Assignment:</strong> You may not assign your rights without consent.</li>
              <li><strong>Force Majeure:</strong> Rubbsh App is not liable for delays due to events beyond control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">15. Contact Information</h2>
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
              href="/privacy"
              className="text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
