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
      // Over the header / banner the 3D scene should stay still, so reset to the resting pose.
      if ((e.target as Element | null)?.closest?.("header, [data-site-banner]")) {
        globalPointer.x = 0;
        globalPointer.y = 0;
        return;
      }
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
  // Pointer left the window (e.g. to the browser tabs): ease back to rest instead of freezing tilted.
  document.addEventListener("pointerleave", () => {
    globalPointer.x = 0;
    globalPointer.y = 0;
  });
}
