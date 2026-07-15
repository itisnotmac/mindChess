import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Brain, BookOpen, Target, User, Crown, MessageSquare, Settings } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';
import { SettingsProvider } from '@/lib/SettingsContext';
import SettingsDialog from '@/components/SettingsDialog';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/play', label: 'Play', icon: Gamepad2 },
  { to: '/tactics', label: 'Tactics', icon: Brain },
  { to: '/openings', label: 'Openings', icon: BookOpen },
  { to: '/endgames', label: 'Endgames', icon: Target },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/about', label: 'About', icon: Crown },
  { to: '/contact', label: 'Contact', icon: MessageSquare },
];

export default function Layout() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
  <SettingsProvider>
  <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-primary teal-text-glow" />
            <span className="text-2xl font-bold text-primary teal-text-glow">Chess Mind</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 ml-10 italic">Let's Chess!</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${active ? 'bg-primary/10 text-primary teal-glow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={() => setChatOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all teal-glow-sm font-medium">
            <MessageSquare className="w-5 h-5" />
            <span>Ask Coach</span>
          </button>
          <button onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-all mt-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex justify-around py-2 z-40">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center gap-1 px-2 py-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={() => setChatOpen(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center teal-glow z-40">
        <MessageSquare className="w-6 h-6" />
      </button>
      <button onClick={() => setSettingsOpen(true)}
        className="md:hidden fixed bottom-20 right-20 w-14 h-14 bg-card border border-border text-primary rounded-full flex items-center justify-center teal-glow-sm z-40">
        <Settings className="w-6 h-6" />
      </button>

      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
    </SettingsProvider>
  );
}