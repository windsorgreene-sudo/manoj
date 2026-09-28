/**
 * Mutable, render-free channels shared between DOM scroll/pointer handlers and the R3F render loop.
 * (Avoids React re-renders at 60fps.)
 */
export const storyProgress = { current: 0 };
export const globalPointer = { x: 0, y: 0 };

let bound = false;
export function bindGlobalPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}
