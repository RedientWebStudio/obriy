import { ProductCard, type ProductCardLabels } from "@/components/category/ProductCard";
import type { CategorySection } from "@/lib/category-types";
import { pickLocale } from "@/lib/locale";

type Props = {
  section: CategorySection;
  categorySlug: string;
  locale: string;
  productLabels: ProductCardLabels;
};

export function SubcategorySection({
  section,
  categorySlug,
  locale,
  productLabels,
}: Props) {
  const headingId = `${section.id}-heading`;

  return (
    <section
      id={section.id}
      className={
        section.isSale
          ? "category-section category-section--sale"
          : "category-section"
      }
      aria-labelledby={headingId}
    >
      <header className="category-section-header">
        <div className="category-section-title-row">
          <h2 id={headingId} className="category-section-heading">
            {pickLocale(section.title, locale)}
          </h2>
          {section.isSale ? (
            <span className="category-sale-accent" aria-hidden="true">
              −%
            </span>
          ) : null}
        </div>
      </header>

      <div className="category-product-list">
        {section.products.map((product) => (
          <div key={product.id} className="category-product-item">
            <ProductCard
              product={product}
              categorySlug={categorySlug}
              locale={locale}
              labels={productLabels}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
