import { Bell, Plus } from 'lucide-react';
import { UserSettings } from '../types';

interface TopBarProps {
  onAddJob: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: UserSettings;
}

export default function TopBar({ onAddJob, activeTab, onTabChange, settings }: TopBarProps) {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface/70 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-white/5">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-on-surface tracking-tight">
          {activeTab}
        </h1>
        {(activeTab === 'Pipeline' || activeTab === 'Archive') && (
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onTabChange('Pipeline')}
              className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'Pipeline' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Pipeline
            </button>
            <button 
              onClick={() => onTabChange('Archive')}
              className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'Archive' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Archive
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:bg-surface-container-highest/50 p-2 rounded transition-colors">
          <Bell size={20} />
        </button>
        <button 
          onClick={onAddJob}
          className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold px-6 py-2 rounded-md active:scale-95 duration-200 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Application
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest border border-white/10">
          <img
            className="w-full h-full object-cover"
            src={settings.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"}
            alt="User profile"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
