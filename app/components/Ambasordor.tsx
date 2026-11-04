'use client';

import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Heart,
  MessageCircle,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
  Video,
  Wallet,
  Handshake,
  Globe2,
} from 'lucide-react';

const pillars = [
  {
    number: '01',
    title: 'Discover something new',
    description:
      'Explore products, discover exciting businesses, and find things you love through engaging content and recommendations from people.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Connect with real sellers',
    description:
      'Get closer to the people behind the products. Ask questions, learn more about what you love, and make informed buying decisions.',
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Shop with confidence',
    description:
      'Move from discovering a product to purchasing it through a shopping experience designed to make buying feel simple and convenient.',
    icon: ShoppingBag,
  },
  {
    number: '04',
    title: 'Get your products',
    description:
      'Connect shopping with delivery and collection options, helping bring the things you discover closer to you.',
    icon: Truck,
  },
];

const audiences = [
  {
    title: 'For shoppers',
    subtitle: 'Your next great find is waiting.',
    description:
      'Discover interesting products, explore businesses, compare your options, and connect with sellers before making a purchase.',
    icon: ShoppingBag,
    href: '/',
    linkText: 'Start exploring',
    number: '01',
  },
  {
    title: 'For businesses',
    subtitle: 'Give your products a bigger stage.',
    description:
      'Showcase your products, tell your business story, connect with potential customers, and create more opportunities to grow.',
    icon: Store,
    href: '/lister/connectors',
    linkText: 'Grow your business',
    number: '02',
  },
  {
    title: 'For creators',
    subtitle: 'Turn discovery into opportunity.',
    description:
      'Help people discover products and businesses through engaging content, authentic recommendations, and creative storytelling.',
    icon: Video,
    href: '/lister/connectors',
    linkText: 'Explore opportunities',
    number: '03',
  },
  {
    title: 'For connectors',
    subtitle: 'Make valuable connections.',
    description:
      'Help businesses reach new audiences by introducing them to opportunities within the Koombo community. Eligible activities may offer earning opportunities.',
    icon: Handshake,
    href: '/lister/connectors',
    linkText: 'Join the community',
    number: '04',
  },
];

