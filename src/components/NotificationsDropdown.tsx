import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { Job } from '../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
}

export default function NotificationsDropdown({ isOpen, onClose, jobs }: NotificationsDropdownProps) {
  // Derive some "notifications" from jobs
  const notifications = jobs
    .filter(job => job.status === 'Applied' || job.status === 'Home Assignment')
    .slice(0, 5)
    .map(job => ({
      id: job.id,
      title: `Follow up: ${job.company}`,
      description: `It's been a few days since you applied for ${job.title}.`,
      time: '2h ago',
      type: 'reminder' as const,
    }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-surface-container-highest border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Alerts</h3>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {notif.type === 'reminder' ? (
                          <Clock size={16} className="text-primary" />
                        ) : (
                          <CheckCircle2 size={16} className="text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                          {notif.title}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          {notif.description}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60 mt-2 font-medium">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-on-surface-variant/40" />
                  </div>
                  <p className="text-sm text-on-surface-variant">No new alerts</p>
                  <p className="text-xs text-on-surface-variant/60 mt-1">You're all caught up!</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button className="w-full p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-white/5 uppercase tracking-widest">
                View All Notifications
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
