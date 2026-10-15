import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CategoryPage } from "@/components/category/CategoryPage";
import { Footer } from "@/components/layout/Footer";
import { catalogCategories } from "@/lib/catalog-categories";
import { getCategoryPageModel } from "@/lib/category-page-data";

export const instant = false;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ slug: category.slug }));
}

export default async function CatalogCategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const model = await getCategoryPageModel(slug);
  if (!model) {
    notFound();
  }

  return (
    <>
      <CategoryPage locale={locale} model={model} />
      <Footer variant="full" />
    </>
  );
}
