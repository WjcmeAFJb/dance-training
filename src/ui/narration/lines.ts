// Generic lesson narration phrases. Sampled so the same prompt doesn't get the
// same opener every retry.

const sample = <T>(arr: readonly T[]): T => {
  const idx = Math.floor(Math.random() * arr.length) % arr.length;
  return arr[idx]!;
};

export const NARRATION_LINES = {
  intro: ["", "", ""],
  hint: ["**Hint.** Try this:", "**Stuck?** Use:"],
  success: ["Done.", "Got it.", "Onward."],
  failure: ["Not quite — re-read the step?", "Almost; try again."],
  unbound: ["You haven't bound this in Dance — using the Kakoune default:"],
  cheer: ["Lesson complete!", "Boom — that one's done."],
} as const;

export const pickLine = (kind: keyof typeof NARRATION_LINES): string =>
  sample(NARRATION_LINES[kind]);
