import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#101820]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-[120px] sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5B21B6]">Cookie Policy</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-[#101820] sm:text-5xl">Cookie Policy</h1>
          <p className="mt-4 text-base leading-relaxed text-[#475569]">
            This Cookie Policy explains how Koombo uses cookies and similar technologies to operate our platform, improve service quality,
            and respect your choices. We aim to be transparent, privacy-conscious, and compliant with the Ghana Data Protection Act, 2012
            (Act 843), applicable GDPR principles, and relevant ePrivacy requirements.
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">1. What are cookies?</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Cookies are small text files stored on your device when you use a website. They allow the site to remember information such as
                your preferences, login state, and product browsing activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">2. Why Koombo uses cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Koombo uses cookies to keep the platform secure, support core commerce features, remember your preferences, understand user
                behavior, and improve our services. We only use the minimum necessary cookies and we provide clear choices for optional categories.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">3. Strictly necessary cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                These cookies are required for the platform to function. They support authentication, session management, browser security, CSRF
                protection, shopping cart operations, checkout security, and essential product or seller workflows. These cookies cannot be turned off.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">4. Functional cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Functional cookies remember user preferences such as language, region, and personalization choices to improve the shopping and
                browsing experience. These are optional and can be enabled or disabled in the cookie settings panel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">5. Analytics cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Analytics cookies help us better understand platform usage, user journeys, product discovery, and performance trends. These are
                only enabled when a user accepts the analytics category.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">6. Marketing cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Marketing cookies are reserved for advertising personalization, conversion measurement, retargeting, and related campaign analysis.
                They are disabled by default and require explicit user consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">7. Third-party cookies</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                The current Koombo frontend includes a native Shuri AI shopping assistant that may use functional support cookies when enabled in
                the cookie manager. No Google Analytics or Meta Pixel scripts are active in the current app configuration, so no claims are made
                about those services unless they are intentionally added and configured later.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">8. How users can manage preferences</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                You can manage your preferences at any time by using the Cookie Settings link in the website footer. You can accept all cookies,
                reject optional cookies, or customize individual categories.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">9. Withdrawing consent</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                You can change or withdraw your consent at any time from Cookie Settings. If you reject optional categories, strictly necessary cookies
                remain active because they are required for platform security and essential functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">10. Consent retention</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                Consent preferences are stored locally on your device and retained for up to 365 days unless you update your settings or the
                policy changes materially. After that period, the consent banner will reappear and request fresh consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820]">11. Contact and review</h2>
              <p className="mt-3 text-base leading-relaxed text-[#475569]">
                If you have questions about this Cookie Policy or your privacy choices, contact Koombo through the privacy or support channels
                available on the site. We may update this policy as our platform or third-party services change, and those changes will require
                fresh consent if they materially affect the cookies or tracking we use.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
