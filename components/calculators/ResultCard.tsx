"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { FormData } from "@/types";
import { CheckCircle2, Target } from "lucide-react";

const GOAL_CONFIG: Record<
  FormData["goal"],
  { label: string; color: string; context: string; tips: string[] }
> = {
  lose: {
    label: "Weight Loss",
    color: "amber",
    context:
      "You're eating in a 500 kcal daily deficit. At this rate you'll lose approximately 0.5 kg per week — a safe, sustainable pace that preserves muscle mass.",
    tips: [
      "Cut added sugar — swap fizzy drinks for zero-cal alternatives",
      "Increase protein to ~2 g per kg bodyweight to preserve muscle",
      "Drink at least 2.5 L of water daily to reduce hunger",
    ],
  },
  maintain: {
    label: "Maintenance",
    color: "emerald",
    context:
      "You're eating at your Total Daily Energy Expenditure (TDEE). This keeps your weight stable — your energy in equals your energy out.",
    tips: [
      "Keep sugar intake under 10% of total calories",
      "Eat 1.6–2 g of protein per kg bodyweight to sustain muscle",
      "Drink 2 L of water daily and more on active days",
    ],
  },
  gain: {
    label: "Lean Bulk",
    color: "blue",
    context:
      "You're eating in a 300 kcal daily surplus. This lean bulk approach maximises muscle growth while minimising fat gain — ideal when combined with resistance training.",
    tips: [
      "Prioritise complex carbs for clean energy and recovery",
      "Target 1.8–2.4 g of protein per kg bodyweight for muscle growth",
      "Stay well hydrated — aim for 3 L of water per day",
    ],
  },
};

const colorMap = {
  amber: {
    border: "border-amber-200/50",
    bg: "bg-gradient-to-br from-amber-500/10 via-white/60 to-white/60",
    glow: "shadow-amber-500/20",
    badgeBg: "bg-amber-100/80",
    badgeText: "text-amber-700",
    number: "text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600",
    icon: "text-amber-500",
    bullet: "text-amber-400",
    cta: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/25",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
  },
  emerald: {
    border: "border-emerald-200/50",
    bg: "bg-gradient-to-br from-emerald-500/10 via-white/60 to-white/60",
    glow: "shadow-emerald-500/20",
    badgeBg: "bg-emerald-100/80",
    badgeText: "text-emerald-700",
    number: "text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-600",
    icon: "text-emerald-500",
    bullet: "text-emerald-400",
    cta: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/20",
  },
  blue: {
    border: "border-blue-200/50",
    bg: "bg-gradient-to-br from-blue-500/10 via-white/60 to-white/60",
    glow: "shadow-blue-500/20",
    badgeBg: "bg-blue-100/80",
    badgeText: "text-blue-700",
    number: "text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600",
    icon: "text-blue-500",
    bullet: "text-blue-400",
    cta: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
  },
};

interface ResultCardProps {
  calories: number;
  goal: FormData["goal"];
  onCTAClick?: () => void;
}

// Animate numbers up cleanly
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export default function ResultCard({ calories, goal, onCTAClick }: ResultCardProps) {
  const config = GOAL_CONFIG[goal];
  const c = colorMap[config.color as keyof typeof colorMap];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden rounded-[2rem] border backdrop-blur-3xl p-8 sm:p-10 shadow-2xl space-y-8 ${c.border} ${c.bg} ${c.glow}`}
    >
      {/* Decorative blurred background orb */}
      <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-40 pointer-events-none ${c.accentBg}`} />

      {/* Header */}
      <div className="flex flex-col items-center gap-3 relative z-10">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-sm ${c.badgeBg} ${c.badgeText}`}>
          <Target className="h-3.5 w-3.5" />
          {config.label} Target
        </span>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-2">
          Daily Calorie Goal
        </p>
      </div>

      {/* Animated Number display */}
      <div className="text-center relative z-10 py-4">
        <div className={`text-7xl sm:text-8xl font-black tabular-nums tracking-tighter leading-none drop-shadow-sm ${c.number}`}>
          <AnimatedNumber value={calories} />
        </div>
        <p className={`mt-6 text-sm sm:text-base font-medium leading-relaxed max-w-lg mx-auto text-slate-600`}>
          Based on your profile, you need{" "}
          <strong className="font-bold text-slate-900">{calories.toLocaleString()} calories per day</strong>{" "}
          to effectively achieve {config.label.toLowerCase()}.
        </p>
      </div>

      {/* Context Block */}
      <div className={`relative z-10 rounded-2xl border p-5 backdrop-blur-md ${c.accentBg} ${c.accentBorder}`}>
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold block mb-1 text-slate-900">The Science:</strong>
          {config.context}
        </p>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent relative z-10" />

      {/* Quick Tips */}
      <div className="relative z-10">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Nutrition Protocol
        </h4>
        <ul className="space-y-3">
          {config.tips.map((tip, idx) => (
            <motion.li 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="flex items-start gap-3 text-sm font-medium text-slate-600"
            >
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${c.bullet}`} />
              <span className="leading-snug">{tip}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {onCTAClick && (
        <button
          onClick={onCTAClick}
          className={`relative z-10 w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${c.cta}`}
        >
          Send Detailed Plan to Email →
        </button>
      )}
    </motion.div>
  );
}
