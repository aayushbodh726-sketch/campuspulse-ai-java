import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Repeat,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InsightsView: React.FC = () => {
  const { tickets, categories, recurringIssues, setActiveTab, setSelectedTicketId } = useApp();

  const total = tickets.length;
  const resolvedCount = tickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  ).length;

  const resolutionRate = total > 0 ? Math.round((resolvedCount * 100) / total) : 0;

  const nowTime = Date.now();
  const overdueCount = tickets.filter((t) => {
    if (t.status === 'RESOLVED' || t.status === 'CLOSED' || t.status === 'CANCELLED') return false;
    return new Date(t.resolutionDeadline).getTime() < nowTime;
  }).length;

  // Compute average resolution hours
  const resolvedTickets = tickets.filter((t) => t.resolvedAt);
  let avgResolutionHours = 36; // fallback default from demo
  if (resolvedTickets.length > 0) {
    const totalDurationHours = resolvedTickets.reduce((acc, t) => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.resolvedAt!).getTime();
      const diffHours = Math.max(1, (resolved - created) / (1000 * 3600));
      return acc + diffHours;
    }, 0);
    avgResolutionHours = Math.round(totalDurationHours / resolvedTickets.length);
  }

  // Category breakdown
  const categoryCounts = categories.map((cat) => {
    const count = tickets.filter((t) => t.categoryId === cat.id).length;
    const percentage = total > 0 ? Math.round((count * 100) / total) : 0;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count,
      percentage,
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
          Campus Intelligence
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543]">
          Campus Insights & Patterns
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Service analytics and recurring pattern detection to help teams implement lasting fixes.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg. resolution</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-800">
            {avgResolutionHours}h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">For resolved reports</div>
        </div>

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
          <div className="text-[11px] text-slate-400 mt-1">Needs staff follow-up</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolution rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600">
            {resolutionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Resolved vs total tickets</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-indigo-600">
            {categories.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active issue categories</div>
        </div>
      </div>

      {/* Two Columns: Category Breakdown & Intelligence Engine rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-800">
                Reports by category
              </h3>
              <p className="text-xs text-slate-400">Where campus service is requested</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {total} total
            </span>
          </div>

          <div className="space-y-4">
            {categoryCounts.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-800 font-semibold">{cat.name}</strong>
                  <span className="text-slate-500">
                    {cat.count} report{cat.count !== 1 ? 's' : ''} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.max(cat.count > 0 ? 5 : 0, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Engine Principles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-800">
                Campus Intelligence Rules
              </h3>
              <p className="text-xs text-slate-400">Explainable, reviewable campus policies</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Rules Engine
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-0.5">01 · Routing</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Each category routes to its responsible department (e.g. IT, Facilities, Housekeeping, Campus Administration).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-0.5">02 · Priority Suggestion</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Urgency and student impact determine the suggested level. Urgent safety issues automatically elevate to Critical.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-0.5">03 · Dynamic SLA Deadlines</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Target deadlines are computed automatically: Critical (4h), High (24h), Medium (72h), Low (120h).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-0.5">04 · 90-Day Pattern Detection</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Repeated reports of the same category and physical location within 90 days are flagged as recurring issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Issue Signals Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-blue-600" />
              <span>Recurring Issue Signals</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies locations where the same problem has been reported multiple times in the past 90 days.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {recurringIssues.length} Pattern{recurringIssues.length !== 1 ? 's' : ''} Detected
          </span>
        </div>

        {recurringIssues.length > 0 ? (
          <div className="divide-y divide-slate-100 mt-4">
            {recurringIssues.map((issue, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm mt-0.5">
                    ↻
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>{issue.categoryName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-blue-700">{issue.location}</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Latest report:{' '}
                        {new Date(issue.latestReport).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Tickets: {issue.ticketNumbers.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {issue.count} reports in 90 days
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('tickets');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1"
                  >
                    View tickets →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 mt-4">
            <p className="text-xs text-slate-500">
              No repeated locations detected yet. When multiple tickets share a category and location, the engine will surface them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
