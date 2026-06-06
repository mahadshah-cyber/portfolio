"use client";

/* ═══════════════════════════════════════════════════════════
   Hacker Mode — Global State + Konami Code Detector
   Unlocked by: ↑↑↓↓←→←→BA  or  typing "sudo --override"
   in the terminal page.
═══════════════════════════════════════════════════════════ */

type Listener = (active: boolean) => void;

class HackerModeEngine {
  private _active = false;
  private _listeners: Set<Listener> = new Set();
  private _konamiSequence = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a",
  ];
  private _buffer: string[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this._restore();
      window.addEventListener("keydown", this._onKey.bind(this));
    }
  }

  private _restore() {
    try {
      if (localStorage.getItem("hacker-mode") === "true") {
        this._active = true;
        this._applyClass();
      }
    } catch { /* ignore */ }
  }

  private _onKey(e: KeyboardEvent) {
    this._buffer.push(e.key);
    if (this._buffer.length > this._konamiSequence.length) {
      this._buffer.shift();
    }
    if (this._buffer.join(",") === this._konamiSequence.join(",")) {
      this.toggle();
      this._buffer = [];
    }
  }

  private _applyClass() {
    if (this._active) {
      document.documentElement.classList.add("hacker-mode");
      document.body.classList.add("hacker-mode");
    } else {
      document.documentElement.classList.remove("hacker-mode");
      document.body.classList.remove("hacker-mode");
    }
  }

  private _emit() {
    this._listeners.forEach((fn) => fn(this._active));
  }

  toggle() {
    this._active = !this._active;
    this._applyClass();
    this._emit();
    try { localStorage.setItem("hacker-mode", String(this._active)); } catch { /* ignore */ }
  }

  activate() {
    if (this._active) return;
    this.toggle();
  }

  deactivate() {
    if (!this._active) return;
    this.toggle();
  }

  isActive() { return this._active; }

  subscribe(fn: Listener): () => void {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }
}

// Singleton — safe for SSR (window check inside constructor)
export const hackerMode = typeof window !== "undefined"
  ? new HackerModeEngine()
  : null as unknown as HackerModeEngine;
