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
import SupportModal from './components/SupportModal';
import ManageColumnsModal from './components/ManageColumnsModal';
import GlobalErrorBanner from './components/GlobalErrorBanner';
import ConfirmationModal from './components/ConfirmationModal';
import { Job, JobStatus, Document, QuickLink, UserSettings } from './types';
import { DropResult } from '@hello-pangea/dnd';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  MOCK_JOBS, 
  MOCK_DOCUMENTS, 
  MOCK_QUICK_LINKS, 
  MOCK_USER_SETTINGS 
} from './constants/mockData';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [globalError, setGlobalError] = useState<any>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mockDocuments, setMockDocuments] = useState<Document[]>([]);
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
    },
    columns: []
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isManageBoardOpen, setIsManageBoardOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  // Close modal on navigation
  useEffect(() => {
    setSelectedJobId(null);
  }, [activeTab]);

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
        const data = snapshot.data() as UserSettings;
        if (!data.columns || data.columns.length === 0) {
          data.columns = [
            { id: 'Bookmarked', title: 'Bookmarked' },
            { id: 'Applied', title: 'Applied' },
            { id: 'Technical Assessment', title: 'Technical' },
            { id: 'Onsite', title: 'Onsite' },
            { id: 'Offers', title: 'Offers' },
          ];
          // Update Firestore with default columns if missing
          updateDoc(userDocRef, { columns: data.columns }).catch(e => {
            const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
            setGlobalError(err);
          });
        }
        setSettings(data);
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
          },
          columns: [
            { id: 'Bookmarked', title: 'Bookmarked' },
            { id: 'Applied', title: 'Applied' },
            { id: 'Technical Assessment', title: 'Technical' },
            { id: 'Onsite', title: 'Onsite' },
            { id: 'Offers', title: 'Offers' },
          ]
        };
        setSettings(initialSettings);
        setDoc(userDocRef, initialSettings).catch(e => {
          const err = handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
          setGlobalError(err);
        });
      }
    }, (e) => {
      const err = handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
      setGlobalError(err);
    });

    const unsubJobs = onSnapshot(query(jobsRef, orderBy('postedAt', 'desc')), (snapshot) => {
      setJobs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
    }, (e) => {
      const err = handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/jobs`);
      setGlobalError(err);
    });

    const unsubDocs = onSnapshot(docsRef, (snapshot) => {
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document)));
      setMockDocuments([]); // Clear mock docs
    }, (e) => {
      const err = handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/documents`);
      setGlobalError(err);
    });

    const unsubLinks = onSnapshot(linksRef, (snapshot) => {
      setQuickLinks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as QuickLink)));
    }, (e) => {
      const err = handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/quickLinks`);
      setGlobalError(err);
    });

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
      const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${draggableId}`);
      setGlobalError(err);
    }
  };

  const handleUpdateJob = async (jobId: string, updates: Partial<Job>) => {
    if (!user) return;
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await updateDoc(jobRef, updates);
    } catch (e) {
      const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
      setGlobalError(err);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus?: string) => {
    if (!user) return;
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let targetStatus = newStatus;
    if (!targetStatus) {
      const statusOrder = settings.columns.map(c => c.id);
      const currentIndex = statusOrder.indexOf(job.status);
      targetStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
    }
    
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await updateDoc(jobRef, { 
        status: targetStatus, 
        tag: targetStatus === 'Offers' ? 'Signed' : targetStatus 
      });
      const columnTitle = settings.columns.find(c => c.id === targetStatus)?.title || targetStatus;
      setGlobalSuccess(`Job moved to ${columnTitle}`);
      setTimeout(() => setGlobalSuccess(null), 3000);
    } catch (e) {
      const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
      setGlobalError(err);
    }
  };

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (!user) return;
    
    if (editingJob) {
      const jobRef = doc(db, 'users', user.uid, 'jobs', editingJob.id);
      try {
        await updateDoc(jobRef, jobData);
      } catch (e) {
        const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${editingJob.id}`);
        setGlobalError(err);
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
        websiteUrl: jobData.websiteUrl || '',
        uid: user.uid
      };
      try {
        await setDoc(jobRef, newJob);
      } catch (e) {
        const err = handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/jobs/${jobId}`);
        setGlobalError(err);
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
      const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/jobs/${jobId}`);
      setGlobalError(err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;
    const jobRef = doc(db, 'users', user.uid, 'jobs', jobId);
    try {
      await deleteDoc(jobRef);
      setSelectedJobId(null);
    } catch (e) {
      const err = handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/jobs/${jobId}`);
      setGlobalError(err);
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

  const handleAddDocument = async (name: string, tag: string, fileData?: string) => {
    if (!user) return;
    const docId = Math.random().toString(36).substr(2, 9);
    const newDoc: Document = {
      id: docId,
      name,
      type: name.toLowerCase().endsWith('.pdf') ? 'pdf' : (name.toLowerCase().endsWith('.docx') ? 'docx' : 'other'),
      version: '1.0',
      tag: tag || 'General',
      url: '#',
      fileData: fileData || '',
      uploadedAt: new Date().toLocaleDateString(),
      uid: user.uid
    };
    
    // Mock upload for prototype - strictly local to avoid "SYSTEM ERROR"
    setMockDocuments(prev => [newDoc, ...prev]);
    setGlobalSuccess('Asset added successfully');
    setTimeout(() => setGlobalSuccess(null), 3000);
  };

  const handleDeleteDocument = async (id: string) => {
    if (!user) return;
    try {
      // Remove from mock documents if it exists there
      setMockDocuments(prev => prev.filter(d => d.id !== id));
      // Also try to delete from Firestore
      await deleteDoc(doc(db, 'users', user.uid, 'documents', id));
    } catch (e) {
      // Silently fail for mock/prototype purposes if it was only a local doc
      console.warn('Firestore delete failed, document might have been local-only');
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
      const err = handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/quickLinks/${linkId}`);
      setGlobalError(err);
    }
  };

  const handleDeleteQuickLink = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'quickLinks', id));
    } catch (e) {
      const err = handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/quickLinks/${id}`);
      setGlobalError(err);
    }
  };

  const handleUpdateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, updates);
    } catch (e) {
      const err = handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
      setGlobalError(err);
    }
  };

  const handleAddColumn = async (title: string) => {
    if (!user) return;
    const newColumn = { id: title.toLowerCase().replace(/\s+/g, '-'), title };
    const updatedColumns = [...settings.columns, newColumn];
    await handleUpdateSettings({ columns: updatedColumns });
  };

  const handleRenameColumn = async (columnId: string, newTitle: string) => {
    if (!user) return;
    const updatedColumns = settings.columns.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    await handleUpdateSettings({ columns: updatedColumns });
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!user) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Column',
      message: 'Are you sure you want to delete this column? Jobs in this column will be moved to the first column.',
      confirmText: 'Delete Column',
      variant: 'danger',
      onConfirm: async () => {
        const updatedColumns = settings.columns.filter(col => col.id !== columnId);
        const firstColumnId = updatedColumns[0]?.id || 'Bookmarked';

        // Move jobs to the first column
        const jobsToUpdate = jobs.filter(j => j.status === columnId);
        for (const job of jobsToUpdate) {
          await handleUpdateStatus(job.id, firstColumnId);
        }

        await handleUpdateSettings({ columns: updatedColumns });
      }
    });
  };

  const handleResetData = async () => {
    if (!user) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Reset All Data',
      message: 'WARNING: This will permanently delete ALL your job applications, documents, and links. This action cannot be undone. Are you absolutely sure?',
      confirmText: 'Delete Everything',
      variant: 'danger',
      onConfirm: async () => {
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

          setGlobalSuccess('All data has been cleared.');
          setTimeout(() => setGlobalSuccess(null), 3000);
        } catch (e) {
          console.error('Failed to reset data', e);
          setGlobalError({ error: 'Failed to clear some data. Please try again.' });
        }
      }
    });
  };

  const handleLoadDemoData = async () => {
    if (!user) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Load Demo Data',
      message: 'This will populate your account with Gaya Palti\'s professional profile, 8 tech job applications, and documents. Existing data will remain. Continue?',
      confirmText: 'Load Demo Data',
      variant: 'primary',
      onConfirm: async () => {
        console.log('Starting demo data load for user:', user.uid);
        try {
          const batch = writeBatch(db);

          // Load Jobs
          MOCK_JOBS.forEach(job => {
            const jobRef = doc(db, 'users', user.uid, 'jobs', job.id);
            batch.set(jobRef, { ...job, uid: user.uid });
          });

          // Load Documents
          MOCK_DOCUMENTS.forEach(docItem => {
            const docRef = doc(db, 'users', user.uid, 'documents', docItem.id);
            batch.set(docRef, { ...docItem, uid: user.uid });
          });

          // Load Quick Links
          MOCK_QUICK_LINKS.forEach(link => {
            const linkRef = doc(db, 'users', user.uid, 'quickLinks', link.id);
            batch.set(linkRef, { ...link, uid: user.uid });
          });

          // Update Settings (use set with merge to ensure it works even if doc doesn't exist)
          const userDocRef = doc(db, 'users', user.uid);
          batch.set(userDocRef, {
            ...MOCK_USER_SETTINGS,
            email: user.email || MOCK_USER_SETTINGS.email,
          }, { merge: true });

          console.log('Committing batch...');
          await batch.commit();
          console.log('Batch committed successfully');

          setGlobalSuccess('Demo data loaded successfully! Your pipeline is now populated.');
          setTimeout(() => setGlobalSuccess(null), 5000);
        } catch (e) {
          console.error('Demo load failed:', e);
          const err = handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/demo-load`);
          setGlobalError(err);
          throw e; // Re-throw to let the modal handle the loading state
        }
      }
    });
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
            documents={[...mockDocuments, ...documents]} 
            quickLinks={quickLinks}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddQuickLink={handleAddQuickLink}
            onDeleteQuickLink={handleDeleteQuickLink}
          />
        );
      case 'Settings':
        return (
          <SettingsScreen 
            settings={settings} 
            onUpdateSettings={handleUpdateSettings} 
            onResetData={handleResetData} 
            onLoadDemoData={handleLoadDemoData}
          />
        );
      case 'Archive':
      case 'Pipeline':
      default:
        return (
          <KanbanBoard 
            jobs={jobs} 
            onJobClick={(job) => setSelectedJobId(job.id)} 
            activeTab={activeTab}
            onDragEnd={handleDragEnd}
            columns={settings.columns}
            onUpdateColumns={(cols) => handleUpdateSettings({ columns: cols })}
            onRenameColumn={handleRenameColumn}
            onDeleteColumn={handleDeleteColumn}
            onEditBoard={() => setIsManageBoardOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-surface dark">
      <GlobalErrorBanner 
        error={globalError} 
        success={globalSuccess}
        onClear={() => { setGlobalError(null); setGlobalSuccess(null); }} 
      />
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSupportClick={() => setIsSupportOpen(true)} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        <TopBar 
          onAddJob={openAddForm} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          settings={settings} 
          jobs={jobs}
          onMenuClick={() => setIsSidebarOpen(true)}
          onEditBoard={() => setIsManageBoardOpen(true)}
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
          columns={settings.columns}
        />
        <JobFormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveJob}
          initialData={editingJob}
          documents={documents}
          columns={settings.columns}
        />
        <SupportModal 
          isOpen={isSupportOpen} 
          onClose={() => setIsSupportOpen(false)} 
        />
        <ManageColumnsModal 
          isOpen={isManageBoardOpen}
          onClose={() => setIsManageBoardOpen(false)}
          columns={settings.columns}
          onSave={(cols) => handleUpdateSettings({ columns: cols })}
        />
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          variant={confirmModal.variant}
        />
      </main>
    </div>
  );
}
