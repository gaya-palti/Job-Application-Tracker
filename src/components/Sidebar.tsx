import React from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Archive, 
  Briefcase,
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSupportClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSupportClick, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: LayoutGrid, label: 'Pipeline' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: FileText, label: 'Documents' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-surface border-r border-white/5 flex flex-col py-8 px-4 gap-y-2 transition-all duration-300 
        lg:relative lg:translate-x-0 lg:w-64 lg:z-40
        md:relative md:translate-x-0 md:z-40
        ${isOpen ? 'w-64 translate-x-0 shadow-2xl' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8 px-4">
          <div 
            onClick={() => handleTabClick('Pipeline')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform flex-shrink-0">
              <Briefcase className="text-on-primary" size={22} />
            </div>
            <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
              <h2 className="text-on-surface font-bold text-lg tracking-tight group-hover:text-primary transition-colors">Career<span className="text-primary">OS</span></h2>
              <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Career Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-on-surface lg:hidden">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 flex flex-col gap-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleTabClick(item.label)}
              title={item.label}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                activeTab === item.label
                  ? 'text-primary border-r-2 border-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
                {item.label}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5 lg:hidden">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-y-1">
          <button
            onClick={() => { onSupportClick(); onClose(); }}
            title="Support"
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40 transition-all duration-300 group relative"
          >
            <HelpCircle size={20} className="flex-shrink-0" />
            <span className={`text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
              Support
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5 lg:hidden">
                Support
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-300 group relative"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
              Logout
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5 lg:hidden">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
