import React, { useState, useCallback, useRef, useEffect } from 'react';
import { fetchSuggestions, fetchFrameworkGuidance, fetchFinalSolution } from './services/geminiService';
import type {
  AIResponse,
  Framework,
  FrameworkGuidance,
  FinalSolution,
  Answer,
  Playbook,
  FiveWhys,
} from './types';
import Card from './components/Card';
import Loader from './components/Loader';
import FrameworkGuidanceComponent from './components/FrameworkGuidance';
import FinalSolutionComponent from './components/FinalSolution';
import SessionsPanel from './components/SessionsPanel';
import { supabase } from './services/supabaseClient';

import LightBulbIcon from './components/icons/LightBulbIcon';
import InfoIcon from './components/icons/InfoIcon';
import GridIcon from './components/icons/GridIcon';
import BrainIcon from './components/icons/BrainIcon';
import TargetIcon from './components/icons/TargetIcon';
import PlaybooksPanel from './components/PlaybooksPanel';
import { playbooks } from './data/playbooks';
import Stepper from './components/Stepper';
import UploadIcon from './components/icons/UploadIcon';
import InputQualityMeter from './components/InputQualityMeter';
import SuggestionsDashboard from './components/SuggestionsDashboard';
import ProblemComplexityScorer from './components/ProblemComplexityScorer';
import Tour from './components/Tour';
import { fetchAISuggestedSolutions } from './services/geminiService';
import AISuggestions from './components/AISuggestions';
import type { AISuggestedSolution } from './types';

const problemPlaceholders = [
  "e.g., Our B2B SaaS startup is struggling with a high customer churn rate, especially within the first 3 months...",
  "e.g., We need to develop a go-to-market strategy for a new sustainable fashion brand targeting millennials...",
  "e.g., How can our non-profit organization increase volunteer engagement and attract more donations online?",
  "e.g., Our e-commerce site has high traffic but a low conversion rate. We need to optimize the user journey...",
  "e.g., As a traditional retail business, we need a digital transformation roadmap to stay competitive..."
];

interface SavedSession {
  id: number;
  name: string;
}

// Helper component for drawing vertical arrows
const ArrowDown: React.FC = () => (
  <div className="flex justify-center items-center my-4">
    <svg width="24" height="48" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0V46M12 46L6 40M12 46L18 40" stroke="#CBD5E1" strokeWidth="2"/>
    </svg>
  </div>
);

