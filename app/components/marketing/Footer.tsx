'use client';

export default function KoomboFooter() {
  const linkColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Shop', href: '/' },
        { label: 'Live Shopping', href: '/rider' },
        { label: 'Vendors', href: '/lister' },
        { label: 'Mobile App', href: '/watch-demo' },
        { label: 'What\'s New', href: '/about' },
      ],
    },
    {
      title: 'Earn with us',
      links: [
        { label: 'Become a Vendor', href: '/lister' },
        { label: 'Become a Connector', href: '/lister/connectors' },
        { label: 'Delivery Partners', href: '/rider' },
        { label: 'Affiliate Program', href: '/contact' },
        { label: 'Seller Resources', href: '/seller' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Koombo', href: '/about' },
        { label: 'Careers', href: '/contact' },
        { label: 'Press & Media', href: '/contact' },
        { label: 'Blog', href: '/watch-demo' },
        { label: 'Investors', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/contact' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Buyer Protection', href: '/about' },
        { label: 'Report an Issue', href: '/contact' },
        { label: 'Community Guidelines', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-[#24133F] text-white" style={{ fontFamily: "'DM Sans','Inter',system-ui,sans-serif" }}>
      
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-[#DDD6FE]/10 blur-3xl" />
      </div>

      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        
        {/* Top Row: Big Logo + Description + App Download */}
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          
          {/* Left: Logo & Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="Koombo" 
                className="h-16 w-auto object-contain drop-shadow-lg sm:h-20 lg:h-24"
              />
            </div>
            <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Social commerce, built for the way people discover, shop, and earn in Ghana and beyond. Bringing buyers, sellers, and creators together — one live stream at a time.
            </p>

            {/* App Download Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <a href="/watch-demo" className="group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 transition hover:border-[#DDD6FE]/50 hover:bg-white/10">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-white/60">Download on the</span>
                  <span className="block text-sm font-bold">App Store</span>
                </span>
              </a>
              <a href="/watch-demo" className="group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 transition hover:border-[#DDD6FE]/50 hover:bg-white/10">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-white/60">Get it on</span>
                  <span className="block text-sm font-bold">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right: Social & Region */}
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Follow us</p>
              <div className="mt-3 flex items-center gap-3">
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                  { label: 'Twitter', href: 'https://x.com/', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'TikTok', href: 'https://www.tiktok.com/', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z' },
                  { label: 'Facebook', href: 'https://www.facebook.com/', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'YouTube', href: 'https://www.youtube.com/', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                ].map(({ label, href, path }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:-translate-y-0.5 hover:border-[#DDD6FE]/50 hover:bg-[#DDD6FE]/10 hover:text-[#DDD6FE]"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Region Selector */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:border-[#DDD6FE]/40">
              <svg className="h-4 w-4 text-[#DDD6FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Ghana</span>
              <span className="text-white/40">·</span>
              <span className="text-white/60">EN</span>
              <svg className="ml-1 h-3.5 w-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:mt-20">
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-white">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-[#DDD6FE]"
                    >
                      <span className="h-px w-0 bg-[#DDD6FE] transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-white/10 bg-[#1E1233]/60">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            {/* Payment Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">We accept</span>
              {['MTN MoMo', 'Vodafone', 'AirtelTigo', 'Visa', 'Mastercard'].map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-5 text-sm text-white/50">
              <a href="/contact" className="transition hover:text-[#DDD6FE]">Privacy</a>
              <span className="text-white/20">·</span>
              <a href="/contact" className="transition hover:text-[#DDD6FE]">Terms</a>
              <span className="text-white/20">·</span>
              <a href="/contact" className="transition hover:text-[#DDD6FE]">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}