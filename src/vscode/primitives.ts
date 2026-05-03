// Geometric primitives + Disposable + EventEmitter — the simplest pieces of
// the vscode API. Mirror VS Code's behaviour exactly because Dance compares
// these by identity in places.

export class Position {
  readonly line: number;
  readonly character: number;

  constructor(line: number, character: number) {
    this.line = Math.max(0, line | 0);
    this.character = Math.max(0, character | 0);
  }

  isBefore(other: Position): boolean {
    if (this.line < other.line) return true;
    if (this.line > other.line) return false;
    return this.character < other.character;
  }
  isBeforeOrEqual(other: Position): boolean {
    return this.isBefore(other) || this.isEqual(other);
  }
  isAfter(other: Position): boolean {
    return !this.isBeforeOrEqual(other);
  }
  isAfterOrEqual(other: Position): boolean {
    return !this.isBefore(other);
  }
  isEqual(other: Position): boolean {
    return this.line === other.line && this.character === other.character;
  }
  compareTo(other: Position): number {
    if (this.line < other.line) return -1;
    if (this.line > other.line) return 1;
    return this.character - other.character;
  }
  translate(lineDelta?: number, characterDelta?: number): Position;
  translate(change: { lineDelta?: number; characterDelta?: number }): Position;
  translate(a?: number | { lineDelta?: number; characterDelta?: number }, b?: number): Position {
    const ld = typeof a === "object" ? (a?.lineDelta ?? 0) : (a ?? 0);
    const cd = typeof a === "object" ? (a?.characterDelta ?? 0) : (b ?? 0);
    return new Position(this.line + ld, this.character + cd);
  }
  with(line?: number, character?: number): Position;
  with(change: { line?: number; character?: number }): Position;
  with(a?: number | { line?: number; character?: number }, b?: number): Position {
    const l = typeof a === "object" ? (a?.line ?? this.line) : (a ?? this.line);
    const c = typeof a === "object" ? (a?.character ?? this.character) : (b ?? this.character);
    return new Position(l, c);
  }
}

export class Range {
  readonly start: Position;
  readonly end: Position;

  constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);
  constructor(start: Position, end: Position);
  constructor(a: number | Position, b: number | Position, c?: number, d?: number) {
    const start = typeof a === "number" ? new Position(a, b as number) : a;
    const end = typeof a === "number" ? new Position(c!, d!) : (b as Position);
    if (start.isAfter(end)) {
      this.start = end;
      this.end = start;
    } else {
      this.start = start;
      this.end = end;
    }
  }

  get isEmpty(): boolean {
    return this.start.isEqual(this.end);
  }
  get isSingleLine(): boolean {
    return this.start.line === this.end.line;
  }
  contains(positionOrRange: Position | Range): boolean {
    if (positionOrRange instanceof Position) {
      return (
        positionOrRange.isAfterOrEqual(this.start) && positionOrRange.isBeforeOrEqual(this.end)
      );
    }
    return this.contains(positionOrRange.start) && this.contains(positionOrRange.end);
  }
  isEqual(other: Range): boolean {
    return this.start.isEqual(other.start) && this.end.isEqual(other.end);
  }
  intersection(other: Range): Range | undefined {
    const start = this.start.isAfter(other.start) ? this.start : other.start;
    const end = this.end.isBefore(other.end) ? this.end : other.end;
    if (start.isAfter(end)) return undefined;
    return new Range(start, end);
  }
  union(other: Range): Range {
    const start = this.start.isBefore(other.start) ? this.start : other.start;
    const end = this.end.isAfter(other.end) ? this.end : other.end;
    return new Range(start, end);
  }
  with(start?: Position, end?: Position): Range;
  with(change: { start?: Position; end?: Position }): Range;
  with(a?: Position | { start?: Position; end?: Position }, b?: Position): Range {
    const s =
      a && typeof a === "object" && "isBefore" in a
        ? (a as Position)
        : ((a as { start?: Position })?.start ?? this.start);
    const e =
      b ??
      (typeof a === "object" && "end" in a ? (a as { end?: Position }).end : this.end) ??
      this.end;
    return new Range(s, e);
  }
}

