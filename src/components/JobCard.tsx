import React from 'react';
import { Bookmark, Mail, Code, Users, PartyPopper } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  key?: string;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'Bookmarked': return Bookmark;
      case 'Applied': return Mail;
      case 'Technical Assessment': return Code;
      case 'Onsite': return Users;
      case 'Offers': return PartyPopper;
      default: return Bookmark;
    }
  };

  const [imgError, setImgError] = React.useState(false);

  const StatusIcon = getStatusIcon();

  const getFallbackLogo = (company: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company)}&backgroundColor=f8fafc&textColor=0f172a&fontSize=45`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTagStyles = () => {
    if (job.status === 'Technical Assessment') return 'glow-chip-secondary text-secondary';
    if (job.status === 'Offers') return 'glow-chip-tertiary text-tertiary';
    return 'glow-chip-primary text-primary';
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="bg-surface-container-low p-5 rounded-xl border border-white/5 hover:bg-surface-container-highest transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-white/5 p-1">
          <img
            className="w-full h-full object-contain"
            src={imgError ? getFallbackLogo(job.company) : job.logo}
            alt={job.company}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </div>
        <StatusIcon
          size={18}
          className={`transition-colors ${
            job.status === 'Technical Assessment' ? 'text-secondary' : 
            job.status === 'Offers' ? 'text-tertiary' : 'text-on-surface-variant group-hover:text-primary'
          }`}
        />
      </div>
      
      <h4 className="text-on-surface font-semibold mb-1 leading-tight">{job.title}</h4>
      <p className="text-on-surface-variant text-sm mb-4">{job.company}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">{formatDate(job.postedAt)}</span>
        {job.tag && (
          <div className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${getTagStyles()}`}>
            {job.tag}
          </div>
        )}
      </div>
    </div>
  );
}
