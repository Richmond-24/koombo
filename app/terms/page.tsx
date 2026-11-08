import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#101820]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-[120px] sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5B21B6]">Terms & Conditions</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-[#101820] sm:text-5xl">Terms & Conditions</h1>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-[#475569]">
            <p>
              By using Koombo, you agree to participate in a marketplace where buyers and sellers connect for commerce, discovery, and local
              engagement. Koombo provides a digital platform and does not itself guarantee the quality, legality, or completeness of user-listed
              products or services.
            </p>
            <p>
              Users must provide accurate information, act responsibly, and comply with all applicable laws. Seller accounts, product listings,
              and interactions should not involve fraud, deceptive content, or unsafe conduct.
            </p>
            <p>
              Koombo may use cookies, authentication, and platform services to protect security, maintain user accounts, support checkout,
              improve onboarding, and prevent misuse. Users are responsible for protecting their login credentials and account information.
            </p>
            <p>
              We may update these terms as features evolve or legal requirements change. Continued use of the platform after an update indicates
              acceptance of the revised terms.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
