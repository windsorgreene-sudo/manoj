// In-browser Python execution via Pyodide (WebAssembly). No server or API key
// is needed: the runtime is fetched once from the jsDelivr CDN, cached by the
// browser, then all code runs locally in the tab.
//
// We pin a specific stable version so the loader and the wasm assets always
// match. Update PYODIDE_VERSION together if bumping.

const PYODIDE_VERSION = "v314.0.6";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_LOADER = `${PYODIDE_BASE}pyodide.js`;

// Minimal shape of the bits of the Pyodide API we use.
interface PyodideAPI {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideAPI>;
  }
}

let pyodidePromise: Promise<PyodideAPI> | null = null;

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Python execution is only available in the browser."));
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[data-pyodide]`);
    if (existing) {
      if (window.loadPyodide) resolve();
      else existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.pyodide = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the Python runtime."));
    document.head.appendChild(s);
  });
}

/** Load (or reuse) a ready Pyodide instance. Safe to call repeatedly. */
export async function getPyodide(): Promise<PyodideAPI> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await loadScriptOnce(PYODIDE_LOADER);
    if (!window.loadPyodide) throw new Error("Python runtime failed to initialise.");
    return window.loadPyodide({ indexURL: PYODIDE_BASE });
  })();
  // If initialisation fails, clear the cache so a later run can retry.
  pyodidePromise.catch(() => {
    pyodidePromise = null;
  });
  return pyodidePromise;
}

export interface PyRunResult {
  output: string;
  error: boolean;
}

/** Run Python source and capture everything printed to stdout/stderr. */
export async function runPython(code: string): Promise<PyRunResult> {
  const py = await getPyodide();
  const out: string[] = [];
  const err: string[] = [];
  py.setStdout({ batched: (s) => out.push(s) });
  py.setStderr({ batched: (s) => err.push(s) });
  try {
    await py.runPythonAsync(code);
    const text = [...out, ...err].join("\n");
    return { output: text.trim() || "(no output)", error: err.length > 0 };
  } catch (e) {
    // Runtime errors (e.g. Python tracebacks) surface as thrown JS errors.
    const combined = [...out, ...err, String(e)].join("\n").trim();
    return { output: combined, error: true };
  }
}
