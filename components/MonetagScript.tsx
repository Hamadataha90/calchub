"use client";

import { useEffect } from "react";

interface MonetagScriptProps {
  /** Only start the load sequence when true (i.e. result is visible) */
  isActive: boolean;
}

const SESSION_KEY = "monetag_loaded";

export default function MonetagScript({ isActive }: MonetagScriptProps) {
  useEffect(() => {
    if (!isActive) return;

    // Run only once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let fired = false;

    const inject = () => {
      if (fired) return;
      fired = true;

      document.removeEventListener("click", inject, { capture: true });
      clearTimeout(timer);

      // Guard against duplicate script tags
      if (document.querySelector('script[data-zone="223528"]')) return;

      const script = document.createElement("script");
      script.src = "https://quge5.com/88/tag.min.js";
      script.setAttribute("data-zone", "223528");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);

      sessionStorage.setItem(SESSION_KEY, "1");
    };

    // Trigger on first click after result is shown
    document.addEventListener("click", inject, { capture: true, once: true });

    // Fallback: 10 seconds after result appears
    const timer = setTimeout(inject, 10_000);

    return () => {
      document.removeEventListener("click", inject, { capture: true });
      clearTimeout(timer);
    };
  }, [isActive]);

  return null;
}
