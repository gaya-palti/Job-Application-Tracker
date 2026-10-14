import { Job, Document, QuickLink, UserSettings } from '../types';
import { DEFAULT_COLUMNS } from './columns';

export const MOCK_USER_SETTINGS: UserSettings = {
  name: 'Gaya Palti',
  email: 'gaya.palti@example.com',
  location: 'Tel Aviv, Israel',
  photoURL: '',
  theme: 'dark',
  notifications: {
    followUp: true,
    interviewReminder: true,
  },
  columns: [
    ...DEFAULT_COLUMNS,
    { id: 'Rejected', title: 'Rejected' },
    { id: 'Archived', title: 'Archived' },
  ],
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Software Engineer',
    company: 'SAP',
    location: 'Darmstadt, Germany',
    logo: 'https://www.google.com/s2/favicons?domain=sap.com&sz=128',
    status: 'Applied',
    postedAt: '2026-03-15T10:00:00Z',
    salary: '€75k - €90k',
    description: 'Join the SAP Cloud Platform team to build scalable microservices using Java and Go. You will be responsible for designing and implementing high-performance APIs and ensuring seamless integration with our global infrastructure.\n\nRequirements include strong knowledge of distributed systems, Kubernetes, and cloud-native development patterns.',
    requirements: ['Java/Go', 'Kubernetes', 'Cloud-native architecture', 'Distributed Systems'],
    roadmap: [
      { label: 'Application Submitted', status: 'completed', details: 'March 15, 2026' },
      { label: 'Recruiter Call', status: 'upcoming', details: 'Pending schedule' }
    ],
    websiteUrl: 'https://jobs.sap.com',
    uid: 'demo-user',
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    company: 'Meta',
    location: 'Tel Aviv, Israel',
    logo: 'https://www.google.com/s2/favicons?domain=meta.com&sz=128',
    status: 'Home Assignment',
    postedAt: '2026-03-20T14:30:00Z',
    salary: '₪45k - ₪55k / month',
    description: 'We are looking for a Full Stack Engineer to join the Instagram Reels team. You will work on high-impact features used by billions of people. The role involves working with React on the frontend and Hack/PHP on the backend.\n\nFocus on performance optimization and building intuitive user experiences at scale.',
    requirements: ['React', 'Hack/PHP', 'System Design', 'Product Thinking'],
    roadmap: [
      { label: 'Initial Screening', status: 'completed', details: 'March 25, 2026' },
      { label: 'Technical Assessment', status: 'in-progress', details: 'HackerRank challenge due April 10' }
    ],
    codeChallengeLinks: ['https://www.hackerrank.com/challenges/meta-fullstack-eval'],
    websiteUrl: 'https://www.metacareers.com',
    uid: 'demo-user',
  },
  {
    id: 'job-3',
    title: 'Backend Developer',
    company: 'Claroty',
    location: 'Tel Aviv, Israel',
    logo: 'https://www.google.com/s2/favicons?domain=claroty.com&sz=128',
    status: 'Technical Interview',
    postedAt: '2026-03-10T09:00:00Z',
    salary: '₪38k - ₪48k / month',
    description: 'Claroty is looking for a Backend Developer to join our core security team. You will build the infrastructure that protects industrial networks (ICS/OT) from cyber threats. Tech stack includes Python, PostgreSQL, and Docker.\n\nDeep dive into network protocols and security research.',
    requirements: ['Python', 'PostgreSQL', 'Docker', 'Network Security'],
    roadmap: [
      { label: 'Technical Interview', status: 'completed', details: 'March 20, 2026' },
      { label: 'Onsite Interview', status: 'in-progress', details: 'April 12 with Head of Engineering' }
    ],
    interviewNotes: 'Focus on low-level networking and concurrency during the onsite.',
    websiteUrl: 'https://claroty.com/careers',
    uid: 'demo-user',
  },
  {
    id: 'job-4',
    title: 'Data Analyst',
    company: 'Monday.com',
    location: 'Tel Aviv, Israel',
    logo: 'https://www.google.com/s2/favicons?domain=monday.com&sz=128',
    status: 'Referral Requested',
    postedAt: '2026-04-05T11:20:00Z',
    salary: '₪25k - ₪32k / month',
    description: 'Help us make data-driven decisions at Monday.com. You will analyze user behavior, build dashboards in Looker, and work closely with product managers to optimize our growth funnel.\n\nStrong SQL skills and experience with Python/R for data analysis are essential.',
    requirements: ['SQL', 'Looker/Tableau', 'Python/R', 'Product Analytics'],
    roadmap: [
      { label: 'Research Phase', status: 'completed', details: 'Reviewing company culture' },
      { label: 'Apply', status: 'upcoming', details: 'Target date: April 15' }
    ],
    websiteUrl: 'https://monday.com/jobs',
    uid: 'demo-user',
  },
  {
    id: 'job-5',
    title: 'C++ Software Engineer',
    company: 'Mobileye',
    location: 'Jerusalem, Israel',
    logo: 'https://www.google.com/s2/favicons?domain=mobileye.com&sz=128',
    status: 'Rejected',
    postedAt: '2026-03-01T08:00:00Z',
    salary: '₪35k - ₪45k / month',
    description: 'Develop the next generation of autonomous driving algorithms. This role requires expert-level C++ knowledge and experience with real-time systems and computer vision.\n\nWork on safety-critical systems that save lives.',
    requirements: ['Expert C++', 'Real-time Systems', 'Computer Vision', 'Linux'],
    roadmap: [
      { label: 'Technical Test', status: 'completed', details: 'Failed on complexity constraints' }
    ],
    websiteUrl: 'https://www.mobileye.com/careers',
    uid: 'demo-user',
  },
  {
    id: 'job-6',
    title: 'Software Engineer, Cloud',
    company: 'Google',
    location: 'Berlin, Germany',
    logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
    status: 'Applied',
    postedAt: '2026-04-01T15:00:00Z',
    salary: '€85k - €110k',
    description: 'Work on Google Cloud Platform (GCP) infrastructure. You will be part of the team that manages global-scale storage and compute services. Focus on reliability, scalability, and performance.\n\nExperience with large-scale distributed systems is a must.',
    requirements: ['Go/C++', 'Distributed Systems', 'SRE Principles', 'GCP'],
    roadmap: [
      { label: 'Applied', status: 'completed', details: 'April 1, 2026' },
      { label: 'Review', status: 'in-progress', details: 'Under review by hiring manager' }
    ],
    websiteUrl: 'https://careers.google.com',
    uid: 'demo-user',
  },
  {
    id: 'job-7',
    title: 'Data Scientist',
    company: 'Monday.com',
    location: 'Tel Aviv, Israel',
    logo: 'https://www.google.com/s2/favicons?domain=monday.com&sz=128',
    status: 'Referral Requested',
    postedAt: '2026-04-07T10:00:00Z',
    salary: '₪30k - ₪40k / month',
    description: 'Join the data science team at Monday.com to build predictive models and improve our product experience. You will work with large datasets and use machine learning to solve complex problems.\n\nExperience with Python, SQL, and ML frameworks is required.',
    requirements: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
    roadmap: [
      { label: 'Research', status: 'completed', details: 'Reviewing job description' }
    ],
    websiteUrl: 'https://monday.com/jobs',
    uid: 'demo-user',
  },
  {
    id: 'job-8',
    title: 'Frontend Developer',
    company: 'SAP',
    location: 'Berlin, Germany',
    logo: 'https://www.google.com/s2/favicons?domain=sap.com&sz=128',
    status: 'Applied',
    postedAt: '2026-03-28T12:00:00Z',
    salary: '€70k - €85k',
    description: 'Build modern user interfaces for SAP Cloud Platform. You will work with React, TypeScript, and Tailwind CSS to create intuitive and performant applications.\n\nFocus on accessibility and user experience.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
    roadmap: [
      { label: 'Applied', status: 'completed', details: 'March 28, 2026' }
    ],
    websiteUrl: 'https://jobs.sap.com',
    uid: 'demo-user',
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Gaya_Palti_CV_2026.pdf',
    type: 'pdf',
    version: '1.2',
    tag: 'Resume',
    url: '#',
    uploadedAt: '2026-03-01T10:00:00Z',
    uid: 'demo-user',
  },
  {
    id: 'doc-2',
    name: 'Cover_Letter_SAP.docx',
    type: 'docx',
    version: '1.0',
    tag: 'Cover Letter',
    url: '#',
    uploadedAt: '2026-03-15T11:00:00Z',
    uid: 'demo-user',
  },
  {
    id: 'doc-3',
    name: 'Data_Analysis_Portfolio.link',
    type: 'other',
    version: '2.1',
    tag: 'Portfolio',
    url: 'https://portfolio.gayapalti.com',
    uploadedAt: '2026-03-20T09:00:00Z',
    uid: 'demo-user',
  }
];

export const MOCK_QUICK_LINKS: QuickLink[] = [
  { id: 'link-1', label: 'LinkedIn', url: 'https://linkedin.com/in/gayapalti', uid: 'demo-user' },
  { id: 'link-2', label: 'GitHub', url: 'https://github.com/gayapalti', uid: 'demo-user' },
  { id: 'link-3', label: 'Portfolio', url: 'https://portfolio.gayapalti.com', uid: 'demo-user' },
];

export const MOCK_ANALYTICS = {
  totalApplications: 24,
  activeInterviews: 3,
  rejections: 4,
  offers: 0,
};
