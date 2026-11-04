"use client";

import { useCallback, useEffect, useMemo, useState, useRef, ReactNode } from "react";
import {
  connectSellerTelegram,
  createConnectNonce,
  fetchTelegramConfig,
  openTelegramDeepLink,
  pollTelegramConnect,
  telegramStatusMessage,
  type TelegramConnectStatus,
} from "../../lib/telegram-connect";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

// Define the new Teal Blue theme color for consistency
const THEME_COLOR = "#0D9488"; // Teal-600
const THEME_COLOR_HOVER = "#0F766E"; // Teal-700

const Icons = {
  ChevronRight: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),

  ChevronLeft: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),

  Check: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),

  User: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  Store: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l1-5h16l1 5" />
      <path d="M5 9v11h14V9" />
      <path d="M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M9 20v-5h6v5" />
    </svg>
  ),

  Telegram: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.7 3.2 18.4 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.8 13.6.9 12c-1.1-.3-1.1-1.1.2-1.6L20.3 3c.9-.3 1.7.2 1.4.2Z" />
    </svg>
  ),

  Bot: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 3v4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M8 16h8" />
    </svg>
  ),

  Camera: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-1.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),

  Message: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4.7A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  ),

  Shield: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),

  ArrowUpRight: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
};

interface SellerFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  location: string;
  categories: string[];
}

interface TelegramConnection {
  connected: boolean;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

const CATEGORIES = [
  "Fashion",
  "Electronics",
  "Phones & Accessories",
  "Food",
  "Books",
  "Beauty",
  "Home & Furniture",
  "Services",
  "Sports",
  "Other",
];

const LOCATIONS = [
  "Sunyani",
  "Kumasi",
  "Accra",
  "Takoradi",
  "Cape Coast",
  "Tamale",
  "Other",
];

type StepStatus = "not_connected" | "connecting" | "connected" | "error";
type Channel = "whatsapp" | "telegram";

const CHANNEL_STATUS_DEFAULT: Record<Channel, StepStatus> = {
  whatsapp: "not_connected",
  telegram: "not_connected",
};

// Hook for scroll animations
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible] as const;
}