const values = [
  {
    title: 'People come first',
    description:
      'Behind every product is a person, a business, or a dream. We want commerce to create meaningful connections between them.',
    icon: Heart,
  },
  {
    title: 'Trust matters',
    description:
      'Shopping should feel reassuring. We believe in clear product information, honest communication, and building confidence between buyers and sellers.',
    icon: ShieldCheck,
  },
  {
    title: 'Opportunity for everyone',
    description:
      'We want businesses of different sizes and people with different skills to have more ways to participate in the digital economy.',
    icon: Globe2,
  },
  {
    title: 'Simple is better',
    description:
      'Discovering a product, contacting a business, and deciding what to buy should feel natural rather than complicated.',
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-[#F8F8F6] text-[#20201F]"
      style={{
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <header className="relative z-20 border-b border-black/[0.04] bg-[#F8F8F6]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Koombo home"
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <img
              src="/logo.png"
              alt="Koombo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-4 sm:gap-8"
          >
            <Link
              href="/"
              className="hidden text-sm font-semibold text-[#66645F] transition hover:text-[#5B21B6] sm:block"
            >
              Home
            </Link>

            <Link
              href="#our-story"
              className="hidden text-sm font-semibold text-[#66645F] transition hover:text-[#5B21B6] md:block"
            >
              Our story
            </Link>

            <Link
              href="/lister/connectors"
              className="inline-flex items-center gap-2 rounded-full bg-[#4C1D95] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#5B21B6] sm:px-5"
            >
              Join Koombo
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="relative">
        <div className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-[#DDD6FE]/50 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#D1FAE5]/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:pb-32 lg:pt-28">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2D8FF] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#5B21B6] shadow-sm">
              <Sparkles size={14} />
              Get to know Koombo
            </div>

            <h1 className="mt-7 max-w-3xl text-[2.8rem] font-black leading-[1.04] tracking-[-0.065em] text-[#20201F] sm:text-6xl lg:text-[4.6rem]">
              Good finds.
              <br />
              Great people.
              <br />
              <span className="text-[#6D28D9]">
                Bigger opportunities.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#686760] sm:text-lg sm:leading-9">
              Shopping should be more than scrolling through products.
              It should help you discover new things, connect with
              businesses, support people with great ideas, and find
              opportunities along the way.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-[#686760] sm:text-lg">
              That's how Koombo works — a
              social commerce platform bringing product discovery, people,
              and shopping closer together.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C1D95] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#4C1D95]/15 transition hover:-translate-y-0.5 hover:bg-[#5B21B6]"
              >
                Explore Koombo
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-bold text-[#49463F] transition hover:text-[#5B21B6]"
              >
                Our story
                <ArrowDownRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E7E5E0] pt-6 text-sm font-medium text-[#77746D]">
              <span className="flex items-center gap-2">
                <Users size={17} className="text-[#6D28D9]" />
                Built around people
              </span>

              <span className="flex items-center gap-2">
                <Store size={17} className="text-[#6D28D9]" />
                Made for businesses
              </span>
            </div>
          </div>

          {/* Hero visual */}

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -left-5 top-10 h-24 w-24 rounded-[2rem] bg-[#C4B5FD] sm:-left-8 sm:h-32 sm:w-32" />

            <div className="absolute -right-4 top-1/3 h-20 w-20 rounded-full bg-[#FDE68A] sm:-right-8 sm:h-28 sm:w-28" />

            <div className="absolute -bottom-6 left-12 h-32 w-32 rounded-full bg-[#D1FAE5] sm:h-40 sm:w-40" />

            <div className="relative rounded-[2rem] bg-[#24133F] p-3 shadow-[0_30px_100px_rgba(36,19,63,0.18)] sm:rounded-[2.5rem] sm:p-4">
              <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <img
                  src="/shop.jpg"
                  alt="Discovering products and connecting with local businesses"
                  className="h-[380px] w-full object-cover sm:h-[500px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#170D29]/85 via-transparent to-black/5" />

                <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-bold text-[#4C1D95] shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                  Discover more together
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7 sm:right-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DDD6FE]">
                    The Koombo experience
                  </p>

                  <h2 className="mt-3 max-w-sm text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                    Where discovery meets opportunity.
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                    Discover products. Meet businesses. Make connections
                    that matter.
                  </p>
                </div>
              </div>

              {/* Floating feature card */}

              <div className="absolute -bottom-8 right-5 max-w-[250px] rounded-2xl border border-white/70 bg-white p-4 shadow-xl sm:-right-6 sm:max-w-[280px] sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EDE9FE] text-[#5B21B6]">
                    <ShoppingBag size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#282329]">
                      More than a marketplace
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#77717D]">
                      People, products, and possibilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRODUCTION ================= */}

      <section
        id="our-story"
        className="scroll-mt-20 border-y border-[#EAE8E3] bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
                Why Koombo exists
              </p>

              <h2 className="mt-5 max-w-md text-3xl font-black leading-tight tracking-[-0.04em] text-[#20201F] sm:text-4xl lg:text-5xl">
                A more connected way to discover and shop.
              </h2>

              <div className="mt-7 h-1.5 w-16 rounded-full bg-[#7C3AED]" />
            </div>

            <div className="space-y-5 text-base leading-8 text-[#686760] sm:text-lg sm:leading-9">
              <p>
                Finding something worth buying should be exciting. Finding
                a business worth supporting should be just as rewarding.
                Yet discovering products, learning about sellers, and
                making purchases can often feel like separate experiences.
              </p>

              <p>
                <span className="font-bold text-[#292526]">Koombo</span>{' '}
                brings these experiences closer together. We are creating
                a space where products can be discovered through engaging
                content, businesses can connect with potential customers,
                and shoppers can move more naturally from inspiration to
                purchase.
              </p>

              <p>
                We also believe that commerce creates opportunities beyond
                buying and selling. Creators can help people discover
                products, connectors can help businesses reach new
                audiences, and entrepreneurs can find new ways to share
                what they offer.
              </p>

              <p className="font-semibold text-[#3C3542]">
                Our goal is simple: make commerce feel more human,
                accessible, and connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION AND VISION ================= */}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              What drives us
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              The bigger picture behind what we do.
            </h2>

            <p className="mt-4 leading-7 text-[#686760]">
              We are working towards a future where discovering products,
              growing businesses, and finding commercial opportunities
              are more connected.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-[2rem] bg-[#24133F] p-7 text-white sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6D28D9]/40 blur-2xl transition group-hover:bg-[#7C3AED]/50" />

              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#DDD6FE]">
                  <Radio size={23} />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#C4B5FD]">
                  Our mission
                </p>

                <h3 className="mt-4 max-w-md text-2xl font-black leading-tight sm:text-3xl">
                  Make product discovery more social and commerce more
                  accessible.
                </h3>

                <p className="mt-5 max-w-lg leading-7 text-white/70">
                  We aim to bring shoppers, businesses, creators, and
                  connectors together through an experience that makes
                  discovering products and creating opportunities easier.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-[#E7E2F0] bg-white p-7 sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EDE9FE] blur-2xl transition group-hover:bg-[#DDD6FE]" />

              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDE9FE] text-[#5B21B6]">
                  <Globe2 size={23} />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
                  Our vision
                </p>

                <h3 className="mt-4 max-w-md text-2xl font-black leading-tight text-[#252126] sm:text-3xl">
                  A world where every great product has a chance to be
                  discovered.
                </h3>

                <p className="mt-5 max-w-lg leading-7 text-[#686760]">
                  We envision a connected commerce ecosystem where
                  businesses can reach the right people, shoppers can
                  discover more possibilities, and participation creates
                  room for new opportunities.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="border-y border-[#EAE8E3] bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              How Koombo works
            </p>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              From the first look to the final delivery.
            </h2>

            <p className="mt-5 leading-7 text-[#686760] sm:text-lg">
              We are bringing the different parts of shopping into one
              connected experience, so discovering something you love can
              be the beginning of something great.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ number, title, description, icon: Icon }) => (
              <article
                key={number}
                className="group rounded-[1.75rem] border border-[#EAE8E3] bg-[#FBFAF8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:bg-white hover:shadow-xl hover:shadow-[#4C1D95]/5 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDE9FE] text-[#5B21B6] transition group-hover:bg-[#4C1D95] group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <span className="text-sm font-bold tracking-widest text-[#AAA59D]">
                    {number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-extrabold text-[#252126]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#77736D]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO IS IT FOR ================= */}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
                There is a place for you
              </p>

              <h2 className="mt-5 max-w-md text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Different people. Shared opportunities.
              </h2>

              <p className="mt-5 max-w-md leading-8 text-[#686760]">
                Whether you are looking for your next favourite product
                or working to grow something of your own, Koombo is
                designed to bring people together around commerce.
              </p>

              <Link
                href="/lister/connectors"
                className="mt-7 inline-flex items-center gap-2 font-bold text-[#5B21B6] transition hover:gap-3"
              >
                Find your place on Koombo
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {audiences.map(
                ({
                  title,
                  subtitle,
                  description,
                  icon: Icon,
                  href,
                  linkText,
                  number,
                }) => (
                  <article
                    key={number}
                    className="flex flex-col rounded-[1.75rem] border border-[#EAE8E3] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:shadow-xl hover:shadow-[#4C1D95]/5 sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDE9FE] text-[#5B21B6]">
                        <Icon size={22} />
                      </div>

                      <span className="text-xs font-bold tracking-widest text-[#AAA59D]">
                        {number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-[#252126]">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-[#5B21B6]">
                      {subtitle}
                    </p>

                    <p className="mt-3 flex-1 text-sm leading-7 text-[#77736D]">
                      {description}
                    </p>

                    <Link
                      href={href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#353039] transition hover:text-[#5B21B6]"
                    >
                      {linkText}
                      <ArrowUpRight size={16} />
                    </Link>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES (UPDATED WITH BG IMAGE) ================= */}

      <section className="relative border-y border-[#EAE8E3] py-20 sm:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
            alt="Background texture"
            className="h-full w-full object-cover"
          />
          {/* Heavy overlay to ensure text visibility */}
          <div className="absolute inset-0 bg-[#F8F8F6]/94 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D28D9]">
              What we believe
            </p>

            {/* Updated Heading */}
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl text-[#20201F]">
              That's how Koombo works.
            </h2>

            <p className="mt-5 leading-7 text-[#686760]">
              The best commerce experiences do more than facilitate
              purchases. They make people feel informed, supported, and
              connected.
            </p>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, description, icon: Icon }) => (
              <article key={title} className="group">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F0EAFE] text-[#5B21B6] transition duration-300 group-hover:rotate-3 group-hover:bg-[#4C1D95] group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-[#252126]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#77736D]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR PROMISE ================= */}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#F0EAFE] px-7 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C4B5FD]/50 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/70 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D7C7FF] bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#5B21B6]">
                  <Heart size={14} />
                  Our promise
                </div>

                <h2 className="mt-6 max-w-2xl text-3xl font-black leading-tight tracking-[-0.05em] text-[#24133F] sm:text-4xl lg:text-5xl">
                  Every great business deserves to be discovered.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-[#62586E] sm:text-lg">
                  We want to help make that possible by connecting
                  products with people, giving businesses more ways to
                  reach customers, and making room for the next great
                  idea to grow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C1D95] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5B21B6]"
                >
                  Discover Koombo
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/lister/connectors"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6C6F7] bg-white/80 px-6 py-3.5 font-bold text-[#4C1D95] transition hover:bg-white"
                >
                  Join our community
                  <Users size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER CTA ================= */}

      <section className="bg-[#24133F] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#C4B5FD]">
                <span className="h-2 w-2 rounded-full bg-[#A78BFA]" />
                Your journey starts here
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Find something you love. Help something grow.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/65 sm:text-lg">
                Come discover what is possible when people, products,
                and businesses connect.
              </p>
            </div>

            <Link
              href="/lister/connectors"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-[#4C1D95] transition hover:-translate-y-0.5 hover:bg-[#F3EFFF]"
            >
              Get started with Koombo
              <ArrowRight size={18} />
            </Link>
          </div>

          <footer className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              aria-label="Koombo home"
              className="inline-flex w-fit items-center rounded-lg bg-white px-3 py-1.5 transition-opacity hover:opacity-80"
            >
              <img
                src="/logo.png"
                alt="Koombo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-sm leading-6 text-white/55">
              Discover. Connect. Shop. Grow.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              Back to home
              <ArrowUpRight size={15} />
            </Link>
          </footer>

          <div className="mt-7 border-t border-white/10 pt-6 text-xs text-white/40">
            © {new Date().getFullYear()} Koombo. All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}