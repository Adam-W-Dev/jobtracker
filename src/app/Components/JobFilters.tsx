// Components/JobFilters.tsx
"use client";

import { ChangeEvent } from "react";
import styles from "../styles/tracker.module.css";
import { JobStatus } from "../Types/job";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: JobStatus | "";
  onStatusChange: (value: JobStatus | "") => void;
  dateSort: "asc" | "desc";
  onDateSortChange: (value: "asc" | "desc") => void;
};

export default function JobFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateSort,
  onDateSortChange,
}: Props) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(e.target.value as JobStatus | "")
          }
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={dateSort}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onDateSortChange(e.target.value as "asc" | "desc")
          }
        >
          <option value="asc">Date Ascending</option>
          <option value="desc">Date Descending</option>
        </select>
      </div>
    </div>
  );
}