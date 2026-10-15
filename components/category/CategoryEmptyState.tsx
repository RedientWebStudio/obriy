import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  lead: string;
  cta: string;
};

export function CategoryEmptyState({ title, lead, cta }: Props) {
  return (
    <div className="category-empty">
      <h2 className="category-empty-title">{title}</h2>
      <p className="category-empty-lead">{lead}</p>
      <Link href="/catalog" className="category-empty-link">
        {cta}
      </Link>
    </div>
  );
}
