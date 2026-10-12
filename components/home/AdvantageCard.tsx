type Props = {
  number: string;
  title: string;
  description: string;
};

export function AdvantageCard({ number, title, description }: Props) {
  return (
    <article className="advantage-card">
      <p className="advantage-number">{number}</p>
      <h3 className="advantage-title">{title}</h3>
      <p className="advantage-text">{description}</p>
    </article>
  );
}
