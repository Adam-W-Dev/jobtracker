"use client";

import styles from "../styles/tracker.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
};

export default function AddJobBar({ value, onChange, onAdd }: Props) {
  const handleAdd = () => {
    if (!value.trim()) {
      alert("Please enter a job title");
      return;
    }
    onAdd();
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder="Enter new job title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleAdd} className={styles.button}>
        Add Job
      </button>
    </div>
  );
}