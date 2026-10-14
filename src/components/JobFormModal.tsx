import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Clock, Calendar, Link as LinkIcon, Sparkles, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, JobStatus, Document, Column } from '../types';
import { formatFirebaseError } from '../lib/errorUtils';
import { extractJobFromUrl, extractJobFromText } from '../services/jobExtractionService';
import { DEFAULT_COLUMNS } from '../constants/columns';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Partial<Job>) => void;
  initialData?: Job | null;
  documents?: Document[];
  columns: Column[];
}

export default function JobFormModal({ isOpen, onClose, onSave, initialData, documents = [], columns }: JobFormModalProps) {
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    description: '',
    status: columns[0]?.id || DEFAULT_COLUMNS[0].id,
    salary: '',
    requirements: [],
    roadmap: [],
    websiteUrl: '',
    contactName: '',
    contactInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoFillMode, setAutoFillMode] = useState<'url' | 'text'>('url');
  const [autoFillInput, setAutoFillInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        requirements: initialData.requirements || [],
        roadmap: initialData.roadmap || [],
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        status: columns[0]?.id || DEFAULT_COLUMNS[0].id,
        salary: '',
        requirements: [],
        roadmap: [
          { label: 'Initial Screening', status: 'upcoming', details: 'Pending' }
        ],
        websiteUrl: '',
        contactName: '',
        contactInfo: '',
      });
    }
    setErrors({});
    setAutoFillInput('');
    setExtractionError(null);
  }, [initialData, isOpen, columns]);

  const handleAutoFill = async () => {
    const input = autoFillInput.trim();
    if (!input) {
      setExtractionError(autoFillMode === 'url' ? 'Paste a job posting URL first' : 'Paste the job posting text first');
      return;
    }
    if (autoFillMode === 'url' && !/^https?:\/\//i.test(input)) {
      setExtractionError('URL must start with http:// or https://');
      return;
    }

    setIsExtracting(true);
    setExtractionError(null);

    try {
      const extracted = autoFillMode === 'url'
        ? await extractJobFromUrl(input)
        : await extractJobFromText(input);
      setFormData(prev => ({
        ...prev,
        title: extracted.title,
        company: extracted.company,
        location: extracted.location,
        salary: extracted.salary || '',
        description: extracted.description,
        requirements: extracted.requirements || [],
        websiteUrl: autoFillMode === 'url' ? input : prev.websiteUrl,
      }));
      setErrors({});
    } catch (err: any) {
      console.error('Auto-fill failed', err);
      setExtractionError(err?.message || 'Failed to extract job details');
    } finally {
      setIsExtracting(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData.company?.trim()) newErrors.company = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...(formData.requirements || []), '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...(formData.requirements || [])];
    newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  const removeRequirement = (index: number) => {
    const newReqs = [...(formData.requirements || [])];
    newReqs.splice(index, 1);
    setFormData({ ...formData, requirements: newReqs });
  };

  const addRoadmapStep = () => {
    setFormData({
      ...formData,
      roadmap: [...(formData.roadmap || []), { label: '', status: 'upcoming', details: '' }]
    });
  };

  const updateRoadmapStep = (index: number, updates: any) => {
    const newRoadmap = [...(formData.roadmap || [])];
    newRoadmap[index] = { ...newRoadmap[index], ...updates };
    setFormData({ ...formData, roadmap: newRoadmap });
  };

  const removeRoadmapStep = (index: number) => {
    const newRoadmap = [...(formData.roadmap || [])];
    newRoadmap.splice(index, 1);
    setFormData({ ...formData, roadmap: newRoadmap });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container-low border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-high/50">
            <h2 className="text-lg md:text-xl font-bold text-on-surface">
              {initialData ? 'Edit Application' : 'Add New Application'}
            </h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
              <X size={20} className="md:size-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar">
              {/* AI Auto-fill */}
              {!initialData && (
                <div className="bg-surface-container-highest/30 border border-primary/20 rounded-xl p-3 md:p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles size={16} />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">AI Auto-fill</span>
                    </div>
                    <div className="flex bg-surface-container-low rounded-lg p-0.5 border border-white/5">
                      {(['url', 'text'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => { setAutoFillMode(mode); setAutoFillInput(''); setExtractionError(null); }}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            autoFillMode === mode ? 'bg-primary/15 text-primary' : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {mode === 'url' ? 'Link' : 'Text'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {autoFillMode === 'url' ? (
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
                        <input
                          type="url"
                          value={autoFillInput}
                          onChange={(e) => setAutoFillInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAutoFill(); } }}
                          className="w-full bg-surface-container-low border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                          placeholder="Paste a job posting link"
                        />
                      </div>
                    ) : (
                      <textarea
                        value={autoFillInput}
                        onChange={(e) => setAutoFillInput(e.target.value)}
                        className="flex-1 bg-surface-container-low border border-white/5 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all h-24 resize-none"
                        placeholder="Paste the full job posting text (useful for LinkedIn)"
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      disabled={isExtracting}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 sm:self-start"
                    >
                      {isExtracting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {isExtracting ? 'Reading...' : 'Auto-fill'}
                    </button>
                  </div>
                  {extractionError && (
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{extractionError}</p>
                  )}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Job Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full bg-surface-container-highest border ${errors.title ? 'border-primary' : 'border-white/5'} rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all`}
                    placeholder="e.g. Frontend Engineer"
                  />
                  {errors.title && <p className="text-primary text-[9px] md:text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Company <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full bg-surface-container-highest border ${errors.company ? 'border-primary' : 'border-white/5'} rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all`}
                    placeholder="e.g. Metaflow"
                  />
                  {errors.company && <p className="text-primary text-[9px] md:text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="e.g. Remote"
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="e.g. $120k - $150k"
                  />
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Applied Through (Contact)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                    <input
                      type="text"
                      value={formData.contactName || ''}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-surface-container-highest border border-white/5 rounded-lg pl-10 md:pl-12 pr-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="e.g. Dana Cohen (referral)"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                    Contact Details
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo || ''}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="Email, phone, or LinkedIn profile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all h-24 md:h-32 resize-none"
                  placeholder="Briefly describe the role..."
                />
              </div>

              {/* Requirements Section */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Key Requirements
                  </label>
                  <button 
                    type="button"
                    onClick={addRequirement}
                    className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary-dim transition-colors"
                  >
                    <Plus size={12} className="md:size-14" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements?.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 bg-surface-container-highest border border-white/5 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        placeholder="e.g. 5+ years React"
                      />
                      <button 
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-1.5 md:p-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Trash2 size={16} className="md:size-[18px]" />
                      </button>
                    </div>
                  ))}
                  {(!formData.requirements || formData.requirements.length === 0) && (
                    <p className="text-[10px] md:text-xs text-on-surface-variant italic">No requirements added yet.</p>
                  )}
                </div>
              </div>

              {/* Roadmap Section */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Interview Roadmap
                  </label>
                  <button 
                    type="button"
                    onClick={addRoadmapStep}
                    className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary-dim transition-colors"
                  >
                    <Plus size={12} className="md:size-14" /> Add Step
                  </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {formData.roadmap?.map((step, index) => (
                    <div key={index} className="glass-panel p-3 md:p-4 border border-white/5 rounded-xl space-y-3 md:space-y-4 relative group">
                      <button 
                        type="button"
                        onClick={() => removeRoadmapStep(index)}
                        className="absolute top-3 right-3 md:top-4 md:right-4 text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} className="md:size-[18px]" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Step Label</label>
                          <input
                            type="text"
                            value={step.label}
                            onChange={(e) => updateRoadmapStep(index, { label: e.target.value })}
                            className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 py-1.5 md:py-2 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
                            placeholder="e.g. Technical"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Status</label>
                          <select
                            value={step.status}
                            onChange={(e) => updateRoadmapStep(index, { status: e.target.value })}
                            className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 py-1.5 md:py-2 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Details</label>
                        <input
                          type="text"
                          value={step.details}
                          onChange={(e) => updateRoadmapStep(index, { details: e.target.value })}
                          className="w-full bg-surface-container-highest border border-white/5 rounded-lg px-3 py-1.5 md:py-2 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
                          placeholder="e.g. 1 hour with CTO"
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.roadmap || formData.roadmap.length === 0) && (
                    <p className="text-[10px] md:text-xs text-on-surface-variant italic">No roadmap steps added yet.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 md:mb-2">
                  Job Website / Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} md:size={18} />
                  <input
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full bg-surface-container-highest border border-white/5 rounded-lg pl-10 md:pl-12 pr-4 py-2 md:py-3 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="https://company.com/careers/job"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-white/5 flex gap-3 md:gap-4 bg-surface-container-low">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg border border-white/10 text-on-surface hover:bg-surface-container-highest transition-colors font-bold text-xs md:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-2 md:py-3 rounded-lg active:scale-95 duration-200 shadow-lg shadow-primary/10 text-xs md:text-sm"
              >
                {initialData ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
