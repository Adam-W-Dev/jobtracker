"use client";

import { useState, useEffect } from "react";
import styles from "../styles/tracker.module.css";
import { JobStatus } from "../Types/job";

type Props = {
  defaultTitle?: string;
  defaultDate?: string;
  defaultStatus?: JobStatus;
  onClose: () => void;
  onSave: (job: { title: string; date: string; status: JobStatus }) => void;
};

export default function JobModal({
  defaultTitle = "",
  defaultDate = new Date().toISOString().slice(0, 10),
  defaultStatus = "Applied",
  onClose,
  onSave,
}: Props) {
  // ---------------- STATE ----------------
  const [title, setTitle] = useState(defaultTitle);
  const [date, setDate] = useState(defaultDate);
  const [status, setStatus] = useState<JobStatus>(defaultStatus);
  const [saving, setSaving] = useState(false);

  // ---------------- ESC KEY TO CLOSE ----------------
  useEffect(() => {
     setTitle(defaultTitle);
    setDate(defaultDate);
    setStatus(defaultStatus ?? "Applied");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose,defaultTitle, defaultDate, defaultStatus]);

  // ---------------- SAVE HANDLER ----------------
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a job title.");
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }

    try {
      setSaving(true);
      onSave({ title, date, status });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Add Job Application</h2>

        <label>
          Job Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Date Applied
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>

        <div className={styles.modalActions}>
          <button
            className={styles.secondaryButton}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={styles.primaryButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
