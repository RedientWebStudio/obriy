import { getTranslations } from "next-intl/server";
import { HeaderBurgerMenu } from "@/components/layout/HeaderBurgerMenu";
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

  const labels = {
    home: t("home"),
    catalog: t("catalog"),
    contacts: t("contacts"),
  };

  return (
    <HeaderFrame>
      <HeaderLogo label={t("logo")} scrollLabel={t("logoScrollTop")} />

      <NavLinks
        items={navItems}
        labels={labels}
        navLabel={t("navLabel")}
      />

      <div className="header-actions">
        <div className="header-locale">
          <LocaleSwitcher />
        </div>
        <HeaderBurgerMenu
          items={navItems}
          labels={labels}
          navLabel={t("navLabel")}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
        />
      </div>
    </HeaderFrame>
  );
}
