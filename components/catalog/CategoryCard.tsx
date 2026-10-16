import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
};

export function CategoryCard({
  href,
  name,
  imageSrc,
  imageAlt,
  priority = false,
}: Props) {
  return (
    <li>
      <Link href={href} className="category-card">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 377px, 100vw"
          className="category-card-image"
        />
        <span className="category-card-caption">
          <span className="category-card-name">{name}</span>
        </span>
      </Link>
    </li>
  );
}
