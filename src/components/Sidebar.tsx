import React from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Archive, 
  Briefcase 
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSupportClick: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSupportClick }: SidebarProps) {
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

  return (
    <aside className="h-screen sticky left-0 w-64 border-r border-white/5 bg-surface flex flex-col py-8 px-4 gap-y-2 z-40">
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Briefcase className="text-on-primary" size={22} />
        </div>
        <div>
          <h2 className="text-on-surface font-bold text-lg tracking-tight">Career<span className="text-primary">OS</span></h2>
          <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">Career Mode</p>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              activeTab === item.label
                ? 'text-primary border-r-2 border-primary bg-primary/5'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-y-1">
        <button
          onClick={onSupportClick}
          className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40 transition-all duration-300"
        >
          <HelpCircle size={20} />
          <span className="text-sm font-medium">Support</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
