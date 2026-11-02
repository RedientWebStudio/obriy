/**
 * Explicit opt-in for catalog demo products (test mode only).
 *
 * Default when unset: disabled (safe for client / production).
 * Enable with DEMO_CATALOG=true|1|on|yes.
 */
export function isDemoCatalogEnabled(): boolean {
  const value = process.env.DEMO_CATALOG?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "on" || value === "yes";
}
