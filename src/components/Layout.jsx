import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Brain, BookOpen, Target, User, Crown, MessageSquare, Settings, Library, Microscope, GraduationCap, ChevronLeft, Menu as MenuIcon } from 'lucide-react';
import AIChatPanel from '@/components/AIChatPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsProvider } from '@/lib/SettingsContext';
import SettingsDialog from '@/components/SettingsDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const CORE_TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/play', label: 'Play', icon: Gamepad2 },
  { to: '/tactics', label: 'Tactics', icon: Brain },
  { to: '/profile', label: 'Profile', icon: User },
];

const SECONDARY = [
  { to: '/openings', label: 'Openings', icon: BookOpen },
  { to: '/endgames', label: 'Endgames', icon: Target },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/analyze', label: 'Analyze', icon: Microscope },
  { to: '/about', label: 'About', icon: Crown },
  { to: '/contact', label: 'Contact', icon: MessageSquare },
];

const SIDEBAR_ITEMS = [...CORE_TABS, ...SECONDARY];

function getRouteMeta(path) {
  if (path === '/') return { title: 'Chess Mind', back: false };
  if (path.startsWith('/library/')) return { title: 'Game', back: true };
  if (path.startsWith('/learn')) return { title: 'Learn', back: false };
  if (path.startsWith('/play')) return { title: 'Play', back: false };
  if (path.startsWith('/tactics')) return { title: 'Tactics', back: false };
  if (path.startsWith('/openings')) return { title: 'Openings', back: false };
  if (path.startsWith('/endgames')) return { title: 'Endgames', back: false };
  if (path.startsWith('/library')) return { title: 'Library', back: false };
  if (path.startsWith('/analyze')) return { title: 'Analyze', back: false };
  if (path.startsWith('/profile')) return { title: 'Profile', back: false };
  if (path.startsWith('/about')) return { title: 'About', back: false };
  if (path.startsWith('/contact')) return { title: 'Contact', back: false };
  return { title: 'Chess Mind', back: false };
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const meta = getRouteMeta(path);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
  <SettingsProvider>
  <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="md:hidden shrink-0 flex items-center justify-between px-3 py-2 bg-sidebar border-b border-sidebar-border" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}>
        <div className="flex items-center min-w-[44px]">
          {meta.back ? (
            <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center text-foreground rounded-lg hover:bg-secondary" aria-label="Back">
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : path === '/' ? (
            <Crown className="w-7 h-7 text-primary teal-text-glow ml-1" />
          ) : (
            <button onClick={() => setMenuOpen(true)} className="w-11 h-11 flex items-center justify-center text-muted-foreground rounded-lg hover:bg-secondary" aria-label="Menu">
              <MenuIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <h1 className="text-base font-bold text-foreground truncate text-center px-2">{meta.title}</h1>
        <div className="flex items-center gap-1 min-w-[88px] justify-end">
          <button onClick={() => setChatOpen(true)} className="w-11 h-11 flex items-center justify-center text-primary rounded-lg hover:bg-primary/10 teal-glow-sm" aria-label="Ask Coach">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => setSettingsOpen(true)} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-primary teal-text-glow" />
            <span className="text-2xl font-bold text-primary teal-text-glow">Chess Mind</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 ml-10 italic">Let's Chess!</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {SIDEBAR_ITEMS.map(item => {
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex justify-around z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.25rem)', paddingTop: '0.25rem' }}>
        {CORE_TABS.map(item => {
          const active = item.to === '/' ? path === '/' : path.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-2 flex-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar border-r border-sidebar-border p-4">
          <SheetHeader className="text-left">
            <SheetTitle className="text-primary">More</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 mt-4">
            {SECONDARY.map(item => {
              const active = path.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg min-h-[44px] ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
    </SettingsProvider>
  );
}