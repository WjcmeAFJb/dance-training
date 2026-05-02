// SVG paperclip mascot. Animation states are just CSS classes on the inner group.
//
// Geometry: a single bent wire shaped like a real paperclip, drawn left-to-right.
// Eyes + brows sit on the upper-left bay (between the inner and outer loops).

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
      viewBox="0 0 120 160"
      width={size}
      height={(size * 160) / 120}
      className={cn("text-clippy", state === "idle" && "clippy-bob", className)}
      role="img"
      aria-label="Clippy, your Kakoune assistant"
    >
      <defs>
        <linearGradient id="clippyWire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(48 95% 75%)" />
          <stop offset="55%" stopColor="hsl(48 95% 60%)" />
          <stop offset="100%" stopColor="hsl(36 80% 45%)" />
        </linearGradient>
        <filter id="clippyShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
          <feOffset dx="0" dy="2" result="off" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter="url(#clippyShadow)"
        className={cn(
          state === "talking" && "animate-pulse",
          state === "cheering" && "origin-bottom",
        )}
      >
        {/* The paperclip wire — a single continuous bent path.
            Outer right vertical → bottom hook (left) → left vertical (going up) →
            top hook (right) → inner right vertical (going down) → inner end. */}
        <path
          d="
            M 90 30
            L 90 130
            A 20 20 0 0 1 50 130
            L 50 30
            A 14 14 0 0 1 78 30
            L 78 110
          "
          fill="none"
          stroke="url(#clippyWire)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Faint inner highlight on the outer rail, gives metallic feel */}
        <path
          d="M 90 36 L 90 124"
          fill="none"
          stroke="hsl(48 100% 92%)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Brows */}
        <Brows state={state} />
        {/* Eyes — sit on the upper-left bay between inner and outer */}
        <Eye cx={61} cy={62} state={state} />
        <Eye cx={79} cy={62} state={state} />
        {/* Mouth */}
        <Mouth state={state} />
        {/* Pointing finger arrow when state="pointing" */}
        {state === "pointing" && (
          <path
            d="M 96 88 L 116 88 M 110 82 L 116 88 L 110 94"
            fill="none"
            stroke="hsl(48 95% 60%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
}

function Eye({ cx, cy, state }: { cx: number; cy: number; state: ClippyState }) {
  const isClosed = state === "sleeping";
  if (isClosed) {
    return (
      <line
        x1={cx - 5}
        y1={cy}
        x2={cx + 5}
        y2={cy}
        stroke="hsl(220 26% 7%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx="4.6"
        ry="5.6"
        fill="white"
        stroke="hsl(220 26% 7%)"
        strokeWidth="1.4"
      />
      <circle
        cx={cx + (state === "pointing" ? 1.2 : 0)}
        cy={cy + (state === "cheering" ? -1 : 0.5)}
        r="2.2"
        fill="hsl(220 26% 7%)"
        className="clippy-eye"
      />
      <circle cx={cx + 0.8} cy={cy - 1.5} r="0.8" fill="white" />
    </g>
  );
}

function Brows({ state }: { state: ClippyState }) {
  const stroke = "hsl(48 95% 30%)";
  const sw = 2.2;
  if (state === "cheering") {
    return (
      <>
        <path
          d="M 56 50 Q 61 46 66 50"
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M 74 50 Q 79 46 84 50"
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </>
    );
  }
  if (state === "talking") {
    return (
      <>
        <path
          d="M 56 51 Q 61 49 66 51"
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d="M 74 51 Q 79 49 84 51"
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </>
    );
  }
  if (state === "sleeping") return null;
  return (
    <>
      <path
        d="M 56 52 L 66 52"
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M 74 52 L 84 52"
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </>
  );
}

function Mouth({ state }: { state: ClippyState }) {
  switch (state) {
    case "cheering":
      return (
        <path
          d="M 64 76 Q 70 86 76 76"
          fill="hsl(0 60% 35%)"
          stroke="hsl(220 26% 7%)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "talking":
      return (
        <ellipse
          cx="70"
          cy="78"
          rx="5"
          ry="3"
          fill="hsl(0 60% 25%)"
          stroke="hsl(220 26% 7%)"
          strokeWidth="1.4"
        />
      );
    case "sleeping":
      return (
        <path
          d="M 64 78 Q 70 80 76 78"
          fill="none"
          stroke="hsl(220 26% 7%)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      );
    case "pointing":
      return (
        <line
          x1="65"
          y1="78"
          x2="75"
          y2="78"
          stroke="hsl(220 26% 7%)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M 64 76 Q 70 81 76 76"
          fill="none"
          stroke="hsl(220 26% 7%)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      );
  }
}
