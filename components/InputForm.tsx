
import React, { useState } from 'react';
import { Genre, Mood, StoryRequest } from '../types';
import { MapPin, Sparkles, Feather } from 'lucide-react';
import { Button } from './Button';

interface InputFormProps {
  onSubmit: (data: StoryRequest) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState<Genre>(Genre.SIMPLE);
  const [mood, setMood] = useState<Mood>(Mood.WHIMSICAL);
  const [locLoading, setLocLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    onSubmit({ location, genre, mood });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocation(coords);
        setLocLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setLocLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Location Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-cyan-300 uppercase tracking-wider">
            Where are you?
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-cyan-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city, landmark, or coordinates..."
              className="block w-full pl-10 pr-12 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={handleGeolocation}
              disabled={locLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-500 hover:text-cyan-400 transition-colors"
              title="Use current location"
            >
              {locLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full" />
              ) : (
                <span className="text-xs font-medium px-2 py-1 bg-slate-800/80 rounded-md hover:bg-slate-700 text-cyan-200/80 border border-white/5">Auto</span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Genre Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-fuchsia-300 uppercase tracking-wider">
              Genre
            </label>
            <div className="relative">
              <Feather className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-500 pointer-events-none" />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="block w-full pl-9 pr-4 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 appearance-none cursor-pointer hover:bg-slate-900/80 transition-colors"
              >
                {Object.values(Genre).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-violet-300 uppercase tracking-wider">
              Mood
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500 pointer-events-none" />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="block w-full pl-9 pr-4 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 appearance-none cursor-pointer hover:bg-slate-900/80 transition-colors"
              >
                {Object.values(Mood).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full text-lg"
            icon={<Sparkles className="w-5 h-5" />}
          >
            Weave Story
          </Button>
        </div>
      </div>
    </form>
  );
};
