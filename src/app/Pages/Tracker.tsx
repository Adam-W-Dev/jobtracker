"use client";

import { useEffect, useState } from "react";
import AddJobBar from "../Components/AddJobBar";
import JobModal from "../Components/JobModal";
import JobsTable from "../Components/JobsTable";
import JobFilters from "../Components/JobFilters";
import DashboardCards from "../Components/DashboardCards";
import WelcomeCard from "../Components/WelcomeCard";

import { Job, JobStatus } from "../Types/job";
import { createJob, updateJob, deleteJob, fetchJobs } from "../actions/jobs";

type Props = {
  name: string;
};

export default function Tracker({ name }: Props) {
  // ---------------- JOB DATA ----------------
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch(err => console.error("Initial load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // ---------------- MODAL / EDIT ----------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // ---------------- FILTERS ----------------
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("asc");

  

  // ---------------- HANDLERS ----------------

  const handleAddJob = () => {
    setDraftDate(new Date().toISOString().slice(0, 10));
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setDraftTitle(job.title);
    setDraftDate(new Date(job.date).toISOString().split("T")[0]);
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = async ({
    title,
    date,
    status,
  }: {
    title: string;
    date: string;
    status: JobStatus;
  }) => {
    try {
      if (editingJob) {
        await updateJob({
          id: editingJob.id,
          title,
          date,
          status,
        });

        setJobs(prev =>
          prev.map(j =>
            j.id === editingJob.id
              ? { ...j, title, date, status }
              : j
          )
        );
      } else {
        const newJob = await createJob({ title, date, status });

        setJobs(prev => [newJob, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save job.");
    } finally {
      setIsModalOpen(false);
      setDraftTitle("");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);

      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job.");
    }
  };

  // ---------------- DASHBOARD ----------------

  const dashboardData = [
    { title: "Total Applications", value: jobs.length },
    {
      title: "Interviewing",
      value: jobs.filter(j => j.status === "Interviewing").length,
    },
    {
      title: "Offers",
      value: jobs.filter(j => j.status === "Offer").length,
    },
    {
      title: "Rejected",
      value: jobs.filter(j => j.status === "Rejected").length,
    },
  ];

  // ---------------- RENDER ----------------

  if (loading) return <p>Loading jobs...</p>;

  return (
    <>
    <WelcomeCard title="Job Tracker" user={name} />
      <AddJobBar
        value={draftTitle}
        onChange={setDraftTitle}
        onAdd={handleAddJob}
      />

      {isModalOpen && (
        <JobModal
          defaultTitle={draftTitle}
          defaultDate={draftDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJob}
        />
      )}

      <DashboardCards data={dashboardData} />

      <JobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateSort={dateSort}
        onDateSortChange={setDateSort}
      />

      <JobsTable
        jobs={jobs}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateSort={dateSort}
      />
    </>
  );
}
