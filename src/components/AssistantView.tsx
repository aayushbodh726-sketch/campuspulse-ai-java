import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  Shield,
  Clock,
  BookOpen,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const AssistantView: React.FC = () => {
  const { faqs, tickets, categories, departments } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am CampusPulse AI, your smart campus service guide. I can help you report issues accurately, explain how priorities and SLA deadlines are calculated, and show how tickets route to departments. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const findGroundedAnswer = (questionText: string): string => {
    const qLower = questionText.toLowerCase();

    // Check against verified FAQs
    for (const faq of faqs) {
      const fLower = faq.question.toLowerCase();
      if (
        qLower.includes(fLower) ||
        fLower.includes(qLower) ||
        (qLower.includes('how') && qLower.includes('report') && fLower.includes('report')) ||
        (qLower.includes('detail') && fLower.includes('detail')) ||
        (qLower.includes('priority') && fLower.includes('priority')) ||
        (qLower.includes('progress') && fLower.includes('progress')) ||
        (qLower.includes('recurring') && fLower.includes('recurring')) ||
        (qLower.includes('department') && fLower.includes('department'))
      ) {
        return faq.answer;
      }
    }

    if (qLower.includes('status') || qLower.includes('sla') || qLower.includes('deadline')) {
      return "Ticket resolution targets are determined by priority: Critical tickets have a 4-hour target SLA; High priority has 24 hours; Medium priority has 72 hours; and Low priority has 120 hours. When a ticket is updated to Resolved or Closed, its completion timestamp is audited.";
    }

    if (qLower.includes('safety') || qLower.includes('danger') || qLower.includes('emergency')) {
      return "Important: For immediate physical danger, medical emergencies, or live security threats, please contact campus security or local emergency services directly. CampusPulse is designed for operational and facility tracking.";
    }

    if (qLower.includes('department') || qLower.includes('it') || qLower.includes('wifi') || qLower.includes('wifi')) {
      return `Our campus has 4 active service departments:
1. IT Services: Handles Wi-Fi, lab equipment, and networking.
2. Facilities & Maintenance: Handles classroom projectors, electricity, hostel plumbing, and buildings.
3. Housekeeping: Handles cleaning, waste management, and sanitation.
4. Campus Administration: Handles general student services and campus safety.`;
    }

    if (qLower.includes('open') || qLower.includes('count') || qLower.includes('tickets')) {
      const open = tickets.filter(
        (t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED' && t.status !== 'CANCELLED'
      ).length;
      return `There are currently ${open} active open tickets being processed across campus departments. You can view them anytime in the "My tickets" tab.`;
    }

    // Default grounded guidance response
    return `CampusPulse AI operates on explainable campus policy rules. You can submit reports via the "Report an issue" tab, where your category, urgency, and student impact will determine priority and route to the correct team.

If you have specific questions about ticket status or campus facilities, try asking:
• "How do I report a campus issue?"
• "How is ticket priority calculated?"
• "What does in progress mean?"
• "What departments handle which issues?"`;
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Provide grounded response with natural typing delay
    setTimeout(() => {
      const answer = findGroundedAnswer(query);
      const assistantMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const suggestions = [
    'How do I report a campus issue?',
    'What details should I include in a report?',
    'How is ticket priority calculated?',
    'What does "in progress" mean?',
    'What departments handle which issues?',
    'How does recurring pattern detection work?',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-600">
          Campus Guide & Assistant
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#152543]">
          Ask CampusPulse AI
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Practical assistant grounded in verified university FAQ and campus resolution workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[600px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isAssistant
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isAssistant ? 'AI' : 'You'}
                  </div>

                  <div className={`max-w-[85%] ${isAssistant ? '' : 'text-right'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-bold text-slate-700">
                        {isAssistant ? 'CampusPulse AI' : 'You'}
                      </span>
                      <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-slate-50/90 text-slate-800 border border-slate-200/70 text-left'
                          : 'bg-blue-600 text-white text-left shadow-sm shadow-blue-500/20'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  AI
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-300"></span>
                  <span className="ml-1 text-slate-500 font-medium">Formulating grounded response…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask how to report an issue, SLA targets, priority rules…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar / Suggestions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-display font-extrabold text-sm">Suggested Questions</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click any question below to immediately ask the assistant:
            </p>

            <div className="space-y-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/70 hover:border-blue-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Grounded Knowledge</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              CampusPulse AI adheres to explainable university rules and never hallucinates policy or demands private credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
