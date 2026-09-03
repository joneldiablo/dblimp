/**
 * Find the closest scrollable parent of an element
 * @param el The element to start from
 * @returns HTMLElement | null
 */
export function findScrollableParent(el: HTMLElement): HTMLElement | null {
  let current = el;

  while (current && current !== document.body) {
    const overflowY = window.getComputedStyle(current).overflowY;
    const isScrollable = overflowY === "auto" || overflowY === "scroll";

    if (isScrollable && current.scrollHeight > current.clientHeight) {
      return current;
    }

    current = current.parentElement!;
  }

  return null;
}