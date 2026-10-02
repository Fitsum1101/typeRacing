"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gauge, Globe, Keyboard, Users, Zap } from "lucide-react";
import Link from "next/link";
import Header from "../components/custom/Header";

const PREVIEW_TEXT =
  "Precision wins races. Find your rhythm and leave the competition behind.";

const MODES = [
  {
    id: "normal",
    title: "Normal Race",
    tag: "Solo Practice",
    description:
      "Race against the clock. No opponents, pure focus. Grind personal bests and perfect your accuracy.",
    meta: "1 Player • Timed • Personal Records",
    href: "/play?mode=normal",
    icon: Keyboard,
    primary: true,
  },
  {
    id: "global",
    title: "Global Race",
    tag: "Live Ranked",
    description:
      "Jump into real-time lobbies and race players worldwide. Live WPM, ranked matches, global leaderboards.",
    meta: "4–8 Racers • Ranked • Live",
    href: "/play?mode=global",
    icon: Globe,
    primary: false,
  },
  {
    id: "friends",
    title: "Friends Race",
    tag: "Private Lobby",
    description:
      "Create a private room, invite friends, and race head-to-head. Custom settings and instant rematches.",
    meta: "2–6 Friends • Custom • Private",
    href: "/play?mode=friends",
    icon: Users,
    primary: false,
  },
] as const;

export default function TypeRushHero() {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.4 };

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-background text-foreground">
      <div
        className="hero-grid pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="hero-glow pointer-events-none absolute inset-0"
        aria-hidden
      />

      <Header />

      <section className="site-container relative z-10 grid min-h-0 flex-1 items-center gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.95fr)] lg:gap-10">
        {/* ===== LEFT: Title + Modes ===== */}
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            <div className="hud-badge">
              <span className="size-1.5 rounded-full bg-success animate-pulse-soft" />
              Race servers online
            </div>

            <h1 className="hero-title mt-4 max-w-2xl uppercase">
              How fast can you{" "}
              <span className="text-glow text-primary-light">type?</span>
            </h1>

            <p className="hero-copy mt-3 max-w-lg text-base text-muted-foreground">
              Choose your race. Compete live. Set new records.
            </p>
          </motion.div>

          {/* Modes */}
          <div className="mt-6 flex flex-col gap-3">
            {MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...transition,
                    delay: shouldReduceMotion ? 0 : 0.06 + i * 0.05,
                  }}
                >
                  <Link
                    href={mode.href}
                    className={`mode-card group flex items-start gap-4 ${
                      mode.primary ? "mode-card-primary" : ""
                    }`}
                  >
                    <div
                      className={`mode-icon shrink-0 ${
                        mode.primary ? "mode-icon-primary" : ""
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight">
                          {mode.title}
                        </h2>
                        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-label text-muted-text">
                          {mode.tag}
                        </span>
                      </div>

                      <p className="mode-desc mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {mode.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-[0.6rem] uppercase tracking-label text-muted-text">
                          {mode.meta}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-label text-primary-light opacity-0 transition-opacity group-hover:opacity-100">
                          Enter
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== RIGHT: Live Race Preview ===== */}
        <motion.div
          className="race-shell relative hidden min-w-0 lg:block"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...transition, delay: shouldReduceMotion ? 0 : 0.12 }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-primary-light" />
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-label">
                Race Preview
              </span>
            </div>
            <span className="font-mono text-[0.58rem] text-success">LIVE</span>
          </div>

          <div className="grid grid-cols-3 border-b border-border">
            {[
              ["WPM", "92"],
              ["ACCURACY", "98%"],
              ["TIME", "00:34"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-r border-border px-4 py-4 last:border-r-0"
              >
                <span className="block font-mono text-[0.52rem] text-muted-text">
                  {label}
                </span>
                <strong className="mt-1 block font-mono text-xl">
                  {value}
                </strong>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "22%" }}
                animate={{ width: "68%" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 2.4,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>
            <p className="race-copy">
              <span className="char-correct">Precision wins races. </span>
              <span className="char-cursor">F</span>
              <span className="char-pending">{PREVIEW_TEXT.slice(22)}</span>
            </p>
          </div>

          <div className="grid grid-cols-4 border-t border-border px-4 py-3 font-mono text-[0.56rem] text-muted-text">
            <span className="text-primary-light">P1 YOU</span>
            <span>P2 NOVA</span>
            <span>P3 GHOST</span>
            <span>P4 ZERO</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
