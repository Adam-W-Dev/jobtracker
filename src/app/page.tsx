import styles from "./page.module.css";
import Tracker from "./Pages/Tracker";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
       
        <Tracker />
       
      </main>
    </div>
  );
}
