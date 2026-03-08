"use client";

import { Job } from "../Types/job";
import styles from "@/app/styles/tracker.module.css";

type Props = {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => Promise<void>;
  searchTerm?: string;
  statusFilter?: string;
  dateSort?: "asc" | "desc";
};

export default function JobsTable({
  jobs,
  onEdit,
  onDelete,
  searchTerm = "",
  statusFilter = "",
  dateSort = "asc",
}: Props) {
  // Apply filters/search/sort
  const filteredJobs = jobs
    .filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => (statusFilter ? job.status === statusFilter : true))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });
    const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB"); // DD-MM-YYYY
};

  return (
    <section className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredJobs.map(job => (
            <tr key={job.id}>
              <td>{job.title}</td>

             <td>{formatDate(job.date)}</td>

              <td>
                <span
                  className={`${styles.statusBadge} ${
                    styles[job.status.toLowerCase()]
                  }`}
                >
                  {job.status}
                </span>
              </td>

              <td>
                <div className={styles.jobActions}>
                  <button onClick={() => onEdit(job)}>Edit</button>
                  <button onClick={() => onDelete(job.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
