import Link from 'next/link';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b12] text-slate-900 dark:text-white overflow-hidden transition-colors">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7C5CFC] flex items-center justify-center">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg">Taskwise</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 max-w-7xl mx-auto pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Ambient glow - signature element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C5CFC]/15 dark:bg-[#7C5CFC]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 text-[#7C5CFC] text-xs font-semibold mb-8">
            <Zap size={14} />
            Built for teams who ship
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Work that moves.
            <br />
            <span className="text-[#7C5CFC]">Not work that waits.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-[#9999b3] max-w-xl mx-auto mb-10 leading-relaxed">
            Taskwise organizes your team&apos;s tasks, deadlines, and ownership in one
            place — so nothing slips through the cracks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-[#7C5CFC] text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Get started free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-slate-400 dark:text-[#6B6B8A]">
              No credit card required
            </span>
          </div>
        </div>

        {/* Product glimpse */}
        <div className="relative mt-20 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#13131c] p-2 shadow-2xl shadow-slate-200 dark:shadow-[#7C5CFC]/5">
            <div className="rounded-xl bg-slate-50 dark:bg-[#0e0e16] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-bold text-sm">Today&apos;s tasks</p>
                  <p className="text-xs text-slate-400 dark:text-[#6B6B8A]">3 due, 2 done</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#7C5CFC]/20 flex items-center justify-center text-[#7C5CFC] text-xs font-bold">
                  AJ
                </div>
              </div>
              {['Review pull request for auth module', 'Finalize Q3 design tokens', 'Sync with Sara on onboarding flow'].map((task, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-t border-slate-200 dark:border-white/5 first:border-t-0">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-[#6B6B8A]" />
                  <span className="text-sm text-slate-600 dark:text-[#c4c4d8]">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-20 border-t border-slate-200 dark:border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Today, not someday',
              desc: 'See exactly what needs your attention right now, sorted by what matters most.',
            },
            {
              icon: Users,
              title: 'Built for teams',
              desc: 'Assign tasks to the right person, track ownership, and keep everyone aligned.',
            },
            {
              icon: BarChart3,
              title: 'Progress you can see',
              desc: 'Watch completion rates climb in real time as your team gets things done.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-[#7C5CFC]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#7C5CFC]" />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-[#9999b3] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get organized?</h2>
        <p className="text-slate-500 dark:text-[#9999b3] mb-8">Join your team on Taskwise today.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#7C5CFC] text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Create your account
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="px-6 md:px-12 max-w-7xl mx-auto py-8 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-400 dark:text-[#6B6B8A]">
        © 2026 Taskwise. Built by Abdullah Adel.
      </footer>
    </div>
  );
}