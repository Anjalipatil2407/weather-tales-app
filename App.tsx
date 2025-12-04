import React, { useState } from 'react';
import { CloudRain, Wind, AlertCircle } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { StoryDisplay } from './components/StoryDisplay';
import { generateWeatherStory } from './services/geminiService';
import { StoryRequest, StoryResponse } from './types';

function App() {
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: StoryRequest) => {
    setLoading(true);
    setError(null);
    setStory(null);
    try {
      const result = await generateWeatherStory(request);
      setStory(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while contacting the muses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0c] selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      
      {/* Vibrant Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-3 text-cyan-400 mb-2">
            <Wind className="w-6 h-6 animate-pulse" />
            <CloudRain className="w-6 h-6 animate-bounce delay-150 text-fuchsia-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 font-serif pb-2">
            Weather Tales
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto font-light">
            Your weather, your story.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 mx-auto mt-6 rounded-full" />
        </header>

        {/* Main Content */}
        <main className="w-full space-y-12">
          
          <InputForm onSubmit={handleGenerate} isLoading={loading} />

          {error && (
            <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-red-200 animate-in fade-in zoom-in-95 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <p>{error}</p>
            </div>
          )}

          <div id="story-container">
            <StoryDisplay story={story} />
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-auto pt-20 pb-6 text-center text-slate-500 text-sm">
          <p>Powered by Google Gemini &bull; Built with React & Tailwind</p>
        </footer>
      </div>
    </div>
  );
}

export default App;