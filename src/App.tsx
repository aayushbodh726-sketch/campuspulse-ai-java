import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewView } from './components/OverviewView';
import { NewTicketView } from './components/NewTicketView';
import { TicketsListView } from './components/TicketsListView';
import { TicketDetailView } from './components/TicketDetailView';
import { AssistantView } from './components/AssistantView';
import { InsightsView } from './components/InsightsView';
import { NoticesView } from './components/NoticesView';
import { AdminUsersView } from './components/AdminUsersView';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, flashMessage, setFlashMessage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'new-ticket':
        return 'Report an issue';
      case 'tickets':
        return 'My tickets';
      case 'ticket-detail':
        return 'Ticket details';
      case 'assistant':
        return 'Campus assistant';
      case 'insights':
        return 'Campus insights';
      case 'notices':
        return 'Campus notices';
      case 'admin':
        return 'Admin & access';
      default:
        return 'CampusPulse AI';
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'new-ticket':
        return <NewTicketView />;
      case 'tickets':
        return <TicketsListView />;
      case 'ticket-detail':
        return <TicketDetailView />;
      case 'assistant':
        return <AssistantView />;
      case 'insights':
        return <InsightsView />;
      case 'notices':
        return <NoticesView />;
      case 'admin':
        return <AdminUsersView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#152543] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <Topbar
          title={getPageTitle()}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Global Flash Alerts */}
        {flashMessage && (
          <div className="px-4 sm:px-8 pt-4">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs ${
                flashMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {flashMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{flashMessage.text}</span>
              </div>
              <button
                onClick={() => setFlashMessage(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary Page View Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>

        {/* Professional Footer — Zero Hatchable watermark */}
        <footer className="px-4 sm:px-8 py-5 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-400">
          <p>
            CampusPulse AI · Smart Campus Issue Reporting & Resolution · Operational Prototype
          </p>
        </footer>
      </div>

      {/* Auth & Role Switcher Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
