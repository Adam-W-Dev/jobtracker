export type JobStatus =
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export type Job = {
  id: string;
  title: string;
  date: string;
  status: JobStatus;
};