import { expect, test } from "@playwright/test";

test.describe("Monaco editor integration", () => {
  test("intercepts keys in normal mode and advances a lesson to completion", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    // The cursor-motion lesson has 5 steps:
    //   1: press l (right)        → cursor at line 0 col 2
    //   2: press j (down)         → cursor at line 1 col 2
    //   3: press k (up)           → cursor at line 0 col 2
    //   4: press h (left)         → cursor at line 0 col 1
    //   5: navigate to (line 3, col 3) → press j j l l
    await page.goto("/#/lessons/02-basics/02-cursor-motion");

    await page.waitForSelector(".monaco-editor", { timeout: 30000 });
    await expect(page.getByText("NORMAL")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=/Step 1\\/5/")).toBeVisible();

    // Click the editor — in normal mode this should NOT move the cursor
    // (the bridge re-asserts our state on every mouse-up).
    await page.locator(".monaco-editor").first().click();
    await page.waitForTimeout(200);

    await page.keyboard.press("l");
    await expect(page.locator("text=/Step 2\\/5/")).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("j");
    await expect(page.locator("text=/Step 3\\/5/")).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("k");
    await expect(page.locator("text=/Step 4\\/5/")).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("h");
    await expect(page.locator("text=/Step 5\\/5/")).toBeVisible({ timeout: 5000 });

    // Step 5: from (0, 1), need to reach (line 3, col 3).
    // Down 3, right 2 — but j/k/l fallback dispatches dance.select.{down,up,right}.jump,
    // which do single-cell motion in our emulator.
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await page.keyboard.press("l");
    await page.keyboard.press("l");

    // Lesson should now be complete: narration panel shows the cheer line.
    await expect(
      page.getByText(/Lesson complete!|Boom — that one's done\.|All steps green/).first(),
    ).toBeVisible({ timeout: 5000 });

    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("does NOT insert characters in normal mode", async ({ page }) => {
    await page.goto("/#/lessons/02-basics/02-cursor-motion");
    await page.waitForSelector(".monaco-editor", { timeout: 30000 });
    await expect(page.getByText("NORMAL")).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(200);

    // Read the editor's text BEFORE typing (Monaco renders glyphs as
    // .view-line elements; we read the pre-typing snapshot).
    const before = await page.evaluate(() => {
      const lines = Array.from(document.querySelectorAll(".view-line"));
      return lines.map((l) => l.textContent ?? "").join("\n");
    });

    // Now press a non-mapped letter ('z' in matchKakDefault is not bound).
    // We expect the buffer text to be UNCHANGED.
    await page.keyboard.press("z");
    await page.keyboard.press("z");
    await page.keyboard.press("z");
    await page.waitForTimeout(200);

    const after = await page.evaluate(() => {
      const lines = Array.from(document.querySelectorAll(".view-line"));
      return lines.map((l) => l.textContent ?? "").join("\n");
    });

    expect(after).toBe(before);
  });

  test("enters insert mode on i and lets characters through, leaves on esc", async ({ page }) => {
    await page.goto("/#/lessons/02-basics/02-cursor-motion");
    await page.waitForSelector(".monaco-editor", { timeout: 30000 });
    await expect(page.getByText("NORMAL")).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(200);

    // 'i' = dance.modes.insert.before via matchKakDefault fallback.
    await page.keyboard.press("i");
    await expect(page.getByText("INSERT")).toBeVisible({ timeout: 3000 });

    // Now characters should land in the buffer.
    await page.keyboard.type("XYZ");
    await page.waitForTimeout(150);
    const text = await page.evaluate(() => {
      const lines = Array.from(document.querySelectorAll(".view-line"));
      return lines.map((l) => l.textContent ?? "").join("\n");
    });
    expect(text).toContain("XYZ");

    // Esc returns to NORMAL.
    await page.keyboard.press("Escape");
    await expect(page.getByText("NORMAL")).toBeVisible({ timeout: 3000 });
  });
});
