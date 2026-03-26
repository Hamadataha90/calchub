"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, LayoutDashboard, BookText, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Calculators", href: "/calories", icon: Calculator },
    { name: "Blog", href: "/blog", icon: BookText },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl transition-all">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md transition-transform group-hover:scale-105 group-active:scale-95">
            <Calculator className="h-4 w-4" />
          </div>
          <span>Calc<span className="text-blue-600">Hub</span></span>
        </Link>
        
        <ul className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 border border-slate-200/50">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/calories"
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow transition-all active:scale-95"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
