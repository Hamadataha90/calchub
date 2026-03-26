import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPost } from "@/lib/posts";
import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | CalcHub Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // Basic reading time estimation (200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Split content into paragraphs/sections for basic rendering
  const lines = post.content.split("\n");

  return (
    <article className="mx-auto max-w-4xl py-12 px-4 sm:px-6 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="mb-12 flex items-center gap-2 text-sm font-semibold text-slate-500 relative z-10">
        <Link href="/blog" className="flex items-center hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          All Articles
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span className="text-slate-900 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-16 space-y-8 relative z-10">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <time className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          {post.title}
        </h1>

        <p className="text-xl text-slate-500 leading-relaxed max-w-3xl border-l-4 border-blue-500 pl-6 py-1">
          {post.excerpt}
        </p>
      </header>

      {/* Content Layout: Main Text + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Main Content Body */}
        <div className="lg:col-span-8 space-y-6 text-slate-800 leading-loose prose-zinc max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl sm:text-3xl font-bold text-slate-900 pt-8 pb-4 tracking-tight border-b border-slate-200/50">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-bold text-slate-900 pt-6 pb-2">
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.startsWith("> ")) {
              return (
                <blockquote key={i} className="pl-6 italic border-l-4 border-slate-300 text-slate-600 bg-slate-50/50 rounded-r-2xl py-3 pr-4 my-6">
                  {line.replace("> ", "")}
                </blockquote>
              );
            }
            if (line.startsWith("- ")) {
              const formatted = line
                .replace("- ", "")
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-4">$1</a>');
              return (
                <li key={i} className="ml-6 list-disc mb-2 marker:text-blue-500 pl-2">
                  <span dangerouslySetInnerHTML={{ __html: formatted }} />
                </li>
              );
            }
            if (/^\d+\./.test(line)) {
              const formatted = line
                .replace(/^\d+\.\s/, "")
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-4">$1</a>');
              return (
                <li key={i} className="ml-6 list-decimal mb-2 marker:text-slate-400 font-semibold marker:font-bold pl-2">
                  <span className="font-normal" dangerouslySetInnerHTML={{ __html: formatted }} />
                </li>
              );
            }
            if (line.trim() === "") return <div key={i} className="h-4" />;

            // Standard Paragraph
            const formatted = line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline decoration-blue-200 underline-offset-4 font-medium transition-colors hover:decoration-blue-500">$1</a>');
            
            return (
              <p
                key={i}
                className="text-lg text-slate-600 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: formatted }}
              />
            );
          })}
        </div>

        {/* Sidebar Sticky CTA */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-24 rounded-3xl border border-slate-200/60 bg-white/60 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-inner">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Take the guesswork out of your diet
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Use our free calculator to get a personalised plan tailored exactly to your body and goals.
              </p>
            </div>

            <Link
              href="/calories"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95"
            >
              Try the Calculator
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
