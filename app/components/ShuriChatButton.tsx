'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, SendHorizontal, Sparkles, X } from 'lucide-react';
import { useCookieConsent } from './cookies/CookieConsentProvider';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export default function ShuriChatButton() {
  const { isReady } = useCookieConsent();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hi, I\'m Shuri. I can help you discover products, compare sellers, and answer shopping questions on Koombo.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('koombo-shuri-open', handleOpen);
    return () => window.removeEventListener('koombo-shuri-open', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isOpen, messages, isLoading]);

  /* On phones the chat is a full-screen sheet, so stop the page behind it from scrolling */
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    if (window.matchMedia('(min-width: 640px)').matches) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = trimmed;
    setInput('');
    setMessages((current) => [...current, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/shuri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          history: messages.map(({ role, text }) => ({ role, text })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Shuri could not answer right now.');
      }

      setMessages((current) => [...current, { role: 'assistant', text: payload.answer || 'I am ready to help you shop on Koombo.' }]);

      if (Array.isArray(payload.suggestions) && payload.suggestions.length > 0) {
        const suggestionsText = `Suggested prompts: ${payload.suggestions.join(' • ')}`;
        setMessages((current) => [...current, { role: 'assistant', text: suggestionsText }]);
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text:
            error instanceof Error
              ? error.message
              : 'I am having trouble responding right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isReady) {
    return null;
  }

  return (
    <div
      className={
        isOpen
          ? /* Phones: full-screen sheet. sm+: floating panel bottom-right */
            'fixed inset-0 z-[60] flex flex-col sm:inset-auto sm:bottom-5 sm:right-5 sm:items-end sm:gap-3'
          : 'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-5 sm:right-5'
      }
    >
      <style>{`
        @keyframes shuri-ping {
          0% { transform: scale(1); opacity: 0.55; }
          80%, 100% { transform: scale(1.9); opacity: 0; }
        }
        .shuri-ping { animation: shuri-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .shuri-ping { animation: none; }
        }
      `}</style>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Shuri AI chat"
          className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white sm:h-[min(36rem,calc(100dvh-7.5rem))] sm:w-[24rem] sm:rounded-[28px] sm:border sm:border-[#CDEAF0] sm:shadow-[0_24px_80px_rgba(8,58,74,0.22)] sm:ring-1 sm:ring-[#CDEAF0]"
        >
          {/* HEADER: always visible, with a clear close button */}
          <div className="flex shrink-0 items-center justify-between gap-3 bg-[#0B4F63] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Shuri AI</p>
                <p className="truncate text-[11px] text-cyan-100">Koombo shopping assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Shuri chat"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* MESSAGES: takes the remaining height and scrolls */}
          <div
            ref={listRef}
            aria-live="polite"
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#F2FAFC] p-3 sm:p-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[15px] leading-6 sm:max-w-[85%] sm:text-sm ${
                    message.role === 'user'
                      ? 'bg-[#0B4F63] text-white'
                      : 'bg-white text-[#1F2937] shadow-sm ring-1 ring-[#D6EEF3]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-3.5 py-2.5 text-sm text-[#475569] shadow-sm ring-1 ring-[#D6EEF3]">
                  Shuri is thinking…
                </div>
              </div>
            )}
          </div>

          {/* INPUT BAR: pinned to the bottom, clear of the home indicator */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 items-center gap-2 border-t border-[#D6EEF3] bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Shuri anything…"
              enterKeyHint="send"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 rounded-full border border-[#E5E7EB] bg-[#F2FAFC] px-4 text-base text-[#111827] outline-none transition focus:border-[#0B4F63] focus:ring-2 focus:ring-cyan-200 sm:h-11 sm:text-sm"
              aria-label="Ask Shuri a question"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#0B4F63] text-white transition hover:bg-[#0E7490] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:w-11"
              aria-label="Send message to Shuri"
            >
              <SendHorizontal className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </form>
        </div>
      )}

      {isOpen ? (
        /* Floating close button: desktop only (phones use the header close button) */
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close Shuri chat"
          className="hidden h-16 w-16 place-items-center rounded-full bg-[#0B4F63] text-white shadow-[0_18px_40px_rgba(11,79,99,0.4)] transition duration-200 hover:scale-105 hover:bg-[#0E7490] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 sm:grid"
        >
          <X className="h-7 w-7" />
        </button>
      ) : (
        /* "Ask Shuri" text button.
           Mobile: label is always visible.
           Desktop (md+): icon only, label draws out on hover or keyboard focus. */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Shuri chat"
          className="group flex h-14 items-center rounded-full bg-[#0B4F63] pl-1.5 pr-1.5 text-white shadow-[0_18px_40px_rgba(11,79,99,0.4)] transition-all duration-300 ease-out hover:bg-[#0E7490] hover:shadow-[0_22px_48px_rgba(14,116,144,0.5)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 motion-reduce:transition-none sm:h-16 sm:pl-2 sm:pr-2"
        >
          {/* Icon circle with soft pulse ring */}
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#0B4F63] sm:h-12 sm:w-12">
            <span
              aria-hidden
              className="shuri-ping absolute inset-0 rounded-full bg-cyan-300"
            />
            <Bot className="relative h-6 w-6 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
          </span>

          {/* Text that draws out */}
          <span
            className="overflow-hidden whitespace-nowrap text-sm font-bold tracking-wide transition-all duration-300 ease-out max-w-[9rem] pl-2.5 pr-3.5 opacity-100 sm:text-base md:max-w-0 md:pl-0 md:pr-0 md:opacity-0 md:group-hover:max-w-[9rem] md:group-hover:pl-3 md:group-hover:pr-4 md:group-hover:opacity-100 md:group-focus-visible:max-w-[9rem] md:group-focus-visible:pl-3 md:group-focus-visible:pr-4 md:group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            Ask Shuri
          </span>
        </button>
      )}
    </div>
  );
}