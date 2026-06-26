/**
 * Animation Helpers — Sovereign Phase 1
 * Replacement 6: Hybrid approach
 * - Simple: Pure CSS
 * - Number count-up: requestAnimationFrame loop
 * - Word-by-word reveal: Split into <span> with CSS animation-delay
 */

/**
 * Animate a number from one value to another using requestAnimationFrame.
 * Uses exponential ease-out for a satisfying feel.
 */
export function animateNumber(
  el: HTMLElement,
  from: number,
  to: number,
  duration = 800
): void {
  const start = performance.now()
  const diff = to - from

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Exponential ease-out
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    el.textContent = Math.round(from + diff * eased).toString()
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

/**
 * Split text into word spans for word-by-word reveal animation.
 * Each word gets an increasing animation-delay.
 * Requires @keyframes wordReveal defined in globals.css.
 */
export function splitWordsForReveal(text: string): string {
  return text
    .split(' ')
    .map(
      (word, i) =>
        `<span style="opacity:0;animation:wordReveal 200ms ${i * 40}ms forwards">${word}</span>`
    )
    .join(' ')
}
