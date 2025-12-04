import React from 'react';
import { StoryResponse } from '../types';
import { BookOpen, ExternalLink, CloudSun, CalendarDays, Wind, Sun, Umbrella, Activity, Droplets } from 'lucide-react';

interface StoryDisplayProps {
  story: StoryResponse | null;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  if (!story) return null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* subtle internal glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 blur-[50px] pointer-events-none"></div>

        {/* Info Banners */}
        <div className="flex flex-col md:flex-row border-b border-white/10">
          {/* Weather Context Banner */}
          {story.weatherDescription && (
            <div className={`bg-cyan-950/30 p-4 flex items-start gap-3 relative z-10 flex-1 ${story.forecast ? 'border-b md:border-b-0 md:border-r border-white/5' : ''}`}>
              <CloudSun className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Current Weather
                </h3>
                <p className="text-cyan-100 italic opacity-90 text-sm">{story.weatherDescription}</p>
              </div>
            </div>
          )}

          {/* Forecast Banner */}
          {story.forecast && (
            <div className="bg-violet-950/30 p-4 flex items-start gap-3 relative z-10 flex-1">
              <CalendarDays className="w-5 h-5 text-violet-400 mt-1 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
                  3-Day Outlook
                </h3>
                <p className="text-violet-100 italic opacity-90 text-sm">{story.forecast}</p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Layers Grid */}
        {story.layers && (
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10 relative z-10 bg-slate-950/20">
            {story.layers.airQuality && (
              <div className="p-3 border-r border-b md:border-b-0 border-white/5 flex flex-col items-center text-center">
                <Activity className="w-4 h-4 text-emerald-400 mb-2" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Air Quality</span>
                <span className="text-sm text-emerald-200 font-medium">{story.layers.airQuality}</span>
              </div>
            )}
            {story.layers.uvIndex && (
              <div className="p-3 border-r-0 md:border-r border-b md:border-b-0 border-white/5 flex flex-col items-center text-center">
                <Sun className="w-4 h-4 text-amber-400 mb-2" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">UV Index</span>
                <span className="text-sm text-amber-200 font-medium">{story.layers.uvIndex}</span>
              </div>
            )}
            {story.layers.wind && (
              <div className="p-3 border-r border-white/5 flex flex-col items-center text-center">
                <Wind className="w-4 h-4 text-blue-400 mb-2" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Wind</span>
                <span className="text-sm text-blue-200 font-medium">{story.layers.wind}</span>
              </div>
            )}
            {story.layers.rainChance && (
              <div className="p-3 flex flex-col items-center text-center">
                <Umbrella className="w-4 h-4 text-indigo-400 mb-2" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Rain Chance</span>
                <span className="text-sm text-indigo-200 font-medium">{story.layers.rainChance}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-8 md:p-12 relative z-10">
          {/* Decorative Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-slate-800/80 rounded-full border border-white/5 ring-1 ring-white/10 shadow-lg shadow-fuchsia-900/20">
              <BookOpen className="w-8 h-8 text-fuchsia-400" />
            </div>
          </div>

          {/* Story Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            {story.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? (
                <p key={idx} className="font-serif leading-relaxed text-slate-200 mb-4 text-lg">
                  {paragraph}
                </p>
              ) : <br key={idx} />
            ))}
          </div>
        </div>

        {/* Footer / Sources */}
        {story.sources.length > 0 && (
          <div className="bg-slate-950/40 p-6 border-t border-white/5 relative z-10">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Weather Data Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {story.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                >
                  {source.title}
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};