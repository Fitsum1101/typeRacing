"use client";

import { ArrowRight, Keyboard } from "lucide-react";

import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="relative z-20 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="site-container grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="TypeRush home"
        >
          <span className="logo-mark shrink-0">
            <Keyboard className="size-4" />
          </span>
          <span className="truncate text-base font-extrabold uppercase">
            Type<span className="text-primary">Rush</span>
          </span>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-2"
          aria-label="Main navigation"
        >
          <Link
            href="/play"
            className="hidden px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Play
          </Link>
          <Button className="btn-glow min-h-10 h-10 px-4 text-xs uppercase sm:px-5">
            <Link href="/play">
              Play now <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
