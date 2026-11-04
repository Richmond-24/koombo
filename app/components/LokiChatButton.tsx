'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    botpress?: {
      toggle?: () => void;
      open?: () => void;
      show?: () => void;
    };
  }
}

const INJECT_SCRIPT_URL = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';
const LOKI_CONFIG_URL = 'https://files.bpcontent.cloud/2026/11/01/19/20261101191430-VXCD3170.js';

export default function LokiChatButton() {
  useEffect(() => {
    const patchBotText = () => {
      const widgetRoot = document.querySelector(
        '.bpw-layout, .bpw-widget-container, .bpw-chat-container, .bpw-conversation-container'
      );

      if (!widgetRoot) return;

      const walker = document.createTreeWalker(widgetRoot, NodeFilter.SHOW_TEXT);
      let node: Node | null = walker.nextNode();

      while (node) {
        const value = node.textContent ?? '';

        if (/welcome to koombo/i.test(value)) {
          node.textContent = "Hello, I'm Loki 👋";
        } else if (/explore the marketplace or find the next step to list your business/i.test(value)) {
          node.textContent = 'Your Koombo assistant. Ask me anything about shopping or selling.';
        }

        node = walker.nextNode();
      }
    };

    patchBotText();

    const observer = new MutationObserver(() => {
      patchBotText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .bpw-widget-container,
        .bpw-layout,
        .bpw-chat-container,
        .bpw-conversation-container,
        .bpw-chat-history,
        [data-bp-widget],
        .bp-widget,
        .bp-webchat,
        [id*="botpress"],
        #bp-webchat,
        .bpw-widget-btn,
        .bpw-widget-button,
        .bpw-floating-button {
          position: fixed !important;
          right: 18px !important;
          bottom: 18px !important;
          left: auto !important;
          top: auto !important;
          transform: none !important;
          z-index: 99999 !important;
        }

        .bpw-widget-container,
        .bpw-layout,
        .bpw-chat-container,
        .bpw-conversation-container,
        .bpw-chat-history {
          width: min(360px, calc(100vw - 24px)) !important;
          max-width: min(360px, calc(100vw - 24px)) !important;
          height: auto !important;
          max-height: min(66vh, 620px) !important;
          border-radius: 24px !important;
          box-shadow: 0 24px 80px rgba(17, 24, 39, 0.18) !important;
        }

        .bpw-layout,
        .bpw-widget-container {
          right: 18px !important;
          bottom: 86px !important;
        }

        .bpw-widget-btn,
        .bpw-widget-button,
        .bpw-floating-button {
          width: 56px !important;
          height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          border-radius: 9999px !important;
          background: linear-gradient(135deg, #111827 0%, #374151 100%) !important;
          box-shadow: 0 14px 32px rgba(17, 24, 39, 0.22) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
        }

        .bpw-widget-btn svg,
        .bpw-widget-button svg,
        .bpw-floating-button svg,
        .bpw-widget-btn i,
        .bpw-widget-button i,
        .bpw-floating-button i {
          color: #ffffff !important;
          fill: #ffffff !important;
          stroke: #ffffff !important;
        }

        .bpw-header-container {
          min-height: 58px !important;
          padding: 12px 16px !important;
          background: #111827 !important;
          color: #ffffff !important;
          border-radius: 24px 24px 0 0 !important;
        }

        .bpw-message-text,
        .bpw-date-container,
        .bpw-quick-replies {
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        @media (max-width: 767px) {
          .bpw-widget-container,
          .bpw-layout,
          .bpw-chat-container,
          .bpw-conversation-container,
          .bpw-chat-history {
            width: min(88vw, 320px) !important;
            max-width: min(88vw, 320px) !important;
            max-height: 58vh !important;
          }

          .bpw-widget-container,
          .bpw-layout {
            right: 12px !important;
            bottom: 76px !important;
          }

          .bpw-widget-btn,
          .bpw-widget-button,
          .bpw-floating-button {
            right: 12px !important;
            bottom: 12px !important;
            width: 52px !important;
            height: 52px !important;
            max-width: 52px !important;
            max-height: 52px !important;
          }
        }
      `}</style>

      <script src={INJECT_SCRIPT_URL} defer />
      <script src={LOKI_CONFIG_URL} defer />
    </>
  );
}