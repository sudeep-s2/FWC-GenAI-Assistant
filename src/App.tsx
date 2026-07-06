import { useState, useEffect, Suspense, lazy } from 'react';
import { LayoutDashboard, Users, Compass, ShieldAlert, Accessibility, Leaf, Sparkles } from 'lucide-react';
import CommandCenter from './components/dashboard/CommandCenter';
import { orchestrator } from './hooks/useAI';

// Lazy load other panels for better performance and lazy suspense testing
const CrowdPulse = lazy(() => import('./components/crowd/CrowdPulse'));
const FanJourneyAI = lazy(() => import('./components/fan/FanJourneyAI'));
const VolunteerCopilot = lazy(() => import('./components/volunteer/VolunteerCopilot'));
const AccessibilityGuardian = lazy(() => import('./components/accessibility/AccessibilityGuardian'));
const SustainabilityAI = lazy(() => import('./components/sustainability/SustainabilityAI'));

type TabType = 'dashboard' | 'crowd' | 'fan' | 'volunteer' | 'accessibility' | 'sustainability';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    // Dynamic runtime key retrieval from Google Cloud Run environment variable
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          orchestrator.setApiKey(data.apiKey);
        }
      })
      .catch(err => console.warn('Dynamic config API key loading failed: ', err));
  }, []);

  const navigation = [
    { id: 'dashboard', name: 'Command Center', icon: <LayoutDashboard size={18} /> },
    { id: 'crowd', name: 'CrowdPulse Risk', icon: <Users size={18} /> },
    { id: 'fan', name: 'FanJourney AI', icon: <Compass size={18} /> },
    { id: 'volunteer', name: 'Volunteer Copilot', icon: <ShieldAlert size={18} /> },
    { id: 'accessibility', name: 'ADA Guardian', icon: <Accessibility size={18} /> },
    { id: 'sustainability', name: 'Eco Optimizer', icon: <Leaf size={18} /> },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-stadium-950 text-slate-100">
      {/* Global Navbar */}
      <header className="sticky top-0 z-50 bg-stadium-900/80 backdrop-blur-md border-b border-stadium-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-xl shadow-lg shadow-gold-500/10">
              <Sparkles className="text-stadium-950 font-bold" size={20} />
            </div>
            <div>
              <span className="text-lg font-black font-display tracking-wider text-gradient-gold">StadiumOS AI</span>
              <span className="text-xs font-medium text-slate-500 block">FIFA World Cup 2026 Operations Twin</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gold-500 text-stadium-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-stadium-800/40'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile navigation indicator */}
      <div className="md:hidden bg-stadium-900 border-b border-stadium-800 p-2 flex overflow-x-auto gap-1">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === item.id
                ? 'bg-gold-500 text-stadium-950 font-extrabold'
                : 'text-slate-400 hover:bg-stadium-800/30'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" role="main">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gold-400 font-medium">Loading Operations Panel...</p>
            </div>
          }
        >
          {activeTab === 'dashboard' && <CommandCenter />}
          {activeTab === 'crowd' && <CrowdPulse />}
          {activeTab === 'fan' && <FanJourneyAI />}
          {activeTab === 'volunteer' && <VolunteerCopilot />}
          {activeTab === 'accessibility' && <AccessibilityGuardian />}
          {activeTab === 'sustainability' && <SustainabilityAI />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-stadium-950 border-t border-stadium-900 py-6 text-center text-xs text-slate-600">
        <p>© 2026 FIFA World Cup Operations Twin · StadiumOS AI · Grounded in Real-Time Twin Telemetry</p>
      </footer>
    </div>
  );
}

export default App;
