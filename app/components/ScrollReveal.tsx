"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("main section, main article, main > div");

    elements.forEach((element) => {
      if (!element.hasAttribute("data-scroll-reveal")) {
        element.setAttribute("data-scroll-reveal", "true");
      }
    });

    const targets = document.querySelectorAll(
      "[data-scroll-reveal], .fade-scroll-section, .scroll-reveal"
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    targets.forEach((node) => {
      if (!node.classList.contains("is-visible")) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
