/**
 * Global not-found shell — required when the root layout only passes children
 * through (html/body live under [locale] / studio).
 */
export default function GlobalNotFound() {
  return (
    <html lang="uk">
      <body>
        <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
          <h1>404</h1>
          <p>Page not found.</p>
        </main>
      </body>
    </html>
  );
}
