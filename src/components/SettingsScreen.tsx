import React, { useState, useEffect } from 'react';
import { 
  User, Mail, MapPin, Bell, Moon, Sun, 
  Shield, LogOut, Trash2, Save, Camera, Link as LinkIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserSettings } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { formatFirebaseError } from '../lib/errorUtils';
import UserAvatar from './UserAvatar';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onResetData: () => void;
}

export default function SettingsScreen({ settings, onUpdateSettings, onResetData }: SettingsScreenProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await onUpdateSettings(localSettings);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage(formatFirebaseError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB for base64 storage in Firestore)
    if (file.size > 1024 * 1024) {
      setSaveMessage('File is too large. Please choose an image under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const updated = { ...localSettings, photoURL: base64String };
      setLocalSettings(updated);
      try {
        await onUpdateSettings({ photoURL: base64String });
        setSaveMessage('Profile photo updated!');
        setTimeout(() => setSaveMessage(null), 3000);
      } catch (error) {
        setSaveMessage('Failed to update photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    const updated = { ...localSettings, photoURL: '' };
    setLocalSettings(updated);
    try {
      await onUpdateSettings({ photoURL: '' });
      setSaveMessage('Profile photo removed!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Failed to remove photo.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-surface custom-scrollbar transition-colors duration-300">
      <input 
        type="file" 
        id="profile-photo-input" 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="max-w-3xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">System Configuration</h1>
            <p className="text-on-surface-variant">Manage your profile, theme, and notification preferences.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-on-primary font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 w-full lg:w-auto"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </header>

        {saveMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-sm font-bold text-center ${saveMessage.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <User className="text-primary" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Profile Management</h3>
          </div>
          
          <div className="flex flex-row md:flex-row gap-4 md:gap-8 items-center md:items-start">
            <div className="relative group shrink-0">
              <UserAvatar 
                name={localSettings.name} 
                photoURL={localSettings.photoURL} 
                size="lg" 
                className="group-hover:border-primary transition-all w-20 h-20 md:w-32 md:h-32"
              />
              <div className="absolute -bottom-1 -right-1 flex gap-1 md:gap-2">
                {localSettings.photoURL && (
                  <button 
                    onClick={handleRemovePhoto}
                    title="Remove Photo"
                    className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shadow-lg border-2 md:border-4 border-surface hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Trash2 size={14} className="md:size-[18px]" />
                  </button>
                )}
                <button 
                  onClick={() => document.getElementById('profile-photo-input')?.click()}
                  title="Upload Photo"
                  className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg border-2 md:border-4 border-surface hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={14} className="md:size-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="space-y-1 md:space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input 
                    type="text" 
                    value={localSettings.name}
                    onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-white/5 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-4 py-2 md:py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="hidden md:block space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input 
                    type="email" 
                    disabled
                    value={localSettings.email}
                    className="w-full bg-surface-container-low border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="email" 
                disabled
                value={localSettings.email}
                className="w-full bg-surface-container-low border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Preferred Job Location</label>
            <p className="text-[10px] text-on-surface-variant italic -mt-1">This location will be automatically suggested when you add new job applications.</p>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                value={localSettings.location}
                onChange={(e) => setLocalSettings({ ...localSettings, location: e.target.value })}
                className="w-full bg-surface-container-low border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="e.g. Remote, New York, etc."
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Bell className="text-primary" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <ToggleOption 
              label="Follow-up Reminders" 
              description="Remind me to follow up 7 days after an application."
              isActive={localSettings.notifications.followUp}
              onToggle={() => setLocalSettings({ 
                ...localSettings,
                notifications: { ...localSettings.notifications, followUp: !localSettings.notifications.followUp } 
              })}
            />
            <ToggleOption 
              label="Interview Alerts" 
              description="Remind me 1 day before an upcoming interview."
              isActive={localSettings.notifications.interviewReminder}
              onToggle={() => setLocalSettings({ 
                ...localSettings,
                notifications: { ...localSettings.notifications, interviewReminder: !localSettings.notifications.interviewReminder } 
              })}
            />
          </div>
        </section>

        {/* Account Actions */}
        <section className="space-y-6 pt-8">
          <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
            <Shield className="text-primary" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Account Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-6 border border-white/5 rounded-2xl glass-panel">
              <div>
                <p className="text-sm font-bold text-on-surface">Sign Out</p>
                <p className="text-xs text-on-surface-variant">Log out of your current session.</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 text-on-surface-variant hover:text-primary transition-colors"
              >
                <LogOut size={24} />
              </button>
            </div>
            <div className="flex items-center justify-between p-6 border border-primary/10 rounded-2xl bg-primary/5">
              <div>
                <p className="text-sm font-bold text-on-surface">Clear All Data</p>
                <p className="text-xs text-on-surface-variant">Permanently delete all job applications.</p>
              </div>
              <button 
                onClick={onResetData}
                className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all active:scale-95"
              >
                Reset Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleOption({ label, description, isActive, onToggle }: { label: string, description: string, isActive: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 glass-panel border border-white/5 rounded-2xl">
      <div>
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${
          isActive ? 'bg-primary' : 'bg-surface-container-highest'
        }`}
      >
        <motion.div 
          animate={{ x: isActive ? 24 : 0 }}
          className="w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
