
import React, { useState, useEffect, useRef } from 'react';
import { PC_COMPONENTS, INITIAL_HEARTS } from './constants';
import { GameStage, EvaluationResult } from './types';
import SketchfabViewer from './components/SketchfabViewer';
import { evaluateAnswer } from './services/geminiService';

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg 
    className={`w-6 h-6 transition-all duration-300 ${filled ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'text-zinc-800 fill-zinc-900'}`} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(INITIAL_HEARTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<GameStage>(GameStage.INSPECTING);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [namingComplete, setNamingComplete] = useState(false);
  const [classifyingComplete, setClassifyingComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentComponent = PC_COMPONENTS[currentIndex];
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        handleVoiceInput(result);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setFeedback({ isCorrect: false, text: "MIC ERROR" });
        setTimeout(() => setFeedback(null), 2000);
      };
      recognitionRef.current = recognition;
    }
  }, [currentIndex, namingComplete, classifyingComplete]);

  const handleVoiceInput = async (text: string) => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    
    let context: 'name' | 'classification' | 'role';
    let actualValue: string;

    if (!namingComplete) {
      context = 'name';
      actualValue = currentComponent.name;
    } else if (!classifyingComplete) {
      context = 'classification';
      actualValue = currentComponent.classification;
    } else {
      context = 'role';
      actualValue = currentComponent.name;
    }
    
    const result: EvaluationResult = await evaluateAnswer(text, actualValue, context);
    setIsEvaluating(false);
    
    if (result.correct) {
      setFeedback({ isCorrect: true, text: `YES! ${result.reason.toUpperCase()}` });
      setScore(prev => prev + (showHint ? 50 : 100));
      setShowHint(false);
      
      setTimeout(() => {
        setFeedback(null);
        setTranscript('');
        if (!namingComplete) {
          setNamingComplete(true);
          setStage(GameStage.INSPECTING);
        } else if (!classifyingComplete) {
          setClassifyingComplete(true);
          setStage(GameStage.INSPECTING);
        } else {
          setStage(GameStage.NEXT_READY);
        }
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: `NO! ${result.reason.toUpperCase()}` });
      setHearts(prev => {
        const next = prev - 1;
        if (next <= 0) setStage(GameStage.GAME_OVER);
        return next;
      });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const nextComponent = () => {
    setFeedback(null);
    setTranscript('');
    setNamingComplete(false);
    setClassifyingComplete(false);
    setShowHint(false);
    setStage(GameStage.INSPECTING);
    setCurrentIndex(prev => (prev + 1) % PC_COMPONENTS.length);
  };

  const resetGame = () => {
    setScore(0);
    setHearts(INITIAL_HEARTS);
    setCurrentIndex(0);
    setStage(GameStage.INSPECTING);
    setTranscript('');
    setFeedback(null);
    setNamingComplete(false);
    setClassifyingComplete(false);
    setShowHint(false);
  };

  const startListening = () => {
    if (isListening || isEvaluating) return;
    setTranscript('');
    setFeedback(null);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn("Speech start error:", e);
    }
  };

  if (stage === GameStage.GAME_OVER) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white text-center p-10 fiesta-font">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <h1 className="text-8xl text-red-600 mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">GAME OVER</h1>
      <p className="text-3xl text-zinc-400 mb-12">FINAL NEURAL SCORE: {score}</p>
      <button 
        onClick={resetGame} 
        className="px-12 py-6 border-4 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all text-2xl uppercase btn-pulse-red rounded-2xl"
      >
        Restart System
      </button>
      <div className="absolute bottom-10 text-zinc-600 text-xl tracking-widest opacity-80 fiesta-font">
        brought to you by ASMAE KIRDI
      </div>
      <style>{`
        @keyframes pulse-ring-red {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .btn-pulse-red {
          animation: pulse-ring-red 2s infinite;
        }
      `}</style>
    </div>
  );

  const getSubHeaderText = () => {
    if (!namingComplete) return 'IDENTIFYING COMPONENT...';
    if (!classifyingComplete) return 'ANALYZING CATEGORY...';
    return 'DESCRIBING FUNCTION...';
  };

  const getStageHeader = () => {
    if (stage === GameStage.INSPECTING) return 'NEURAL SCAN';
    if (stage === GameStage.NAMING) return 'SAY THE NAME';
    if (stage === GameStage.CLASSIFYING) return 'SAY CATEGORY';
    if (stage === GameStage.ROLE) return 'SAY THE ROLE';
    return 'EXCELLENT!';
  };

  const getActionButtonText = () => {
    if (!namingComplete) return 'PROCESS NAME';
    if (!classifyingComplete) return 'PROCESS CATEGORY';
    return 'PROCESS ROLE';
  };

  return (
    <div className="relative h-screen w-screen bg-[#020202] fiesta-font overflow-hidden text-white">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="scanner-line" />

      {/* Sketchfab Viewport */}
      <div className="absolute inset-0 z-0 p-12 lg:p-24 flex items-center justify-center">
        <div className="w-full h-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-[0_0_80px_rgba(0,0,0,1)] bg-black">
          <SketchfabViewer modelId={currentComponent.sketchfabId} title={currentComponent.name} />
        </div>
      </div>

      {/* Interface Overlay */}
      <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-10">
        
        {/* Top Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col space-y-3">
            <div className="hud-border bg-black/60 px-6 py-4 rounded-2xl border-2 border-white/20 shadow-xl">
              <span className="text-zinc-500 text-xs block opacity-70">NEURAL SCORE</span>
              <span className="text-4xl text-cyan-400 tracking-tighter">{score}</span>
            </div>
            <div className="flex space-x-2 p-2 bg-black/40 rounded-full backdrop-blur-sm self-start">
              {[...Array(INITIAL_HEARTS)].map((_, i) => (
                <HeartIcon key={i} filled={i < hearts} />
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-10 text-center">
            <div className="hud-border bg-black/80 px-12 py-6 rounded-[2.5rem] border-2 border-white/10 min-w-[300px]">
              <h2 className="text-5xl text-white tracking-tight leading-none mb-1">
                {getStageHeader()}
              </h2>
              <p className="text-yellow-400 text-sm tracking-widest opacity-90">
                {getSubHeaderText()}
              </p>
            </div>
          </div>

          <div className="hud-border bg-black/60 px-6 py-4 rounded-2xl border-2 border-white/20 text-right">
             <span className="text-zinc-500 text-xs block opacity-70">ARCHIVE MODULE</span>
             <span className="text-3xl text-white">{currentIndex + 1} / {PC_COMPONENTS.length}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center pointer-events-auto mt-auto ml-auto mb-12">
          {showHint && (
            <div className="mb-6 max-w-sm bg-cyan-900/60 backdrop-blur-xl border-2 border-cyan-500/50 p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
               <p className="text-white text-lg leading-relaxed">{currentComponent.description}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            {stage === GameStage.INSPECTING ? (
              <button 
                onClick={() => {
                  if (!namingComplete) setStage(GameStage.NAMING);
                  else if (!classifyingComplete) setStage(GameStage.CLASSIFYING);
                  else setStage(GameStage.ROLE);
                }} 
                className="btn-pulse px-16 py-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-3xl transition-all shadow-2xl text-3xl border-b-8 border-cyan-800 active:translate-y-1 active:border-b-4"
              >
                {getActionButtonText()}
              </button>
            ) : stage === GameStage.NEXT_READY ? (
              <button 
                onClick={nextComponent} 
                className="px-20 py-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-2xl text-5xl transform hover:scale-105 border-b-8 border-emerald-800 active:translate-y-1 active:border-b-4 transition-all"
              >
                LOAD NEXT »
              </button>
            ) : (
              <div className="hud-border bg-black/90 p-8 rounded-[3rem] border-2 border-white/10 flex flex-col items-center shadow-2xl min-w-[350px]">
                <div className="flex w-full justify-between items-center mb-6 px-4">
                  <span className="text-cyan-400 text-xs tracking-widest animate-pulse">MIC ACTIVE</span>
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className={`text-xs px-4 py-1.5 rounded-full border-2 transition-all ${showHint ? 'bg-cyan-500 text-black border-cyan-500' : 'text-zinc-500 border-zinc-700'}`}
                  >
                    HINT
                  </button>
                </div>

                <button 
                  onClick={startListening} 
                  disabled={isEvaluating || isListening} 
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all border-4 ${isListening ? 'bg-rose-600/30 border-rose-500 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'bg-cyan-500/10 border-cyan-500 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]'}`}
                >
                  {isListening ? (
                    <div className="flex gap-1.5 items-center h-10">
                      <div className="w-1.5 bg-rose-400 animate-[pulse_0.8s_infinite] h-10 rounded-full" />
                      <div className="w-1.5 bg-rose-400 animate-[pulse_1s_infinite] h-6 rounded-full" />
                      <div className="w-1.5 bg-rose-400 animate-[pulse_0.9s_infinite] h-8 rounded-full" />
                    </div>
                  ) : (
                    <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 18.5V22m-4 0h8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="mt-8 text-center h-[3rem] flex items-center justify-center">
                  {isEvaluating ? (
                    <span className="text-cyan-400 animate-pulse text-lg">ANALYZING FREQUENCIES...</span>
                  ) : transcript ? (
                    <span className="text-white italic text-xl truncate max-w-[280px] block underline decoration-cyan-500/40 underline-offset-8">"{transcript}"</span>
                  ) : (
                    <span className="text-zinc-500 text-sm tracking-widest">TAP TO SPEAK</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pop-up Feedback */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {feedback && (
            <div className={`px-16 py-10 rounded-[2.5rem] border-4 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all animate-in zoom-in duration-300 ${feedback.isCorrect ? 'bg-emerald-500/30 border-emerald-500 text-emerald-400' : 'bg-rose-500/30 border-rose-500 text-rose-400'}`}>
              <p className="text-6xl text-center drop-shadow-lg">{feedback.text}</p>
            </div>
          )}
        </div>

        {/* Credits */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto text-zinc-500 text-xl tracking-[0.1em] opacity-80 fiesta-font hover:text-cyan-400 transition-colors cursor-default drop-shadow-sm">
          brought to you by MOHAMED ZOUAOUI
        </div>
      </div>

      <div className="absolute bottom-6 left-8 opacity-20 pointer-events-none mono text-[10px]">
        SKETCHFAB_LINK_v3.2_STABLE
      </div>
    </div>
  );
};

export default App;
