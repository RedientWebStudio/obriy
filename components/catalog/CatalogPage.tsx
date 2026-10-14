import { getTranslations } from "next-intl/server";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { Container } from "@/components/layout/Container";
import { catalogCategories } from "@/lib/catalog-categories";

export async function CatalogPage() {
  const t = await getTranslations("CatalogPage");

  return (
    <main className="catalog-page">
      <Container>
        <header className="catalog-intro">
          <h1 className="catalog-heading">{t("heading")}</h1>
          <p className="catalog-lead">{t("lead")}</p>
        </header>

        <ul className="catalog-grid">
          {catalogCategories.map((category, index) => (
            <CategoryCard
              key={category.slug}
              href={`/catalog/${category.slug}`}
              name={t(`categories.${category.slug}.name`)}
              imageSrc={category.image}
              imageAlt={t(`categories.${category.slug}.imageAlt`)}
              priority={index === 0}
            />
          ))}
        </ul>
      </Container>
    </main>
  );
}
