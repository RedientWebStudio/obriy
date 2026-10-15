import { getTranslations } from "next-intl/server";
import { HeaderFrame } from "@/components/layout/HeaderFrame";
import { HeaderLogo } from "@/components/layout/HeaderLogo";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { NavLinks, type NavItem } from "@/components/layout/NavLinks";

const navItems: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/catalog", key: "catalog" },
  { href: "/contacts", key: "contacts" },
];

export async function Header() {
  const t = await getTranslations("Header");

  return (
    <HeaderFrame>
      <HeaderLogo label={t("logo")} scrollLabel={t("logoScrollTop")} />

      <NavLinks
        items={navItems}
        labels={{
          home: t("home"),
          catalog: t("catalog"),
          contacts: t("contacts"),
        }}
        navLabel={t("navLabel")}
      />

      <div className="header-locale">
        <LocaleSwitcher />
      </div>
    </HeaderFrame>
  );
}
