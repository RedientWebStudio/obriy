/**
 * Kill switch for catalog demo products.
 *
 * Set DEMO_CATALOG=false (or 0 / off) before production launch so
 * fictitious prices/specs never appear as live offers.
 * Default: enabled when unset (development stage).
 */
export function isDemoCatalogEnabled(): boolean {
  const value = process.env.DEMO_CATALOG?.trim().toLowerCase();
  if (!value) return true;
  return !(value === "0" || value === "false" || value === "off" || value === "no");
}
