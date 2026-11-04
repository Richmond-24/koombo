import React from 'react';

export default function SocialCommerceLandingPage() {
  return (
    <div id="live" className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Shopping should be <span className="text-gray-900">social.</span><br />
              And <span className="italic font-serif text-gray-700">authentic.</span>
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Discover real products from real people.
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
                Step away from the endless scroll. Connect directly with local vendors, watch live product demos, and shop with confidence in a community built on trust, transparency, and authentic connections.
              </p>
            </div>

            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore live shops
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                alt="People enjoying a social shopping experience"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Optional floating badge for extra "social" feel */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">+2k</div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Shopping live now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-medium text-base sm:text-lg">
                Join thousands of shoppers discovering authentic local brands today.
              </p>
            </div>
            <button className="text-gray-900 font-semibold hover:text-gray-600 transition-colors text-base flex items-center gap-1 group">
              See how it works
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}