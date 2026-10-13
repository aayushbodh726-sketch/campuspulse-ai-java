export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';

export type TicketImpact = 'INDIVIDUAL' | 'SMALL_GROUP' | 'MANY' | 'CAMPUS';

export type TicketUrgency = 'ROUTINE' | 'SOON' | 'URGENT';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TicketStatus =
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED'
  | 'CANCELLED';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  slug: string;
  departmentId: string;
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  userDisplayName: string;
  userRole: UserRole;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  note: string;
  createdAt: string;
}

export interface CampusTicket {
  id: string;
  ticketNumber: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  categoryId: string;
  departmentId: string;
  title: string;
  description: string;
  location: string;
  impact: TicketImpact;
  urgency: TicketUrgency;
  priority: TicketPriority;
  status: TicketStatus;
  resolutionDeadline: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  isDemo?: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface CampusNotice {
  id: string;
  title: string;
  body: string;
  category: string;
  publishedAt: string;
}

export interface CampusFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface RecurringIssue {
  categoryName: string;
  categorySlug: string;
  location: string;
  count: number;
  latestReport: string;
  ticketNumbers: string[];
}
