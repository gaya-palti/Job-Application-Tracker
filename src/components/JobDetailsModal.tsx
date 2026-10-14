import { useState } from 'react';
import { X, CheckCircle2, Clock, Calendar, MoreVertical, ExternalLink, FileCheck, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, Document, Column } from '../types';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onUpdateStatus: (jobId: string, newStatus?: string) => void;
  onArchive: (jobId: string) => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onUpdateJob: (jobId: string, updates: Partial<Job>) => void;
  documents?: Document[];
  columns: Column[];
}

export default function JobDetailsModal({ job, onClose, onUpdateStatus, onArchive, onEdit, onDelete, onUpdateJob, documents = [], columns }: JobDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'links' | 'notes'>('details');
  const [isQuickEditing, setIsQuickEditing] = useState(false);
  const [quickEditValue, setQuickEditValue] = useState('');
  const [isStageSelectorOpen, setIsStageSelectorOpen] = useState(false);

  if (!job) return null;

  const handleQuickEditStart = () => {
    setIsQuickEditing(true);
    if (activeTab === 'links') {
      setQuickEditValue(job.codeChallengeLinks?.join('\n') || '');
    } else if (activeTab === 'notes') {
      setQuickEditValue(job.interviewNotes || '');
    }
  };

  const handleQuickSave = () => {
    if (activeTab === 'links') {
      onUpdateJob(job.id, { codeChallengeLinks: quickEditValue.split('\n').filter(l => l.trim() !== '') });
    } else if (activeTab === 'notes') {
      onUpdateJob(job.id, { interviewNotes: quickEditValue });
    }
    setIsQuickEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the application for ${job.title} at ${job.company}?`)) {
      onDelete(job.id);
    }
  };

  const handleStageSelect = (stageId: string) => {
    onUpdateStatus(job.id, stageId);
    setIsStageSelectorOpen(false);
  };

  const currentStatusTitle = columns.find(c => c.id === job.status)?.title || job.status;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full max-w-[500px] glass-panel border-l border-white/10 z-[60] flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-white/10 p-1">
                <img
                  className="w-full h-full object-contain"
                  src={job.logo}
                  alt={job.company}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-on-surface">{job.title}</h2>
                <p className="text-on-surface-variant">{job.company} • {job.location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-white p-1 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded glow-chip-primary text-primary bg-primary/5">
              {currentStatusTitle} Stage
            </div>
            {job.salary && (
              <div className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded bg-surface-container-highest text-on-surface-variant">
                {job.salary}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 md:px-8 border-b border-white/5 bg-surface-container-low/30 overflow-x-auto scrollbar-hide whitespace-nowrap">
          <div className="flex px-4 md:px-0 pr-12 md:pr-0">
            <button 
              onClick={() => setActiveTab('details')}
              className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 shrink-0 ${
                activeTab === 'details' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-white'
              }`}
            >
              Job Details
            </button>
            <button 
              onClick={() => setActiveTab('links')}
              className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 shrink-0 ${
                activeTab === 'links' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-white'
              }`}
            >
              Code Challenge Links
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 shrink-0 ${
                activeTab === 'notes' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-white'
              }`}
            >
              Interview Notes
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {activeTab === 'details' && (
            <>
              <section className="px-2 md:px-0">
                <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-4">Description</h3>
                <p className="text-on-surface/80 leading-relaxed text-sm">
                  {job.description}
                </p>
              </section>

              {(job.contactName || job.contactInfo) && (
                <section>
                  <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-4">Applied Through</h3>
                  <div className="glass-panel p-4 border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                      <User className="text-primary" size={20} />
                    </div>
                    <div className="overflow-hidden">
                      {job.contactName && <h4 className="text-sm font-bold text-on-surface truncate">{job.contactName}</h4>}
                      {job.contactInfo && <p className="text-xs text-on-surface-variant break-all">{job.contactInfo}</p>}
                    </div>
                  </div>
                </section>
              )}

              {job.websiteUrl && (
                <section>
                  <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-4">Job Website</h3>
                  <div className="glass-panel p-4 border border-white/5 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                        <ExternalLink className="text-primary" size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-on-surface truncate">Visit Job Post</h4>
                        <a 
                          href={job.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-primary uppercase font-bold tracking-widest hover:underline truncate block"
                        >
                          {job.websiteUrl}
                        </a>
                      </div>
                    </div>
                    <a 
                      href={job.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-4">Key Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-on-surface/80">
                      <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-4">Interview Roadmap</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10"></div>
                  {job.roadmap.map((step, i) => (
                    <div key={i} className={`flex items-start gap-4 relative ${step.status === 'upcoming' ? 'opacity-50' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                        step.status === 'completed' ? 'bg-primary text-on-primary' :
                        step.status === 'in-progress' ? 'bg-secondary text-white' :
                        'bg-surface-container-highest border border-white/10 text-on-surface-variant'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 size={14} /> :
                         step.status === 'in-progress' ? <Clock size={14} /> :
                         <Calendar size={14} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface">{step.label}</h4>
                        <p className="text-xs text-on-surface-variant">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'links' && (
            <section className="px-2 md:px-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">Code Challenge Links</h3>
                {!isQuickEditing && (
                  <button 
                    onClick={handleQuickEditStart}
                    className="text-[10px] font-bold text-primary uppercase tracking-wider hover:text-primary-dim transition-colors"
                  >
                    {job.codeChallengeLinks && job.codeChallengeLinks.length > 0 ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>
              
              {isQuickEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={quickEditValue}
                    onChange={(e) => setQuickEditValue(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 h-32 resize-none custom-scrollbar"
                    placeholder="Enter links (one per line)..."
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleQuickSave}
                      className="flex-1 bg-primary text-on-primary text-xs font-bold py-2 rounded transition-all active:scale-95"
                    >
                      Save Links
                    </button>
                    <button 
                      onClick={() => setIsQuickEditing(false)}
                      className="px-4 border border-white/10 text-white text-xs font-bold py-2 rounded hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : job.codeChallengeLinks && job.codeChallengeLinks.length > 0 ? (
                <ul className="space-y-4">
                  {job.codeChallengeLinks.map((link, i) => (
                    <li key={i} className="bg-surface-container-highest/50 border border-white/5 rounded-lg p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <ExternalLink size={18} className="text-primary shrink-0" />
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-on-surface/80 hover:text-primary transition-colors truncate"
                        >
                          {link}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                  <p className="text-on-surface-variant text-sm">No links added yet.</p>
                  <button 
                    onClick={handleQuickEditStart}
                    className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dim transition-colors"
                  >
                    Add Links
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === 'notes' && (
            <section className="px-2 md:px-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">Interview Notes</h3>
                {!isQuickEditing && (
                  <button 
                    onClick={handleQuickEditStart}
                    className="text-[10px] font-bold text-primary uppercase tracking-wider hover:text-primary-dim transition-colors"
                  >
                    {job.interviewNotes ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>

              {isQuickEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={quickEditValue}
                    onChange={(e) => setQuickEditValue(e.target.value)}
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 h-48 resize-none custom-scrollbar"
                    placeholder="Enter interview notes..."
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleQuickSave}
                      className="flex-1 bg-primary text-on-primary text-xs font-bold py-2 rounded transition-all active:scale-95"
                    >
                      Save Notes
                    </button>
                    <button 
                      onClick={() => setIsQuickEditing(false)}
                      className="px-4 border border-white/10 text-white text-xs font-bold py-2 rounded hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : job.interviewNotes ? (
                <div className="bg-surface-container-highest/50 border border-white/5 rounded-lg p-6">
                  <p className="text-on-surface/80 leading-relaxed text-sm whitespace-pre-wrap">
                    {job.interviewNotes}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                  <p className="text-on-surface-variant text-sm">No notes added yet.</p>
                  <button 
                    onClick={handleQuickEditStart}
                    className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dim transition-colors"
                  >
                    Add Notes
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 relative">
          <AnimatePresence>
            {isStageSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full left-4 right-4 mb-4 glass-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70]"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-high">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Move to Stage</h4>
                  <button onClick={() => setIsStageSelectorOpen(false)} className="text-on-surface-variant hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleStageSelect(col.id)}
                      className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-all hover:bg-primary/10 group ${
                        job.status === col.id ? 'text-primary bg-primary/5' : 'text-on-surface/80'
                      }`}
                    >
                      <span>{col.title}</span>
                      {job.status === col.id ? (
                        <CheckCircle2 size={16} className="text-primary" />
                      ) : (
                        <ChevronRight size={16} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsStageSelectorOpen(!isStageSelectorOpen)}
            className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3 rounded-xl active:scale-95 duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Update Progress
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => onArchive(job.id)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-colors font-medium"
            >
              Archive
            </button>
            <button 
              onClick={() => onEdit(job)}
              className="px-4 py-3 rounded-xl border border-white/10 text-on-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center"
              title="Edit Application"
            >
              <MoreVertical size={20} className="rotate-90" />
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-3 rounded-xl border border-primary/20 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
              title="Delete Application"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
