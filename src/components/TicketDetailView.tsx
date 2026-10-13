import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Building,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  History,
  Send,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getAllowedTransitions,
  getDeadlineHours,
  getPriorityBadgeClass,
  getStatusBadgeClass,
  IMPACT_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  URGENCY_LABELS,
} from '../services/ticketPolicy';
import { TicketStatus } from '../types';

export const TicketDetailView: React.FC = () => {
  const {
    currentUser,
    tickets,
    ticketHistories,
    categories,
    departments,
    selectedTicketId,
    setActiveTab,
    updateTicketStatus,
  } = useApp();

  const ticket = tickets.find((t) => t.id === selectedTicketId);
  const [nextStatus, setNextStatus] = useState<TicketStatus | ''>('');
  const [updateNote, setUpdateNote] = useState('');

  if (!ticket) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg">Ticket Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested ticket does not exist or was removed.
        </p>
        <button
          onClick={() => setActiveTab('tickets')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Back to tickets
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === ticket.categoryId);
  const department = departments.find((d) => d.id === ticket.departmentId);
  const histories = ticketHistories
    .filter((h) => h.ticketId === ticket.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const allowedStatuses = getAllowedTransitions(ticket.status);

  // Can the current user update this ticket?
  const canUpdate =
    currentUser.role === 'ADMIN' ||
    (currentUser.role === 'STAFF' &&
      (ticket.departmentId === currentUser.departmentId ||
        ticket.assignedStaffId === currentUser.id)) ||
    (currentUser.role === 'STUDENT' &&
      ticket.requesterId === currentUser.id &&
      (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'));

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextStatus) return;

    const success = updateTicketStatus(ticket.id, nextStatus as TicketStatus, updateNote);
    if (success) {
      setNextStatus('');
      setUpdateNote('');
    }
  };

  const isOverdue =
    ticket.status !== 'RESOLVED' &&
    ticket.status !== 'CLOSED' &&
    ticket.status !== 'CANCELLED' &&
    new Date(ticket.resolutionDeadline).getTime() < Date.now();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('tickets')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to tickets</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {ticket.ticketNumber}
          </span>
          {ticket.isDemo && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Demo Seed Record
            </span>
          )}
        </div>
      </div>

      {/* Main Ticket Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getStatusBadgeClass(
              ticket.status
            )}`}
          >
            {STATUS_LABELS[ticket.status]}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(
              ticket.priority
            )}`}
          >
            {PRIORITY_LABELS[ticket.priority]} Priority
          </span>
          {isOverdue && (
            <span className="text-xs px-2.5 py-0.5 rounded-full border bg-rose-100 text-rose-700 border-rose-300 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              SLA Overdue
            </span>
          )}
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543] tracking-tight mb-2">
          {ticket.title}
        </h2>

        <p className="text-xs text-slate-400 mb-6">
          Created on{' '}
          {new Date(ticket.createdAt).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        {/* Issue Description */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Issue Description
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-100 text-xs">
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Category
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {category?.name || 'General'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Location
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block truncate">
              {ticket.location}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Assigned Department
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {department?.name || 'Administration'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Target Resolution SLA
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {new Date(ticket.resolutionDeadline).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Impact
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {IMPACT_LABELS[ticket.impact]}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Urgency
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {URGENCY_LABELS[ticket.urgency]}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Reported By
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {ticket.requesterName}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Assigned Staff
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {ticket.assignedStaffName || 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Timeline & Status Update */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="font-display font-extrabold text-lg text-slate-800">
              Activity & Audit Timeline
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {histories.map((item, idx) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  •
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-slate-800">
                      {item.userDisplayName} ({item.userRole})
                    </span>
                    <span className="text-slate-400">changed status to</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                        item.toStatus
                      )}`}
                    >
                      {STATUS_LABELS[item.toStatus]}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-xs text-slate-600 mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-extrabold text-base text-slate-800">
                Update Ticket Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authorized role transitions according to campus SLA rules.
              </p>
            </div>

            {canUpdate ? (
              allowedStatuses.length > 0 ? (
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Next Status
                    </label>
                    <select
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value as TicketStatus)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">Select next status…</option>
                      {allowedStatuses.map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Resolution Note / Comment
                    </label>
                    <textarea
                      rows={3}
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      placeholder="Add technician note or reason for status update…"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!nextStatus}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save status change</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                  This ticket has reached its terminal status ({STATUS_LABELS[ticket.status]}). No further transitions are available.
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                <p className="font-bold mb-1">Role restriction</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Only assigned staff or administrators can update ticket status. Use the simulation switch in the topbar to test as <strong>IT Staff</strong> or <strong>Admin</strong>.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Every update is recorded with user identity and timestamp.
          </div>
        </div>
      </div>
    </div>
  );
};
