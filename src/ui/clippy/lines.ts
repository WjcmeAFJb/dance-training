// Clippy's catalogue of voice lines. We sample so the same step doesn't get
// the same opener every time the user retries.

const sample = <T>(arr: readonly T[]): T => {
  const idx = Math.floor(Math.random() * arr.length) % arr.length;
  return arr[idx]!;
};

export const CLIPPY_LINES = {
  intro: [
    "Welcome back. Let's see what we're up to today…",
    "It looks like you're trying to learn Kakoune. Want some help?",
    "New lesson! I'll be your friendly, slightly-too-attentive paperclip.",
  ],
  hint: ["Stuck? Try this:", "Need a nudge? Here's the move:", "Psst. Use this one."],
  success: [
    "Nice! That's the move.",
    "Beautiful selection.",
    "You and Kak are officially friends.",
    "Right on. Onward.",
  ],
  failure: [
    "Almost — re-read the step?",
    "Not quite. Step back, breathe, try again.",
    "Hmm, that wasn't the goal. Want me to spoil it?",
  ],
  unbound: [
    "You haven't bound this in Dance — I'll show the Kakoune default instead.",
    "FYI: this command isn't in your keybindings. The Kak default would be:",
  ],
  discrepancy: [
    "Heads up — Dance does this slightly differently than Kakoune:",
    "Real-Kak detail incoming:",
  ],
  cheer: [
    "Lesson complete!",
    "Boom. That one's done.",
    "All steps green. Take five and grab the next one.",
  ],
} as const;

export const pickLine = (kind: keyof typeof CLIPPY_LINES): string => sample(CLIPPY_LINES[kind]);