// Helper component for drawing horizontal arrows
const ArrowRight: React.FC = () => (
  <div className="flex justify-center items-center w-16 mx-4 shrink-0">
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12H46M46 12L40 6M46 12L40 18" stroke="#CBD5E1" strokeWidth="2"/>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [problem, setProblem] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [placeholder, setPlaceholder] = useState(problemPlaceholders[0]);
  const [showLandingPage, setShowLandingPage] = useState(true);
  
  const steps = [
    "Definizione del Problema",
    "Suggerimenti Iniziali AI",
    "Guida tramite Framework",
    "Soluzione Finale"
  ];
  
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [frameworkGuidance, setFrameworkGuidance] = useState<FrameworkGuidance | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState<boolean>(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  const guidanceRef = useRef<HTMLDivElement>(null);

  const [finalSolution, setFinalSolution] = useState<FinalSolution | null>(null);
  const [isSolutionLoading, setIsSolutionLoading] = useState<boolean>(false);
  const [solutionError, setSolutionError] = useState<string | null>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [aiSuggestedSolutions, setAiSuggestedSolutions] = useState<AISuggestedSolution[] | null>(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const [runTour, setRunTour] = useState(false);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  const tourSteps = [
    {
      target: 'body',
      content: 'Welcome to the AI Problem-Solving Facilitator! This guided tour will show you the key features of the application.',
      placement: 'center' as const,
    },
    {
      target: '#problem-definition',
      content: 'Start here by clearly defining your problem. Be specific and detailed - the more context you provide, the better the AI can help you.',
    },
    {
      target: '#playbooks-panel',
      content: 'Need a quick start? Choose from our pre-built playbooks for common business scenarios like cost reduction, digital transformation, or ESG strategy.',
    },
    {
      target: '#generate-suggestions',
      content: 'Once you\'ve defined your problem, click here to get AI-powered strategic analysis and framework recommendations.',
    },
    {
      target: '#sessions-panel',
      content: 'Access all your saved sessions here. You can load previous work or delete old sessions to keep organized.',
    },
    {
      target: 'body',
      content: 'Great! You\'re ready to start. The AI will guide you through the rest of the process as you progress. You can always click "Start Tour" again for a refresher.',
      placement: 'center' as const,
    }
  ];

  useEffect(() => {
    if (runTour) {
      // Try to play audio, but don't fail if it doesn't work
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log("Audio playback not available (this is normal in some browsers):", error);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [runTour]);

  useEffect(() => {
    const tourHasRun = localStorage.getItem('tourHasRun');
    if (!tourHasRun) {
      setRunTour(true);
      localStorage.setItem('tourHasRun', 'true');
    }
  }, []);

  const handleJoyrideCallback = (data: { status: string }) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };
  
  const handleStartTour = () => {
    setRunTour(true);
  };

  const handleGetStarted = () => {
    setShowLandingPage(false);
    // Scroll to top after transition
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    // Cycle through placeholders only if the user hasn't started typing
    if (problem) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % problemPlaceholders.length;
      setPlaceholder(problemPlaceholders[currentIndex]);
    }, 3000); // Change placeholder every 3 seconds

    return () => clearInterval(interval);
  }, [problem]);

  const handleSelectPlaybook = (playbook: Playbook) => {
    // Pre-compila Problem e Context con contenuti dal playbook per avviare rapidamente
    setProblem(playbook.objective);
    setContext(playbook.context);

    // Scorri verso il form per concentrare l'attenzione
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('id, name')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      alert('Could not fetch sessions.');
    } else {
      setSavedSessions(data || []);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (frameworkGuidance) {
      setAnswers(frameworkGuidance.keyQuestions.map(q => ({ question: q, answer: '' })));
    } else {
      setAnswers([]);
    }
  }, [frameworkGuidance]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleLoadExample = () => {
    setProblem('Customers are leaving our service after the first month');
    setContext('SaaS startup, B2C, 10,000 active users, team of 5');
  };

  const handleSaveSession = async () => {
    const sessionName = prompt('Enter a name for this session:', `Session ${new Date().toLocaleTimeString()}`);
    if (!sessionName) return;

    const sessionContent = {
      problem,
      context,
      aiResponse,
      activeFramework,
      frameworkGuidance,
      answers,
      finalSolution,
    };
    
    const { error } = await supabase
      .from('sessions')
      .insert({ name: sessionName, content: sessionContent });

    if (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session.');
    } else {
      alert(`Session "${sessionName}" saved!`);
      loadSessions();
    }
  };

  const handleLoadSession = async (sessionId: number) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('content')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error loading session:', error);
      alert('Failed to load session.');
    } else if (data) {
      const state = data.content;
      setProblem(state.problem || '');
      setContext(state.context || '');
      setAiResponse(state.aiResponse || null);
      setActiveFramework(state.activeFramework || null);
      setFrameworkGuidance(state.frameworkGuidance || null);
      setAnswers(state.answers || []);
      setFinalSolution(state.finalSolution || null);
      
      if (state.finalSolution) {
        setCurrentStep(4);
      } else if (state.frameworkGuidance) {
        setCurrentStep(3);
      } else if (state.aiResponse) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }

       // Scroll to top to see the loaded state
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('text/')) {
        alert('Please upload a text file (e.g., .txt, .md).');
        return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size exceeds 1MB limit.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        setContext(text);
    };
    reader.onerror = (e) => {
        console.error("Error reading file:", e);
        alert("Failed to read the file.");
    }
    reader.readAsText(file);
    
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const handleDeleteSession = async (sessionId: number) => {
    const sessionToDelete = savedSessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    if (confirm(`Are you sure you want to delete session "${sessionToDelete.name}"?`)) {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session.');
      } else {
        loadSessions();
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!problem || !context) {
      setError('Please fill in both the Problem and Context fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setActiveFramework(null);
    setFrameworkGuidance(null);
    setGuidanceError(null);
    setFinalSolution(null);
    setSolutionError(null);
    setCurrentStep(1);

    try {
      const response = await fetchSuggestions(problem, context);
      setAiResponse(response);
      setCurrentStep(2);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  }, [problem, context]);

  const handleFrameworkSelect = useCallback(async (frameworkName: string) => {
    if (frameworkName === activeFramework || isGuidanceLoading) return;

    const selectedFrameworkObject = aiResponse?.recommendedFrameworks.find(f => f.name === frameworkName);
    if (!selectedFrameworkObject) {
        console.error(`Framework "${frameworkName}" not found.`);
        setGuidanceError(`An error occurred. The selected framework could not be found.`);
        return;
    }
    
    setActiveFramework(frameworkName);
    setIsGuidanceLoading(true);
    setGuidanceError(null);
    setFrameworkGuidance(null);
    setFinalSolution(null);
    setSolutionError(null);
    setCurrentStep(2);
    
    setTimeout(() => {
        guidanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const guidance = await fetchFrameworkGuidance(problem, context, selectedFrameworkObject);
      setFrameworkGuidance(guidance);
      setCurrentStep(3);
    } catch(e: unknown) {
      if (e instanceof Error) {
        setGuidanceError(e.message);
      } else {
        setGuidanceError('An unknown error occurred while fetching guidance.');
      }
      setCurrentStep(2);
    } finally {
      setIsGuidanceLoading(false);
    }
  }, [problem, context, activeFramework, isGuidanceLoading, aiResponse]);

  const handleGenerateSolution = useCallback(async (answers: Answer[]) => {
      if (!activeFramework) return;

      setIsSolutionLoading(true);
      setSolutionError(null);
      setFinalSolution(null);
      setCurrentStep(3);

      setTimeout(() => {
          solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      try {
          const solution = await fetchFinalSolution(problem, context, activeFramework, answers);
          setFinalSolution(solution);
          setCurrentStep(4);
      } catch (e: unknown) {
          if (e instanceof Error) {
              setSolutionError(e.message);
          } else {
              setSolutionError('An unknown error occurred while generating the solution.');
          }
          setCurrentStep(3);
      } finally {
          setIsSolutionLoading(false);
      }
  }, [problem, context, activeFramework]);

  const handleFetchAISuggestions = useCallback(async () => {
    if (!finalSolution) return;
    
    setIsSuggestionsLoading(true);
    setSuggestionsError(null);
    setAiSuggestedSolutions(null);

    try {
      const suggestions = await fetchAISuggestedSolutions(problem, context, finalSolution);
      setAiSuggestedSolutions(suggestions);
    } catch (e) {
      if (e instanceof Error) {
        setSuggestionsError(e.message);
      } else {
        setSuggestionsError('An unknown error occurred while fetching AI suggestions.');
      }
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, [problem, context, finalSolution]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col items-center p-4 sm:p-8">
       <audio ref={audioRef} src="/tour.mp3" preload="auto" loop onError={(e) => console.log("Audio file not found:", e)} />
      <div className="w-full max-w-7xl mx-auto">
        
        {showLandingPage ? (
          // Landing Page
          <div className="min-h-screen flex flex-col justify-center items-center text-center animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="mb-12">
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-6">
                  AI Problem-Solving
                  <span className="block text-blue-600">Facilitator</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Transform complex business challenges into actionable solutions with AI-powered strategic frameworks
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <BrainIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-600">Get intelligent insights and strategic recommendations tailored to your specific problem</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <TargetIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Proven Frameworks</h3>
                  <p className="text-gray-600">Follow industry-standard methodologies like 5 Whys, SWOT Analysis, and more</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <GridIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Actionable Results</h3>
                  <p className="text-gray-600">Receive concrete implementation plans with KPIs and risk mitigation strategies</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mb-8">
                <button
                  onClick={handleGetStarted}
                  className="px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Start Solving Your Problem →
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="text-sm text-gray-500">
                <p>Trusted by business professionals worldwide</p>
                <p className="mt-2">No registration required • Free to use</p>
              </div>
            </div>
          </div>
        ) : (
          // Main Application
          <>
            <header className="text-center mb-12 relative">
              <div className="inline-block">
                 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">AI Problem-Solving Facilitator</h1>
              </div>
              <button
                onClick={handleStartTour}
                className="absolute top-1/2 right-0 -translate-y-1/2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 hover:bg-blue-200 transition-all text-sm transform hover:scale-105 active:scale-95"
                title="Start a tour of the application"
              >
                Start Tour
              </button>
            </header>

            <Stepper steps={steps} currentStep={currentStep} />

            <Tour run={runTour} steps={tourSteps} handleJoyrideCallback={handleJoyrideCallback} />

            <main className="flex flex-col items-center w-full">
              {/* Playbooks Section */}
              <div id="playbooks-panel">
                <PlaybooksPanel playbooks={playbooks} onSelectPlaybook={handleSelectPlaybook} />
              </div>
              
              <div className="w-full text-center mb-8 animate-fade-in-up" id="problem-definition">
                <h2 className="text-2xl font-bold text-gray-800">Fase 1: Definisci il Tuo Problema</h2>
                <p className="text-md text-gray-600 mt-2 max-w-3xl mx-auto">
                  Inizia descrivendo il problema centrale e fornendo il contesto rilevante. Questo aiuterà l'AI a comprendere a fondo la tua situazione e a generare suggerimenti pertinenti.
                </p>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Problem" icon={<LightBulbIcon />}>
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-32 p-3 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                  <InputQualityMeter text={problem} wordGoal={40} />
                </Card>
                <Card 
                  title="Context" 
                  icon={<InfoIcon />}
                  headerAction={
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".txt,.md,.text"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 font-semibold rounded-lg border border-gray-200 hover:bg-gray-200 transition-all text-sm transform hover:scale-105 active:scale-95"
                        title="Upload a text file for context"
                      >
                        <UploadIcon />
                        Upload File
                      </button>
                    </>
                  }
                >
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Provide relevant context (e.g., industry, company size, target audience)..."
                    className="w-full h-32 p-3 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                  <InputQualityMeter text={context} wordGoal={30} />
                </Card>
              </div>
              
              <div className="flex items-center justify-center gap-4 my-8" id="generate-suggestions">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? 'Thinking...' : 'Generate Suggestions'}
                </button>
                <button
                  onClick={handleLoadExample}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Try an example
                </button>
              </div>
              
              {isLoading && <Loader />}
              {error && <div className="text-red-500 bg-red-100 border border-red-200 p-4 rounded-md w-full max-w-2xl text-center animate-fade-in-up">{error}</div>}

              {aiResponse && (
                <div className="w-full flex flex-col items-center animate-fade-in-up">
                    <ArrowDown />
                    <div className="w-full text-center my-8 animate-fade-in-up">
                      <h2 className="text-2xl font-bold text-gray-800">Fase 2: Analizza i Suggerimenti Iniziali</h2>
                      <p className="text-md text-gray-600 mt-2 max-w-3xl mx-auto">
                        L'AI ha analizzato il tuo problema e ha generato una strategia, degli obiettivi e dei framework investigativi. Seleziona un framework per continuare.
                      </p>
                    </div>
                     <div className="w-full max-w-6xl" id="suggestions-dashboard">
                      <SuggestionsDashboard
                        aiResponse={aiResponse}
                        activeFramework={activeFramework}
                        isGuidanceLoading={isGuidanceLoading}
                        onFrameworkSelect={handleFrameworkSelect}
                      />
                    </div>
                </div>
              )}

                <div ref={guidanceRef} className="w-full mt-4">
                    {(isGuidanceLoading || guidanceError || frameworkGuidance) && (
                        <div className="flex flex-col items-center">
                            <ArrowDown />
                            {isGuidanceLoading && <Loader />}
                            {guidanceError && <div className="text-red-500 bg-red-100 border border-red-200 p-4 rounded-md w-full max-w-4xl text-center animate-fade-in-up">{guidanceError}</div>}
                            {frameworkGuidance && (
                                <div className="w-full max-w-4xl animate-fade-in-up" id="framework-guidance">
                                   <div className="w-full text-center my-8 animate-fade-in-up">
                                    <h2 className="text-2xl font-bold text-gray-800">Fase 3: Approfondisci con il Framework Scelto</h2>
                                    <p className="text-md text-gray-600 mt-2 max-w-3xl mx-auto">
                                      Rispondi alle domande chiave proposte dal framework. Le tue risposte guideranno l'AI nella formulazione della soluzione finale.
                                    </p>
                                  </div>
                                    <FrameworkGuidanceComponent 
                                        guidance={frameworkGuidance}
                                        answers={answers}
                                        onAnswerChange={handleAnswerChange}
                                        onGenerateSolution={handleGenerateSolution}
                                        isLoading={isSolutionLoading}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div ref={solutionRef} className="w-full mt-4">
                     {(isSolutionLoading || solutionError || finalSolution) && (
                        <div className="flex flex-col items-center">
                             <ArrowDown />
                             {isSolutionLoading && <Loader />}
                             {solutionError && <div className="text-red-500 bg-red-100 border border-red-200 p-4 rounded-md w-full max-w-4xl text-center animate-fade-in-up">{solutionError}</div>}
                             {finalSolution && (
                                <div className="w-full max-w-4xl animate-fade-in-up" id="final-solution">
                                    <div className="w-full text-center my-8 animate-fade-in-up">
                                      <h2 className="text-2xl font-bold text-gray-800">Fase 4: Implementa la Soluzione Finale</h2>
                                      <p className="text-md text-gray-600 mt-2 max-w-3xl mx-auto">
                                        Questa è la soluzione strategica generata sulla base delle tue risposte. Usala come guida per implementare i cambiamenti necessari.
                                      </p>
                                    </div>
                                    <FinalSolutionComponent solution={finalSolution} />
                                    <div className="w-full text-center mt-12" id="save-session">
                                        <button 
                                            onClick={handleSaveSession}
                                            className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 text-lg"
                                        >
                                            Save Session to Dashboard
                                        </button>
                                    </div>

                                    {!aiSuggestedSolutions && !isSuggestionsLoading && (
                                      <div className="w-full text-center mt-12" id="ai-recommendations">
                                        <button
                                          onClick={handleFetchAISuggestions}
                                          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
                                        >
                                          Get AI Recommendations
                                        </button>
                                      </div>
                                    )}

                                    {isSuggestionsLoading && <div className="mt-8"><Loader /></div>}
                                    {suggestionsError && <div className="text-red-500 bg-red-100 border border-red-200 p-4 rounded-md w-full max-w-4xl text-center animate-fade-in-up mt-8">{suggestionsError}</div>}
                                    {aiSuggestedSolutions && <AISuggestions suggestions={aiSuggestedSolutions} />}
                                </div>
                            )}
                        </div>
                     )}
                </div>
            </main>
            
            <div id="sessions-panel">
                <SessionsPanel 
                  sessions={savedSessions}
                  onLoadSession={handleLoadSession}
                  onDeleteSession={handleDeleteSession}
                />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
