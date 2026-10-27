import { getTranslations } from "next-intl/server";
import { CategoryEmptyState } from "@/components/category/CategoryEmptyState";
import { CategoryLocaleScrollPreserve } from "@/components/category/CategoryLocaleScrollPreserve";
import { FloatingContactCta } from "@/components/category/FloatingContactCta";
import { StickyCategoryNav } from "@/components/category/StickyCategoryNav";
import { SubcategorySection } from "@/components/category/SubcategorySection";
import { Container } from "@/components/layout/Container";
import type { CategoryPageModel } from "@/lib/category-types";
import { pickLocale } from "@/lib/locale";

type Props = {
  locale: string;
  model: CategoryPageModel;
};

export async function CategoryPage({ locale, model }: Props) {
  const t = await getTranslations("CategoryPage");

  const productLabels = {
    size: t("labels.size"),
    price: t("labels.price"),
    specifications: t("labels.specifications"),
    photoPlaceholder: t("labels.photoPlaceholder"),
    photoSingle: t("labels.photoSingle"),
    galleryPrev: t("labels.galleryPrev"),
    galleryNext: t("labels.galleryNext"),
    share: t("labels.share"),
    shareCopied: t("labels.shareCopied"),
    more: t("labels.more"),
    less: t("labels.less"),
    fromPrefix: t("labels.fromPrefix"),
    lightboxClose: t("labels.lightboxClose"),
    lightboxLabel: t("labels.lightboxLabel"),
  };

  const categoryName = pickLocale(model.title, locale);

  if (!model.assortmentReady) {
    return (
      <main className="category-page category-page--vacant">
        <h1 className="sr-only">{categoryName}</h1>
        <Container className="category-page-vacant-inner">
          <CategoryEmptyState
            title={t("unavailable.title")}
            lead={t("unavailable.lead")}
            cta={t("unavailable.cta")}
          />
        </Container>
        <FloatingContactCta label={t("floatingCta")} />
      </main>
    );
  }

  const hasSections = model.sections.length > 0;

  return (
    <main className="category-page">
      <CategoryLocaleScrollPreserve locale={locale} />
      <h1 className="sr-only">{categoryName}</h1>

      <StickyCategoryNav
        key={model.slug}
        locale={locale}
        categoryTitle={model.title}
        nav={model.nav}
        labels={{
          navAria: t("nav.aria"),
          openMenu: t("nav.open"),
          closeMenu: t("nav.close"),
        }}
      />

      <Container>
        {hasSections ? (
          model.sections.map((section) => (
            <SubcategorySection
              key={section.id}
              section={section}
              categorySlug={model.slug}
              locale={locale}
              productLabels={productLabels}
            />
          ))
        ) : (
          <CategoryEmptyState
            title={t("empty.title")}
            lead={t("empty.lead")}
            cta={t("empty.cta")}
          />
        )}
      </Container>

      <FloatingContactCta label={t("floatingCta")} />
    </main>
  );
}
