import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { formatFirebaseError } from '../lib/errorUtils';

interface GlobalErrorBannerProps {
  error: any;
  onClear: () => void;
}

export default function GlobalErrorBanner({ error, onClear }: GlobalErrorBannerProps) {
  if (!error) return null;

  const message = formatFirebaseError(error);
  const isSecurityError = message.includes('Security Error') || message.includes('permission');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xl px-4"
      >
        <div className={`
          relative overflow-hidden rounded-2xl border shadow-2xl p-4 flex items-start gap-4
          ${isSecurityError 
            ? 'bg-red-500/10 border-red-500/20 text-red-500' 
            : 'bg-primary/10 border-primary/20 text-primary'}
          backdrop-blur-md
        `}>
          <div className={`
            shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
            ${isSecurityError ? 'bg-red-500/20' : 'bg-primary/20'}
          `}>
            {isSecurityError ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
          </div>
          
          <div className="flex-1 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
              {isSecurityError ? 'Security Alert' : 'System Error'}
            </h4>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              {message}
            </p>
          </div>

          <button 
            onClick={onClear}
            className="shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>

          {/* Progress bar for auto-dismiss if we wanted one, but better to keep it manual for errors */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
