'use client';

import { Fragment, useState } from "react";

/* Photos: Using high-quality Unsplash images relevant to African social commerce categories */
type Category = { 
  id: string; 
  label: string; 
  src: string; 
};

const CATEGORIES: Category[] = [
  { id: "fashion", label: "Secondhand Fashion", src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80" },
  { id: "beauty", label: "Preloved Beauty", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
  { id: "tech", label: "Refurbished Tech", src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
  { id: "home", label: "Secondhand Home & Living", src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" },
  { id: "food", label: "Kitchen Finds", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" },
  { id: "art", label: "Vintage Art & Crafts", src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80" },
];

/* BRANDS DATA - Replace these placeholders with your actual logo paths */
const BRANDS = [
  { name: "ENDEAVOR", src: "" }, // Add path like "/logos/endeavor.png"
  { name: "DORADO", src: "" },
  { name: "Comfrt", src: "" },
  { name: "A M A S S", src: "" },
  { name: "LUMINA", src: "" },
  { name: "APEX", src: "" },
];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <div 
      className="group relative w-full aspect-[4/5] overflow-hidden rounded-[24px] cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background Image with Scale Animation */}
      <img 
        src={category.src} 
        alt={category.label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      
      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Label Text Only - Explore text removed */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md sm:text-2xl">
          {category.label}
        </h3>
      </div>
    </div>
  );
}

export default function KoomboCategories() {
  return (
    <>
      {/* CATEGORIES SECTION */}
      <section className="relative w-full overflow-hidden bg-[#FDFBF7] py-16 md:py-24">
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0; /* Start hidden */
          }
          
          @keyframes scroll-brands {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-brands {
            animation: scroll-brands 30s linear infinite;
          }
          .animate-scroll-brands:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <div className="mb-12 text-center animate-fade-in-up">
            <h2 className="text-4xl font-black tracking-tight text-[#1A1A1A] sm:text-5xl md:text-6xl">
              Discover Categories
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Explore secondhand treasures, everyday essentials, and unique finds from local sellers across Ghana.
            </p>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
            {CATEGORIES.map((cat, i) => (
              <Fragment key={cat.id}>
                <CategoryCard category={cat} index={i} />
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS MARQUEE SECTION - WHITE BACKGROUND */}
      <section className="relative w-full overflow-hidden bg-white py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 mb-10 text-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Brands We Work With
          </h3>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative flex overflow-hidden">
          {/* Fade edges for smooth blending */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          {/* Scrolling Track */}
          <div className="flex animate-scroll-brands min-w-full items-center">
            {/* Duplicate the list twice for seamless infinite loop */}
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div 
                key={`${brand.name}-${i}`} 
                className="relative flex w-[200px] shrink-0 items-center justify-center border-r border-gray-100 px-8 py-4"
              >
                {/* LOGO PLACEHOLDER - REPLACE THIS WITH YOUR IMG TAG */}
                {brand.src ? (
                  <img 
                    src={brand.src} 
                    alt={brand.name} 
                    className="h-8 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  /* Text Placeholder if no image is provided yet */
                  <span className="text-xl font-bold tracking-wider text-gray-300 transition-all duration-300 hover:text-gray-800">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}