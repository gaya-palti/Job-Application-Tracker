import { Job, Column } from './types';

export const COLUMNS: Column[] = [
  { id: 'Bookmarked', title: 'Bookmarked', count: 3 },
  { id: 'Applied', title: 'Applied', count: 12 },
  { id: 'Technical Assessment', title: 'Technical', count: 3 },
  { id: 'Onsite', title: 'Onsite', count: 1 },
  { id: 'Offers', title: 'Offers', count: 1 },
];

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior AI Engineer',
    company: 'Cyberdyne Systems',
    location: 'San Francisco, CA',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSV2Uc_w_e0n55SC1yBA6DW5tOwF6ZfF0xiSCSiUoWq5yLSaW4WiVIU9lEpZaBUKdBrDsJXBrxlsh0Y_i6KhV-HcdUB9shGePq-tr4EgpnOAdu9NyBAXIImgzoVViB6qN7PcfKV3c6xYEY3yIkoR0yh7sIapIvl3p9_SQktugg3UgCKuqrHBEumHsFz_vclvRXGsOgT2i4STc1aNhZnqBquYN3fT7BuB1pNGNvnXjE8xEEOkhDYtC4Al0TTdV5cnEtSshqhKpVSYnI',
    status: 'Bookmarked',
    postedAt: '2 days ago',
    tag: 'Potential',
    description: 'Lead the development of next-generation neural networks for autonomous systems.',
    requirements: [
      '8+ years experience in ML/AI',
      'Strong background in PyTorch or TensorFlow',
      'Experience with large-scale distributed training'
    ],
    roadmap: [
      { label: 'Initial Screening', status: 'completed', details: 'Completed Oct 12 • 30 mins' },
      { label: 'Technical Assessment', status: 'upcoming', details: 'Coding Challenge' }
    ],
    uid: 'mock-user'
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Volt Dynamics',
    location: 'Austin, TX',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7-r2pR0RKKsYo4LbDas8qRuFMX4zdInJ-P79xMQoal6F-2DHYA54HZgIs6LTQzorS4q4zEH-AjrYnJ2qYDZdKqRtK31tATxq9vDRjdTe9cNxuBKvLNmCiKyia-MfX-EiJrIJcXs2VFV3A4sNDFcK8ir9-16soc__DAQrH4BRfOBAXCvDNmx5bleOAArAU3l-u7dmUtzxYe_kJBE_HxUEG1UwEqYPsF9rAqBniXZwLlqo6Z81dIBeTNkvoHFNA8kphZ1e0Epboc8vB',
    status: 'Applied',
    postedAt: '5 days ago',
    tag: 'Applied',
    description: 'Build scalable microservices using Go and Kubernetes.',
    requirements: [
      '5+ years Go experience',
      'Deep understanding of gRPC and Protobuf',
      'Experience with PostgreSQL and Redis'
    ],
    roadmap: [
      { label: 'Initial Screening', status: 'upcoming', details: 'Pending Review' }
    ],
    uid: 'mock-user'
  },
  {
    id: '3',
    title: 'xEngineer',
    company: 'Wix Kickstart',
    location: 'Tel Aviv, Israel',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuyHsy6tvM57wzXY1jgjy30WRWHWfYYZizU6uhHI1Wx5xzb9tvkHiLj6arbz0IzzkizaKWFHUvQvyVmD7i1CRMKStm7sUjKnCraAnI1cLC-cfocbjUyzlLc_0fQDcOe-offVcTok4ZSxKZQjdmpVNiE7ciX62hwkPIV9kf0V51O59O-lUd0GsC-Hi9jJVgS3RES9yXeGMmTRBNST2sQwHYZR-SROWvIgYvo0Kh2U6T34KWqxgMGEOtpKxDumEs3zEIOS0JBX1jBe1d',
    status: 'Technical Assessment',
    postedAt: 'Assessment: 17.4',
    tag: 'In Progress',
    description: 'Join the Wix Kickstart program to build the future of web creation.',
    requirements: [
      'Strong JavaScript/TypeScript skills',
      'Passion for building high-quality web products',
      'Fast learner and team player'
    ],
    roadmap: [
      { label: 'Initial Screening', status: 'completed', details: 'Completed Nov 1 • 45 mins' },
      { label: 'Technical Assessment', status: 'in-progress', details: 'In Progress • Coding Challenge' }
    ],
    codeChallengeLinks: [
      'https://github.com/wix-kickstart/challenge-1',
      'https://codesandbox.io/s/wix-interview-task'
    ],
    interviewNotes: 'The recruiter was very friendly. They focused a lot on React performance and TypeScript generics. Next round is a deep dive into system design.',
    uid: 'mock-user'
  },
  {
    id: '4',
    title: 'Senior Frontend Engineer',
    company: 'Metaflow',
    location: 'San Francisco, CA',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_eQbR3pJGNF6deQ-ETDEGlvm7mLKPWEY0Ulk19eYsCUXHo1r-LAu7SmQns97qZALIQPD3pQ0pUCH4b_nNK_sWqg-q0GmILwn0XUICXngvnSF8vg1CrcOd57GznIjeLiBsIJiriPUSVwC26kqZ3pZ4LH3j9ZzxPXxlwtL9njv1yUDheOyDe9hOc3eZRB-2dry8oHrMX0n_z1W1rKUaTyiZfc0ubcJfXZnNM1kekFC529GtdXmXoQeLO28rfl8uL6v8cI1zqrZnSPHE',
    status: 'Onsite',
    postedAt: 'Next: Monday',
    tag: 'Interview',
    salary: '$180k - $220k',
    description: 'As a Senior Frontend Engineer at Metaflow, you will lead the architecture of our core data visualization engine. You will work closely with our design and backend teams to build performant, accessible, and beautiful interfaces for complex data workflows.',
    requirements: [
      '8+ years of experience with React and TypeScript.',
      'Experience building high-performance 2D/3D visualizations (D3, Three.js).',
      'Strong understanding of browser rendering pipelines and performance profiling.'
    ],
    roadmap: [
      { label: 'Initial Screening', status: 'completed', details: 'Completed Oct 12 • 30 mins' },
      { label: 'Technical Assessment', status: 'in-progress', details: 'In Progress • Coding Challenge' },
      { label: 'Onsite Rounds', status: 'upcoming', details: 'Upcoming • 4 Hours' }
    ],
    uid: 'mock-user'
  },
  {
    id: '5',
    title: 'Staff Architect',
    company: 'Aether Cloud',
    location: 'Seattle, WA',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1_5XaTZiwMi0xFSasX_ZkoiALSgO45VL1Gwqv6L8bWVMET6LYEy9Nx7YF3HeOvWYY31NmqblruxiCVU7iltgf00kYWSvb02SIFoWGJE-a6FQyjPKFXB42aFCBbfd8k1VsqJ5Y1I8cNGy7WDucDl7L4IwxEJqJO8ZPOjQtcsusdfqTMljFWmpRi1fbPOsh-peG7O6uado8OXSDV1jdtcRfEalPGDLt6shiAk3nKVRf7TGtRotFSagu8xT9qAo44mCWI_-nKRisnCPr',
    status: 'Offers',
    postedAt: 'Expires in 3d',
    tag: 'Signed',
    description: 'Design and oversee the cloud infrastructure for global-scale applications.',
    requirements: [
      '12+ years in software architecture',
      'Expertise in AWS/GCP/Azure',
      'Strong leadership and communication skills'
    ],
    roadmap: [
      { label: 'Initial Screening', status: 'completed', details: 'Completed Sep 20' },
      { label: 'Technical Assessment', status: 'completed', details: 'Completed Oct 5' },
      { label: 'Onsite Rounds', status: 'completed', details: 'Completed Oct 15' },
      { label: 'Offer Received', status: 'completed', details: 'Signed Oct 20' }
    ],
    uid: 'mock-user'
  }
];
