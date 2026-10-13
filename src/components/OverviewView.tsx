import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Repeat,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPriorityBadgeClass, getStatusBadgeClass, STATUS_LABELS, PRIORITY_LABELS } from '../services/ticketPolicy';

export const OverviewView: React.FC = () => {
  const {
    currentUser,
    tickets,
    notices,
    categories,
    setActiveTab,
    setSelectedTicketId,
  } = useApp();

  // Role-based ticket filtering
  const visibleTickets = tickets.filter((ticket) => {
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'STAFF') {
      return (
        ticket.departmentId === currentUser.departmentId ||
        ticket.assignedStaffId === currentUser.id
      );
    }
    // STUDENT
    return ticket.requesterId === currentUser.id;
  });

  const total = tickets.length;
  const openCount = tickets.filter(
    (t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED' && t.status !== 'CANCELLED'
  ).length;
  const resolvedCount = tickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  ).length;

  const nowTime = Date.now();
  const overdueCount = tickets.filter((t) => {
    if (t.status === 'RESOLVED' || t.status === 'CLOSED' || t.status === 'CANCELLED') return false;
    return new Date(t.resolutionDeadline).getTime() < nowTime;
  }).length;

  const recentTickets = [...visibleTickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'General';
  };

  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveTab('ticket-detail');
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
            Campus Operations
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543] tracking-tight">
            Good to see you, {currentUser.displayName}.
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            A clearer view of campus concerns, service progress, and what needs attention next.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new-ticket')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report an issue</span>
        </button>
      </div>

      {/* Demo notice banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Prototype includes illustrative demo records</strong>
          <p className="text-amber-800/80 text-[11px] mt-0.5">
            These sample tickets demonstrate real status workflows, category routing, and recurring pattern detection.
          </p>
        </div>
      </div>

      {/* Dashboard Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#152543] via-[#1d3668] to-[#2c4fae] text-white p-6 sm:p-8 shadow-lg shadow-slate-900/10">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block text-[10px] font-extrabold tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full mb-3 text-blue-200">
            Your Campus · Your Voice
          </span>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
            Small reports. Meaningful improvements.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            Share what needs attention, follow real-time department responses, and help your campus spot recurring issues automatically.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('assistant')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ask CampusPulse AI →</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
            >
              <span>View Pattern Insights</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-12 -bottom-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total reported */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total reported</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all campus reports</div>
        </div>

        {/* Open right now */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Open right now</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-600">
            {openCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Needs attention / in progress</div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Resolved or closed</div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-rose-600">
            {overdueCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Past resolution target SLA</div>
        </div>
      </div>

      {/* Two Columns: Recent Tickets & Campus Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-800">
                  {currentUser.role === 'STUDENT'
                    ? 'Your recent tickets'
                    : currentUser.role === 'STAFF'
                    ? 'Assigned team tickets'
                    : 'All recent tickets'}
                </h3>
                <p className="text-xs text-slate-400">Latest activity in your current workspace</p>
              </div>
              <button
                onClick={() => setActiveTab('tickets')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentTickets.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleOpenTicket(ticket.id)}
                    className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        ⌁
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {ticket.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {getCategoryName(ticket.categoryId)} · {ticket.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          ticket.status
                        )}`}
                      >
                        {STATUS_LABELS[ticket.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                  🎫
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No tickets found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Submit a campus issue to start the resolution tracking journey.
                </p>
                <button
                  onClick={() => setActiveTab('new-ticket')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Create first report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Campus Notices Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-800">
                  Campus notices
                </h3>
                <p className="text-xs text-slate-400">Current guidance and announcements</p>
              </div>
              <button
                onClick={() => setActiveTab('notices')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>All notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-blue-600 uppercase tracking-wider">
                      {notice.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">{notice.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {notice.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Built for Transparency / Workflow Explainer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-800">
              Built for transparency
            </h3>
            <p className="text-xs text-slate-400">
              How CampusPulse turns student reports into timely resolutions
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Resolution Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-sm">
              01
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block mb-1">
                Route it intelligently
              </strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Category rules send reports directly to the assigned department (IT, Facilities, Housekeeping) and compute suggested SLA targets.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center shrink-0 text-sm">
              02
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block mb-1">
                Keep a clear history
              </strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Status changes, department assignments, and technician notes are logged on an immutable audit timeline.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center shrink-0 text-sm">
              03
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block mb-1">
                Spot repeated patterns
              </strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Shared locations and categories in the last 90 days are flagged as recurring issues to promote lasting infrastructure repairs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
