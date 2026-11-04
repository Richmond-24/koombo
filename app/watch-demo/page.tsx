'use client';

import { useState, useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import KoomboFooter from '../components/Footer';

type Step = 'details' | 'schedule' | 'success';

export default function BookDemoPage() {
  const [step, setStep] = useState<Step>('details');
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    company: '', 
    role: 'vendor',
    goal: ''
  });

  // Schedule State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleNext = () => {
    if (formData.name && formData.email) setStep('schedule');
  };

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setStep('success');
  };

  // Mock dates for next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toISOString().split('T')[0]
    };
  });

  const times = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&display=swap');
        
        .kb-display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }
        
        @keyframes kb-slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kb-animate { animation: kb-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
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
        
        /* Custom Scrollbar for time slots */
        .time-scroll::-webkit-scrollbar { height: 4px; }
        .time-scroll::-webkit-scrollbar-track { background: transparent; }
        .time-scroll::-webkit-scrollbar-thumb { background: #E7DFF5; border-radius: 10px; }

        @media (prefers-reduced-motion: reduce) {
          .kb-animate { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      <SiteHeader />

      <main className="relative min-h-screen bg-[#F6F3FC] pb-24 pt-32 text-[#20152F] sm:pt-36 overflow-hidden">
        {/* Background Elements */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CFC2EA 1.2px, transparent 1.2px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.12),transparent_70%)] blur-3xl translate-x-1/3 -translate-y-1/4" />

        <div className={`relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${mounted ? 'kb-animate' : 'opacity-0'}`}>
          
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left max-w-3xl mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EDE3FF] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9] shadow-sm mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D28D9] animate-pulse" />
              Live Product Walkthrough
            </span>
            <h1 className="kb-display text-[clamp(2.5rem, 5vw, 4.5rem)] font-extrabold leading-[1.05] tracking-tight text-[#1F1630]">
              Let's build your <br className="hidden md:block"/>
              <span className="text-[#6D28D9]">growth strategy.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#4A3F63]">
              Skip the sales pitch. Get a personalized 30-minute session with our product team to see exactly how Koombo can automate your listings and boost sales.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sticky Sidebar (Value Props) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              {[
                { title: 'AI Listing Automation', desc: 'See Riri AI turn photos into professional listings in seconds.' },
                { title: 'Real-time Analytics', desc: 'Track sales, payouts, and customer behavior live.' },
                { title: 'Q&A Priority Access', desc: 'Get direct answers about scaling your business.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-[#EDE3FF] bg-white/80 p-5 backdrop-blur-sm transition hover:border-[#6D28D9]/30 hover:bg-white hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE3FF] text-[#6D28D9]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#20152F]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6A5E85]">{item.desc}</p>
                  </div>
                </div>
              ))}
              
              {/* Trust Badge */}
              <div className="rounded-2xl bg-[#1F1630] p-6 text-white shadow-xl mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#6D28D9] rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <p className="text-base italic leading-relaxed text-white/90 relative z-10">"The demo completely changed how we view social commerce. The AI matching alone saved us hours."</p>
                <div className="mt-4 flex items-center gap-3 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-[#6D28D9] flex items-center justify-center text-xs font-bold">AS</div>
                  <div>
                    <p className="text-sm font-semibold">Amara S.</p>
                    <p className="text-xs text-white/60">Founder, Urban Threads</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Booking Card */}
            <div className="lg:col-span-8 relative">
              {step === 'details' && (
                <div className="rounded-3xl border border-[#E7DFF5] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(109,40,217,0.15)] kb-animate">
                  <h2 className="kb-display text-2xl font-bold text-[#1F1630] mb-2">Tell us about yourself</h2>
                  <p className="text-[#6A5E85] mb-8">We'll tailor the demo to your specific business goals.</p>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Full Name</label>
                        <input type="text" placeholder="Jane Doe" className="kb-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Work Email</label>
                        <input type="email" placeholder="jane@company.com" className="kb-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">Company / Shop Name</label>
                      <input type="text" placeholder="Koombo Store" className="kb-input" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-2">What's your primary goal?</label>
                      <select className="kb-input appearance-none cursor-pointer" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                        <option value="">Select a goal...</option>
                        <option value="scale">Scale my existing business</option>
                        <option value="start">Start selling online for the first time</option>
                        <option value="automate">Automate my current workflow</option>
                        <option value="partner">Explore partnership opportunities</option>
                      </select>
                    </div>

                    <button 
                      onClick={handleNext}
                      disabled={!formData.name || !formData.email}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] py-4 text-base font-bold text-white shadow-lg shadow-[#6D28D9]/25 transition-all hover:-translate-y-0.5 hover:bg-[#5B21B6] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      Choose a Time Slot
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                  </div>
                </div>
              )}

              {step === 'schedule' && (
                <div className="rounded-3xl border border-[#E7DFF5] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(109,40,217,0.15)] kb-animate">
                  <button onClick={() => setStep('details')} className="mb-6 text-sm font-semibold text-[#6A5E85] hover:text-[#6D28D9] flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Back to details
                  </button>

                  <h2 className="kb-display text-2xl font-bold text-[#1F1630] mb-2">Pick a time that works</h2>
                  <p className="text-[#6A5E85] mb-8">All times are shown in your local timezone.</p>

                  {/* Date Selector */}
                  <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-3">Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 time-scroll">
                      {dates.map((d) => (
                        <button
                          key={d.full}
                          onClick={() => setSelectedDate(d.full)}
                          className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border-2 transition-all ${selectedDate === d.full ? 'border-[#6D28D9] bg-[#F3EFFF] text-[#6D28D9]' : 'border-[#E7DFF5] bg-white hover:border-[#CFC2EA]'}`}
                        >
                          <span className="text-xs font-bold uppercase">{d.day}</span>
                          <span className="text-2xl font-extrabold">{d.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selector */}
                  {selectedDate && (
                    <div className="mb-8 kb-animate">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F63] mb-3">Available Slots</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {times.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${selectedTime === t ? 'border-[#6D28D9] bg-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/20' : 'border-[#E7DFF5] bg-white hover:border-[#CFC2EA] text-[#20152F]'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleSubmitBooking}
                    disabled={!selectedDate || !selectedTime || isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F1630] py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#2A1B45] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Securing slot...</>
                    ) : (
                      <>Confirm Booking <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></>
                    )}
                  </button>
                </div>
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E7DFF5] bg-white p-12 text-center shadow-xl kb-animate min-h-[500px]">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#EDE3FF] text-[#6D28D9] animate-bounce">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h2 className="kb-display text-3xl font-bold text-[#1F1630]">You're all set!</h2>
                  <p className="mt-4 max-w-md text-lg text-[#4A3F63]">
                    Thanks for booking a demo with Koombo. A confirmation email with the meeting link has been sent to <span className="font-semibold text-[#6D28D9]">{formData.email}</span>.
                  </p>
                  <button onClick={() => {setStep('details'); setSelectedDate(null); setSelectedTime(null);}} className="mt-8 px-6 py-3 rounded-xl border border-[#E7DFF5] text-sm font-bold text-[#6D28D9] hover:bg-[#F3EFFF] transition-colors">
                    Book another session
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