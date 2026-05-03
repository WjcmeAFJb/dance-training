// A small modeless prompt that opens above the editor when Dance asks for
// inline input — used by `:colon` mode commands, by `|` pipe expressions,
// by `/` search, and by `f`/`t` seek-char.

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils.ts";

export type PromptKind = "colon" | "pipe" | "pipe.append" | "pipe.prepend" | "search" | "seek";

const META: Record<PromptKind, { prefix: string; placeholder: string }> = {
  colon: { prefix: ":", placeholder: "command (sort, reverse, unique, upper, lower, goto N, …)" },
  pipe: { prefix: "|", placeholder: "expression — $ is the selection text. Or #sort, /pat/repl/" },
  "pipe.append": { prefix: "<a-!>", placeholder: "expression to append after each selection" },
  "pipe.prepend": { prefix: "!", placeholder: "expression to insert before each selection" },
  search: { prefix: "/", placeholder: "regex" },
  seek: { prefix: "f", placeholder: "single character" },
};

interface Props {
  kind: PromptKind;
  onSubmit: (input: string) => void;
  onCancel: () => void;
}

export function CommandPrompt({ kind, onSubmit, onCancel }: Props) {
  const meta = META[kind];
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 z-10 flex items-stretch border-b bg-card/95 backdrop-blur",
      )}
    >
      <span className="px-3 py-1.5 font-mono text-sm text-primary self-center select-none">
        {meta.prefix}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={meta.placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // Stop these from leaking back to the Monaco onKeyDown handler.
          e.stopPropagation();
          if (e.key === "Enter") {
            onSubmit(value);
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="flex-1 bg-transparent outline-hidden text-sm font-mono py-1.5 pr-3"
      />
      <button
        type="button"
        onClick={onCancel}
        className="px-3 text-xs text-muted-foreground hover:text-foreground"
      >
        Esc
      </button>
    </div>
  );
}
