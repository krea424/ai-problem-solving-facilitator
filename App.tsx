import React, { useState, useCallback, useRef, useEffect } from 'react';
import { fetchSuggestions, fetchFrameworkGuidance, fetchFinalSolution } from './services/geminiService';
import type { AIResponse, FrameworkGuidance, FinalSolution, Answer } from './types';
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
import type { Playbook } from './types';

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

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  const handleSelectPlaybook = (playbook: Playbook) => {
    // Pre-compila Problem e Context con contenuti dal playbook per avviare rapidamente
    setProblem(playbook.objective);
    setContext(`${playbook.sector} • ${playbook.problemCategory} • ${playbook.name}`);

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
       // Scroll to top to see the loaded state
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

    try {
      const response = await fetchSuggestions(problem, context);
      setAiResponse(response);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [problem, context]);

  const handleFrameworkSelect = useCallback(async (framework: string) => {
    if (framework === activeFramework || isGuidanceLoading) return;
    
    setActiveFramework(framework);
    setIsGuidanceLoading(true);
    setGuidanceError(null);
    setFrameworkGuidance(null);
    setFinalSolution(null);
    setSolutionError(null);
    
    setTimeout(() => {
        guidanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const guidance = await fetchFrameworkGuidance(problem, context, framework);
      setFrameworkGuidance(guidance);
    } catch(e: unknown) {
      if (e instanceof Error) {
        setGuidanceError(e.message);
      } else {
        setGuidanceError('An unknown error occurred while fetching guidance.');
      }
    } finally {
      setIsGuidanceLoading(false);
    }
  }, [problem, context, activeFramework, isGuidanceLoading]);

  const handleGenerateSolution = useCallback(async (answers: Answer[]) => {
      if (!activeFramework) return;

      setIsSolutionLoading(true);
      setSolutionError(null);
      setFinalSolution(null);

      setTimeout(() => {
          solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      try {
          const solution = await fetchFinalSolution(problem, context, activeFramework, answers);
          setFinalSolution(solution);
      } catch (e: unknown) {
          if (e instanceof Error) {
              setSolutionError(e.message);
          } else {
              setSolutionError('An unknown error occurred while generating the solution.');
          }
      } finally {
          setIsSolutionLoading(false);
      }
  }, [problem, context, activeFramework]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        
        <header className="text-center mb-12">
          <div className="inline-block">
             <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">AI Problem-Solving Facilitator</h1>
          </div>
        </header>

        <main className="flex flex-col items-center w-full">
          {/* Playbooks Section */}
          <PlaybooksPanel playbooks={playbooks} onSelectPlaybook={handleSelectPlaybook} />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Problem" icon={<LightBulbIcon />}>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the core problem you're facing..."
                className="w-full h-32 p-3 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </Card>
            <Card title="Context" icon={<InfoIcon />}>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide relevant context (e.g., industry, company size, target audience)..."
                className="w-full h-32 p-3 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </Card>
          </div>
          
          <div className="flex items-center justify-center gap-4 my-8">
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
                <div className="relative w-full">
                    <div className="absolute top-0 right-0">
                        <button 
                            onClick={handleSaveSession}
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Save Session
                        </button>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-8">
                        <div className="w-full lg:w-1/2">
                            <Card title="Suggested Frameworks" icon={<GridIcon />} className="h-full">
                                <p className="text-sm text-gray-500 mb-4">Select a framework to get an actionable guide.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {aiResponse.suggestedFrameworks.map((framework) => {
                                        const isActive = framework === activeFramework;
                                        return (
                                            <button 
                                                key={framework} 
                                                onClick={() => handleFrameworkSelect(framework)}
                                                disabled={isGuidanceLoading}
                                                className={`
                                                    text-center py-3 px-2 rounded-md font-medium shadow-sm 
                                                    flex items-center justify-center transition-all duration-200 transform
                                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-400
                                                    disabled:cursor-wait
                                                    ${isActive 
                                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-1'
                                                    }
                                                    ${activeFramework && !isActive ? 'opacity-60 hover:opacity-100' : ''}
                                                    ${isGuidanceLoading && !isActive ? 'opacity-50' : ''}
                                                `}
                                            >
                                                {framework}
                                            </button>
                                        )
                                    })}
                                </div>
                            </Card>
                        </div>
                        <div className="hidden lg:flex items-center self-center h-full"><ArrowRight /></div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-8">
                            <Card title="Master Strategy" icon={<BrainIcon />}>
                                <ul className="space-y-3">
                                    {aiResponse.masterStrategy.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-500 mr-3 mt-1">&#8594;</span>
                                        <span>{item}</span>
                                    </li>
                                    ))}
                                </ul>
                            </Card>
                            <ArrowDown />
                            <Card title="Final Goal" icon={<TargetIcon />}>
                                <p className="text-lg text-green-600 font-medium">{aiResponse.finalGoal}</p>
                            </Card>
                        </div>
                    </div>
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
                            <div className="w-full max-w-4xl animate-fade-in-up">
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
                            <div className="w-full max-w-4xl animate-fade-in-up">
                                <FinalSolutionComponent solution={finalSolution} />
                            </div>
                        )}
                    </div>
                 )}
            </div>
        </main>
        
        <SessionsPanel 
          sessions={savedSessions}
          onLoadSession={handleLoadSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </div>
  );
};

export default App;
