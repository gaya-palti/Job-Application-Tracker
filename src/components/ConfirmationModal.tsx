import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsLoading(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  variant === 'danger' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  <AlertTriangle size={24} />
                </div>
                {!isLoading && (
                  <button 
                    onClick={onClose}
                    className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-on-surface tracking-tight">{title}</h3>
                <p className="mt-2 text-on-surface-variant text-sm leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await onConfirm();
                      onClose();
                    } catch (error) {
                      setIsLoading(false);
                    }
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-on-primary shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
                    variant === 'danger' 
                      ? 'bg-primary shadow-primary/20 hover:bg-primary-dim' 
                      : 'bg-secondary shadow-secondary/20 hover:bg-secondary-dim'
                  }`}
                >
                  {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {isLoading ? 'Processing...' : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
