import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, Mail, MessageSquare, BookOpen, Send, CheckCircle2 } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Simulate sending
    setTimeout(() => {
      setIsSent(true);
      setTimeout(() => {
        onClose();
        setIsSent(false);
        setMessage('');
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-highest border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 bg-surface flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface tracking-tight">Support Center</h3>
                  <p className="text-sm text-on-surface-variant">How can we help you today?</p>
                </div>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                  <BookOpen className="text-primary group-hover:scale-110 transition-transform" size={20} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-on-surface">Documentation</p>
                    <p className="text-xs text-on-surface-variant">Learn how to use Career OS</p>
                  </div>
                </button>
                <button className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-3 group">
                  <MessageSquare className="text-secondary group-hover:scale-110 transition-transform" size={20} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-on-surface">Live Chat</p>
                    <p className="text-xs text-on-surface-variant">Speak with our team</p>
                  </div>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-surface-container-highest px-4 text-on-surface-variant font-bold">Or send a message</span>
                </div>
              </div>

              <form onSubmit={handleSend} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Your Message</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-surface border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[120px] resize-none"
                    placeholder="Describe your issue or feedback..."
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSent || !message.trim()}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${
                    isSent 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-primary/20 hover:shadow-primary/30'
                  }`}
                >
                  {isSent ? (
                    <><CheckCircle2 size={20} /> Message Sent!</>
                  ) : (
                    <><Send size={20} /> Send Message</>
                  )}
                </button>
              </form>
            </div>

            <div className="p-6 bg-surface/50 border-t border-white/5 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Mail size={14} />
                <span>support@careeros.com</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <HelpCircle size={14} />
                <span>Help Center</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
