import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  ShieldAlert,
  Building,
  MapPin,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TicketImpact, TicketUrgency } from '../types';
import {
  calculateDeadline,
  getDeadlineHours,
  getPriorityBadgeClass,
  IMPACT_LABELS,
  PRIORITY_LABELS,
  suggestPriority,
  URGENCY_LABELS,
} from '../services/ticketPolicy';

const COMMON_LOCATIONS = [
  'Block B · Computer Lab',
  'Academic Block · Room 204',
  'Hostel Block A · Ground Floor',
  'Student Centre · First Floor',
  'Central Library · 2nd Floor',
  'Main Auditorium',
  'Sports Complex & Gym',
  'Cafeteria Main Hall',
];

export const NewTicketView: React.FC = () => {
  const { categories, departments, createTicket, setActiveTab, setSelectedTicketId } = useApp();

  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [location, setLocation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [impact, setImpact] = useState<TicketImpact>('MANY');
  const [urgency, setUrgency] = useState<TicketUrgency>('SOON');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const assignedDept = departments.find((d) => d.id === selectedCategory?.departmentId);

  // Live priority & SLA calculation based on TicketPolicy rules
  const currentSuggestedPriority = selectedCategory
    ? suggestPriority(selectedCategory.slug, impact, urgency)
    : 'MEDIUM';
  const slaHours = getDeadlineHours(currentSuggestedPriority);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) {
      err.title = 'Title must be at least 5 characters long.';
    }
    if (!location.trim()) {
      err.location = 'Please specify where this issue is located on campus.';
    }
    if (!description.trim() || description.trim().length < 15) {
      err.description = 'Please provide at least 15 characters describing what happened.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newTicket = createTicket({
      categoryId: selectedCategory.id,
      location: location.trim(),
      title: title.trim(),
      description: description.trim(),
      impact,
      urgency,
    });

    setSelectedTicketId(newTicket.id);
    setActiveTab('ticket-detail');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
            Issue Submission
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#152543]">Report an issue</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit a campus concern to route it to the appropriate maintenance team.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Category & Department Auto-Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Automated Department Route
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 text-sm text-slate-700">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">{assignedDept?.name || 'Assigned Department'}</span>
              </div>
            </div>
          </div>

          {/* Location with quick suggestions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Specific Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                }}
                placeholder="e.g. Block B · Computer Lab, Room 204"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            {errors.location && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.location}
              </p>
            )}

            {/* Quick Location Pills */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Suggestions:</span>
              {COMMON_LOCATIONS.slice(0, 4).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Wi-Fi drops repeatedly during afternoon classes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Impact and Urgency Radio Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Who is affected? <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {(['INDIVIDUAL', 'SMALL_GROUP', 'MANY', 'CAMPUS'] as TicketImpact[]).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      impact === opt
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="impact"
                      value={opt}
                      checked={impact === opt}
                      onChange={() => setImpact(opt)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{IMPACT_LABELS[opt]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                How urgent is this? <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {(['ROUTINE', 'SOON', 'URGENT'] as TicketUrgency[]).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      urgency === opt
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt}
                      checked={urgency === opt}
                      onChange={() => setUrgency(opt)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{URGENCY_LABELS[opt]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/3000 chars</span>
            </div>
            <textarea
              rows={4}
              maxLength={3000}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="What happened? When did you notice it? Add useful context without sharing sensitive information."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Do not include passwords, government ID numbers, or unrelated private information.
            </p>
          </div>

          {/* Live Priority & Policy Prediction Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-800">Campus Intelligence Policy:</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getPriorityBadgeClass(
                    currentSuggestedPriority
                  )}`}
                >
                  Suggested {PRIORITY_LABELS[currentSuggestedPriority]} Priority
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Target SLA: {slaHours} hours
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CampusPulse calculates priority using category, urgency, and student impact. Critical
                safety issues receive immediate priority. Staff can review and verify in the management queue.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit report →</span>
          </button>
        </div>
      </form>
    </div>
  );
};
