"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";
import { ArrowRight, Calendar } from "lucide-react";

export default function BlogList({ posts }: { posts: Post[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 grid-cols-1 md:grid-cols-2"
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={itemVariants}>
          <Link
            href={`/blog/${post.slug}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white/60 backdrop-blur-xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200/50"
          >
            {/* Soft decorative glow */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100 opacity-50 blur-2xl group-hover:bg-blue-200 transition-colors" />

            <div className="relative z-10 flex flex-1 flex-col">
              <time className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                {post.title}
              </h2>

              <p className="mt-3 flex-1 text-sm text-slate-500 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-8 flex items-center text-sm font-bold text-blue-600">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
