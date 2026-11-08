import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#101820]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-[120px] sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5B21B6]">Privacy Policy</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-[#101820] sm:text-5xl">Privacy Policy</h1>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-[#475569]">
            <p>
              Koombo is committed to protecting your privacy and handling personal information responsibly. This policy explains how data is
              collected, used, stored, and protected across our marketplace, seller tools, shopping experiences, and support features.
            </p>
            <p>
              We collect information needed to support account creation, product discovery, seller onboarding, payments, buyer and seller
              communication, fraud prevention, platform security, and customer support.
            </p>
            <p>
              We use cookies and similar technologies to preserve essential login and shopping state, remember preferences, support compliance,
              and improve how the platform functions. Optional categories are disabled by default and can be managed through the Cookie Settings
              panel.
            </p>
            <p>
              We do not sell personal information to third parties. We may use trusted service providers to deliver essential infrastructure,
              support customer communication, or power product features. Any such use is subject to contractual safeguards and privacy-aware data
              processing practices.
            </p>
            <p>
              Users may manage their consent choices at any time. Necessary cookies remain active because they are required for the platform to
              function safely and correctly. Users may also contact Koombo to request additional privacy information or to ask questions about data
              handling.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
