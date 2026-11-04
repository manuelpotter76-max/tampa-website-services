// Send a Google Analytics event. Safe to call anywhere; does nothing if GA hasn't loaded.
export function track(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
}
