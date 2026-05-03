// Tiny boolean-expression evaluator for VS Code `when` clauses.
//
// Supports the subset that the Dance setup actually uses:
//   - identifiers (with dots): editorTextFocus, dance.mode, jumpy2.jump-mode, …
//   - string literals in single or double quotes
//   - operators: && || ! == != ( )
//
// The full VS Code `when` grammar also has `>=`, `<`, `=~`, regex, etc., but
// none of those appear in the bindings the Dance extension installs.

export type WhenValue = string | boolean;

export interface WhenContext {
  /** Map from `when` identifier (e.g., "dance.mode") to its current value. */
  values: Record<string, WhenValue | undefined>;
}

type Token =
  | { kind: "ident"; v: string }
  | { kind: "string"; v: string }
  | { kind: "op"; v: "&&" | "||" | "!" | "==" | "!=" | "(" | ")" };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i]!;
    if (c === " " || c === "\t" || c === "\n") {
      i++;
      continue;
    }
    if (c === "(" || c === ")") {
      out.push({ kind: "op", v: c });
      i++;
      continue;
    }
    if (c === "&" && src[i + 1] === "&") {
      out.push({ kind: "op", v: "&&" });
      i += 2;
      continue;
    }
    if (c === "|" && src[i + 1] === "|") {
      out.push({ kind: "op", v: "||" });
      i += 2;
      continue;
    }
    if (c === "=" && src[i + 1] === "=") {
      out.push({ kind: "op", v: "==" });
      i += 2;
      continue;
    }
    if (c === "!" && src[i + 1] === "=") {
      out.push({ kind: "op", v: "!=" });
      i += 2;
      continue;
    }
    if (c === "!") {
      out.push({ kind: "op", v: "!" });
      i++;
      continue;
    }
    if (c === "'" || c === '"') {
      const q = c;
      let v = "";
      i++;
      while (i < src.length && src[i] !== q) {
        v += src[i]!;
        i++;
      }
      i++; // consume closing quote
      out.push({ kind: "string", v });
      continue;
    }
    // Identifier — letters, digits, dots, dashes, underscores.
    if (/[A-Za-z0-9_]/.test(c)) {
      let v = "";
      while (i < src.length && /[A-Za-z0-9_.-]/.test(src[i]!)) {
        v += src[i]!;
        i++;
      }
      out.push({ kind: "ident", v });
      continue;
    }
    // Unknown character — skip.
    i++;
  }
  return out;
}

class Parser {
  pos = 0;
  constructor(public toks: Token[]) {}

  peek(): Token | undefined {
    return this.toks[this.pos];
  }
  consume(): Token | undefined {
    return this.toks[this.pos++];
  }
  expectOp(v: string): boolean {
    const t = this.peek();
    if (t && t.kind === "op" && t.v === v) {
      this.pos++;
      return true;
    }
    return false;
  }

  // expr = or
  parseOr(): WhenAst {
    let left = this.parseAnd();
    while (this.peek()?.kind === "op" && (this.peek() as { v: string }).v === "||") {
      this.consume();
      const right = this.parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }
  parseAnd(): WhenAst {
    let left = this.parseNot();
    while (this.peek()?.kind === "op" && (this.peek() as { v: string }).v === "&&") {
      this.consume();
      const right = this.parseNot();
      left = { kind: "and", left, right };
    }
    return left;
  }
  parseNot(): WhenAst {
    if (this.peek()?.kind === "op" && (this.peek() as { v: string }).v === "!") {
      this.consume();
      return { kind: "not", value: this.parseNot() };
    }
    return this.parseCmp();
  }
  parseCmp(): WhenAst {
    const left = this.parsePrimary();
    const op = this.peek();
    if (op?.kind === "op" && (op.v === "==" || op.v === "!=")) {
      this.consume();
      const right = this.parsePrimary();
      return { kind: "cmp", op: op.v, left, right };
    }
    return left;
  }
  parsePrimary(): WhenAst {
    const t = this.consume();
    if (!t) return { kind: "value", value: false };
    if (t.kind === "op" && t.v === "(") {
      const inner = this.parseOr();
      this.expectOp(")");
      return inner;
    }
    if (t.kind === "string") return { kind: "value", value: t.v };
    if (t.kind === "ident") {
      if (t.v === "true") return { kind: "value", value: true };
      if (t.v === "false") return { kind: "value", value: false };
      return { kind: "ident", name: t.v };
    }
    return { kind: "value", value: false };
  }
}

export type WhenAst =
  | { kind: "value"; value: WhenValue }
  | { kind: "ident"; name: string }
  | { kind: "not"; value: WhenAst }
  | { kind: "and"; left: WhenAst; right: WhenAst }
  | { kind: "or"; left: WhenAst; right: WhenAst }
  | { kind: "cmp"; op: "==" | "!="; left: WhenAst; right: WhenAst };

export function parseWhen(src: string): WhenAst {
  return new Parser(tokenize(src)).parseOr();
}

function valueOf(node: WhenAst, ctx: WhenContext): WhenValue {
  switch (node.kind) {
    case "value":
      return node.value;
    case "ident":
      return ctx.values[node.name] ?? false;
    case "not":
      return !truthy(valueOf(node.value, ctx));
    case "and":
      return truthy(valueOf(node.left, ctx)) && truthy(valueOf(node.right, ctx));
    case "or":
      return truthy(valueOf(node.left, ctx)) || truthy(valueOf(node.right, ctx));
    case "cmp": {
      const l = valueOf(node.left, ctx);
      const r = valueOf(node.right, ctx);
      return node.op === "==" ? l === r : l !== r;
    }
  }
}

function truthy(v: WhenValue): boolean {
  if (typeof v === "boolean") return v;
  return v !== "" && v !== "false";
}

export function evaluateWhen(src: string | undefined, ctx: WhenContext): boolean {
  if (!src) return true;
  try {
    return truthy(valueOf(parseWhen(src), ctx));
  } catch {
    return true; // be permissive on parse failures
  }
}
