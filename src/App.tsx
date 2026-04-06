import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import KanbanBoard from './components/KanbanBoard';
import JobDetailsModal from './components/JobDetailsModal';
import JobFormModal from './components/JobFormModal';
import AnalyticsScreen from './components/AnalyticsScreen';
import DocumentsScreen from './components/DocumentsScreen';
import SettingsScreen from './components/SettingsScreen';
import AuthScreen from './components/AuthScreen';
import { Job, JobStatus, Document, QuickLink, UserSettings } from './types';
import { DropResult } from '@hello-pangea/dnd';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    location: '',
    photoURL: '',
    theme: 'dark',
    notifications: {
      followUp: true,
      interviewReminder: true,
    }
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Theme Sync (Removed per user request, defaulting to dark)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setDocuments([]);
      setQuickLinks([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const jobsRef = collection(db, 'users', user.uid, 'jobs');
    const docsRef = collection(db, 'users', user.uid, 'documents');
    const linksRef = collection(db, 'users', user.uid, 'quickLinks');

    const unsubSettings = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as UserSettings);
      } else {
        // Initialize user settings if they don't exist
        const initialSettings: UserSettings = {
          name: user.displayName || '',
          email: user.email || '',
          location: '',
          photoURL: user.photoURL || '',
          theme: 'dark',
          notifications: {
            followUp: true,
            interviewReminder: true,
          }
        };
        setDoc(userDocRef, initialSettings).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}`));

    const unsubJobs = onSnapshot(query(jobsRef, orderBy('postedAt', 'desc')), (snapshot) => {
      setJobs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/jobs`));

    const unsubDocs = onSnapshot(docsRef, (snapshot) => {
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document)));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/documents`));

    const unsubLinks = onSnapshot(linksRef, (snapshot) => {
      setQuickLinks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as QuickLink)));
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/quickLinks`));

    return () => {
      unsubSettings();
      unsubJobs();
      unsubDocs();
      unsubLinks();
    };
  }, [user]);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  const handleDragEnd = async (result: DropResult) => {
    if (!user) return;
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as JobStatus;
    const jobRef = doc(db, 'users', user.uid, 'jobs', draggableId);
    
    try {
      await updateDoc(jobRef, { 
        status: newStatus,
        tag: newStatus === 'Offers' ? 'Signed' : (newStatus === 'Archived' ? 'Archived' : 'Updated')
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${draggableId}`);
    }
  };

  const handleUpdateJob = async (jobId: string, updates: Partial<Job>) => {
    if (!user) return;
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await updateDoc(jobRef, updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
    }
  };

  const handleUpdateStatus = async (jobId: string) => {
    if (!user) return;
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const statusOrder: JobStatus[] = ['Bookmarked', 'Applied', 'Technical Assessment', 'Onsite', 'Offers'];
    const currentIndex = statusOrder.indexOf(job.status);
    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
    
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await updateDoc(jobRef, { 
        status: nextStatus, 
        tag: nextStatus === 'Offers' ? 'Signed' : nextStatus 
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
    }
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (!user) return;
    
    if (editingJob) {
      const jobRef = doc(db, 'users', user.uid, 'jobs', editingJob.id);
      try {
        await updateDoc(jobRef, jobData);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${editingJob.id}`);
      }
    } else {
      const jobId = Math.random().toString(36).substr(2, 9);
      const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
      const newJob: Job = {
        id: jobId,
        title: jobData.title || '',
        company: jobData.company || '',
        location: jobData.location || 'Remote',
        salary: jobData.salary || '',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSV2Uc_w_e0n55SC1yBA6DW5tOwF6ZfF0xiSCSiUoWq5yLSaW4WiVIU9lEpZaBUKdBrDsJXBrxlsh0Y_i6KhV-HcdUB9shGePq-tr4EgpnOAdu9NyBAXIImgzoVViB6qN7PcfKV3c6xYEY3yIkoR0yh7sIapIvl3p9_SQktugg3UgCKuqrHBEumHsFz_vclvRXGsOgT2i4STc1aNhZnqBquYN3fT7BuB1pNGNvnXjE8xEEOkhDYtC4Al0TTdV5cnEtSshqhKpVSYnI',
        status: jobData.status || 'Bookmarked',
        postedAt: new Date().toISOString(),
        tag: jobData.status === 'Offers' ? 'Signed' : 'New',
        description: jobData.description || '',
        requirements: jobData.requirements || [],
        roadmap: jobData.roadmap || [{ label: 'Initial Screening', status: 'upcoming', details: 'Pending' }],
        codeChallengeLinks: jobData.codeChallengeLinks || [],
        interviewNotes: jobData.interviewNotes || '',
        resumeId: jobData.resumeId || '',
        uid: user.uid
      };
      try {
        await setDoc(jobRef, newJob);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/jobs/${jobId}`);
      }
    }
    setEditingJob(null);
  };

  const handleArchiveJob = async (jobId: string) => {
    if (!user) return;
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await updateDoc(jobRef, { status: 'Archived', tag: 'Archived' });
      setSelectedJobId(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await deleteDoc(jobRef);
      setSelectedJobId(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/jobs/${jobId}`);
    }
  };

  const openAddForm = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const openEditForm = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleAddDocument = async (name: string, tag: string) => {
    if (!user) return;
    const docId = Math.random().toString(36).substr(2, 9);
    const newDoc: Document = {
      id: docId,
      name,
      type: name.toLowerCase().endsWith('.pdf') ? 'pdf' : (name.toLowerCase().endsWith('.docx') ? 'docx' : 'other'),
      version: '1.0',
      tag: tag || 'General',
      url: '#',
      uploadedAt: new Date().toLocaleDateString(),
      uid: user.uid
    };
    try {
      await setDoc(doc(db, 'users', user.uid, 'documents', docId), newDoc);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/documents/${docId}`);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'documents', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/documents/${id}`);
    }
  };

  const handleAddQuickLink = async (label: string, url: string) => {
    if (!user) return;
    const linkId = Math.random().toString(36).substr(2, 9);
    const newLink: QuickLink = {
      id: linkId,
      label,
      url,
      uid: user.uid
    };
    try {
      await setDoc(doc(db, 'users', user.uid, 'quickLinks', linkId), newLink);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/quickLinks/${linkId}`);
    }
  };

  const handleDeleteQuickLink = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'quickLinks', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/quickLinks/${id}`);
    }
  };

  const handleUpdateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleResetData = async () => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to permanently delete ALL your data? This cannot be undone.')) return;

    try {
      // Delete jobs
      const jobsToDelete = [...jobs];
      for (const job of jobsToDelete) {
        await deleteDoc(doc(db, 'users', user.uid, 'jobs', job.id));
      }

      // Delete documents
      const docsToDelete = [...documents];
      for (const docItem of docsToDelete) {
        await deleteDoc(doc(db, 'users', user.uid, 'documents', docItem.id));
      }

      // Delete quick links
      const linksToDelete = [...quickLinks];
      for (const link of linksToDelete) {
        await deleteDoc(doc(db, 'users', user.uid, 'quickLinks', link.id));
      }

      alert('All data has been cleared.');
    } catch (e) {
      console.error('Failed to reset data', e);
      alert('Failed to clear some data. Please try again.');
    }
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Analytics':
        return <AnalyticsScreen jobs={jobs} />;
      case 'Documents':
        return (
          <DocumentsScreen 
            documents={documents} 
            quickLinks={quickLinks}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddQuickLink={handleAddQuickLink}
            onDeleteQuickLink={handleDeleteQuickLink}
          />
        );
      case 'Settings':
        return <SettingsScreen settings={settings} onUpdateSettings={handleUpdateSettings} onResetData={handleResetData} />;
      case 'Archive':
      case 'Pipeline':
      default:
        return (
          <KanbanBoard 
            jobs={jobs} 
            onJobClick={(job) => setSelectedJobId(job.id)} 
            activeTab={activeTab}
            onDragEnd={handleDragEnd}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-surface dark">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        <TopBar 
          onAddJob={openAddForm} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          settings={settings} 
        />
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {renderContent()}
        </div>
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJobId(null)} 
          onUpdateStatus={handleUpdateStatus}
          onArchive={handleArchiveJob}
          onEdit={openEditForm}
          onDelete={handleDeleteJob}
          onUpdateJob={handleUpdateJob}
          documents={documents}
        />
        <JobFormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveJob}
          initialData={editingJob}
          documents={documents}
        />
      </main>
    </div>
  );
}
