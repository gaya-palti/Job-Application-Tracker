import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, FunnelChart, Funnel, LabelList 
} from 'recharts';
import { Job, JobStatus } from '../types';
import { INTERVIEW_STATUSES } from '../constants/columns';
import { motion } from 'motion/react';
import { TrendingUp, Target, XCircle, Clock } from 'lucide-react';
import { MOCK_ANALYTICS, MOCK_JOBS } from '../constants/mockData';

interface AnalyticsScreenProps {
  jobs: Job[];
}

const COLORS = ['#00E5FF', '#7C4DFF', '#FF4081', '#FFD600', '#00C853'];

export default function AnalyticsScreen({ jobs }: AnalyticsScreenProps) {
  // KPI Calculations
  const totalApplications = jobs.length;
  const activeInterviews = jobs.filter(j => INTERVIEW_STATUSES.includes(j.status)).length;
  const rejections = jobs.filter(j => j.status === 'Rejected' || j.status === 'Archived').length;
  const offers = jobs.filter(j => j.status === 'Offers').length;
  
  // Funnel Data
  const funnelData = [
    { value: totalApplications, name: 'Total Applications', fill: '#00E5FF' },
    { value: jobs.filter(j => j.status !== 'Referral Requested').length, name: 'Applied', fill: '#7C4DFF' },
    { value: activeInterviews + offers, name: 'Interviewing', fill: '#FF4081' },
    { value: offers, name: 'Offers', fill: '#00C853' },
  ];

  // Time Metrics (Mocked for now as we don't have real timestamps for stage changes)
  const timeData = [
    { stage: 'Referral', days: 2 },
    { stage: 'Applied', days: 5 },
    { stage: 'Screening', days: 7 },
    { stage: 'Interviews', days: 10 },
    { stage: 'Offer', days: 14 },
  ];

  // Goal Tracking
  const weeklyGoal = 10;
  const currentWeekly = jobs.filter(j => j.postedAt === 'Just now' || j.postedAt.includes('hours')).length + 3; // Mocked offset

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-surface custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Search Analytics</h1>
          <p className="text-on-surface-variant">Track your job search performance and conversion rates.</p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard 
            title="Total Applications" 
            value={totalApplications} 
            icon={<TrendingUp className="text-primary" size={20} />} 
            delay={0}
          />
          <KPICard 
            title="Active Interviews" 
            value={activeInterviews} 
            icon={<Target className="text-secondary" size={20} />} 
            delay={0.1}
          />
          <KPICard 
            title="Rejections" 
            value={rejections} 
            icon={<XCircle className="text-primary" size={20} />} 
            delay={0.2}
          />
          <KPICard 
            title="Avg. Response" 
            value="4.2d" 
            icon={<Clock className="text-on-surface-variant" size={20} />} 
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Funnel Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border border-white/5 rounded-2xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Conversion Funnel</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList position="right" fill="#8E9199" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Time in Stage */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 border border-white/5 rounded-2xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Avg. Days in Stage</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="stage" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8E9199', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8E9199', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1A1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="days" fill="#7C4DFF" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Goal Tracking */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 border border-white/5 rounded-2xl"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">Weekly Application Goal</h3>
              <p className="text-2xl font-bold text-on-surface">{currentWeekly} <span className="text-on-surface-variant text-lg font-normal">/ {weeklyGoal}</span></p>
            </div>
            <div className="text-right">
              <span className="text-primary font-bold">{Math.round((currentWeekly / weeklyGoal) * 100)}%</span>
            </div>
          </div>
          <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentWeekly / weeklyGoal) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            />
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">You're on track! Submit {weeklyGoal - currentWeekly} more applications to reach your weekly target.</p>
        </motion.div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, delay }: { title: string, value: string | number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="glass-panel p-6 border border-white/5 rounded-2xl flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{title}</p>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
      </div>
    </motion.div>
  );
}
