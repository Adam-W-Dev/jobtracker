"use server";

import { createClient } from "../utils/supabase/client";
import { JobStatus, Job } from "../Types/job";

// ----------------- CREATE -----------------
export async function createJob(job: {
  title: string;
  date: string;
  status: JobStatus;
}): Promise<Job> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("job_application")
    .insert({
      title: job.title,
      created_at: job.date,
      status: job.status,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert failed:", error);
    throw new Error("Failed to create job");
  }

  return {
    id: data.id,
    title: data.title,
    date: data.created_at,
    status: data.status,
  };
}


// ----------------- READ -----------------
export async function fetchJobs(): Promise<Job[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("job_application")
    .select("id, title, created_at, status")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch failed:", error);
    throw new Error("Failed to fetch jobs");
  }

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    date: row.created_at,
    status: row.status as JobStatus,
  }));
}

// ----------------- UPDATE -----------------
export async function updateJob(job: {
  id: string;
  title: string;
  date: string;
  status: JobStatus;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from("job_application")
    .update({
      title: job.title,
      created_at: job.date,
      status: job.status,
    })
    .eq("id", job.id);

  if (error) {
    console.error("Supabase update failed:", error);
    throw new Error("Failed to update job");
  }
}

// ----------------- DELETE -----------------
export async function deleteJob(jobId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("job_application")
    .delete()
    .eq("id", jobId);

  if (error) {
    console.error("Supabase delete failed:", error);
    throw new Error("Failed to delete job");
  }
}
