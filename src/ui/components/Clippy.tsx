// SVG paperclip mascot. Animation states are just CSS classes on the inner group.

import { cn } from "../lib/utils.ts";

export type ClippyState = "idle" | "talking" | "cheering" | "pointing" | "sleeping";

export function Clippy({
  state = "idle",
  size = 96,
  className,
}: {
  state?: ClippyState;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 140"
      width={size}
      height={(size * 140) / 100}
      className={cn("text-clippy", state === "idle" && "clippy-bob", className)}
      role="img"
      aria-label="Clippy, your Kakoune assistant"
    >
      <g
        className={cn(
          state === "talking" && "animate-pulse",
          state === "cheering" && "origin-bottom",
        )}
      >
        {/* Outer paperclip loop */}
        <path
          d="M 30 20
             Q 30 10 50 10
             Q 70 10 70 25
             L 70 100
             Q 70 120 50 120
             Q 30 120 30 105
             L 30 35
             Q 30 25 45 25
             Q 60 25 60 35
             L 60 95
             Q 60 105 50 105
             Q 40 105 40 95
             L 40 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Eyes */}
        <ellipse cx="42" cy="55" rx="3.2" ry="4" fill="hsl(220 26% 7%)" className="clippy-eye" />
        <ellipse cx="56" cy="55" rx="3.2" ry="4" fill="hsl(220 26% 7%)" className="clippy-eye" />
        {/* Pupils */}
        <circle cx="42" cy="56" r="1.2" fill="hsl(220 13% 91%)" />
        <circle cx="56" cy="56" r="1.2" fill="hsl(220 13% 91%)" />
        {/* Mouth */}
        <Mouth state={state} />
      </g>
    </svg>
  );
}

function Mouth({ state }: { state: ClippyState }) {
  switch (state) {
    case "cheering":
      return (
        <path
          d="M 41 70 Q 49 80 57 70"
          fill="none"
          stroke="hsl(220 26% 7%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case "talking":
      return <ellipse cx="49" cy="72" rx="4" ry="2.4" fill="hsl(220 26% 7%)" />;
    case "sleeping":
      return (
        <line
          x1="44"
          y1="70"
          x2="54"
          y2="70"
          stroke="hsl(220 26% 7%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M 43 70 Q 49 75 55 70"
          fill="none"
          stroke="hsl(220 26% 7%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
  }
}
