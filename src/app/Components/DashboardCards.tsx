import styles from "@/app/styles/tracker.module.css";

type CardData = {
  title: string;
  value: number;
};

type Props = {
  data: CardData[];
};

export default function DashboardCards({ data }: Props) {
  return (
    <section className={styles.dashboard}>
      {data.map((item) => (
        <article key={item.title} className={styles.card}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.cardContent}>{item.value}</p>
        </article>
      ))}
    </section>
  );
}