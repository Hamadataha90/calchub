"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/60 bg-white/50 py-12 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row text-center md:text-left">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <Calculator className="h-5 w-5 text-blue-600" />
          <span>Calc<span className="text-blue-600">Hub</span></span>
        </div>
        
        <p className="text-sm text-slate-500">
          Built to be beautiful. Ready to help you hit your goals.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/calories" className="hover:text-blue-600 transition-colors">
              Calculators
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
