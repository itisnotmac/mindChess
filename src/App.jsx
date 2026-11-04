import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import PlayVsAI from '@/pages/PlayVsAI';
import Tactics from '@/pages/Tactics';
import Openings from '@/pages/Openings';
import EndgameLab from '@/pages/EndgameLab';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import GameLibrary from '@/pages/GameLibrary';
import GameDetail from '@/pages/GameDetail';
import AnalyzeGame from '@/pages/AnalyzeGame';
import LearningPath from '@/pages/LearningPath';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/play" element={<PlayVsAI />} />
            <Route path="/tactics" element={<Tactics />} />
            <Route path="/openings" element={<Openings />} />
            <Route path="/endgames" element={<EndgameLab />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/library" element={<GameLibrary />} />
            <Route path="/library/:id" element={<GameDetail />} />
            <Route path="/analyze" element={<AnalyzeGame />} />
            <Route path="/learn" element={<LearningPath />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App