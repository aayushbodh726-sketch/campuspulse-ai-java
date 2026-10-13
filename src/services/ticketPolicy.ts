import { TicketImpact, TicketPriority, TicketStatus, TicketUrgency } from '../types';

export const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  SUBMITTED: ['ACKNOWLEDGED', 'ASSIGNED', 'CANCELLED'],
  ACKNOWLEDGED: ['ASSIGNED', 'IN_PROGRESS', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'ASSIGNED', 'CANCELLED'],
  RESOLVED: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['ASSIGNED', 'IN_PROGRESS', 'CANCELLED'],
  CANCELLED: [],
};

export function suggestPriority(
  categorySlug: string,
  impact: TicketImpact,
  urgency: TicketUrgency
): TicketPriority {
  if (categorySlug === 'campus-safety' && urgency === 'URGENT') {
    return 'CRITICAL';
  }
  if (urgency === 'URGENT' || impact === 'CAMPUS' || impact === 'MANY') {
    return 'HIGH';
  }
  if (urgency === 'SOON' || impact === 'SMALL_GROUP') {
    return 'MEDIUM';
  }
  return 'LOW';
}

export function getDeadlineHours(priority: TicketPriority): number {
  switch (priority) {
    case 'CRITICAL':
      return 4;
    case 'HIGH':
      return 24;
    case 'MEDIUM':
      return 72;
    case 'LOW':
      return 120;
    default:
      return 72;
  }
}

export function calculateDeadline(priority: TicketPriority, baseDate: Date = new Date()): string {
  const hours = getDeadlineHours(priority);
  const deadline = new Date(baseDate.getTime() + hours * 60 * 60 * 1000);
  return deadline.toISOString();
}

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  const allowed = STATUS_TRANSITIONS[from] || [];
  return allowed.includes(to);
}

export function getAllowedTransitions(from: TicketStatus): TicketStatus[] {
  return STATUS_TRANSITIONS[from] || [];
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  SUBMITTED: 'Submitted',
  ACKNOWLEDGED: 'Acknowledged',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REOPENED: 'Reopened',
  CANCELLED: 'Cancelled',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const IMPACT_LABELS: Record<TicketImpact, string> = {
  INDIVIDUAL: 'Only me',
  SMALL_GROUP: 'A few students / small group',
  MANY: 'Many students / whole class',
  CAMPUS: 'Entire building or campus',
};

export const URGENCY_LABELS: Record<TicketUrgency, string> = {
  ROUTINE: 'Routine (whenever possible)',
  SOON: 'Soon (within a few days)',
  URGENT: 'Urgent (needs quick attention)',
};

export function getStatusBadgeClass(status: TicketStatus): string {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'ACKNOWLEDGED':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'ASSIGNED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'IN_PROGRESS':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CLOSED':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'REOPENED':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getPriorityBadgeClass(priority: TicketPriority): string {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
    case 'HIGH':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
    case 'MEDIUM':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'LOW':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
}