// Wrapper component for fade-in animations
function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) {
  const [ref, isVisible] = useInView();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Floating WhatsApp Widget Component
function WhatsAppWidget() {
  const phoneNumber = "233531190274"; // Ghana country code + number without leading 0
  const message = encodeURIComponent("Hi RIRI, I need help with Koombo.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Animated Message Bubble */}
      <div className="pointer-events-auto bg-white text-slate-800 text-sm font-bold py-2 px-4 rounded-xl shadow-lg border border-slate-100 animate-bubble-fade mb-1 relative mr-2">
        Hey, am RIRI 👋
        {/* Little triangle pointer */}
        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-slate-100 transform rotate-45"></div>
      </div>

      {/* Bouncing Icon Button */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)] hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.6)] transition-all duration-300 animate-gentle-bounce cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
        
        {/* Ping Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping-slow"></span>
      </a>
    </div>
  );
}

export default function SellerSignup() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [telegramConnectionToken, setTelegramConnectionToken] =
    useState<string | null>(null);

  const [channelStatus, setChannelStatus] =
    useState<Record<Channel, StepStatus>>(CHANNEL_STATUS_DEFAULT);

  const [formData, setFormData] = useState<SellerFormData>({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    location: "",
    categories: [],
  });

  const [telegram, setTelegram] = useState<TelegramConnection>({
    connected: false,
  });

  const [whatsapp, setWhatsapp] = useState<{ connected: boolean }>({
    connected: false,
  });

  const [telegramBotUsername, setTelegramBotUsername] = useState(
    () =>
      (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "")
        .replace(/^@/, "")
        .trim()
  );
  const [telegramConnectNonce, setTelegramConnectNonce] = useState("");
  const [telegramHint, setTelegramHint] = useState("");

  // The bot handle is owned by the backend; read it once so the deep link can
  // never point at a stale or misspelled bot.
  useEffect(() => {
    let cancelled = false;
    void fetchTelegramConfig().then((config) => {
      if (!cancelled && config?.botUsername) setTelegramBotUsername(config.botUsername);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sellerDetailsValid = useMemo(() => {
    return (
      formData.fullName.trim().length >= 2 &&
      formData.businessName.trim().length >= 2 &&
      formData.phone.trim().length >= 7 &&
      formData.email.includes("@") &&
      formData.location.trim().length > 0 &&
      formData.categories.length > 0
    );
  }, [formData]);

  const updateField = (
    field: keyof SellerFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(category);

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((item) => item !== category)
          : [...prev.categories, category],
      };
    });

    setError("");
  };

  const createSellerAccount = async () => {
    if (!sellerDetailsValid) {
      setError("Please complete all required seller details.");
      return false;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sellers/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            businessName: formData.businessName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            location: formData.location.trim(),
            categories: formData.categories,

            status: "pending",
            telegramConnected: false,

            sendWelcomeEmail: true,
          }),
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          "Could not create seller account.";

        throw new Error(message);
      }

      const nextSellerId =
        data?.sellerId ||
        data?.seller?.id ||
        data?.seller?._id ||
        data?._id ||
        data?.id ||
        null;

      if (!nextSellerId) {
        throw new Error(
          "Seller account was created but no seller ID was returned."
        );
      }

      setSellerId(String(nextSellerId));
      // Keep the new seller's identity and session available to the dashboard
      // and the Telegram connection step, which both need the seller token.
      window.localStorage.setItem("seller_id", String(nextSellerId));
      const sellerToken = data?.token || data?.sellerToken;
      if (sellerToken) {
        window.localStorage.setItem("seller_token", String(sellerToken));
        window.localStorage.setItem("token", String(sellerToken));
      }

      setTelegramConnectionToken(
        data?.telegramConnectionToken ||
          telegramConnectionToken ||
          null
      );

      setChannelStatus((prev) => ({
        ...prev,
        telegram: "not_connected",
      }));

      setTelegram({
        connected: false,
      });

      setWhatsapp({
        connected: false,
      });

      return true;
    } catch (err) {
      console.error("Seller registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create seller account."
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Applies a Telegram status payload from the backend. This is the single
   * place that decides whether the channel card flips to "connected".
   */
  const applyTelegramStatus = useCallback(
    (status: TelegramConnectStatus | null) => {
      if (!status) return false;

      if (status.connected) {
        setTelegram({
          connected: true,
          userId: status.telegramUserId || undefined,
          username: status.telegramUsername || undefined,
          firstName: status.telegramFirstName || undefined,
          lastName: status.telegramLastName || undefined,
        });
        setChannelStatus((prev) => ({ ...prev, telegram: "connected" }));
        setTelegramHint("");
        setError("");
        return true;
      }

      const message = telegramStatusMessage(status);
      if (message) {
        setTelegramHint(message);
        setChannelStatus((prev) => ({ ...prev, telegram: "error" }));
        setError(message);
      }
      return false;
    },
    []
  );

  const checkTelegramConnection = useCallback(
    async (resolvedSellerId?: string | null) => {
      const activeSellerId = resolvedSellerId || sellerId;
      const status = await pollTelegramConnect({
        nonce: activeSellerId ? null : telegramConnectNonce,
        sellerId: activeSellerId,
      });
      return applyTelegramStatus(status);
    },
    [sellerId, telegramConnectNonce, applyTelegramStatus]
  );

  const connectTelegram = async () => {
    if (!sellerId) {
      setError(
        "Your seller account has not been created yet. Please go back and complete your details."
      );
      return;
    }

    setChannelStatus((prev) => ({ ...prev, telegram: "connecting" }));
    setError("");
    setTelegramHint("");

    try {
      const nonce = telegramConnectNonce || createConnectNonce();
      setTelegramConnectNonce(nonce);

      const link = await connectSellerTelegram({
        sellerId,
        email: formData.email.trim().toLowerCase() || undefined,
        token: window.localStorage.getItem("seller_token") || undefined,
        nonce,
      });

      setTelegramConnectionToken(link.telegramLink);
      if (link.botUsername) setTelegramBotUsername(link.botUsername);
      setTelegramHint("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
      setTelegram({
        connected: true,
        userId: undefined,
        username: undefined,
        firstName: undefined,
        lastName: undefined,
      });
      setChannelStatus((prev) => ({ ...prev, telegram: "connected" }));
      if (typeof window !== "undefined") {
        window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
      }
      await checkTelegramConnection(sellerId);
    } catch (err) {
      console.error("Telegram connection error:", err);
      setChannelStatus((prev) => ({ ...prev, telegram: "error" }));
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Unable to connect Telegram. Please try again."
      );
    }
  };

  const openTelegramBot = () => {
    if (typeof window === "undefined") return;
    if (telegram.connected) {
      window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
      return;
    }
    setTelegramHint("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
    setChannelStatus((prev) => ({ ...prev, telegram: "connected" }));
    window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
  };

  useEffect(() => {
    if (!sellerId || telegram.connected) {
      return;
    }

    void checkTelegramConnection(sellerId);

    const interval = window.setInterval(() => {
      void checkTelegramConnection(sellerId);
    }, 3000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkTelegramConnection(sellerId);
      }
    };

    const handleWindowFocus = () => {
      void checkTelegramConnection(sellerId);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, [sellerId, telegram.connected, checkTelegramConnection]);

  const handleStart = () => {
    setStep(1);
    setError("");
  };

  const anyChannelConnected =
    telegram.connected ||
    whatsapp.connected ||
    channelStatus.whatsapp === "connected";

  const requireChannelConnected = () => {
    if (
      !telegram.connected &&
      channelStatus.telegram !== "connected" &&
      !whatsapp.connected &&
      channelStatus.whatsapp !== "connected"
    ) {
      setError(
        "Please connect Telegram or WhatsApp before continuing."
      );

      setStep(2);

      return false;
    }

    setError("");

    return true;
  };

  const handleSellerDetailsNext = async () => {
    const created = await createSellerAccount();

    if (created) {
      setStep(2);
    }
  };

  const handleWhatsAppConnect = () => {
    if (typeof window === "undefined") return;

    const cleanedPhone =
      formData.phone.replace(/\D/g, "");

    if (!cleanedPhone || cleanedPhone.length < 9) {
      setChannelStatus((prev) => ({
        ...prev,
        whatsapp: "error",
      }));

      setError(
        "Please add a valid mobile number before connecting WhatsApp."
      );

      return;
    }

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
      "Hi, I want to start selling on Koombo."
    )}`;

    setChannelStatus((prev) => ({
      ...prev,
      whatsapp: "connecting",
    }));

    setWhatsapp({
      connected: true,
    });

    setError("");

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setChannelStatus((prev) => ({
      ...prev,
      whatsapp: "connected",
    }));
  };

  const progressSteps = [
    "Your details",
    "Connect a channel",
    "How selling works",
    "Ready",
  ];

  const progressPercentage =
    (step / Math.max(progressSteps.length, 1)) * 100;

  const renderProgress = () => (
    <FadeIn className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-4 relative z-10">
      <div className="flex justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 w-full h-[3px] bg-[#E2E6EC] rounded-full -z-10" />

        {/* Progress line - TEAL */}
        <div
          className="absolute top-5 left-0 h-[3px] bg-[#0D9488] rounded-full -z-10 transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
          }}
        />

        {progressSteps.map((label, index) => {
          const active =
            index + 1 <= step ||
            (step === 0 && index === 0);

          const current =
            index + 1 === step ||
            (step === 0 && index === 0);

          return (
            <div
              key={label}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  active
                    ? "bg-[#0D9488] text-white"
                    : "bg-white border-2 border-[#E2E6EC] text-[#9AA2AF]"
                } ${
                  current
                    ? "ring-4 ring-[#0D9488]/15"
                    : ""
                }`}
              >
                {active && !current ? (
                  <Icons.Check />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={`text-xs font-semibold transition-colors duration-300 hidden sm:block ${
                  current
                    ? "text-[#0D9488]"
                    : active
                    ? "text-[#58606F]"
                    : "text-[#B7BEC9]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );

  const goBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      setError("");
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 sm:py-4 rounded-xl bg-[#F7F9FB] border border-[#E2E6EC] focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#0D9488]/10 outline-none transition-all font-medium text-[#12161C] placeholder:text-[#9AA2AF] hover:border-[#C7CEDA] text-base sm:text-lg";

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-[#12161C] selection:bg-[#0D9488]/10 overflow-x-hidden relative"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes text-fade-cycle {
          0%, 20% { opacity: 0; transform: translateY(10px); }
          25%, 45% { opacity: 1; transform: translateY(0); }
          50%, 70% { opacity: 0; transform: translateY(-10px); }
          75%, 100% { opacity: 0; transform: translateY(10px); }
        }

        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bubble-fade {
          0%, 100% { opacity: 0; transform: translateY(10px) scale(0.9); }
          10%, 90% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-gentle-bounce {
          animation: gentle-bounce 3s infinite ease-in-out;
        }

        .animate-bubble-fade {
          animation: bubble-fade 6s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 sm:h-12 lg:h-14 w-auto relative group">
            <div className="absolute inset-0 bg-teal-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />

            <img
              src="/swoop-logo-teal.png"
              alt="Koombo Logo"
              className="h-full w-auto object-contain relative z-10"
            />
          </div>

          <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none hidden sm:block">
            <span className="ml-2 align-middle text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase text-white bg-gradient-to-r from-teal-500 to-cyan-600 px-2.5 py-1 rounded-md shadow-sm shadow-teal-200">
              RIRI.ai
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium min-w-[80px] justify-end">
          {step > 0 && (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-2 text-slate-500 bg-white/50 px-3 py-1.5 rounded-full border border-slate-100 backdrop-blur-sm">
                <Icons.Shield />
                <span>Secure onboarding</span>
              </div>

              {/* Mobile View - Auto Changing Text */}
              <div className="flex md:hidden items-center gap-1.5 text-[#0D9488] font-bold relative h-6 overflow-hidden w-24 justify-end">
                 <Icons.Shield />
                 <div className="relative w-16 h-6 overflow-hidden">
                   <span className="absolute inset-0 flex items-center justify-end animate-text-cycle" style={{ animation: 'text-fade-cycle 9s infinite' }}>
                     Secured
                   </span>
                   <span className="absolute inset-0 flex items-center justify-end animate-text-cycle" style={{ animation: 'text-fade-cycle 9s infinite 3s' }}>
                     Faster
                   </span>
                   <span className="absolute inset-0 flex items-center justify-end animate-text-cycle" style={{ animation: 'text-fade-cycle 9s infinite 6s' }}>
                     Easier
                   </span>
                 </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        {renderProgress()}

        {error && (
          <FadeIn className="max-w-2xl mx-auto mb-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
            <span>{error}</span>
          </FadeIn>
        )}

        {/* Step 0: Landing */}
        {step === 0 && (
          <div>
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
              <FadeIn className="text-center lg:text-left order-2 lg:order-1" delay={100}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E6EC] bg-white px-4 py-2 text-sm font-semibold text-[#58606F]">
                  <Icons.Message />
                  <span className="hidden sm:inline">Message-first selling</span>
                  <span className="sm:hidden">Chat-based</span>
                </div>

                <h1
                  style={{
                    fontFamily: "'Fraunces', serif",
                  }}
                  className="mt-6 sm:mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-[#12161C] leading-[1.1]"
                >
                  Sell on Koombo
                  <br className="hidden sm:block" />
                  without another seller app.
                </h1>

                <p className="mt-5 sm:mt-6 text-lg sm:text-xl leading-relaxed text-[#58606F] max-w-lg mx-auto lg:mx-0">
                  Create your seller account, connect a messaging channel,
                  and let RIRI.ai turn product photos into listings from
                  the apps you already use.
                </p>

                <button
                  type="button"
                  onClick={handleStart}
                  className="mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9488] px-8 py-4 sm:py-5 font-bold text-white text-base sm:text-lg shadow-xl shadow-[#0D9488]/25 transition-colors hover:bg-[#0F766E] w-full sm:w-auto"
                >
                  Become a seller
                  <Icons.ChevronRight />
                </button>

                <p className="mt-4 sm:mt-5 text-sm text-[#9AA2AF]">
                  Your details, then your channel, then your first listing.
                </p>
              </FadeIn>

              <FadeIn className="order-1 lg:order-2 flex justify-center" delay={300}>
                <ChannelPreview />
              </FadeIn>
            </div>

            {/* Features Grid */}
            <div className="relative mt-16 sm:mt-20 lg:mt-28 max-w-6xl mx-auto">
              <div className="hidden sm:block absolute top-8 left-[10%] right-[10%] h-px bg-[#E2E6EC] -z-10" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12">
                {[
                  {
                    title: "Your details",
                    description:
                      "Share who you are and what you sell.",
                    icon: Icons.User,
                  },
                  {
                    title: "Connect a channel",
                    description:
                      "Choose Telegram or WhatsApp.",
                    icon: Icons.Message,
                  },
                  {
                    title: "How it works",
                    description:
                      "See how product messages turn into listings.",
                    icon: Icons.Bot,
                  },
                  {
                    title: "Go live",
                    description:
                      "Send your first product and get reviewed.",
                    icon: Icons.Store,
                  },
                ].map((item, index) => {
                  const StepIcon = item.icon;

                  return (
                    <FadeIn key={item.title} className="flex flex-col items-center text-center" delay={index * 100 + 200}>
                      <div className="relative">
                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center">
                          <StepIcon />
                        </div>

                        <div className="absolute -bottom-2 -right-2 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#0D9488] text-white text-xs sm:text-sm font-bold flex items-center justify-center ring-4 ring-[#F4F6F9]">
                          {index + 1}
                        </div>
                      </div>

                      <p className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-[#12161C]">
                        {item.title}
                      </p>

                      <p className="mt-2 text-sm sm:text-base text-[#58606F] leading-snug max-w-[160px]">
                        {item.description}
                      </p>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Seller Details */}
        {step === 1 && (
          <FadeIn className="animate-slide-in-right max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-[#E2E6EC] overflow-hidden">
              <div className="p-6 sm:p-10 border-b border-[#E2E6EC]">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#12161C]">
                  Tell us about yourself
                </h2>

                <p className="text-base text-[#58606F] mt-2">
                  This creates your seller account.
                </p>
              </div>

              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-base font-bold text-[#12161C]">
                    Full name *
                  </label>

                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      updateField(
                        "fullName",
                        e.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="e.g. Richmond Afoblikame"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-bold text-[#12161C]">
                    Shop or business name *
                  </label>

                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      updateField(
                        "businessName",
                        e.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="e.g. Richy's Fashion"
                    autoComplete="organization"
                  />

                  <p className="text-sm text-[#9AA2AF]">
                    No business name yet? Use your own name.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-base font-bold text-[#12161C]">
                      Phone number *
                    </label>

                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="+233 XX XXX XXXX"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-bold text-[#12161C]">
                      Email *
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-bold text-[#12161C]">
                    Location *
                  </label>

                  <select
                    value={formData.location}
                    onChange={(e) =>
                      updateField(
                        "location",
                        e.target.value
                      )
                    }
                    className={`${inputClass} cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center]`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239AA2AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundSize: "1.4em",
                    }}
                  >
                    <option value="">
                      Select your location
                    </option>

                    {LOCATIONS.map((location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-base font-bold text-[#12161C]">
                      What do you sell? *
                    </label>

                    <p className="text-sm text-[#9AA2AF] mt-1">
                      Select all that apply.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((category) => {
                      const selected =
                        formData.categories.includes(
                          category
                        );

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() =>
                            toggleCategory(category)
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-base font-semibold transition-colors ${
                            selected
                              ? "border-[#0D9488] bg-[#0D9488] text-white"
                              : "border-[#E2E6EC] bg-white text-[#58606F] hover:border-[#C7CEDA]"
                          }`}
                        >
                          {selected && <Icons.Check />}
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-[#F7F9FB] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-t border-[#E2E6EC]">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 text-[#58606F] font-bold hover:text-[#12161C] px-6 py-4 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  <Icons.ChevronLeft />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSellerDetailsNext}
                  disabled={
                    isSubmitting ||
                    !sellerDetailsValid
                  }
                  className="flex items-center justify-center gap-2 bg-[#12161C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0D9488] transition-colors disabled:cursor-not-allowed disabled:opacity-40 text-base sm:text-lg"
                >
                  {isSubmitting
                    ? "Setting up..."
                    : "Start Selling"}

                  {!isSubmitting && (
                    <Icons.ChevronRight />
                  )}
                </button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Step 2: Connect Channel */}
        {step === 2 && (
          <FadeIn className="animate-slide-in-right max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0D9488]">
                Connect a channel
              </p>

              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                }}
                className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-[#12161C] leading-[1.1]"
              >
                Choose your selling channel.
              </h2>

              <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-[#58606F] max-w-2xl mx-auto leading-relaxed">
                Telegram and WhatsApp are both available here.
                Connect the channel you want to use and continue
                with the seller setup.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <FadeIn delay={100}>
                <ChannelCard
                  channel="whatsapp"
                  label="WhatsApp"
                  description="Message-first selling through WhatsApp."
                  status={channelStatus.whatsapp}
                  onConnect={handleWhatsAppConnect}
                  icon={<WhatsAppIcon />}
                  connectedLabel="Coming soon"
                  unavailableMessage="Add a valid mobile number to enable WhatsApp messaging."
                  connected={false}
                  comingSoon={true}
                />
              </FadeIn>

              <FadeIn delay={200}>
                <ChannelCard
                  channel="telegram"
                  label="Telegram"
                  description="Use Telegram as your live seller workspace."
                  status={
                    telegram.connected
                      ? "connected"
                      : channelStatus.telegram
                  }
                  onConnect={connectTelegram}
                  icon={<Icons.Telegram />}
                  connectedLabel={
                    telegram.username
                      ? `Connected as @${telegram.username}`
                      : telegram.firstName ||
                        telegram.lastName
                      ? `Connected as ${
                          telegram.firstName || ""
                        }${
                          telegram.lastName
                            ? ` ${telegram.lastName}`
                            : ""
                        }`
                      : "Telegram connected"
                  }
                  unavailableMessage={
                    telegramHint ||
                    "Telegram connection is ready once your seller account exists."
                  }
                  connected={telegram.connected}
                />
                {telegramHint && !telegram.connected && (
                  <p className="mt-3 rounded-xl bg-[#F0FDFA] px-4 py-3 text-sm font-medium text-[#0E7A54]">
                    {telegramHint}
                  </p>
                )}
              </FadeIn>
            </div>

            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={goBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#58606F] font-bold hover:text-[#12161C] px-6 py-4 rounded-xl hover:bg-white transition-colors text-base"
              >
                <Icons.ChevronLeft />
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#12161C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0D9488] transition-colors text-base sm:text-lg"
              >
                Continue
                <Icons.ChevronRight />
              </button>
            </div>
          </FadeIn>
        )}

        {/* Step 3: How It Works */}
        {step === 3 && (
          <FadeIn className="animate-slide-in-right max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0D9488]">
                How selling works
              </p>

              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                }}
                className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-[#12161C] leading-[1.1]"
              >
                From photo to listing in minutes.
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10">
              <FadeIn delay={100} className="bg-white rounded-3xl border border-[#E2E6EC] shadow-2xl shadow-slate-200/40 p-6 sm:p-10">
                <div className="space-y-6 sm:space-y-8">
                  <StepItem
                    number="1"
                    title="Send"
                    body="Send a product photo or a quick message with the product details you want to list."
                    example="Nike Air Force 1, black, size 42, GH₵450, 3 available."
                  />

                  <StepItem
                    number="2"
                    title="RIRI.ai drafts it"
                    body="The assistant reads the image and your details to create a clean product listing."
                    example={`Product: Nike Air Force 1
Color: Black
Size: 42
Price: GH₵450
Stock: 3`}
                  />

                  <StepItem
                    number="3"
                    title="Review"
                    body="Koombo creates the listing draft for review before it goes live."
                    example="Ready for review before buyers see it."
                  />

                  <StepItem
                    number="4"
                    title="Go live"
                    body="Once approved, the listing appears to buyers and messages come through your connected channel."
                    example="Approved listing goes live for customers."
                  />
                </div>
              </FadeIn>

              <FadeIn delay={200} className="bg-[#F7F9FB] rounded-3xl border border-[#E2E6EC] shadow-2xl shadow-slate-200/30 p-6 sm:p-10">
                <div className="mb-6 sm:mb-8">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0D9488]">
                    Buyer messaging
                  </p>
                </div>

                <MessagingFlow />
              </FadeIn>
            </div>

            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={goBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#58606F] font-bold hover:text-[#12161C] px-6 py-4 rounded-xl hover:bg-white transition-colors text-base"
              >
                <Icons.ChevronLeft />
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#12161C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0D9488] transition-colors text-base sm:text-lg"
              >
                Continue
                <Icons.ChevronRight />
              </button>
            </div>
          </FadeIn>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <FadeIn className="animate-fade-in-up max-w-2xl mx-auto text-center">
            <div className="mx-auto w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#1E9E6D] text-white flex items-center justify-center shadow-xl shadow-emerald-900/15">
              <Icons.Check />
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', serif",
              }}
              className="mt-6 sm:mt-8 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-[#12161C]"
            >
              You&apos;re ready to sell.
            </h1>

            <p className="mt-4 sm:mt-5 text-[#58606F] leading-relaxed text-lg sm:text-xl">
              Welcome,{" "}
              <span className="font-bold text-[#12161C]">
                {formData.fullName.split(" ")[0] ||
                  "Seller"}
              </span>
              . Your setup is ready and your connected channel
              is waiting for product messages.
            </p>

            <div className="mt-8 sm:mt-12 rounded-3xl bg-white border border-[#E2E6EC] p-6 sm:p-8 text-left">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <p className="text-sm font-bold text-[#9AA2AF]">
                    Seller
                  </p>

                  <p className="font-bold text-[#12161C] mt-2 text-xl sm:text-2xl">
                    {formData.businessName}
                  </p>
                </div>

                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#F7F9FB] flex items-center justify-center text-[#0D9488]">
                  <Icons.Store />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-[#E2E6EC]">
                <StatusRow
                  label="Account created"
                  active={true}
                />

                <StatusRow
                  label="Telegram connected"
                  active={
                    telegram.connected ||
                    channelStatus.telegram ===
                      "connected"
                  }
                />

                <StatusRow
                  label="WhatsApp connected"
                  active={
                    whatsapp.connected ||
                    channelStatus.whatsapp ===
                      "connected"
                  }
                />
              </div>
            </div>

            <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4 text-left">
              <ReadyBullet text="Send a product photo or video." />
              <ReadyBullet text="Add a simple description." />
              <ReadyBullet text="RIRI.ai drafts the listing." />
              <ReadyBullet text="Koombo reviews it before it goes live." />
              <ReadyBullet text="Buyer messages reach your connected channel." />
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => {
                  if (sellerId) {
                    window.location.replace(`/sellers/${encodeURIComponent(sellerId)}`);
                    return;
                  }
                  telegram.connected ? openTelegramBot() : setStep(2);
                }}
                className="flex-1 flex items-center justify-center gap-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold shadow-xl shadow-[#0D9488]/25 transition-colors text-base sm:text-lg"
              >
                <Icons.Message />
                Open my dashboard
                <Icons.ArrowUpRight />
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 flex items-center justify-center gap-2.5 border border-[#E2E6EC] bg-white text-[#12161C] px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold transition-colors hover:border-[#C7CEDA] text-base sm:text-lg"
              >
                Connect another channel
              </button>
            </div>
          </FadeIn>
        )}
      </main>

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes splash-fade-out {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          70% {
            opacity: 0.3;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        @keyframes logo-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes loading-dots {
          0%, 20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          80%, 100% {
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.45s
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .splash-animation {
          animation: splash-fade-out 1.5s ease-in-out forwards;
          animation-delay: 2.5s;
        }

        .logo-pulse {
          animation: logo-pulse 2s ease-in-out infinite;
        }

        .loading-dot:nth-child(1) {
          animation: loading-dots 1.4s infinite;
          animation-delay: 0s;
        }

        .loading-dot:nth-child(2) {
          animation: loading-dots 1.4s infinite;
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation: loading-dots 1.4s infinite;
          animation-delay: 0.4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-slide-in-right,
          .splash-animation,
          .logo-pulse,
          .loading-dot,
          .animate-gentle-bounce,
          .animate-bubble-fade,
          .animate-ping-slow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function ChannelCard({
  channel,
  label,
  description,
  status,
  onConnect,
  icon,
  connectedLabel,
  unavailableMessage,
  connected = false,
  comingSoon = false,
}: {
  channel: Channel;
  label: string;
  description: string;
  status: StepStatus;
  onConnect: () => void;
  icon: React.ReactNode;
  connectedLabel: string;
  unavailableMessage: string;
  connected?: boolean;
  comingSoon?: boolean;
}) {
  const isConnected =
    status === "connected" || connected;

  const isConnecting =
    status === "connecting";

  const isError = status === "error";

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 shadow-xl relative overflow-hidden ${
        comingSoon
          ? "border-gray-200 bg-gray-50 opacity-60"
          : isConnected
          ? "border-[#1E9E6D]/30 bg-[#ECFDF5] shadow-[#1E9E6D]/15"
          : "border-[#E2E6EC] bg-white shadow-slate-200/40"
      }`}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            Coming Soon
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`h-14 sm:h-16 w-14 sm:w-16 rounded-2xl flex items-center justify-center ${
              label === "WhatsApp"
                ? "bg-[#E9F9EE] text-[#25D366]"
                : "bg-[#F0FDFA] text-[#0D9488]"
            }`}
          >
            {icon}
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-bold text-[#12161C]">
              {label}
            </p>

            <p className="text-sm sm:text-base text-[#58606F] mt-1">
              {description}
            </p>
          </div>
        </div>

        {!comingSoon && (
          <div
            className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap ${
              isConnected
                ? "bg-[#DFF5E9] text-[#0E7A54]"
                : isError
                ? "bg-[#FDECEC] text-[#B91C1C]"
                : "bg-[#F3F4F6] text-[#58606F]"
            }`}
          >
            {isConnected
              ? "Connected"
              : isConnecting
              ? "Connecting"
              : isError
              ? "Unavailable"
              : "Not connected"}
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-8 rounded-2xl border border-white/60 bg-white/70 px-4 sm:px-5 py-3 sm:py-4 text-base text-[#58606F]">
        {comingSoon ? (
          <div className="text-gray-500 font-medium">
            This feature will be available soon!
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-2 text-[#0E7A54] font-semibold">
            <Icons.Check />
            <span className="truncate">{connectedLabel}</span>
          </div>
        ) : isError ? (
          <div className="text-[#B91C1C] font-medium">
            {unavailableMessage}
          </div>
        ) : (
          <div className="text-[#58606F]">
            Not connected yet.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={comingSoon ? undefined : onConnect}
        disabled={comingSoon || isConnecting || isConnected}
        className={`mt-6 sm:mt-8 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-2xl font-bold transition-colors text-base sm:text-lg ${
          comingSoon
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : isConnected
            ? "bg-[#0E7A54] text-white"
            : label === "WhatsApp"
            ? "bg-[#25D366] text-white hover:bg-[#1FAE59]"
            : "bg-[#0D9488] text-white hover:bg-[#0F766E]"
        } ${
          isConnecting
            ? "opacity-70 cursor-not-allowed"
            : ""
        }`}
      >
        {comingSoon
          ? "Coming Soon"
          : isConnecting
          ? "Connecting..."
          : isConnected
          ? "Connected"
          : "Connect"}

        {!isConnecting && !comingSoon && <Icons.ArrowUpRight />}
      </button>
    </div>
  );
}

function ChannelPreview() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] animate-fade-in-up">
      {/* Modern iPhone-style frame */}
      <div className="relative mx-auto">
        {/* Phone outer frame */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] sm:rounded-[3.5rem] p-2 shadow-2xl">
          {/* Inner bezel */}
          <div className="bg-black rounded-[2.7rem] sm:rounded-[3.2rem] p-1.5">
            {/* Screen */}
            <div className="relative bg-white rounded-[2.4rem] sm:rounded-[2.9rem] overflow-hidden">
              {/* Splash Screen */}
              {showSplash && (
                <div className="absolute inset-0 z-30 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] flex flex-col items-center justify-center splash-animation">
                  {/* Logo Container */}
                  <div className="mb-8 logo-pulse">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-2">
                      <img 
                        src="/swoop-logo-teal.png" 
                        alt="Koombo Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* App Name */}
                  <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                    Koombo
                  </h2>

                  {/* Tagline */}
                  <p className="text-white/80 text-sm sm:text-base mb-8">
                    Sell smarter, not harder
                  </p>

                  {/* Loading Dots */}
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
                    <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
                    <div className="w-2 h-2 bg-white rounded-full loading-dot"></div>
                  </div>

                  {/* Version */}
                  <p className="absolute bottom-8 text-white/50 text-xs">
                    v1.0.0
                  </p>
                </div>
              )}

              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-28 h-6 sm:h-7 bg-black rounded-b-2xl z-20"></div>
              
              {/* Status bar - TEAL */}
              <div className="flex items-center justify-between px-6 pt-2 pb-1 bg-[#0D9488] text-white text-xs font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white rounded-sm">
                    <div className="w-3 h-full bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* App header - TEAL */}
              <div className="flex items-center justify-between bg-[#0D9488] px-4 sm:px-5 pb-3 pt-1 text-white">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/15 flex items-center justify-center">
                    <Icons.Message />
                  </div>

                  <div>
                    <p className="text-sm sm:text-base font-bold">
                      Koombo Seller
                    </p>

                    <p className="text-xs sm:text-sm text-white/70">
                      Ready to sell
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-bold">
                  2 channels
                </div>
              </div>

              {/* Chat content */}
              <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 min-h-[400px] sm:min-h-[480px] bg-gray-50">
                <div className="bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 sm:h-9 w-8 sm:w-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                      <WhatsAppIcon />
                    </div>

                    <p className="text-sm sm:text-base font-bold text-[#12161C]">
                      WhatsApp
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#58606F] leading-snug">
                    Customer: "Is size 42 available?"
                  </p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 sm:h-9 w-8 sm:w-9 rounded-full bg-[#229ED9] flex items-center justify-center text-white">
                      <Icons.Telegram />
                    </div>

                    <p className="text-sm sm:text-base font-bold text-[#12161C]">
                      Telegram
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#58606F] leading-snug">
                    Seller: "Yes, size 42 is available."
                  </p>
                </div>

                <div className="bg-[#DDF5F3] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 text-sm sm:text-base text-[#0E7A54] font-semibold shadow-sm">
                  Order confirmed • listing ready
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 shadow-sm">
                  <p className="text-sm sm:text-base text-[#58606F] leading-snug">
                    New product photo received...
                  </p>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l"></div>
        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l"></div>
        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-700 rounded-l"></div>
        <div className="absolute -right-1 top-36 w-1 h-16 bg-gray-700 rounded-r"></div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#F7F9FB] px-4 py-3.5 sm:py-4 border border-[#E2E6EC]">
      <p className="text-base font-medium text-[#12161C]">
        {label}
      </p>

      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
          active
            ? "bg-[#EAF7F1] text-[#0E7A54]"
            : "bg-[#F3F4F6] text-[#9AA2AF]"
        }`}
      >
        {active ? (
          <Icons.Check />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-[#9AA2AF] inline-block" />
        )}

        {active ? "Done" : "Waiting"}
      </div>
    </div>
  );
}

function ReadyBullet({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white border border-[#E2E6EC] px-4 sm:px-5 py-3.5 sm:py-4 text-base text-[#12161C]">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF7F1] text-[#0E7A54] flex-shrink-0">
        <Icons.Check />
      </div>

      <span>{text}</span>
    </div>
  );
}

function StepItem({
  number,
  title,
  body,
  example,
}: {
  number: string;
  title: string;
  body: string;
  example: string;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-[#0D9488] text-base sm:text-lg font-bold text-white shadow-sm shadow-[#0D9488]/20 flex-shrink-0">
        {number}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-[#12161C]">
          {title}
        </h3>

        <p className="mt-2 text-base sm:text-lg leading-relaxed text-[#58606F]">
          {body}
        </p>

        <div className="mt-3 sm:mt-4 rounded-2xl border border-[#E2E6EC] bg-[#F7F9FB] px-4 py-3 text-base leading-relaxed text-[#12161C] whitespace-pre-line break-words">
          {example}
        </div>
      </div>
    </div>
  );
}

function MessagingFlow() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl border border-[#E2E6EC] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="h-3 w-3 rounded-full bg-[#0D9488]" />

          <p className="text-sm font-bold text-[#12161C] uppercase tracking-[0.18em]">
            Buyer
          </p>
        </div>

        <p className="text-base text-[#58606F]">
          "Is size 42 available?"
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-[#0D9488] text-white">
          <Icons.ChevronRight />
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-[#E2E6EC] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="h-3 w-3 rounded-full bg-[#1E9E6D]" />

          <p className="text-sm font-bold text-[#12161C] uppercase tracking-[0.18em]">
            Koombo
          </p>
        </div>

        <p className="text-base text-[#58606F]">
          Routes the message to the seller's connected channel.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-[#1E9E6D] text-white">
          <Icons.ChevronRight />
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-[#E2E6EC] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="h-3 w-3 rounded-full bg-[#25D366]" />

          <p className="text-sm font-bold text-[#12161C] uppercase tracking-[0.18em]">
            Seller's channel
          </p>
        </div>

        <p className="text-base text-[#58606F]">
          "Yes, size 42 is available."
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
          <Icons.ChevronRight />
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-[#E2E6EC] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="h-3 w-3 rounded-full bg-[#0D9488]" />

          <p className="text-sm font-bold text-[#12161C] uppercase tracking-[0.18em]">
            Buyer
          </p>
        </div>

        <p className="text-base text-[#58606F]">
          Gets the answer without leaving their app.
        </p>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.57 2 2.1 6.38 2.1 11.76c0 1.93.56 3.76 1.53 5.34L2 22l4.94-1.58A9.78 9.78 0 0 0 12.04 21.5C17.51 21.5 21.98 17.12 21.98 11.74S17.51 2 12.04 2Zm0 17.79c-1.47 0-2.91-.39-4.18-1.12l-.3-.18-2.93.94 1-2.86-.2-.31A7.88 7.88 0 0 1 4.2 11.76c0-4.37 3.57-7.92 7.84-7.92S19.88 7.39 19.88 11.76c0 4.39-3.57 7.93-7.84 7.93Zm4.3-5.92c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.38-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.06 3.6.57.25 1.01.4 1.35.52.57.18 1.08.15 1.48.09.45-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
