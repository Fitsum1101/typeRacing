"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CarFront,
  Flag,
  Gauge,
  Keyboard,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

const COUNTDOWN_STEP_MS = 760;

type PassageLength = "short" | "medium" | "long";
type Difficulty = "easy" | "medium" | "hard";

const LENGTH_OPTIONS: { id: PassageLength; label: string }[] = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

const DIFFICULTY_OPTIONS: {
  id: Difficulty;
  label: string;
  multiplier: number;
}[] = [
  { id: "easy", label: "Easy", multiplier: 0.82 },
  { id: "medium", label: "Medium", multiplier: 1 },
  { id: "hard", label: "Hard", multiplier: 1.18 },
];

const PASSAGES: Record<Difficulty, Record<PassageLength, string>> = {
  easy: {
    short:
      "Type fast and stay calm. Keep your eyes on the line and your fingers on the keys.",
    medium:
      "Type fast and stay calm. Keep your eyes on the line and your fingers on the keys. Every clean word moves you ahead of the pack.",
    long: "Type fast and stay calm. Keep your eyes on the line and your fingers on the keys. Every clean word moves you ahead of the pack. Find a steady rhythm, breathe, and let the race come to you one letter at a time.",
  },
  medium: {
    short:
      "Speed is built one precise keystroke at a time. Stay focused and chase the finish line.",
    medium:
      "Speed is built one precise keystroke at a time. Stay focused, find your rhythm, and chase the finish line.",
    long: "Speed is built one precise keystroke at a time. Stay focused, find your rhythm, and chase the finish line. The best racers know when to push hard and when to settle into a smooth, unbroken flow.",
  },
  hard: {
    short:
      "Precision beats panic: 100% accuracy outranks sloppy speed—every mistyped character costs you momentum!",
    medium:
      "Precision beats panic: 100% accuracy outranks sloppy speed—every mistyped character costs you momentum! Champions don't rush; they execute, adapt, and accelerate.",
    long: "Precision beats panic: 100% accuracy outranks sloppy speed—every mistyped character costs you momentum! Champions don't rush; they execute, adapt, and accelerate. When the pressure peaks past 90 WPM, only disciplined, deliberate keystrokes separate victory from defeat.",
  },
};

type RacePhase = "ready" | "countdown" | "racing" | "finished";

type Racer = {
  id: string;
  name: string;
  tag: string;
  speed: number;
  accuracy: number;
  errors: number;
  avatarClass: string;
  carClass: string;
};

const RACERS: Racer[] = [
  {
    id: "you",
    name: "Velocity",
    tag: "YOU",
    speed: 2.7,
    accuracy: 100,
    errors: 0,
    avatarClass: "racer-avatar-primary",
    carClass: "text-primary-light",
  },
  {
    id: "nova",
    name: "NovaByte",
    tag: "RIVAL",
    speed: 3.15,
    accuracy: 98,
    errors: 1,
    avatarClass: "racer-avatar-green",
    carClass: "text-success",
  },
  {
    id: "ghost",
    name: "GhostKey",
    tag: "RIVAL",
    speed: 2.88,
    accuracy: 96,
    errors: 2,
    avatarClass: "racer-avatar-amber",
    carClass: "text-warning",
  },
  {
    id: "zero",
    name: "ZeroLag",
    tag: "RIVAL",
    speed: 2.55,
    accuracy: 94,
    errors: 3,
    avatarClass: "racer-avatar-neutral",
    carClass: "text-muted-foreground",
  },
];

