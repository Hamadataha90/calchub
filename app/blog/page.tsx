import type { Metadata } from "next";
import { posts } from "@/lib/posts";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog | CalcHub",
  description: "Nutrition tips, calorie guides, and diet advice from CalcHub.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 relative">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Nutrition &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Diet Guides</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Expert tips and actionable advice to help you reach your calorie goals efficiently.
        </p>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
