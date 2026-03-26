"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormData } from "@/types";
import { Send, CheckCircle } from "lucide-react";

interface EmailCaptureProps {
  calories: number;
  goal: FormData["goal"];
  onSubmit?: (email: string) => void;
}

export default function EmailCapture({ calories, goal, onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, calories, goal }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setSubmitted(true);
      onSubmit?.(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div 
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] border border-emerald-200/50 bg-gradient-to-br from-emerald-500/10 via-white/80 to-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-emerald-500/10 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100/80 shadow-inner"
          >
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </motion.div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Plan Successfully Generated
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your personalised nutrition strategy is on its way to{" "}
              <span className="font-bold text-emerald-700">{email}</span>.
            </p>
          </div>
          
          <div className="rounded-2xl bg-white/60 border border-emerald-100/50 p-4 shadow-sm relative z-10 text-left">
            <p className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-base">💡</span>
              <span>
                <strong className="font-semibold text-slate-900">Pro Tip:</strong> Check your spam folder if it doesn't arrive in the next 2 minutes. Start tracking today for the best results.
              </span>
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="capture"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 opacity-5 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center relative z-10 space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Get Your Complete Plan
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
              We&apos;ll send a full breakdown including macros, meal timing, and actionable tips for your specific goal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10 max-w-sm mx-auto">
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="peer w-full rounded-2xl border border-slate-200/80 bg-white/80 px-5 pt-6 pb-2 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:opacity-60"
              />
              <label 
                htmlFor="email" 
                className="absolute left-5 top-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-blue-500"
              >
                Email Address
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Preparing payload...
                </span>
              ) : (
                <>
                  Send My Free Plan
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              className="rounded-xl bg-red-50/80 backdrop-blur-sm px-4 py-3 text-xs font-medium text-red-600 border border-red-100/50 text-center max-w-sm mx-auto relative z-10"
            >
              {error}
            </motion.p>
          )}

          <p className="text-center text-[11px] font-semibold text-slate-400 tracking-wide uppercase relative z-10">
            No spam. Unsubscribe directly any time.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
