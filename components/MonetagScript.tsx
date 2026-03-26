"use client";

import { useEffect, useRef } from "react";

const MONETAG_KEY = process.env.NEXT_PUBLIC_MONETAG_KEY;

export default function MonetagScript() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!MONETAG_KEY || loaded.current) return;

    function load() {
      if (loaded.current) return;
      loaded.current = true;

      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${MONETAG_KEY}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Trigger after 10 seconds
    const timer = setTimeout(load, 10_000);

    // OR on first user interaction
    const events = ["click", "scroll", "keydown", "touchstart"] as const;
    const onInteraction = () => load();
    events.forEach((ev) => window.addEventListener(ev, onInteraction, { once: true }));

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, onInteraction));
    };
  }, []);

  return null;
}
