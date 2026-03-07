"use server";

import { createClient } from "../utils/supabase/server"; 
import { JobStatus, Job } from "../Types/job";
import { revalidatePath } from "next/cache";

// ----------------- CREATE -----------------
export async function createJob(job: {
  title: string;
  date: string;
  status: JobStatus;
}): Promise<Job> {
  const supabase = await createClient(); // Await is required here

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
    throw new Error(error.message);
  }

  revalidatePath("/"); 
  
  return {
    id: data.id,
    title: data.title,
    date: data.created_at,
    status: data.status,
  };
}

// ----------------- READ -----------------
export async function fetchJobs(): Promise<Job[]> {
  const supabase = await createClient(); // Fixed: Added await

  const { data, error } = await supabase
    .from("job_application")
    .select("id, title, created_at, status")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch failed:", error);
    return []; // Return empty array to keep UI from crashing
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
  const supabase = await createClient(); // Fixed: Added await

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
    throw new Error(error.message);
  }
  
  revalidatePath("/"); // Update UI immediately
}

// ----------------- DELETE -----------------
export async function deleteJob(jobId: string) {
  const supabase = await createClient(); // Fixed: Added await

  const { error } = await supabase
    .from("job_application")
    .delete()
    .eq("id", jobId);

  if (error) {
    console.error("Supabase delete failed:", error);
    throw new Error(error.message);
  }

  revalidatePath("/"); // Update UI immediately
}