const CHAR_CLASS = {
  correct: "char-correct",
  wrong: "char-wrong",
  cursor: "char-cursor",
  pending: "char-pending",
} as const;

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((milliseconds % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function PlayerLane({
  racer,
  progress,
  wpm,
  accuracy,
  errors,
  place,
}: {
  racer: Racer;
  progress: number;
  wpm: number;
  accuracy: number;
  errors: number;
  place: number;
}) {
  return (
    <motion.div
      layout
      className="race-lane"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: RACERS.findIndex((item) => item.id === racer.id) * 0.06,
      }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`racer-avatar shrink-0 ${racer.avatarClass}`}>
          {racer.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-extrabold sm:text-sm">
              {racer.name}
            </span>
            <span className="font-mono text-[0.5rem] font-bold text-muted-text">
              {racer.tag}
            </span>
          </div>
          <span className="font-mono text-[0.58rem] text-muted-foreground">
            P{place} · {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="lane-track min-w-0">
        <div className="lane-dashes" aria-hidden />
        <motion.div
          className={`race-car ${racer.carClass}`}
          animate={{ left: `${Math.min(progress, 97)}%` }}
          transition={{ type: "spring", stiffness: 55, damping: 18, mass: 0.5 }}
        >
          <CarFront
            className="size-5 rotate-90 drop-shadow-[0_0_8px_currentColor] sm:size-6"
            aria-hidden
          />
        </motion.div>
        <div className="finish-line" aria-label="Finish line">
          <Flag className="size-3.5" />
        </div>
      </div>

      <div className="lane-stats hidden grid-cols-3 gap-3 lg:grid">
        <div>
          <span>WPM</span>
          <strong>{wpm}</strong>
        </div>
        <div>
          <span>ACC</span>
          <strong>{accuracy}%</strong>
        </div>
        <div>
          <span>ERR</span>
          <strong className={errors ? "text-error" : ""}>{errors}</strong>
        </div>
      </div>
    </motion.div>
  );
}

export default function TypeRush() {
  const [phase, setPhase] = useState<RacePhase>("ready");
  const [countdown, setCountdown] = useState("3");
  const [elapsed, setElapsed] = useState(0);
  const [typed, setTyped] = useState("");
  const [round, setRound] = useState(0);
  const [passageLength, setPassageLength] = useState<PassageLength>("medium");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const raceText = PASSAGES[difficulty][passageLength];
  const difficultyMultiplier =
    DIFFICULTY_OPTIONS.find((option) => option.id === difficulty)?.multiplier ??
    1;
  const raceStartRef = useRef(0);
  const raceScreenRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const startRace = useCallback(() => {
    setTyped("");
    setElapsed(0);
    setCountdown("3");
    setPhase("countdown");
    setRound((value) => value + 1);
  }, []);

  const resetRace = useCallback(() => {
    setTyped("");
    setElapsed(0);
    setCountdown("3");
    setPhase("ready");
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    const steps = ["3", "2", "1", "GO"];
    let index = 0;
    const timer = window.setInterval(
      () => {
        index += 1;
        if (index < steps.length) {
          const nextStep = steps[index];
          if (nextStep) setCountdown(nextStep);
          return;
        }
        window.clearInterval(timer);
        raceStartRef.current = performance.now();
        setPhase("racing");
      },
      shouldReduceMotion ? 180 : COUNTDOWN_STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, [phase, round, shouldReduceMotion]);

  useEffect(() => {
    if (phase === "racing") raceScreenRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "racing") return;
    const timer = window.setInterval(() => {
      const next = performance.now() - raceStartRef.current;
      setElapsed(next);
      if (next >= 32_000) setPhase("finished");
    }, 50);
    return () => window.clearInterval(timer);
  }, [phase]);

  const typedCorrect = useMemo(
    () =>
      typed.split("").filter((char, index) => char === raceText[index]).length,
    [typed, raceText],
  );
  const errors = typed.length - typedCorrect;
  const accuracy = typed.length
    ? Math.round((typedCorrect / typed.length) * 100)
    : 100;
  const playerProgress = Math.min(100, (typed.length / raceText.length) * 100);
  const wpm =
    elapsed > 0 ? Math.round(typedCorrect / 5 / (elapsed / 60_000)) : 0;

  useEffect(() => {
    if (typed.length === raceText.length && phase === "racing")
      setPhase("finished");
  }, [phase, raceText.length, typed.length]);

  const progressById = useMemo(() => {
    const seconds = elapsed / 1000;
    return RACERS.map((racer, index) => {
      if (phase === "ready" || phase === "countdown") return 0;
      if (racer.id === "you") return playerProgress;
      const paceVariation = Math.sin(seconds * 0.8 + index) * 1.8;
      return Math.min(
        100,
        Math.max(
          0,
          seconds * racer.speed * difficultyMultiplier + paceVariation,
        ),
      );
    });
  }, [difficultyMultiplier, elapsed, phase, playerProgress]);

  const places = useMemo(() => {
    const order = progressById
      .map((progress, index) => ({ index, progress }))
      .sort((a, b) => b.progress - a.progress);
    return RACERS.map(
      (_, index) => order.findIndex((item) => item.index === index) + 1,
    );
  }, [progressById]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (phase !== "racing" || event.ctrlKey || event.metaKey || event.altKey)
      return;
    if (event.key === "Backspace") {
      event.preventDefault();
      setTyped((value) => value.slice(0, -1));
      return;
    }
    if (event.key.length === 1 && typed.length < raceText.length) {
      event.preventDefault();
      setTyped((value) => value + event.key);
    }
  };

  return (
    <main
      ref={raceScreenRef}
      className="race-screen relative h-[100svh] overflow-hidden bg-background text-foreground"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="race-grid pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="race-lighting pointer-events-none absolute inset-0"
        aria-hidden
      />

      <header className="race-header relative z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="site-container grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="logo-mark shrink-0">
              <Keyboard className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold uppercase sm:text-base">
                Type<span className="text-primary">Rush</span>
              </div>
              <p className="hidden font-mono text-[0.55rem] uppercase tracking-label text-muted-text sm:block">
                Ranked sprint · Demo race
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <div className="hidden items-center gap-1.5 font-mono text-[0.62rem] font-bold uppercase text-success sm:flex">
              <span className="size-1.5 rounded-full bg-success animate-pulse-soft" />{" "}
              Live
            </div>
            <div className="race-clock">
              <span>TIME</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetRace}
              aria-label="Reset race"
              title="Reset race"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="site-container race-layout relative z-10 flex min-h-0 flex-1 flex-col py-3 sm:py-4">
        <div className="race-title-row grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <div className="section-kicker">
              <Zap className="size-3.5" /> Live race 01
            </div>
            <h1 className="mt-0.5 truncate text-xl font-extrabold uppercase sm:text-2xl">
              Neon Circuit
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 font-mono text-[0.58rem] uppercase text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary-light" /> 4 racers
          </div>
        </div>

        <div className="race-board mt-2.5 min-h-0 flex-1">
          <div className="race-board-heading hidden grid-cols-[11rem_minmax(0,1fr)_14rem] px-3 lg:grid">
            <span>Racer</span>
            <span>Track progress</span>
            <span>Live telemetry</span>
          </div>
          <div className="race-lanes">
            {RACERS.map((racer, index) => {
              const rivalWpm =
                phase === "ready" || phase === "countdown"
                  ? 0
                  : Math.round(
                      (58 + racer.speed * 8) * difficultyMultiplier +
                        Math.sin(elapsed / 1600 + index) * 3,
                    );
              return (
                <PlayerLane
                  key={racer.id}
                  racer={racer}
                  progress={progressById[index] ?? 0}
                  place={places[index] ?? 4}
                  wpm={racer.id === "you" ? wpm : rivalWpm}
                  accuracy={racer.id === "you" ? accuracy : racer.accuracy}
                  errors={racer.id === "you" ? errors : racer.errors}
                />
              );
            })}
          </div>
        </div>

        <motion.div
          className="typing-deck mt-2.5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="typing-heading grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Gauge className="size-4 shrink-0 text-primary-light" />
              <span className="truncate font-mono text-[0.62rem] font-bold uppercase tracking-label">
                Typing console
              </span>
            </div>
            <div className="typing-live-stats flex shrink-0 items-center gap-3 font-mono text-[0.58rem] sm:gap-5">
              <span>
                <b>{wpm}</b> WPM
              </span>
              <span>
                <b>{accuracy}%</b> ACC
              </span>
              <span className="hidden sm:inline">
                <b className={errors ? "text-error" : ""}>{errors}</b> ERR
              </span>
            </div>
          </div>
          <div className="typing-copy" aria-label="Race typing text">
            {raceText.split("").map((char, index) => {
              const state =
                index < typed.length
                  ? typed[index] === char
                    ? "correct"
                    : "wrong"
                  : index === typed.length
                    ? "cursor"
                    : "pending";
              return (
                <span key={`${index}-${char}`} className={CHAR_CLASS[state]}>
                  {char}
                </span>
              );
            })}
          </div>
          <div className="typing-footer grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span className="truncate font-mono text-[0.55rem] uppercase text-muted-text">
              {phase === "ready"
                ? "Waiting for player"
                : phase === "countdown"
                  ? "Get ready"
                  : phase === "finished"
                    ? "Race complete"
                    : "Type to accelerate · Backspace to correct"}
            </span>
            <span className="font-mono text-[0.58rem] font-bold text-primary-light">
              {Math.round(playerProgress)}%
            </span>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            className="countdown-overlay absolute inset-0 z-50 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mx-4 w-full max-w-md text-center"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-label text-primary-light">
                Neon Circuit · 4 racers
              </p>
              <h1 className="mt-3 text-3xl font-extrabold uppercase sm:text-4xl">
                Ready to race?
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Your rivals are staged. Start when you are ready.
              </p>
              <div className="mt-6 space-y-3 text-left">
                <div>
                  <p className="font-mono text-[0.55rem] font-bold uppercase tracking-label text-muted-text">
                    Passage length
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {LENGTH_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPassageLength(option.id)}
                        className={`h-8 flex-1 rounded-md border font-mono text-[0.62rem] font-bold uppercase transition-colors ${passageLength === option.id ? "border-primary bg-primary/15 text-primary-light" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[0.55rem] font-bold uppercase tracking-label text-muted-text">
                    Difficulty
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDifficulty(option.id)}
                        className={`h-8 flex-1 rounded-md border font-mono text-[0.62rem] font-bold uppercase transition-colors ${difficulty === option.id ? "border-primary bg-primary/15 text-primary-light" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="btn-glow mt-6 uppercase" onClick={startRace}>
                <Zap className="size-4" /> Start race
              </Button>
            </motion.div>
          </motion.div>
        )}
        {phase === "countdown" && (
          <motion.div
            className="countdown-overlay absolute inset-0 z-50 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.22 }}
              className="text-center"
            >
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-label text-primary-light">
                Race initializing
              </p>
              <p className="countdown-number mt-1">{countdown}</p>
            </motion.div>
          </motion.div>
        )}
        {phase === "finished" && (
          <motion.div
            className="finish-toast"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Trophy className="size-5 text-warning" />
            <div>
              <strong className="block text-xs uppercase">Race complete</strong>
              <span className="font-mono text-[0.58rem] text-muted-foreground">
                {wpm} WPM · {accuracy}% accuracy
              </span>
            </div>
            <Button className="min-h-8 h-8 px-3 text-xs" onClick={resetRace}>
              Race again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
