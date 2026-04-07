export type JobStatus = string;

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  status: JobStatus;
  postedAt: string;
  salary?: string;
  description: string;
  requirements: string[];
  roadmap: {
    label: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    details: string;
  }[];
  tag?: string;
  codeChallengeLinks?: string[];
  interviewNotes?: string;
  resumeId?: string;
  uid: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'other';
  version: string;
  tag: string;
  url: string;
  uploadedAt: string;
  uid: string;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  uid: string;
}

export interface UserSettings {
  name: string;
  email: string;
  location: string;
  photoURL?: string;
  theme: 'light' | 'dark';
  notifications: {
    followUp: boolean;
    interviewReminder: boolean;
  };
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
}
