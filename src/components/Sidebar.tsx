import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  Sparkles,
  BarChart3,
  Bell,
  ShieldCheck,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, onOpenAuth }) => {
  const { currentUser, activeTab, setActiveTab, setSelectedTicketId, resetToDemoData, tickets } = useApp();

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'ticket-detail') {
      setSelectedTicketId(null);
    }
    onCloseMobile();
  };

  const openTicketsCount = tickets.filter(
    (t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED' && t.status !== 'CANCELLED'
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'new-ticket', label: 'Report an issue', icon: PlusCircle },
    {
      id: 'tickets',
      label: 'My tickets',
      icon: Ticket,
      badge: openTicketsCount > 0 ? `${openTicketsCount} open` : undefined,
    },
    { id: 'assistant', label: 'Campus assistant', icon: Sparkles },
    { id: 'insights', label: 'Campus insights', icon: BarChart3 },
    { id: 'notices', label: 'Campus notices', icon: Bell },
    {
      id: 'admin',
      label: 'Admin & access',
      icon: ShieldCheck,
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 pb-5 border-b border-slate-100 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNav('overview')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                C
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-[#152543]">
                  Campus<span className="text-blue-600">Pulse</span> <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 ml-1">AI</span>
                </span>
                <p className="text-[11px] font-medium text-slate-400">Campus Issue Resolver</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-6">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </div>
            <nav className="space-y-1.5" aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.adminOnly && currentUser.role !== 'ADMIN' && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        Admin
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Value proposition highlight */}
          <div className="mx-4 my-2 p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/70 text-xs text-slate-600">
            <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Student-Driven Resolution
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every ticket follows an automated SLA route. Recurring patterns are flagged to trigger campus improvements.
            </p>
          </div>
        </div>

        {/* User Card & Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {currentUser.displayName}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  {currentUser.departmentId && (
                    <span className="text-[10px] text-slate-400 truncate">
                      · Staff
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              title="Switch user account"
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Prototype v1.0</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo tickets and data to original seed values?')) {
                  resetToDemoData();
                }
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
