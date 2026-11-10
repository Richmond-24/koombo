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
  }, [isOpen, messages]);

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
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
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
        <div className="w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-[28px] border border-[#CDEAF0] bg-white shadow-[0_24px_80px_rgba(8,58,74,0.22)] ring-1 ring-[#CDEAF0]">
          <div className="flex items-center justify-between bg-[#0B4F63] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Shuri AI</p>
                <p className="text-[10px] text-cyan-100">Koombo shopping assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Shuri chat"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="max-h-[26rem] space-y-3 overflow-y-auto bg-[#F2FAFC] p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
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
                <div className="rounded-2xl bg-white px-3 py-2 text-sm text-[#475569] shadow-sm ring-1 ring-[#D6EEF3]">
                  Shuri is thinking…
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-[#D6EEF3] bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Shuri anything…"
              className="h-11 flex-1 rounded-full border border-[#E5E7EB] bg-[#F2FAFC] px-4 text-sm text-[#111827] outline-none transition focus:border-[#0B4F63] focus:ring-2 focus:ring-cyan-200"
              aria-label="Ask Shuri a question"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#0B4F63] text-white transition hover:bg-[#0E7490] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message to Shuri"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {isOpen ? (
        /* Close button while the chat is open */
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close Shuri chat"
          className="grid h-16 w-16 place-items-center rounded-full bg-[#0B4F63] text-white shadow-[0_18px_40px_rgba(11,79,99,0.4)] transition duration-200 hover:scale-105 hover:bg-[#0E7490] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
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
          className="group flex h-16 items-center rounded-full bg-[#0B4F63] pl-2 pr-2 text-white shadow-[0_18px_40px_rgba(11,79,99,0.4)] transition-all duration-300 ease-out hover:bg-[#0E7490] hover:shadow-[0_22px_48px_rgba(14,116,144,0.5)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 motion-reduce:transition-none"
        >
          {/* Icon circle with soft pulse ring */}
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#0B4F63]">
            <span
              aria-hidden
              className="shuri-ping absolute inset-0 rounded-full bg-cyan-300"
            />
            <Bot className="relative h-6 w-6 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
          </span>

          {/* Text that draws out */}
          <span
            className="overflow-hidden whitespace-nowrap text-base font-bold tracking-wide transition-all duration-300 ease-out max-w-[9rem] pl-3 pr-4 opacity-100 md:max-w-0 md:pl-0 md:pr-0 md:opacity-0 md:group-hover:max-w-[9rem] md:group-hover:pl-3 md:group-hover:pr-4 md:group-hover:opacity-100 md:group-focus-visible:max-w-[9rem] md:group-focus-visible:pl-3 md:group-focus-visible:pr-4 md:group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            Ask Shuri
          </span>
        </button>
      )}
    </div>
  );
}