import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Plus,
  ArrowUpDown,
  Calendar,
  MapPin,
  Building,
  User,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getPriorityBadgeClass,
  getStatusBadgeClass,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../services/ticketPolicy';
import { TicketPriority, TicketStatus } from '../types';

export const TicketsListView: React.FC = () => {
  const {
    currentUser,
    tickets,
    categories,
    departments,
    setActiveTab,
    setSelectedTicketId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [showAllForStudents, setShowAllForStudents] = useState(false);

  // Filter based on role permissions
  const baseTickets = tickets.filter((ticket) => {
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'STAFF') {
      return (
        ticket.departmentId === currentUser.departmentId ||
        ticket.assignedStaffId === currentUser.id
      );
    }
    // STUDENT: show their own tickets, or if student toggled "View all campus tickets"
    if (showAllForStudents) return true;
    return ticket.requesterId === currentUser.id;
  });

  const filteredTickets = baseTickets.filter((ticket) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = ticket.title.toLowerCase().includes(q);
      const matchNumber = ticket.ticketNumber.toLowerCase().includes(q);
      const matchLocation = ticket.location.toLowerCase().includes(q);
      const cat = categories.find((c) => c.id === ticket.categoryId);
      const matchCat = cat?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchNumber && !matchLocation && !matchCat) {
        return false;
      }
    }

    // Status filter
    if (selectedStatus !== 'ALL' && ticket.status !== selectedStatus) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL' && ticket.categoryId !== selectedCategory) {
      return false;
    }

    // Priority filter
    if (selectedPriority !== 'ALL' && ticket.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'General';
  };

  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveTab('ticket-detail');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedPriority !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
            Issue Tracker
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543]">
            {currentUser.role === 'STUDENT' && !showAllForStudents
              ? 'My tickets'
              : currentUser.role === 'STAFF'
              ? 'Department queue'
              : 'All campus tickets'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Search tickets, inspect status progressions, and open full SLA audit timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'STUDENT' && (
            <button
              onClick={() => setShowAllForStudents(!showAllForStudents)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            >
              {showAllForStudents ? 'Show only mine' : 'Show all campus'}
            </button>
          )}

          <button
            onClick={() => setActiveTab('new-ticket')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New ticket</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, location, category, or ticket ID…"
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="ALL">All Statuses</option>
              {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter tags & Reset */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Showing <strong className="text-slate-800">{filteredTickets.length}</strong> ticket{filteredTickets.length !== 1 ? 's' : ''}</span>
            {isFiltered && (
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Ticket</th>
                  <th className="py-3 px-4">Category & Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleOpenTicket(ticket.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-blue-600 group-hover:underline">
                          {ticket.ticketNumber}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5 group-hover:text-blue-600 transition-colors max-w-xs sm:max-w-md truncate">
                        {ticket.title}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">
                        {getCategoryName(ticket.categoryId)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{ticket.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border ${getPriorityBadgeClass(
                          ticket.priority
                        )}`}
                      >
                        {PRIORITY_LABELS[ticket.priority]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          ticket.status
                        )}`}
                      >
                        {STATUS_LABELS[ticket.status]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-semibold">{ticket.requesterName}</div>
                      <div className="text-[10px] text-slate-400">{ticket.requesterEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right text-slate-400 text-[11px]">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              🔍
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No matching tickets found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your search criteria or clear active filters.
            </p>
            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Security and privacy note */}
      <p className="text-[11px] text-slate-400 text-center">
        Ticket access is enforced according to role and assigned department in accordance with campus service policies.
      </p>
    </div>
  );
};
