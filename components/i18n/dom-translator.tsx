"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Dict = Record<string, string>;

/**
 * Hinglish UI layer. Pages stay statically rendered in English; when the visitor picks Hinglish we
 * swap UI text in the browser from a dictionary (lazy-loaded, so English visitors download nothing).
 *
 * - Only whole text nodes / attributes that exactly match a UI string are replaced, so learning
 *   content (tutorials, problem statements, code, user posts, names) is never touched.
 * - Numbers are matched through placeholders: "12 lessons" uses the "{x} lessons" entry.
 * - A MutationObserver keeps late UI (toasts, dialogs, menus, live counters) translated.
 */
const SKIP_SELECTOR = "script,style,code,pre,textarea,input,.monaco-editor,[data-no-translate],[contenteditable=true],.prose-cv,svg";
const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;
const NUM = /\d[\d,.:%]*/g;

let dict: Dict | null = null;
let shapes: Map<string, string> | null = null;

async function loadDict() {
  if (dict) return dict;
  const mod = (await import("@/messages/hinglish-ui.json")) as { default: Dict };
  dict = mod.default;
  shapes = new Map();
  for (const [en, hi] of Object.entries(dict)) if (en.includes("{x}")) shapes.set(en.replace(/\{x\}/g, "\u0000"), hi);
  return dict;
}

/** Labels that wrap a date or name, e.g. "Unlocked 20 Sept 2026", "5m ago". */
const RULES: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Unlocked (.+)$/, (m) => `${m[1]} ko unlock hua`],
  [/^Enrolled (.+)$/, (m) => `${m[1]} ko enroll kiya`],
  [/^Completed (.+)$/, (m) => `${m[1]} ko poora kiya`],
  [/^Issued (.+)$/, (m) => `${m[1]} ko jaari hua`],
  [/^Company: (.+)$/, (m) => `Company: ${m[1]}`],
  [/^(\d+)(y|mo|w|d|h|m) ago$/, (m) => `${m[1]}${m[2]} pehle`],
  [/^just now$/, () => "abhi abhi"],
];

function lookup(raw: string): string | null {
  if (!dict) return null;
  const key = raw.replace(/\s+/g, " ").trim();
  if (!key || !/[A-Za-z]/.test(key)) return null;
  const direct = dict[key];
  if (direct !== undefined) return direct;
  for (const [re, fn] of RULES) {
    const m = key.match(re);
    if (m) return fn(m);
  }
  // Shape match: replace numbers (and quoted names) with placeholders, then put them back in order.
  const nums = key.match(NUM);
  if (nums && shapes) {
    const shape = key.replace(NUM, "\u0000");
    const hit = shapes.get(shape) ?? dict[key.replace(NUM, "{x}")];
    if (hit !== undefined) {
      let i = 0;
      return hit.replace(/\{x\}/g, () => nums[i++] ?? "");
    }
  }
  return null;
}

const translated = new WeakMap<Node, string>(); // node -> value we wrote (to ignore our own mutations)

function translateText(node: Text) {
  const v = node.nodeValue ?? "";
  if (translated.get(node) === v) return;
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP_SELECTOR)) return;
  const hit = lookup(v);
  if (hit === null) return;
  const lead = v.match(/^\s*/)?.[0] ?? "";
  const trail = v.match(/\s*$/)?.[0] ?? "";
  const next = lead + hit + trail;
  translated.set(node, next);
  if (next !== v) node.nodeValue = next;
}

function translateAttrs(el: Element) {
  if (el.closest("[data-no-translate],.monaco-editor")) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (!v) continue;
    const hit = lookup(v);
    if (hit !== null && hit !== v) el.setAttribute(a, hit);
  }
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root as Text);
  if (!(root instanceof Element)) return;
  if (root.closest(SKIP_SELECTOR) && root.tagName !== "INPUT" && root.tagName !== "TEXTAREA") return;
  translateAttrs(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n instanceof Element && n.matches("script,style,code,pre,.monaco-editor,[data-no-translate],.prose-cv,svg") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) translateText(n as Text);
    else translateAttrs(n as Element);
  }
}

function translateTitle() {
  const [page, ...rest] = document.title.split(" · ");
  const hit = lookup(page);
  if (hit && hit !== page) document.title = [hit, ...rest].join(" · ");
}

export function DomTranslator({ active }: { active: boolean }) {
  const pathname = usePathname();
  const on = active && !pathname.startsWith("/admin");

  useEffect(() => {
    const html = document.documentElement;
    if (!on) {
      html.classList.remove("tr-pending");
      return;
    }
    let observer: MutationObserver | null = null;
    let cancelled = false;
    void loadDict().then(() => {
      if (cancelled) return;
      translateTree(document.body);
      translateTitle();
      html.classList.remove("tr-pending");
      observer = new MutationObserver((records) => {
        for (const r of records) {
          if (r.type === "characterData") translateText(r.target as Text);
          else if (r.type === "attributes") translateAttrs(r.target as Element);
          else r.addedNodes.forEach((n) => translateTree(n));
        }
      });
      observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [on]);

  // Route changes swap page content and the <title>; translate again once React has committed.
  useEffect(() => {
    if (!on || !dict) return;
    const id = window.setTimeout(() => {
      translateTree(document.body);
      translateTitle();
    }, 0);
    return () => window.clearTimeout(id);
  }, [on, pathname]);

  return null;
}
