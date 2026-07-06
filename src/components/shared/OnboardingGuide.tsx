import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, X, Play, BookOpen, Shield, Users } from 'lucide-react';

interface Step {
  title: string;
  icon: React.ReactNode;
  content: string;
}

const steps: Step[] = [
  {
    title: 'Welcome to StadiumOS AI',
    icon: <Play className="text-gold-500 w-10 h-10" />,
    content: 'Welcome to your FIFA World Cup 2026 AI Operations Twin. Let’s take a 30-second tour of our operational tools.'
  },
  {
    title: 'Command Center',
    icon: <BookOpen className="text-crowd-400 w-10 h-10" />,
    content: 'Get real-time digital twin statistics on attendance, crowd density, gate capacity flows, live incident reporting logs, and one-click scenarios.'
  },
  {
    title: 'CrowdPulse AI',
    icon: <Users className="text-red-400 w-10 h-10" />,
    content: 'Predict high density hazards, manage outer-gate buffer zones, and generate dynamic serpentine detours grounded in venue SOP safety regulations.'
  },
  {
    title: 'Fan Journey AI',
    icon: <ChevronRight className="text-gold-400 w-10 h-10" />,
    content: 'Create language-localized matchday itineraries specifying seat sections, entry gates, accessible elevators, and shuttle routes.'
  },
  {
    title: 'Volunteer Copilot',
    icon: <Shield className="text-sustain-400 w-10 h-10" />,
    content: 'Retrieve instant shift procedures and incident response checklists grounded in volunteer manuals and emergency protocols.'
  },
  {
    title: 'Accessibility Guardian',
    icon: <HelpCircle className="text-ai-400 w-10 h-10" />,
    content: 'Support disabled guests by generating ADA-compliant routing options utilizing ramps, lifts, and sensory quiet rooms.'
  },
  {
    title: 'Demo Mode Scenarios',
    icon: <Play className="text-emerald-500 w-10 h-10" />,
    content: 'Examine prepare-to-test scenarios (crowd surges, lost fans, ADA, spills, green targets) to trigger the live Gemini + RAG operations twin instantly.'
  }
];

const OnboardingGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const isCompleted = localStorage.getItem('stadiumos-onboarded');
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('stadiumos-onboarded', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stadium-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboard-title"
    >
      <div className="glass-card max-w-lg w-full p-6 relative border border-gold-500/30 glow-gold shadow-2xl flex flex-col">
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 cursor-pointer"
          aria-label="Skip onboarding guide"
        >
          <X size={18} />
        </button>

        {/* Indicator */}
        <div className="text-xs font-mono text-gold-400 mb-2">
          Step {currentStep + 1} of {steps.length}
        </div>

        {/* Step Icon & Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2.5 bg-stadium-900/60 rounded-xl border border-stadium-700/50 shadow-inner">
            {step.icon}
          </div>
          <h2 id="onboard-title" className="text-xl font-bold font-display text-gradient-gold">
            {step.title}
          </h2>
        </div>

        {/* Step Content */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {step.content}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-6" aria-hidden="true">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === currentStep ? 'w-6 bg-gold-500' : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={handleFinish}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium cursor-pointer"
          >
            Skip Guide
          </button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 border border-stadium-500/30 hover:border-stadium-400/40 text-xs font-bold rounded-lg text-slate-300 transition-all cursor-pointer"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-xs font-bold rounded-lg text-stadium-950 transition-all cursor-pointer shadow"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
