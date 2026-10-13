import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppUser,
  CampusFaq,
  CampusNotice,
  CampusTicket,
  Department,
  RecurringIssue,
  TicketCategory,
  TicketHistory,
  TicketImpact,
  TicketStatus,
  TicketUrgency,
  UserRole,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_DEPARTMENTS,
  INITIAL_FAQS,
  INITIAL_HISTORIES,
  INITIAL_NOTICES,
  INITIAL_TICKETS,
  INITIAL_USERS,
} from '../data/initialData';
import { calculateDeadline, canTransition, suggestPriority } from '../services/ticketPolicy';

interface CreateTicketParams {
  categoryId: string;
  location: string;
  title: string;
  description: string;
  impact: TicketImpact;
  urgency: TicketUrgency;
}

interface AppContextType {
  currentUser: AppUser;
  users: AppUser[];
  departments: Department[];
  categories: TicketCategory[];
  tickets: CampusTicket[];
  ticketHistories: TicketHistory[];
  notices: CampusNotice[];
  faqs: CampusFaq[];
  activeTab: string;
  selectedTicketId: string | null;
  flashMessage: { type: 'success' | 'error'; text: string } | null;
  recurringIssues: RecurringIssue[];
  setActiveTab: (tab: string) => void;
  setSelectedTicketId: (id: string | null) => void;
  setFlashMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  switchUser: (userId: string) => void;
  loginAs: (email: string) => boolean;
  createTicket: (params: CreateTicketParams) => CampusTicket;
  updateTicketStatus: (ticketId: string, nextStatus: TicketStatus, note?: string) => boolean;
  updateUserRoleAndDept: (userId: string, role: UserRole, departmentId?: string) => void;
  createNotice: (title: string, body: string, category: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_PREFIX = 'campuspulse_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    loadFromStorage('currentUserId', 'user-student')
  );
  const [departments] = useState<Department[]>(() =>
    loadFromStorage('departments', INITIAL_DEPARTMENTS)
  );
  const [categories] = useState<TicketCategory[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [tickets, setTickets] = useState<CampusTicket[]>(() =>
    loadFromStorage('tickets', INITIAL_TICKETS)
  );
  const [ticketHistories, setTicketHistories] = useState<TicketHistory[]>(() =>
    loadFromStorage('histories', INITIAL_HISTORIES)
  );
  const [notices, setNotices] = useState<CampusNotice[]>(() =>
    loadFromStorage('notices', INITIAL_NOTICES)
  );
  const [faqs] = useState<CampusFaq[]>(() => loadFromStorage('faqs', INITIAL_FAQS));

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Sync state to localStorage
  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('currentUserId', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    saveToStorage('tickets', tickets);
  }, [tickets]);

  useEffect(() => {
    saveToStorage('histories', ticketHistories);
  }, [ticketHistories]);

  useEffect(() => {
    saveToStorage('notices', notices);
  }, [notices]);

