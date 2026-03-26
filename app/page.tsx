"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Target, Mail, ArrowRight } from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          Free · No Sign-up Required
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
      >
        Calorie Calculator & <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Nutrition Tools
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 max-w-2xl text-lg text-slate-500 sm:text-xl leading-relaxed"
      >
        Instantly calculate your daily calorie needs based on your unique body metrics.
        Get a personalised, goal-oriented plan to take control of your diet today.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center"
      >
        <Link
          href="/calories"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
        >
          Try the Calculator
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/blog"
          className="rounded-2xl border border-slate-200 bg-white/50 px-8 py-4 text-base font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        >
          Read our Guides
        </Link>
      </motion.div>

      {/* Feature framework */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 text-left"
      >
        {[
          {
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-100/50",
            title: "Instant Results",
            body: "Live algorithm calculates BMR and TDEE in real-time. No waiting.",
          },
          {
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-100/50",
            title: "Goal-Based Plans",
            body: "Precise mathematical surpluses and deficits for lean bulking or fat loss.",
          },
          {
            icon: Mail,
            color: "text-emerald-500",
            bg: "bg-emerald-100/50",
            title: "Email Your Plan",
            body: "Get a beautifully formatted PDF report sent straight to your inbox.",
          },
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/60 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-50 blur-2xl group-hover:from-blue-100 transition-colors" />
              
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feat.bg}`}>
                <Icon className={`h-6 w-6 ${feat.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{feat.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{feat.body}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
