'use client';

import { useState, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import KoomboFooter from '../components/Footer';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

export default function BonanzaPage() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Target Date: Nov 30, 2024 (Adjust year as needed)
  const targetDate = new Date('2024-11-30T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const prizes = [
    { 
      title: 'Exclusive Merch Pack', 
      desc: 'Limited edition Koombo hoodie, cap, and stickers.',
      icon: '🎁'
    },
    { 
      title: 'Free Delivery Credits', 
      desc: 'GH₵ 200 worth of delivery credits to kickstart your journey.',
      icon: '🚀'
    },
    { 
      title: 'Featured on Network', 
      desc: 'Get spotlighted on our homepage and social channels.',
      icon: '⭐'
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&display=swap');
        
        .kb-display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }
        
        @keyframes kb-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: kb-float 4s ease-in-out infinite; }
        
        @keyframes kb-pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(109, 40, 217, 0.2); }
          50% { box-shadow: 0 0 40px rgba(109, 40, 217, 0.5); }
        }
        .animate-pulse-glow { animation: kb-pulse-glow 3s infinite; }

        .kb-input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #E7DFF5;
          background-color: #FAF8FF;
          padding: 16px 18px;
          font-size: 16px;
          color: #20152F;
          transition: all 0.2s ease;
          outline: none;
          font-weight: 500;
        }
        .kb-input:focus {
          border-color: #6D28D9;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.08);
        }
      `}</style>

      <SiteHeader />

      <main className="relative min-h-screen bg-[#F6F3FC] pb-24 pt-32 text-[#20152F] sm:pt-36 overflow-hidden">
        {/* Background Elements */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CFC2EA 1.2px, transparent 1.2px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.15),transparent_70%)] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EDE3FF] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9] shadow-sm mb-6 animate-pulse-glow">
              <span className="h-2 w-2 rounded-full bg-[#6D28D9]" />
              Launching Nov 30th
            </span>
            <h1 className="kb-display text-[clamp(3rem, 7vw, 5.5rem)] font-extrabold leading-[1.05] tracking-tight text-[#1F1630]">
              The Koombo <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6]">Web App Bonanza</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-[#4A3F63] max-w-2xl mx-auto">
              Be among the first to experience Koombo on the web. Sign up before launch day for a chance to win exclusive rewards!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 sm:gap-8 mb-16">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E7DFF5] shadow-lg flex items-center justify-center mb-2">
                  <span className="kb-display text-2xl sm:text-3xl font-black text-[#6D28D9]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A5E85]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Prizes Showcase */}
            <div className="space-y-6">
              <h2 className="kb-display text-2xl font-bold text-[#1F1630] mb-6">What you could win:</h2>
              {prizes.map((prize, i) => (
                <div 
                  key={i} 
                  className={`group flex gap-5 p-6 rounded-2xl border border-[#EDE3FF] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#6D28D9]/40 hover:shadow-lg hover:-translate-y-1 ${i === 0 ? 'animate-float' : ''}`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F3EFFF] text-2xl group-hover:bg-[#6D28D9] group-hover:scale-110 transition-all duration-300">
                    {prize.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#20152F] group-hover:text-[#6D28D9] transition-colors">{prize.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6A5E85]">{prize.desc}</p>
                  </div>
                </div>
              ))}

              {/* Trust Badge */}
              <div className="mt-8 p-6 rounded-2xl bg-[#1F1630] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D28D9] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <p className="text-base italic leading-relaxed text-white/90 relative z-10">"I can't wait to see how Koombo transforms online selling in Ghana. This launch is going to be huge!"</p>
                <div className="mt-4 flex items-center gap-3 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-[#6D28D9] flex items-center justify-center text-xs font-bold">KO</div>
                  <div>
                    <p className="text-sm font-semibold">Koombo Team</p>
                    <p className="text-xs text-white/60">Building the future of commerce</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="relative">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E7DFF5] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(109,40,217,0.15)]">
                  <h2 className="kb-display text-2xl font-bold text-[#1F1630] mb-2">Secure your spot</h2>
                  <p className="text-[#6A5E85] mb-8">Enter your details to join the waitlist & enter the draw.</p>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="kb-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="kb-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Phone Number</label>
                      <input required type="tel" placeholder="+233 XX XXX XXXX" className="kb-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] py-4 text-base font-bold text-white shadow-lg shadow-[#6D28D9]/25 transition-all hover:-translate-y-0.5 hover:bg-[#5B21B6] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          Securing entry...
                        </>
                      ) : (
                        <>Join the Bonanza <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>
                      )}
                    </button>
                    
                    <p className="text-center text-xs text-[#8C7FA8] mt-4">
                      By signing up, you agree to receive launch updates. Winners announced on Nov 30th.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E7DFF5] bg-white p-12 text-center shadow-xl animate-fade-in-up min-h-[500px]">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#EDE3FF] text-[#6D28D9] animate-bounce">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h2 className="kb-display text-3xl font-bold text-[#1F1630]">You're In!</h2>
                  <p className="mt-4 max-w-md text-lg text-[#4A3F63]">
                    Thanks for joining the Koombo Bonanza. We've sent a confirmation to <span className="font-semibold text-[#6D28D9]">{formData.email}</span>. Stay tuned for the big reveal on Nov 30th!
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 px-6 py-3 rounded-xl border border-[#E7DFF5] text-sm font-bold text-[#6D28D9] hover:bg-[#F3EFFF] transition-colors">
                    Register another person
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <KoomboFooter />
    </>
  );
}