  // Clear flash message after 5 seconds
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setFlashMessage({
        type: 'success',
        text: `Switched account to ${target.displayName} (${target.role})`,
      });
    }
  };

  const loginAs = (email: string): boolean => {
    const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUserId(target.id);
      setFlashMessage({
        type: 'success',
        text: `Signed in as ${target.displayName} (${target.role})`,
      });
      return true;
    }
    // Auto-create student if not exists
    const newUser: AppUser = {
      id: 'user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      role: 'STUDENT',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setFlashMessage({
      type: 'success',
      text: `Created and signed in as ${newUser.displayName} (STUDENT)`,
    });
    return true;
  };

  const createTicket = (params: CreateTicketParams): CampusTicket => {
    const category = categories.find((c) => c.id === params.categoryId) || categories[0];
    const priority = suggestPriority(category.slug, params.impact, params.urgency);
    const deadline = calculateDeadline(priority);
    const newId = 'ticket-' + Date.now();
    const ticketSeq = 1000 + tickets.length + 1;
    const ticketNumber = `CP-${ticketSeq}`;

    const newTicket: CampusTicket = {
      id: newId,
      ticketNumber,
      requesterId: currentUser.id,
      requesterName: currentUser.displayName,
      requesterEmail: currentUser.email,
      categoryId: category.id,
      departmentId: category.departmentId,
      title: params.title.trim(),
      description: params.description.trim(),
      location: params.location.trim(),
      impact: params.impact,
      urgency: params.urgency,
      priority,
      status: 'SUBMITTED',
      resolutionDeadline: deadline,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    const initialHistory: TicketHistory = {
      id: 'hist-' + Date.now(),
      ticketId: newId,
      userId: currentUser.id,
      userDisplayName: currentUser.displayName,
      userRole: currentUser.role,
      fromStatus: null,
      toStatus: 'SUBMITTED',
      note: 'Ticket submitted with priority ' + priority + ' (Target resolution: ' + deadline + ')',
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setTicketHistories((prev) => [initialHistory, ...prev]);
    setFlashMessage({
      type: 'success',
      text: `Ticket ${ticketNumber} submitted successfully! Suggested priority: ${priority}.`,
    });

    return newTicket;
  };

  const updateTicketStatus = (
    ticketId: string,
    nextStatus: TicketStatus,
    note?: string
  ): boolean => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return false;

    if (!canTransition(ticket.status, nextStatus)) {
      setFlashMessage({
        type: 'error',
        text: `Cannot transition status from ${ticket.status} to ${nextStatus}`,
      });
      return false;
    }

    const nowIso = new Date().toISOString();
    const updatedTicket: CampusTicket = {
      ...ticket,
      status: nextStatus,
      resolvedAt:
        nextStatus === 'RESOLVED' || nextStatus === 'CLOSED' ? nowIso : ticket.resolvedAt,
      assignedStaffId:
        currentUser.role === 'STAFF' && !ticket.assignedStaffId
          ? currentUser.id
          : ticket.assignedStaffId,
      assignedStaffName:
        currentUser.role === 'STAFF' && !ticket.assignedStaffName
          ? currentUser.displayName
          : ticket.assignedStaffName,
    };

    const historyEntry: TicketHistory = {
      id: 'hist-' + Date.now(),
      ticketId,
      userId: currentUser.id,
      userDisplayName: currentUser.displayName,
      userRole: currentUser.role,
      fromStatus: ticket.status,
      toStatus: nextStatus,
      note: note && note.trim().length > 0 ? note.trim() : `Status updated to ${nextStatus}`,
      createdAt: nowIso,
    };

    setTickets((prev) => prev.map((t) => (t.id === ticketId ? updatedTicket : t)));
    setTicketHistories((prev) => [historyEntry, ...prev]);
    setFlashMessage({
      type: 'success',
      text: `Status for ${ticket.ticketNumber} updated to ${nextStatus}.`,
    });

    return true;
  };

  const updateUserRoleAndDept = (userId: string, role: UserRole, departmentId?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role,
            departmentId: departmentId || undefined,
          };
        }
        return u;
      })
    );
    setFlashMessage({
      type: 'success',
      text: 'User permissions updated successfully.',
    });
  };

  const createNotice = (title: string, body: string, category: string) => {
    const newNotice: CampusNotice = {
      id: 'notice-' + Date.now(),
      title,
      body,
      category,
      publishedAt: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
    setFlashMessage({
      type: 'success',
      text: 'Campus notice published successfully.',
    });
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'users');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'tickets');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'histories');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notices');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'currentUserId');

    setUsers(INITIAL_USERS);
    setCurrentUserId('user-student');
    setTickets(INITIAL_TICKETS);
    setTicketHistories(INITIAL_HISTORIES);
    setNotices(INITIAL_NOTICES);
    setFlashMessage({
      type: 'success',
      text: 'Demo environment reset to initial seed state.',
    });
  };

  // Compute 90-day recurring issues: matching category and location with count >= 2
  const recurringIssues: RecurringIssue[] = React.useMemo(() => {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 3600 * 1000;
    const recentTickets = tickets.filter(
      (t) => new Date(t.createdAt).getTime() >= ninetyDaysAgo
    );

    const map = new Map<
      string,
      { categoryName: string; categorySlug: string; location: string; tickets: CampusTicket[] }
    >();

    for (const ticket of recentTickets) {
      const cat = categories.find((c) => c.id === ticket.categoryId);
      const catSlug = cat ? cat.slug : 'unknown';
      const catName = cat ? cat.name : 'General';
      const normLocation = ticket.location.trim().toLowerCase();
      const key = `${catSlug}:::${normLocation}`;

      if (!map.has(key)) {
        map.set(key, {
          categoryName: catName,
          categorySlug: catSlug,
          location: ticket.location.trim(),
          tickets: [ticket],
        });
      } else {
        map.get(key)!.tickets.push(ticket);
      }
    }

    const result: RecurringIssue[] = [];
    map.forEach((item) => {
      if (item.tickets.length >= 2) {
        const sorted = [...item.tickets].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        result.push({
          categoryName: item.categoryName,
          categorySlug: item.categorySlug,
          location: item.location,
          count: item.tickets.length,
          latestReport: sorted[0].createdAt,
          ticketNumbers: sorted.map((t) => t.ticketNumber),
        });
      }
    });

    return result.sort((a, b) => b.count - a.count);
  }, [tickets, categories]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        departments,
        categories,
        tickets,
        ticketHistories,
        notices,
        faqs,
        activeTab,
        selectedTicketId,
        flashMessage,
        recurringIssues,
        setActiveTab,
        setSelectedTicketId,
        setFlashMessage,
        switchUser,
        loginAs,
        createTicket,
        updateTicketStatus,
        updateUserRoleAndDept,
        createNotice,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
