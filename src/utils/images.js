/**
 * Inline SVG placeholder for missing product images.
 *
 * The app used to fall back to via.placeholder.com, which is a third-party
 * request on every broken image and is frequently slow or down. This is a data
 * URI: zero network, always available, and it matches the brand palette.
 */
export const PRODUCT_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f2ece1"/>
  <circle cx="200" cy="168" r="66" fill="#dcefe6"/>
  <text x="200" y="196" font-size="66" text-anchor="middle">🥛</text>
  <text x="200" y="286" font-size="20" font-family="system-ui, sans-serif"
        fill="#8b9a93" text-anchor="middle" letter-spacing="1">
    Image coming soon
  </text>
</svg>`);
