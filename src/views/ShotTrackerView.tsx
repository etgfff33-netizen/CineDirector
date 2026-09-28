import React, { useState } from 'react';
import { Shot, ShotStatus, ShotComplexity, ShotType, PipelinePhase } from '../types';
import {
  Clapperboard,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
  Camera,
  Film,
  CheckCircle2,
  Clock,
  Layers,
  LayoutGrid,
  List,
  Video,
  Trash2,
} from 'lucide-react';
import { MediaDisplay } from '../components/MediaDisplay';
import { ConfirmModal } from '../components/ConfirmModal';

interface ShotTrackerViewProps {
  shots: Shot[];
  onSelectShot: (shot: Shot) => void;
  onNewShot: () => void;
  onUpdateShotStatus: (shotId: string, status: ShotStatus) => void;
  onDeleteShot?: (shotId: string) => void;
}

export const ShotTrackerView: React.FC<ShotTrackerViewProps> = ({
  shots,
  onSelectShot,
  onNewShot,
  onUpdateShotStatus,
  onDeleteShot,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [complexityFilter, setComplexityFilter] = useState<string>('All');
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);

  const filteredShots = shots.filter((shot) => {
    const matchesSearch =
      search === '' ||
      shot.shotNumber.toLowerCase().includes(search.toLowerCase()) ||
      shot.description.toLowerCase().includes(search.toLowerCase()) ||
      shot.purpose.toLowerCase().includes(search.toLowerCase()) ||
      shot.lens.toLowerCase().includes(search.toLowerCase()) ||
      shot.camera.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || shot.status === statusFilter;
    const matchesComplexity =
      complexityFilter === 'All' || shot.complexity === complexityFilter;

    return matchesSearch && matchesStatus && matchesComplexity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <span>Shot Tracker & Purpose Database</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            The core engine of your film. Every frame breaks down to: What happens → Why it exists → Audience emotion → Unreal execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs ${
                viewMode === 'cards' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs ${
                viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onNewShot}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Shot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search shot number, action, purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded pl-8 pr-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Working">Working</option>
            <option value="Review">Review</option>
            <option value="Approved">Approved</option>
            <option value="Blocked">Blocked</option>
            <option value="Final">Final</option>
          </select>

          <select
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Complexities</option>
            <option value="A — Simple">A — Simple</option>
            <option value="B — Medium">B — Medium</option>
            <option value="C — Difficult">C — Difficult</option>
          </select>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Showing <span className="text-white font-bold">{filteredShots.length}</span> of{' '}
          <span className="text-neutral-300">{shots.length}</span> shots
        </div>
      </div>

      {/* View Mode 1: CARD VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShots.map((shot) => {
            const hasNoPurpose = !shot.purpose || shot.purpose.trim() === '';
            const isBlocked = shot.status === 'Blocked' || shot.blocker.trim() !== '';

            const activeMedia = shot.finalRenderUrl || shot.previsUrl || shot.storyboardUrl;
            const activeMediaType = shot.finalRenderUrl
              ? shot.finalRenderMediaType
              : shot.previsUrl
              ? shot.previsMediaType
              : shot.storyboardMediaType;

            return (
              <div
                key={shot.id}
                onClick={() => onSelectShot(shot)}
                className={`bg-neutral-900 border rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer transition-all hover:border-neutral-700 hover:shadow-lg ${
                  isBlocked
                    ? 'border-rose-900/60 bg-neutral-900/90'
                    : hasNoPurpose
                    ? 'border-amber-900/50'
                    : 'border-neutral-800'
                }`}
              >
                {/* Media Preview Header if media exists */}
                {activeMedia && (
                  <div className="relative border-b border-neutral-800 bg-black aspect-video overflow-hidden">
                    <MediaDisplay
                      src={activeMedia}
                      mediaType={activeMediaType}
                      alt={shot.description}
                      aspectRatioClass="aspect-video"
                      showControls={false}
                      autoPlay={false}
                    />
                    <div className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                      {shot.finalRenderUrl ? 'MRQ RENDER' : shot.previsUrl ? 'PREVIS' : 'STORYBOARD'}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Top Bar: Code, Framing, Camera Lock, Status */}
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {shot.shotNumber}
                      </span>
                      <span className="text-xs font-medium text-neutral-300">{shot.shotType}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {shot.cameraLocked ? (
                        <span className="text-[10px] text-amber-400/90 flex items-center gap-0.5" title="Camera Locked">
                          <Lock className="w-3 h-3" />
                          <span>{shot.cameraVersion}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 flex items-center gap-0.5" title="Camera Unlocked">
                          <Unlock className="w-3 h-3" />
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                          shot.status === 'Approved' || shot.status === 'Final'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : shot.status === 'Blocked'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : shot.status === 'Working'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {shot.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Description */}
                  <div>
                    <h2 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                      {shot.description || shot.whatHappens}
                    </h2>
                  </div>

                  {/* Purpose Box & Warning */}
                  <div
                    className={`p-2.5 rounded text-xs space-y-1 ${
                      hasNoPurpose
                        ? 'bg-rose-950/40 border border-rose-900/60 text-rose-200'
                        : 'bg-neutral-950 border border-neutral-850 text-neutral-300'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-semibold text-amber-400/90 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Storytelling Purpose:</span>
                    </div>
                    {hasNoPurpose ? (
                      <div className="text-[11px] text-rose-300 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>This shot has no defined storytelling purpose.</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-300 leading-relaxed italic line-clamp-2">
                        "{shot.purpose}"
                      </p>
                    )}
                  </div>

                  {/* Blocker alert if blocked */}
                  {isBlocked && (
                    <div className="p-2 bg-rose-950/50 border border-rose-800/80 rounded text-[11px] text-rose-200">
                      <strong>Blocker:</strong> {shot.blocker || 'Unresolved dependency'}
                    </div>
                  )}

                  {/* Camera & Lens Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-950/50 p-2 rounded border border-neutral-850">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Lens & FOV</span>
                      <span className="font-mono text-neutral-300">{shot.lens} ({shot.fov})</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Duration</span>
                      <span className="font-mono text-neutral-300 tabular-nums">
                        {shot.durationSeconds}s / {shot.durationFrames}f
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500 block text-[10px]">Audience Feeling</span>
                      <span className="text-amber-300 font-medium">{shot.audienceFeeling}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Quick Stage & Complexity */}
                <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500">Stage:</span>
                    <span className="text-neutral-200">{shot.stage}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-500">{shot.complexity}</span>
                    {onDeleteShot && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShotToDelete(shot);
                        }}
                        className="text-neutral-600 hover:text-rose-400 p-1 rounded hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
                        title={`Delete ${shot.shotNumber}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: DENSE HIGH-READABILITY TABLE */}
      {viewMode === 'table' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-2.5 px-3">Shot</th>
                <th className="py-2.5 px-3">Media</th>
                <th className="py-2.5 px-3">Framing</th>
                <th className="py-2.5 px-3">Action & Storytelling Purpose</th>
                <th className="py-2.5 px-3">Camera / Lens</th>
                <th className="py-2.5 px-3">Feeling</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Lock</th>
                {onDeleteShot && <th className="py-2.5 px-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredShots.map((shot) => {
                const hasNoPurpose = !shot.purpose || shot.purpose.trim() === '';
                const isBlocked = shot.status === 'Blocked' || shot.blocker.trim() !== '';
                const activeMedia = shot.finalRenderUrl || shot.previsUrl || shot.storyboardUrl;
                const activeMediaType = shot.finalRenderUrl
                  ? shot.finalRenderMediaType
                  : shot.previsUrl
                  ? shot.previsMediaType
                  : shot.storyboardMediaType;

                return (
                  <tr
                    key={shot.id}
                    onClick={() => onSelectShot(shot)}
                    className="hover:bg-neutral-850/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {shot.shotNumber}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      {activeMedia ? (
                        <div className="w-16 h-9 rounded overflow-hidden bg-black border border-neutral-800 relative group/thumb">
                          <MediaDisplay
                            src={activeMedia}
                            mediaType={activeMediaType}
                            aspectRatioClass="aspect-video"
                            showControls={false}
                            allowFullscreen={false}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-9 rounded bg-neutral-950 border border-neutral-850 flex items-center justify-center text-[9px] font-mono text-neutral-600">
                          NO MEDIA
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-medium text-neutral-200">
                      {shot.shotType}
                    </td>

                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-medium text-white truncate">{shot.description}</div>
                      {hasNoPurpose ? (
                        <div className="text-[11px] text-rose-400 flex items-center gap-1 font-medium mt-0.5">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>No defined purpose</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5 italic">
                          {shot.purpose}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono text-neutral-300">
                      <div>{shot.lens}</div>
                      <div className="text-[10px] text-neutral-500">{shot.cameraMovement}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-amber-300">
                      {shot.audienceFeeling}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono tabular-nums text-neutral-300">
                      {shot.durationSeconds}s
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-neutral-400">
                      {shot.stage}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          shot.status === 'Approved' || shot.status === 'Final'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isBlocked
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : shot.status === 'Working'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {shot.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-right">
                      {shot.cameraLocked ? (
                        <span className="text-amber-400 inline-flex items-center gap-1 font-mono text-[10px]">
                          <Lock className="w-3 h-3" />
                          <span>{shot.cameraVersion}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-600 inline-flex items-center">
                          <Unlock className="w-3 h-3" />
                        </span>
                      )}
                    </td>

                    {onDeleteShot && (
                      <td className="py-3 px-3 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShotToDelete(shot);
                          }}
                          className="p-1 text-neutral-600 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
                          title={`Delete ${shot.shotNumber}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Shot Confirmation Modal */}
      <ConfirmModal
        isOpen={!!shotToDelete}
        title={`Delete Shot ${shotToDelete?.shotNumber}?`}
        message={`Are you sure you want to delete ${shotToDelete?.shotNumber} (${shotToDelete?.description || 'Untitled'})? This will remove its camera metadata and storyboard link.`}
        confirmLabel="Delete Shot"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (shotToDelete && onDeleteShot) {
            onDeleteShot(shotToDelete.id);
            setShotToDelete(null);
          }
        }}
        onCancel={() => setShotToDelete(null)}
      />
    </div>
  );
};
