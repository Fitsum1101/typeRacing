"use client";

import Link from "next/link";
import { Keyboard, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  // Demo switch — remove later
  const isLoggedIn = true;

  return (
    <header className="relative z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="site-container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="logo-mark">
            <Keyboard className="size-4" />
          </span>
          <span className="text-[0.95rem] font-bold tracking-tight">
            Type<span className="text-primary-light">Rush</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            /* ───────── LOGGED IN ───────── */
            <>
              {/* Stats */}
              <div className="hidden items-center gap-4 font-mono text-[0.68rem] uppercase tracking-label sm:flex">
                <div className="text-center">
                  <span className="block text-muted-text">WPM</span>
                  <strong className="text-sm text-foreground">92</strong>
                </div>
                <div className="text-center">
                  <span className="block text-muted-text">Acc</span>
                  <strong className="text-sm text-foreground">98%</strong>
                </div>
                <div className="text-center">
                  <span className="block text-muted-text">Races</span>
                  <strong className="text-sm text-foreground">47</strong>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-6 w-px bg-border sm:block" />

              {/* Avatar + name */}
              <div className="flex items-center gap-2.5">
                <span className="profile-avatar">AL</span>
                <span className="hidden text-sm font-semibold sm:inline">
                  alex
                </span>
              </div>

              {/* Logout */}
              <button
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-text transition-colors hover:border-error/50 hover:text-error"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            /* ───────── GUEST ───────── */
            <div className="flex items-center gap-2.5">
              <span className="hidden rounded-full border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-label text-muted-text sm:inline-flex">
                Guest
              </span>
              <Button size="sm" className="btn-glow h-8 px-3 text-xs uppercase">
                <Link href="/login">
                  <LogIn className="size-3.5" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
