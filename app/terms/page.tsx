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
          <strong>Effective Date:</strong> January 23, 2025<br />
          <strong>Last Updated:</strong> January 23, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Rubbish App, a waste classification service operated as a sole proprietorship.
              By accessing or using our service, you agree to be bound by these Terms and Conditions
              ("Terms"). If you do not agree to these Terms, do not use the service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              These Terms constitute a legally binding agreement between you and Rubbish App. Your use
              of the service signifies your acceptance of these Terms and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              Rubbish App is a web-based service that uses artificial intelligence to classify waste
              items from images captured by users. The service provides recommendations on how to
              properly dispose of, recycle, or reuse waste materials. The service is provided "as is"
              and classifications should be considered as recommendations, not absolute determinations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Acceptable Use Policy</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.1 Permitted Use</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may use Rubbish App only for its intended purpose: to classify waste and recyclable
              materials and receive disposal recommendations. You agree to use the service in compliance
              with all applicable laws and regulations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.2 Prohibited Content</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>You are strictly prohibited from uploading images containing:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Non-Waste Items:</strong> Images that do not contain waste, trash, recyclable,
                or reusable materials. The service is exclusively for waste classification.
              </li>
              <li>
                <strong>Illegal Content:</strong> Images depicting illegal activities, illegal substances,
                weapons, explosives, or any content that violates criminal laws.
              </li>
              <li>
                <strong>Personally Identifiable Information (PII):</strong> Images containing personal
                documents, ID cards, passports, credit cards, medical records, financial statements,
                or any documents with names, addresses, social security numbers, or other identifying
                information. You understand that all images are stored in our database and processed
                by third-party AI providers.
              </li>
              <li>
                <strong>Sensitive or Private Content:</strong> Images containing nudity, intimate content,
                or private personal moments.
              </li>
              <li>
                <strong>Confidential or Proprietary Information:</strong> Trade secrets, confidential
                business documents, or proprietary information belonging to you or others.
              </li>
              <li>
                <strong>Harmful or Dangerous Content:</strong> Images depicting self-harm, violence,
                gore, or content that could be harmful to viewers.
              </li>
              <li>
                <strong>Harassment or Hate Content:</strong> Images intended to harass, threaten, bully,
                or promote hate speech or discrimination.
              </li>
              <li>
                <strong>Spam or Malicious Content:</strong> Repeated uploads of the same content, attempts
                to manipulate the service, or content containing malware or viruses.
              </li>
              <li>
                <strong>Copyright Infringement:</strong> Images that infringe upon the intellectual
                property rights of others, unless you own or have permission to use such content.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">3.3 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to circumvent security measures or access controls</li>
              <li>Reverse engineer, decompile, or disassemble the service</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Collect or harvest user data from the service</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Upload viruses, malware, or other harmful code</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <p className="text-red-800 font-medium">
                <strong>Warning:</strong> Violation of these prohibited content or activity provisions
                may result in immediate termination of your access to the service, deletion of your
                content, and potential legal action. We reserve the right to report illegal content
                to law enforcement authorities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.1 Transfer of Rights in Uploaded Images</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>By uploading any image to Rubbish App, you irrevocably transfer and assign all
              intellectual property rights, including but not limited to copyright, in that image to
              Rubbish App.</strong> This means:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Complete Transfer:</strong> You transfer all ownership rights, title, and interest
                in the uploaded images to Rubbish App, including the right to reproduce, distribute,
                display, modify, and create derivative works.
              </li>
              <li>
                <strong>No Residual Rights:</strong> You retain no intellectual property rights in images
                once uploaded. The images become the sole property of Rubbish App.
              </li>
              <li>
                <strong>Global and Perpetual:</strong> This transfer is worldwide, royalty-free, sublicensable,
                transferable, and perpetual.
              </li>
              <li>
                <strong>Unrestricted Use:</strong> Rubbish App may use, modify, reproduce, distribute,
                display, publish, or license your images for any purpose, including but not limited to
                service improvement, AI model training, research, marketing, and commercial purposes.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.2 AI-Generated Content Ownership</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>All content generated by artificial intelligence through analysis of your images,
              including but not limited to classifications, recommendations, descriptions, and any
              derived data, is the exclusive property of Rubbish App.</strong> Specifically:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>No User Ownership:</strong> You have no ownership, copyright, or intellectual
                property rights in any AI-generated classifications, recommendations, analyses, or
                outputs produced by the service.
              </li>
              <li>
                <strong>Rubbish App Ownership:</strong> All AI-generated content, data, and insights
                are owned exclusively by Rubbish App and may be used for any purpose.
              </li>
              <li>
                <strong>Compilation Rights:</strong> Rubbish App owns all rights to databases, compilations,
                and aggregations of user data and AI-generated content.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">4.3 Service Intellectual Property</h3>
            <p className="text-gray-700 leading-relaxed">
              The Rubbish App service, including its design, features, source code, algorithms, trademarks,
              and all related intellectual property, is owned by Rubbish App and protected by copyright,
              trademark, and other intellectual property laws. Nothing in these Terms grants you any
              rights in our service technology or intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. User Representations and Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By using the service and uploading images, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Ownership or Permission:</strong> You own all rights to the images you upload, or
                you have obtained all necessary permissions, licenses, consents, and releases to upload
                the images and transfer rights to Rubbish App.
              </li>
              <li>
                <strong>No Infringement:</strong> Your uploaded images do not infringe any third-party
                intellectual property rights, privacy rights, or other legal rights.
              </li>
              <li>
                <strong>Compliance:</strong> You will comply with all applicable laws and these Terms.
              </li>
              <li>
                <strong>Accuracy:</strong> All information you provide is accurate and complete.
              </li>
              <li>
                <strong>Legal Capacity:</strong> You have the legal capacity to enter into these Terms
                and are at least 13 years of age.
              </li>
              <li>
                <strong>Acceptable Content:</strong> Your images contain only waste materials and do not
                contain any prohibited content as defined in Section 3.2.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Rubbish App uses third-party AI services (including xAI and other LLM providers) to analyze
              your images. By using our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You acknowledge that your images will be transmitted to and processed by these third parties</li>
              <li>You agree to the privacy policies and terms of service of these third-party providers</li>
              <li>
                <strong>You understand it is your responsibility to ensure you do not upload content
                you do not want shared with these AI providers</strong>
              </li>
              <li>Rubbish App is not responsible for the actions, policies, or practices of third-party services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              See our <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link> for
              more information about third-party data sharing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Rubbish App, its operators, affiliates,
              and service providers from and against any and all claims, liabilities, damages, losses,
              costs, expenses, or fees (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Your use or misuse of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
              <li>Your uploaded images or content</li>
              <li>Any claim that your images infringe upon third-party rights</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Any warranty regarding the accuracy, reliability, or completeness of waste classifications</li>
              <li>Any warranty that the service will be uninterrupted, secure, or error-free</li>
              <li>Any warranty regarding the results obtained from using the service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Waste classification recommendations are AI-generated suggestions only and should
              not be considered professional advice.</strong> You are responsible for independently
              verifying disposal methods and complying with local waste disposal regulations. Rubbish
              App makes no guarantees about the accuracy of classifications or recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, RUBBISH APP SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
              LIMITED TO:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from unauthorized access to your data</li>
              <li>Damages from reliance on waste classifications or recommendations</li>
              <li>Damages from third-party conduct or content</li>
              <li>Damages from errors, mistakes, or inaccuracies in the service</li>
              <li>Damages from service interruptions or unavailability</li>
              <li>Fines or penalties resulting from improper waste disposal</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>IN NO EVENT SHALL RUBBISH APP'S TOTAL AGGREGATE LIABILITY EXCEED THE AMOUNT YOU
              PAID TO USE THE SERVICE (WHICH IS CURRENTLY $0 AS THE SERVICE IS FREE).</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Some jurisdictions do not allow the exclusion of certain warranties or limitation of
              liability for incidental or consequential damages. In such jurisdictions, our liability
              will be limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">10.1 Termination by You</h3>
            <p className="text-gray-700 leading-relaxed">
              You may stop using the service at any time. However, uploaded images and data will remain
              in our database as described in our Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">10.2 Termination by Us</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to the service at any time,
              without notice, for any reason, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>Violation of these Terms</li>
              <li>Uploading prohibited content</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Extended periods of inactivity</li>
              <li>Technical or security reasons</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">10.3 Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the service ceases immediately. However, provisions
              regarding intellectual property, indemnification, disclaimers, and limitations of liability
              survive termination. We may retain your data as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Modifications to Service and Terms</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">11.1 Service Changes</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the service (or any part thereof)
              at any time without notice. We shall not be liable to you or any third party for any
              modification, suspension, or discontinuation of the service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">11.2 Terms Changes</h3>
            <p className="text-gray-700 leading-relaxed">
              We may revise these Terms at any time by updating this page. The "Last Updated" date at
              the top will indicate when changes were made. Your continued use of the service after
              changes constitutes acceptance of the revised Terms. If you do not agree to the new Terms,
              you must stop using the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">12.1 Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have a dispute with Rubbish App, you agree to first contact us and attempt to
              resolve the dispute informally before pursuing legal action.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">12.2 Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United
              States and the state in which the sole proprietor resides, without regard to conflict of
              law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">12.3 Jurisdiction</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree that any legal action or proceeding arising out of or relating to these Terms
              or the service shall be brought exclusively in the federal or state courts located in the
              jurisdiction where the sole proprietor resides, and you consent to personal jurisdiction
              and venue in such courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. General Provisions</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.1 Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms and our Privacy Policy constitute the entire agreement between you and Rubbish
              App regarding the service and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.2 Severability</h3>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining
              provisions shall remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.3 Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              No waiver of any term shall be deemed a further or continuing waiver of such term or any
              other term. Our failure to enforce any right or provision shall not constitute a waiver
              of that right or provision.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.4 Assignment</h3>
            <p className="text-gray-700 leading-relaxed">
              You may not assign or transfer these Terms or your rights hereunder without our prior
              written consent. We may assign these Terms at any time without notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">13.5 Force Majeure</h3>
            <p className="text-gray-700 leading-relaxed">
              Rubbish App shall not be liable for any failure to perform due to circumstances beyond
              our reasonable control, including acts of God, war, terrorism, riot, natural disasters,
              or internet service failures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Rubbish App</strong><br />
                Sole Proprietorship<br />
                Email: <a href="mailto:legal@rubbish-app.com" className="text-blue-600 hover:text-blue-800">legal@rubbish-app.com</a>
              </p>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-800 font-medium">
                <strong>By using Rubbish App, you acknowledge that you have read, understood, and agree
                to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree,
                you must not use the service.</strong>
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
