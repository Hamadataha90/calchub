"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { FormData } from "@/types";
import Link from "next/link";
import ResultCard from "@/components/calculators/ResultCard";
import EmailCapture from "@/components/calculators/EmailCapture";
import MonetagScript from "@/components/MonetagScript";

// ── Mifflin-St Jeor BMR ────────────────────────────────────────────────────
function calcBMR(data: FormData): number {
  const base = 10 * data.weight + 6.25 * data.height - 5 * data.age;
  return data.gender === "male" ? base + 5 : base - 161;
}

// ── TDEE: BMR × activity multiplier ────────────────────────────────────────
const ACTIVITY_MULTIPLIER: Record<FormData["activity"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function calcTDEE(bmr: number, activity: FormData["activity"]): number {
  return bmr * ACTIVITY_MULTIPLIER[activity];
}

// ── Goal adjustment ─────────────────────────────────────────────────────────
const GOAL_DELTA: Record<FormData["goal"], number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

function adjustForGoal(tdee: number, goal: FormData["goal"]): number {
  return Math.round(tdee + GOAL_DELTA[goal]);
}

// ── Initial form state ──────────────────────────────────────────────────────
const initialState: FormData = {
  age: 0,
  weight: 0,
  height: 0,
  gender: "male",
  activity: "sedentary",
  goal: "maintain",
};

interface CalorieFormProps {
  onSubmit?: (data: FormData, calories: number) => void;
}

export default function CalorieForm({ onSubmit }: CalorieFormProps) {
  const [form, setForm] = useState<FormData>(initialState);
  const [calories, setCalories] = useState<number | null>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  // ── Restore from localStorage on mount ─────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("calchub_result");
      if (!stored) return;
      const { calories: c, goal: g } = JSON.parse(stored) as {
        calories: number;
        goal: FormData["goal"];
      };
      if (c > 0 && ["lose", "maintain", "gain"].includes(g)) {
        setCalories(c);
        setForm(JSON.parse(stored).form || ((prev: FormData) => ({ ...prev, goal: g })));
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  function scrollToEmail() {
    emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? Number(value) : value,
    }));
  }

  // ── Live Calculation ───────────────────────────────────────────────────────
  useEffect(() => {
    // Only calculate if we have valid baseline numbers
    if (form.age >= 10 && form.weight >= 20 && form.height >= 100) {
      const bmr = calcBMR(form);
      const tdee = calcTDEE(bmr, form.activity);
      const result = adjustForGoal(tdee, form.goal);
      setCalories(result);

      // Persist to storage (debounced naturally by the user stopping interactions)
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(
            "calchub_result",
            JSON.stringify({ calories: result, goal: form.goal, form })
          );
        } catch {
          // ignore
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setCalories(null);
    }
  }, [form]);

  const sliderCls =
    "w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600 bg-gray-200";

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-[2rem] border border-white/50 bg-white/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-100/50 space-y-8 relative overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-10 blur-3xl pointer-events-none" />

        {/* ── Section: Personal Stats ──────────────────────────────────── */}
        <fieldset className="space-y-8 relative z-10">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 block">
            Personal Stats
          </legend>

          {/* Age */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="age" className="text-sm font-semibold text-slate-700">
                Age
              </label>
              <span className="text-sm font-bold text-blue-600 tabular-nums bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {form.age || "—"} <span className="font-normal text-blue-400 text-xs uppercase">yrs</span>
              </span>
            </div>
            <input
              id="age"
              name="age"
              type="number"
              min={10}
              max={120}
              required
              placeholder="25"
              value={form.age || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border-0 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          {/* Weight — slider */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="weight" className="text-sm font-semibold text-slate-700">
                Weight
              </label>
              <span className="text-sm font-bold text-indigo-600 tabular-nums bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {form.weight || "—"} <span className="font-normal text-indigo-400 text-xs uppercase">kg</span>
              </span>
            </div>
            <div className="relative pt-2 pb-1">
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 rounded-l-full bg-gradient-to-r from-blue-500 to-indigo-500 pointer-events-none shadow-sm" 
                style={{ width: `${((form.weight - 30) / (250 - 30)) * 100}%` }}
              />
              <input
                id="weight"
                name="weight"
                type="range"
                min={30}
                max={250}
                step={1}
                required
                value={form.weight || 70}
                onChange={handleChange}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-slate-200/80 shadow-inner accent-white hover:accent-indigo-100 transition-all"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>30 kg</span>
              <span>250 kg</span>
            </div>
          </div>

          {/* Height — slider */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="height" className="text-sm font-semibold text-slate-700">
                Height
              </label>
              <span className="text-sm font-bold text-indigo-600 tabular-nums bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {form.height || "—"} <span className="font-normal text-indigo-400 text-xs uppercase">cm</span>
              </span>
            </div>
            <div className="relative pt-2 pb-1">
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 rounded-l-full bg-gradient-to-r from-blue-500 to-indigo-500 pointer-events-none shadow-sm" 
                style={{ width: `${((form.height - 100) / (250 - 100)) * 100}%` }}
              />
              <input
                id="height"
                name="height"
                type="range"
                min={100}
                max={250}
                step={1}
                required
                value={form.height || 170}
                onChange={handleChange}
                className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-slate-200/80 shadow-inner accent-white hover:accent-indigo-100 transition-all"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>100 cm</span>
              <span>250 cm</span>
            </div>
          </div>
        </fieldset>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ── Section: Goals & Activity ────────────────────────────────── */}
        <fieldset className="space-y-6 relative z-10">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 block">
            Goals &amp; Activity
          </legend>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-sm font-semibold text-slate-700">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-2xl border-0 bg-white/80 px-4 py-3.5 pr-10 text-sm font-medium text-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all cursor-pointer outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="flex flex-col gap-2">
              <label htmlFor="activity" className="text-sm font-semibold text-slate-700">
                Activity
              </label>
              <div className="relative">
                <select
                  id="activity"
                  name="activity"
                  required
                  value={form.activity}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-2xl border-0 bg-white/80 px-4 py-3.5 pr-10 text-sm font-medium text-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all cursor-pointer outline-none"
                >
                  <option value="sedentary">Sedentary (office job)</option>
                  <option value="light">Light (1-3 days/wk)</option>
                  <option value="moderate">Moderate (3-5 days/wk)</option>
                  <option value="active">Active (6-7 days/wk)</option>
                  <option value="very_active">Athlete (2x/day)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Goal */}
            <div className="flex flex-col gap-2">
              <label htmlFor="goal" className="text-sm font-semibold text-slate-700">
                Goal
              </label>
              <div className="relative">
                <select
                  id="goal"
                  name="goal"
                  required
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-2xl border-0 bg-white/80 px-4 py-3.5 pr-10 text-sm font-medium text-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all cursor-pointer outline-none"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </motion.div>


      {calories !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="space-y-6"
        >
          <ResultCard calories={calories} goal={form.goal} onCTAClick={scrollToEmail} />
          
          <div ref={emailRef}>
            <EmailCapture calories={calories} goal={form.goal} />
          </div>

          <div className="pt-6 space-y-4">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Learn more about your goal
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/blog/how-many-calories"
                className="group flex flex-col justify-center rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md p-5 shadow-sm hover:bg-white/60 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Basics of TDEE
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  How energy balance works
                </span>
              </Link>
              <Link
                href="/blog/best-diet-plan-weight-loss"
                className="group flex flex-col justify-center rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md p-5 shadow-sm hover:bg-white/60 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Diet Planning
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Sustainable weight loss
                </span>
              </Link>
              <Link
                href="/blog/how-to-gain-muscle"
                className="group flex flex-col justify-center rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md p-5 shadow-sm hover:bg-white/60 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Muscle Building
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Effective lean bulking
                </span>
              </Link>
            </div>
          </div>

          <MonetagScript />
        </motion.div>
      )}
    </div>
  );
}
