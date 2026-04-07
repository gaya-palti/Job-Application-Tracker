import { useState } from 'react';
import { Bell, Plus, Menu, Settings2 } from 'lucide-react';
import { UserSettings, Job } from '../types';
import NotificationsDropdown from './NotificationsDropdown';
import UserAvatar from './UserAvatar';

interface TopBarProps {
  onAddJob: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: UserSettings;
  jobs: Job[];
  onMenuClick: () => void;
  onEditBoard: () => void;
}

export default function TopBar({ onAddJob, activeTab, onTabChange, settings, jobs, onMenuClick, onEditBoard }: TopBarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-surface/70 backdrop-blur-xl flex flex-col border-b border-white/5">
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 md:gap-8">
          <button 
            onClick={onMenuClick}
            className="p-2 text-on-surface-variant hover:text-on-surface lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
              {activeTab === 'Archive' ? 'Archive' : activeTab}
            </h1>
            {activeTab === 'Pipeline' && (
              <button 
                onClick={onEditBoard}
                className="p-1.5 text-on-surface-variant hover:text-primary transition-colors lg:hidden"
                title="Edit Board"
              >
                <Settings2 size={18} />
              </button>
            )}
          </div>
          {(activeTab === 'Pipeline' || activeTab === 'Archive') && (
            <div className="hidden lg:flex items-center gap-6">
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
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded transition-colors ${isNotificationsOpen ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container-highest/50'}`}
            >
              <Bell size={20} />
            </button>
            <NotificationsDropdown 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
              jobs={jobs}
            />
          </div>
          <button 
            onClick={onAddJob}
            title="Add Application"
            className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold px-3 md:px-6 py-2 rounded-md active:scale-95 duration-200 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden lg:block">Add Application</span>
          </button>
          <button 
            onClick={() => onTabChange('Settings')}
            className="hover:scale-105 transition-transform active:scale-95"
            title="Settings"
          >
            <UserAvatar name={settings.name} photoURL={settings.photoURL} size="sm" />
          </button>
        </div>
      </div>

      {/* Mobile Segmented Control for Pipeline/Archive */}
      {(activeTab === 'Pipeline' || activeTab === 'Archive') && (
        <div className="lg:hidden px-4 pb-4">
          <div className="flex p-1 bg-surface-container-highest/50 rounded-xl border border-white/5">
            <button
              onClick={() => onTabChange('Pipeline')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === 'Pipeline' 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Active Pipeline
            </button>
            <button
              onClick={() => onTabChange('Archive')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === 'Archive' 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Archive
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
