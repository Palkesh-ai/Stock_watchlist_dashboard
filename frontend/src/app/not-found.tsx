import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-6 py-16 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          404
        </div>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          This page wandered off the market.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          The route you requested does not exist. Return to the dashboard or sign in to continue managing your watchlist and portfolio.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md bg-cyan-400 px-5 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Go to dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}