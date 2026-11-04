"use client";

import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../../lib/auth-config";

declare global {
  interface Window { google?: any }
}

const SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-identity-services";

let scriptPromise: Promise<void> | null = null;
let initializedClientId = "";
let activeCredentialHandler: ((credential: string) => void) | null = null;
function loadGsi(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Google sign-in is only available in a browser."));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      const created = !script;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SRC;
        script.async = true;
        script.defer = true;
      }
      const timeout = window.setTimeout(() => {
        scriptPromise = null;
        reject(new Error("Google sign-in took too long to load."));
      }, 15000);
      script.addEventListener("load", () => {
        window.clearTimeout(timeout);
        if (window.google?.accounts?.id) resolve();
        else { scriptPromise = null; reject(new Error("Google sign-in loaded without its identity service.")); }
      }, { once: true });
      script.addEventListener("error", () => {
        window.clearTimeout(timeout);
        scriptPromise = null;
        reject(new Error("Google sign-in could not load."));
      }, { once: true });
      if (created) document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/** Reads the display fields from a Google ID token. For prefilling the form only.
 *  The backend MUST verify the token itself; never trust this on the server side. */
export function decodeGoogleCredential(credential: string): { email: string; name: string; picture?: string; emailVerified: boolean } | null {
  try {
    const payload = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
    const p = JSON.parse(json);
    return { email: String(p.email || ""), name: String(p.name || ""), picture: p.picture, emailVerified: !!p.email_verified };
  } catch { return null; }
}

export default function GoogleButton({
  onCredential,
  text = "continue_with",
  disabled = false,
  onError,
}: {
  onCredential: (credential: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
  disabled?: boolean;
  onError?: (message: string) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);
  const errorCb = useRef(onError);
  cb.current = onCredential;
  errorCb.current = onError;
  const [failure, setFailure] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    const handler = (credential: string) => cb.current(credential);
    activeCredentialHandler = handler;
    loadGsi()
      .then(() => {
        if (cancelled || !holder.current) return;
        if (initializedClientId !== GOOGLE_CLIENT_ID) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (r: { credential?: string }) => {
              if (r?.credential) activeCredentialHandler?.(r.credential);
              else errorCb.current?.("Google did not return an ID token. Try again or use email and password.");
            },
          });
          initializedClientId = GOOGLE_CLIENT_ID;
        }
        const width = Math.min(400, Math.max(240, holder.current.offsetWidth || 360));
        holder.current.innerHTML = "";
        window.google.accounts.id.renderButton(holder.current, {
          type: "standard", theme: "outline", size: "large", text, shape: "rectangular", logo_alignment: "left", width,
        });
      })
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : "Google sign-in could not load.";
        setFailure(message);
        errorCb.current?.(message);
      });
    return () => {
      cancelled = true;
      if (activeCredentialHandler === handler) activeCredentialHandler = null;
    };
  }, [text]);

  if (!GOOGLE_CLIENT_ID) {
    return <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Google sign-in is unavailable because the frontend environment is missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Add it to the deployment environment and rebuild.</p>;
  }
  if (failure) {
    return <p role="status" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{failure} You can use email and password instead.</p>;
  }
  return <div ref={holder} aria-busy={disabled} className={`flex min-h-[44px] w-full justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`} />;
}
