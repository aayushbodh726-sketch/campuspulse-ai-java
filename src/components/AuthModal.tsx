import React, { useState } from 'react';
import { X, User, Shield, Briefcase, GraduationCap, ArrowRight, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUser, loginAs } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginAs(emailInput.trim());
    onClose();
  };

  const handleQuickSwitch = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-xl mx-auto mb-3 shadow-md shadow-blue-500/20">
            C
          </div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-blue-600">
            Student-First Campus Tools
          </span>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#152543] mt-1">
            Sign In / Switch Account
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Currently active as <strong className="text-slate-700">{currentUser.displayName} ({currentUser.role})</strong>
          </p>
        </div>

        {/* 1-Click Simulation Accounts */}
        <div className="space-y-2 mb-6">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Quick 1-Click Switch:
          </div>

          <button
            type="button"
            onClick={() => handleQuickSwitch('user-student')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              currentUser.id === 'user-student'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-slate-800 block">Demo Student</strong>
                <span className="text-[10px] text-slate-400 font-mono">student@campuspulse.local</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Student Role
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSwitch('user-staff')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              currentUser.id === 'user-staff'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-slate-800 block">Demo IT Staff</strong>
                <span className="text-[10px] text-slate-400 font-mono">staff@campuspulse.local</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Staff Role
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSwitch('user-admin')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              currentUser.id === 'user-admin'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-slate-800 block">Demo Administrator</strong>
                <span className="text-[10px] text-slate-400 font-mono">admin@campuspulse.local</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Admin Role
            </span>
          </button>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="pt-4 border-t border-slate-100 space-y-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Or sign in with custom email:
          </div>
          <div>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. john.doe@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!emailInput.trim()}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Sign In as Custom Student</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
