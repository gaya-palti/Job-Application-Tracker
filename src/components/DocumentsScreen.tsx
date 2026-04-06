import React, { useState } from 'react';
import { 
  FileText, Plus, Search, MoreVertical, 
  Tag, Download, Trash2, ExternalLink, 
  Github, Linkedin, Globe, Copy, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Document, QuickLink } from '../types';

interface DocumentsScreenProps {
  documents: Document[];
  quickLinks: QuickLink[];
  onAddDocument: (name: string, tag: string) => void;
  onDeleteDocument: (id: string) => void;
  onAddQuickLink: (label: string, url: string) => void;
  onDeleteQuickLink: (id: string) => void;
}

export default function DocumentsScreen({ 
  documents, 
  quickLinks, 
  onAddDocument, 
  onDeleteDocument,
  onAddQuickLink,
  onDeleteQuickLink
}: DocumentsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-surface custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Documents</h1>
            <p className="text-on-surface-variant">Manage your resumes, cover letters, and technical assets.</p>
          </div>
          <button 
            onClick={() => setIsDocModalOpen(true)}
            className="bg-primary text-on-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Upload Asset
          </button>
        </header>

        {/* Quick Links Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Quick Links</h3>
            <button 
              onClick={() => setIsLinkModalOpen(true)}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:text-primary-dim transition-colors"
            >
              Add Link
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <motion.div 
                key={link.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 border border-white/5 rounded-2xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                    {getLinkIcon(link.label)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{link.label}</p>
                    <p className="text-xs text-on-surface-variant truncate max-w-[150px]">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleCopy(link.id, link.url)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {copiedId === link.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button 
                    onClick={() => onDeleteQuickLink(link.id)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Documents Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Documents & Assets</h3>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredDocs.map((doc) => (
                <div key={doc.id}>
                  <DocumentCard 
                    doc={doc} 
                    onDelete={() => onDeleteDocument(doc.id)} 
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Modals */}
      <AddDocModal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)} 
        onAdd={onAddDocument} 
      />
      <AddLinkModal 
        isOpen={isLinkModalOpen} 
        onClose={() => setIsLinkModalOpen(false)} 
        onAdd={onAddQuickLink} 
      />
    </div>
  );
}

function AddDocModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (name: string, tag: string) => void }) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, tag);
    setName('');
    setTag('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Upload New Asset</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Asset Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Resume_2024.pdf"
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tag</label>
            <input 
              type="text" 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. CS Focus"
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Add Asset
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AddLinkModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (label: string, url: string) => void }) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !url) return;
    onAdd(label, url);
    setLabel('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Add Quick Link</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Label</label>
            <input 
              type="text" 
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. GitHub Profile"
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">URL</label>
            <input 
              type="url" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Save Link
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function DocumentCard({ doc, onDelete }: { doc: Document, onDelete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-panel p-6 border border-white/5 rounded-2xl flex flex-col gap-6 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
          <FileText className={doc.type === 'pdf' ? 'text-primary' : 'text-secondary'} size={24} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
            <Download size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-on-surface mb-1 truncate">{doc.name}</h4>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
            v{doc.version}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
            {doc.tag}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
          {doc.uploadedAt}
        </span>
        <button className="text-primary hover:text-primary-dim transition-colors">
          <ExternalLink size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function getLinkIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('github')) return <Github size={20} />;
  if (l.includes('linkedin')) return <Linkedin size={20} />;
  if (l.includes('portfolio') || l.includes('website')) return <Globe size={20} />;
  return <ExternalLink size={20} />;
}
