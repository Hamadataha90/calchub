"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormData } from "@/types";
import Link from "next/link";
import ResultCard from "@/components/calculators/ResultCard";
import EmailCapture from "@/components/calculators/EmailCapture";
import MonetagScript from "@/components/MonetagScript";
import { Minus, Plus, Activity, Target, User } from "lucide-react";

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
  age: 25, 
  weight: 70, 
  height: 170, 
  gender: "male",
  activity: "sedentary",
  goal: "maintain",
};

// ── Validation ──────────────────────────────────────────────────────────────
interface ValidationErrors {
  age?: string;
  weight?: string;
  height?: string;
}

function validate(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.age || data.age < 10 || data.age > 120)
    errors.age = "Age must be between 10 and 120.";
  if (data.weight < 30 || data.weight > 250)
    errors.weight = "Weight must be between 30 and 250 kg.";
  if (data.height < 100 || data.height > 250)
    errors.height = "Height must be between 100 and 250 cm.";
  return errors;
}

// ── Custom Stepper Component ────────────────────────────────────────────────
function StepperInput({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  error,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">{label}</label>
      <div className={`relative flex items-center justify-between p-2 rounded-3xl bg-white/60 backdrop-blur-md shadow-[inset_0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-inset transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white/90 hover:bg-white/80 ${error ? 'ring-red-400 bg-red-50/50' : 'ring-slate-200/80 hover:ring-slate-300'}`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="z-10 p-4 rounded-2xl bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 shadow-sm border border-slate-100"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-baseline gap-1.5 pointer-events-auto">
            <input 
              type="number"
              min={min}
              max={max}
              value={value || ""}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-24 text-center text-4xl font-black text-slate-800 bg-transparent outline-none tabular-nums p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all focus:scale-110"
            />
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-100/50 px-2 py-1 rounded-lg">
              {unit}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="z-10 p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all active:scale-95 shadow-sm border border-blue-200/50"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
      {error && <p className="text-xs font-semibold text-red-500 px-2">{error}</p>}
    </div>
  );
}

export default function CalorieForm() {
  const [form, setForm] = useState<FormData>(initialState);
  const [calories, setCalories] = useState<number | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  function scrollToEmail() {
    emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleStepperChange(name: keyof FormData, value: number) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const bmr = calcBMR(form);
    const tdee = calcTDEE(bmr, form.activity);
    const result = adjustForGoal(tdee, form.goal);
    setCalories(result);
    setErrors({});

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Profile Card */}
        <div className="relative rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl shadow-blue-100/40 overflow-hidden group">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-700" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-3 bg-blue-100/50 rounded-2xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Your Body Profile</h2>
          </div>

          <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <StepperInput
              label="Age"
              value={form.age}
              unit="yrs"
              min={10}
              max={120}
              onChange={(val) => handleStepperChange("age", val)}
              error={errors.age}
            />
            <StepperInput
              label="Weight"
              value={form.weight}
              unit="kg"
              min={30}
              max={250}
              onChange={(val) => handleStepperChange("weight", val)}
              error={errors.weight}
            />
            <StepperInput
              label="Height"
              value={form.height}
              unit="cm"
              min={100}
              max={250}
              onChange={(val) => handleStepperChange("height", val)}
              error={errors.height}
            />
          </fieldset>
        </div>

        {/* Goals & Activity Card */}
        <div className="relative rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-100/40 overflow-hidden group">
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Left Col: Selections */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-100/50 rounded-2xl">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Lifestyle & Goals</h2>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="gender" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Gender</label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-2xl border-0 bg-white/70 backdrop-blur-sm px-5 py-4 pr-10 text-sm font-semibold text-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200/80 hover:ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white transition-all cursor-pointer outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="activity" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Activity Level</label>
                  <div className="relative">
                    <select
                      id="activity"
                      name="activity"
                      value={form.activity}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-2xl border-0 bg-white/70 backdrop-blur-sm px-5 py-4 pr-10 text-sm font-semibold text-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200/80 hover:ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white transition-all cursor-pointer outline-none"
                    >
                      <option value="sedentary">Sedentary (office job)</option>
                      <option value="light">Light (1-3 days/wk)</option>
                      <option value="moderate">Moderate (3-5 days/wk)</option>
                      <option value="active">Active (6-7 days/wk)</option>
                      <option value="very_active">Athlete (2x/day)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="goal" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1">Main Goal</label>
                  <div className="relative">
                    <select
                      id="goal"
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-2xl border-0 bg-white/70 backdrop-blur-sm px-5 py-4 pr-10 text-sm font-semibold text-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] ring-1 ring-inset ring-slate-200/80 hover:ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white transition-all cursor-pointer outline-none"
                    >
                      <option value="lose">Lose Weight</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="gain">Gain Muscle</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Col: CTA Area */}
            <div className="flex flex-col justify-end space-y-4">
              <div className="bg-slate-900/5 rounded-3xl p-6 text-center border border-slate-900/5">
                <Activity className="w-8 h-8 text-blue-500 mx-auto mb-3 opacity-80" />
                <p className="text-sm font-medium text-slate-600 mb-6 px-2 leading-relaxed">
                  We use the Mifflin-St Jeor formula, the most accurate method for determining energy needs.
                </p>
                <button
                  type="submit"
                  className="relative w-full overflow-hidden rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Calculate Macros
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.form>

      {/* ── Result Section ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {calories !== null && (
          <motion.div
            ref={resultRef}
            key="result"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="space-y-8 mt-12"
          >
            <ResultCard calories={calories} goal={form.goal} onCTAClick={scrollToEmail} />

            <div ref={emailRef} className="pt-4">
              <EmailCapture calories={calories} goal={form.goal} />
            </div>

            <div className="pt-8 space-y-6">
              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  Accelerate your progress
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pb-8">
                <Link
                  href="/blog/how-many-calories"
                  className="group flex flex-col justify-center rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm hover:bg-white/70 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg">📚</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Basics of TDEE
                  </span>
                  <span className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
                    Understand energy balance
                  </span>
                </Link>
                <Link
                  href="/blog/best-diet-plan-weight-loss"
                  className="group flex flex-col justify-center rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm hover:bg-white/70 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    <span className="text-lg">🥗</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    Diet Planning
                  </span>
                  <span className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
                    Sustainable weight loss
                  </span>
                </Link>
                <Link
                  href="/blog/how-to-gain-muscle"
                  className="group flex flex-col justify-center rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm hover:bg-white/70 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                    <span className="text-lg">💪</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    Muscle Building
                  </span>
                  <span className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed">
                    Effective lean bulking
                  </span>
                </Link>
              </div>
            </div>

            {/* Monetag: only active after result is shown */}
            <MonetagScript isActive={calories !== null} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
