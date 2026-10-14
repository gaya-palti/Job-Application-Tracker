import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Briefcase, Mail, Lock, LogIn, UserPlus, Chrome, AlertCircle } from 'lucide-react';
import { UserSettings } from '../types';
import { DEFAULT_COLUMNS } from '../constants/columns';
import { formatFirebaseError } from '../lib/errorUtils';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userDocRef);
      if (!snapshot.exists()) {
        const initialSettings: UserSettings = {
          name: user.displayName || '',
          email: user.email || '',
          location: '',
          photoURL: user.photoURL || '',
          theme: 'dark',
          notifications: {
            followUp: true,
            interviewReminder: true,
          },
          columns: [...DEFAULT_COLUMNS]
        };
        await setDoc(userDocRef, initialSettings);
      }
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initialize user settings in Firestore immediately
        const userDocRef = doc(db, 'users', user.uid);
        const initialSettings: UserSettings = {
          name: email.split('@')[0],
          email: email,
          location: '',
          photoURL: '',
          theme: 'dark',
          notifications: {
            followUp: true,
            interviewReminder: true,
          },
          columns: [...DEFAULT_COLUMNS]
        };
        await setDoc(userDocRef, initialSettings);
      }
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 border border-white/5 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Briefcase className="text-on-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Career<span className="text-primary">OS</span></h1>
          <p className="text-on-surface-variant text-sm mt-2">Your professional journey, organized.</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-surface font-bold py-3 px-4 rounded-xl hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface px-4 text-on-surface-variant font-bold">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20"
              >
                <AlertCircle className="text-primary shrink-0 mt-0.5" size={16} />
                <p className="text-primary text-xs font-medium leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? <><LogIn size={20} /> Sign In</> : <><UserPlus size={20} /> Create Account</>)}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold ml-2 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
