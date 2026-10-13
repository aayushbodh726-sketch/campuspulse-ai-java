import React from 'react';
import { Menu, Plus, User, Shield, Briefcase, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TopbarProps {
  title: string;
  onOpenMobile: () => void;
  onOpenAuth: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, onOpenMobile, onOpenAuth }) => {
  const { currentUser, switchUser, setActiveTab, setSelectedTicketId } = useApp();

  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleNewTicket = () => {
    setSelectedTicketId(null);
    setActiveTab('new-ticket');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title & mobile menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-lg sm:text-xl text-[#152543] tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">{todayLabel}</p>
        </div>
      </div>

      {/* Quick Role Switcher & New Report CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switch Pill Group */}
        <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider px-2 font-bold">
            Simulate:
          </span>
          <button
            onClick={() => switchUser('user-student')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentUser.id === 'user-student'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            onClick={() => switchUser('user-staff')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentUser.id === 'user-staff'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            IT Staff
          </button>
          <button
            onClick={() => switchUser('user-admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              currentUser.id === 'user-admin'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleNewTicket}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New report</span>
        </button>

        {/* User avatar button */}
        <button
          onClick={onOpenAuth}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors"
          title={`Signed in as ${currentUser.displayName} (${currentUser.role})`}
        >
          <User className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </header>
  );
};
