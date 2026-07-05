// ── PWA REGISTRATION ──────────────────────────────
// Only on http/https — inside the Capacitor shell (capacitor:// / file:) assets
// are already local, and SW registration there would fail or double-cache.
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
