import React, { useState, useEffect } from 'react';
import { Shot } from '../types';
import { Clock, Play, Pause, RotateCcw, CheckCircle2, Music, Volume2, Film } from 'lucide-react';
import { MediaDisplay } from '../components/MediaDisplay';

interface AnimaticViewProps {
  shots: Shot[];
  onSelectShot: (shot: Shot) => void;
  animaticApproved: boolean;
  onToggleAnimaticApproved: (approved: boolean) => void;
}

export const AnimaticView: React.FC<AnimaticViewProps> = ({
  shots,
  onSelectShot,
  animaticApproved,
  onToggleAnimaticApproved,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);

  const totalRuntimeSec = shots.reduce((acc, s) => acc + s.durationSeconds, 0);

  // Timecode generator (HH:MM:SS:FF)
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds - Math.floor(seconds)) * 24);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  // Playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalRuntimeSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalRuntimeSec]);

  // Find currently active shot during playback
  let accumulatedTime = 0;
  let activeShotIndex = 0;
  for (let i = 0; i < shots.length; i++) {
    if (currentTimeSec >= accumulatedTime && currentTimeSec < accumulatedTime + shots[i].durationSeconds) {
      activeShotIndex = i;
      break;
    }
    accumulatedTime += shots[i].durationSeconds;
  }
  const currentShot = shots[activeShotIndex] || shots[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Animatic Timeline & Pacing</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Sequence storyboard and previs shots into an editorial animatic to lock narrative pacing before heavy production rendering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleAnimaticApproved(!animaticApproved)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
              animaticApproved
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-750'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{animaticApproved ? 'ANIMATIC APPROVED' : 'Approve Animatic'}</span>
          </button>
        </div>
      </div>

      {/* Main Animatic Viewport & Scrubber */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-5">
        {/* Visual Monitor Viewport */}
        <div className="aspect-[2.39/1] max-w-4xl mx-auto bg-black border border-neutral-800 rounded relative overflow-hidden flex items-center justify-center shadow-2xl">
          {currentShot?.previsUrl || currentShot?.storyboardUrl || currentShot?.finalRenderUrl ? (
            <MediaDisplay
              src={currentShot.finalRenderUrl || currentShot.previsUrl || currentShot.storyboardUrl}
              mediaType={
                currentShot.finalRenderUrl
                  ? currentShot.finalRenderMediaType
                  : currentShot.previsUrl
                  ? currentShot.previsMediaType
                  : currentShot.storyboardMediaType
              }
              alt={currentShot.description}
              aspectRatioClass="aspect-[2.39/1]"
              autoPlay={isPlaying}
              loop={true}
              muted={true}
              showControls={false}
            />
          ) : (
            <div className="p-6 text-center space-y-2 select-none">
              <span className="font-mono text-sm font-bold text-amber-400 bg-neutral-900/90 border border-neutral-800 px-3 py-1 rounded">
                {currentShot?.shotNumber}
              </span>
              <div className="text-white font-medium text-sm max-w-md">
                {currentShot?.description}
              </div>
              <div className="text-xs text-neutral-400 italic">
                "{currentShot?.purpose}"
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {currentShot?.shotType} · {currentShot?.lens} · {currentShot?.cameraMovement}
              </div>
            </div>
          )}

          {/* Timecode Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-neutral-800 px-2.5 py-1 rounded font-mono text-xs text-amber-300 tracking-wider">
            TC: {formatTimecode(currentTimeSec)}
          </div>

          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-neutral-800 px-2.5 py-1 rounded font-mono text-xs text-neutral-400 flex items-center gap-2">
            <span className="text-amber-400 font-bold">{currentShot?.shotNumber}</span>
            <span>·</span>
            <span>TOTAL: {formatTimecode(totalRuntimeSec)}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-4 py-2 border-y border-neutral-800">
          <button
            onClick={() => setCurrentTimeSec(0)}
            className="p-2 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
            title="Return to Frame 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-neutral-950" />}
            <span>{isPlaying ? 'Pause' : 'Play Animatic'}</span>
          </button>
        </div>

        {/* Multi-Track Timeline */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>Video Track 01 (Cut Order)</span>
            <span className="tabular-nums">Scrubber: {currentTimeSec.toFixed(1)}s / {totalRuntimeSec.toFixed(1)}s</span>
          </div>

          {/* Video Blocks Strip */}
          <div className="h-14 bg-neutral-950 border border-neutral-800 rounded flex overflow-hidden relative">
            {shots.map((shot, idx) => {
              const widthPercent = (shot.durationSeconds / (totalRuntimeSec || 1)) * 100;
              const isActive = idx === activeShotIndex;

              return (
                <div
                  key={shot.id}
                  onClick={() => {
                    let t = 0;
                    for (let j = 0; j < idx; j++) t += shots[j].durationSeconds;
                    setCurrentTimeSec(t);
                    onSelectShot(shot);
                  }}
                  style={{ width: `${widthPercent}%` }}
                  className={`h-full border-r border-neutral-800 p-1.5 flex flex-col justify-between cursor-pointer transition-colors relative overflow-hidden ${
                    isActive
                      ? 'bg-amber-500/20 text-white border-amber-500/50'
                      : 'hover:bg-neutral-850 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-400">
                      {shot.shotNumber}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500 tabular-nums">
                      {shot.durationSeconds}s
                    </span>
                  </div>
                  <div className="text-[10px] truncate">{shot.shotType}</div>
                </div>
              );
            })}

            {/* Playhead Indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 pointer-events-none"
              style={{
                left: `${(currentTimeSec / (totalRuntimeSec || 1)) * 100}%`,
              }}
            >
              <div className="w-2.5 h-2.5 bg-amber-400 -ml-1 -top-1 absolute rotate-45" />
            </div>
          </div>

          {/* Audio Track Mock: Dialogue & Temp Music */}
          <div className="h-8 bg-neutral-950 border border-neutral-800 rounded flex items-center px-3 text-xs text-neutral-400 justify-between font-mono">
            <span className="flex items-center gap-2 text-[11px]">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>A1: Temp Synthwave Ambient Suite (112 BPM)</span>
            </span>
            <span className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>A2: Dialogue & Foley Mix</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