export class Selection extends Range {
  readonly anchor: Position;
  readonly active: Position;

  constructor(
    anchorLine: number,
    anchorCharacter: number,
    activeLine: number,
    activeCharacter: number,
  );
  constructor(anchor: Position, active: Position);
  constructor(a: number | Position, b: number | Position, c?: number, d?: number) {
    const anchor = typeof a === "number" ? new Position(a, b as number) : a;
    const active = typeof a === "number" ? new Position(c!, d!) : (b as Position);
    super(anchor, active);
    this.anchor = anchor;
    this.active = active;
  }

  get isReversed(): boolean {
    return this.anchor.isAfter(this.active);
  }
}

export class Disposable {
  private readonly _fn: () => void;
  constructor(fn: () => void) {
    this._fn = fn;
  }
  dispose(): void {
    this._fn();
  }
  static from(...disposables: { dispose(): unknown }[]): Disposable {
    return new Disposable(() => {
      for (const d of disposables) {
        try {
          d.dispose();
        } catch {
          /* ignore */
        }
      }
    });
  }
}

export type Event<T> = (
  listener: (e: T) => unknown,
  thisArgs?: unknown,
  disposables?: Disposable[],
) => Disposable;

export class EventEmitter<T> {
  private readonly _listeners = new Set<(e: T) => unknown>();

  readonly event: Event<T> = (listener, thisArgs, disposables) => {
    const bound = thisArgs ? listener.bind(thisArgs) : listener;
    this._listeners.add(bound);
    const d = new Disposable(() => this._listeners.delete(bound));
    if (disposables) disposables.push(d);
    return d;
  };

  fire(payload: T): void {
    for (const l of this._listeners) {
      try {
        l(payload);
      } catch (e) {
        console.error("EventEmitter listener threw:", e);
      }
    }
  }

  dispose(): void {
    this._listeners.clear();
  }
}

export class CancellationTokenSource {
  private _isCancelled = false;
  private readonly _emitter = new EventEmitter<void>();

  readonly token = {
    get isCancellationRequested(): boolean {
      // Bound below to the source instance via getter binding.
      return false;
    },
    onCancellationRequested: this._emitter.event,
  };

  constructor() {
    Object.defineProperty(this.token, "isCancellationRequested", {
      get: () => this._isCancelled,
    });
  }

  cancel(): void {
    if (this._isCancelled) return;
    this._isCancelled = true;
    this._emitter.fire();
  }
  dispose(): void {
    this._emitter.dispose();
  }
}

export class ThemeColor {
  constructor(public readonly id: string) {}
}

export class ThemeIcon {
  static readonly File = new ThemeIcon("file");
  static readonly Folder = new ThemeIcon("folder");
  constructor(
    public readonly id: string,
    public readonly color?: ThemeColor,
  ) {}
}

export class Uri {
  constructor(
    public readonly scheme: string,
    public readonly authority: string,
    public readonly path: string,
    public readonly query: string = "",
    public readonly fragment: string = "",
  ) {}
  static parse(value: string): Uri {
    try {
      const u = new URL(value);
      return new Uri(
        u.protocol.replace(/:$/, ""),
        u.host,
        u.pathname,
        u.search.replace(/^\?/, ""),
        u.hash.replace(/^#/, ""),
      );
    } catch {
      return new Uri("file", "", value);
    }
  }
  static file(path: string): Uri {
    return new Uri("file", "", path);
  }
  static joinPath(base: Uri, ...paths: string[]): Uri {
    const joined = [base.path, ...paths].join("/").replace(/\/+/g, "/");
    return new Uri(base.scheme, base.authority, joined, base.query, base.fragment);
  }
  toString(): string {
    return `${this.scheme}://${this.authority}${this.path}`;
  }
  get fsPath(): string {
    return this.path;
  }
  with(change: {
    scheme?: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }): Uri {
    return new Uri(
      change.scheme ?? this.scheme,
      change.authority ?? this.authority,
      change.path ?? this.path,
      change.query ?? this.query,
      change.fragment ?? this.fragment,
    );
  }
}
