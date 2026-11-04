'use client';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/your-koombo-page',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/your-koombo-handle',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/233000000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35ZM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.44 9.44 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.45-9.45 2.52 0 4.9.98 6.68 2.77a9.4 9.4 0 0 1 2.76 6.68c0 5.21-4.24 9.45-9.45 9.45ZM20.52 3.45A11.4 11.4 0 0 0 12.05 0C5.73 0 .59 5.14.59 11.46c0 2.02.53 4 1.53 5.74L.5 23l5.97-1.57a11.45 11.45 0 0 0 5.47 1.4h.01c6.32 0 11.46-5.14 11.46-11.46 0-3.06-1.19-5.94-3.35-8.1Z" />
      </svg>
    ),
  },
];

export default function KoomboFooter() {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const discoverLinks = [
    { label: 'Sell with Koombo', href: '/seller' },
    { label: 'List your business', href: '/lister' },
    { label: 'Watch demo', href: '/watch-demo' },
  ];

  return (
    <footer
      className="w-full bg-[#5B21B6] text-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
          {/* Brand */}
          <div className="max-w-sm space-y-6">
            <div className="flex items-center gap-3">
              {/* INCREASED LOGO SIZE: Changed from h-10 to h-14 sm:h-16 */}
              <img 
                src="/logo1.png" 
                alt="Koombo" 
                className="h-14 w-auto sm:h-16 object-contain brightness-0 invert" 
              />
            </div>
            <p className="text-base leading-relaxed text-white/75">
              Discover authentic products, follow trusted sellers, and shop the way your community does — live, local, and personal.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#5B21B6] active:scale-95"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2 md:gap-x-20">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-white/75 transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Business</h4>
              <ul className="space-y-3">
                {discoverLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-white/75 transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-8">
          <p className="text-sm text-white/70">© 2026 Koombo, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}