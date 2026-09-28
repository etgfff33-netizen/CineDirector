import React, { useState } from 'react';
import { SoundItem, Shot } from '../types';
import {
  Volume2,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Music,
  Mic,
  Film,
  Sparkles,
  CheckCircle2,
  Radio,
  Sliders,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface SoundDesignViewProps {
  sounds: SoundItem[];
  shots: Shot[];
  projectId: string;
  onUpdateSounds: (updated: SoundItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const SoundDesignView: React.FC<SoundDesignViewProps> = ({
  sounds,
  shots,
  projectId,
  onUpdateSounds,
  onSelectShot,
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [shotFilter, setShotFilter] = useState<string>('All');

  // Modal states
  const [editingSound, setEditingSound] = useState<SoundItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [soundToDelete, setSoundToDelete] = useState<SoundItem | null>(null);
  const [quickAddShotId, setQuickAddShotId] = useState<string>('');

  const lockedOrApprovedShots = shots.filter(
    (s) => s.cameraLocked || s.status === 'Approved' || s.status === 'Final'
  );

  const handleDelete = (id: string) => {
    onUpdateSounds(sounds.filter((s) => s.id !== id));
    setSoundToDelete(null);
  };

  const handleSave = (item: SoundItem) => {
    if (isAdding) {
      onUpdateSounds([...sounds, item]);
    } else {
      onUpdateSounds(sounds.map((s) => (s.id === item.id ? item : s)));
    }
    setEditingSound(null);
  };

  const handleQuickAddForShot = (shotId: string) => {
    if (!shotId) return;
    const shot = shots.find((s) => s.id === shotId);
    if (!shot) return;
    const newItem: SoundItem = {
      id: `snd-${Date.now()}`,
      projectId,
      scene: shot.scene || 'Scene 1',
      shotId: shot.id,
      type: 'SFX',
      description: `Foley and audio effects for ${shot.shotNumber} (${shot.description})`,
      source: 'Foley Library / Field Recording',
      status: 'Needed',
      isFinal: false,
    };
    onUpdateSounds([...sounds, newItem]);
    setQuickAddShotId('');
  };

  const handleAutoGenerateStems = () => {
    const existingShotIds = new Set(sounds.map((s) => s.shotId).filter(Boolean));
    const targetShots = shots.filter((s) => !existingShotIds.has(s.id));
    if (targetShots.length === 0) return;

    const newItems: SoundItem[] = targetShots.map((shot, idx) => ({
      id: `snd-${Date.now()}-${idx}`,
      projectId,
      scene: shot.scene || 'Scene 1',
      shotId: shot.id,
      type: (idx % 2 === 0 ? 'SFX' : 'Foley') as SoundItem['type'],
      description: `Audio layers for ${shot.shotNumber} — ${shot.description}`,
      source: 'Soundly / Sound Ideas',
      status: 'Needed',
      isFinal: false,
    }));
    onUpdateSounds([...sounds, ...newItems]);
  };

  const filteredSounds = sounds.filter((s) => {
    const matchesType = typeFilter === 'All' || s.type === typeFilter;
    const matchesShot = shotFilter === 'All' || s.shotId === shotFilter;
    return matchesType && matchesShot;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <span>Sound Design & Audio Stems Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full multi-stem sound design (Dialogue, Foley, Ambience, SFX, Score) with direct shot-linking to production cameras and scenes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stem Type Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1.5 rounded text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-mono">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-neutral-900">All Stems</option>
              <option value="Dialogue" className="bg-neutral-900">Dialogue</option>
              <option value="Voice-over" className="bg-neutral-900">Voice-over</option>
              <option value="Ambience" className="bg-neutral-900">Ambience</option>
              <option value="Foley" className="bg-neutral-900">Foley</option>
              <option value="SFX" className="bg-neutral-900">SFX</option>
              <option value="Music" className="bg-neutral-900">Music</option>
            </select>
          </div>

          {/* Shot Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1.5 rounded text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-mono">Shot:</span>
            <select
              value={shotFilter}
              onChange={(e) => setShotFilter(e.target.value)}
              className="bg-transparent text-neutral-200 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-neutral-900">All Shots ({shots.length})</option>
              {shots.map((s) => (
                <option key={s.id} value={s.id} className="bg-neutral-900">
                  {s.shotNumber} — {s.cameraLocked ? '🔒 Locked' : s.status}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Stem for Shot Dropdown */}
          {shots.length > 0 && (
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
              <select
                value={quickAddShotId}
                onChange={(e) => {
                  setQuickAddShotId(e.target.value);
                  if (e.target.value) handleQuickAddForShot(e.target.value);
                }}
                className="bg-transparent text-amber-300 text-xs font-mono focus:outline-none cursor-pointer max-w-[170px]"
              >
                <option value="" className="bg-neutral-900 text-neutral-500">
                  ＋ Quick Stem for Shot...
                </option>
                {lockedOrApprovedShots.length > 0 && (
                  <optgroup label="🌟 Locked / Approved Shots" className="bg-neutral-900 text-amber-300">
                    {lockedOrApprovedShots.map((s) => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">
                        {s.shotNumber} ({s.cameraLocked ? '🔒' : s.status})
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="All Production Shots" className="bg-neutral-900 text-neutral-300">
                  {shots
                    .filter((s) => !lockedOrApprovedShots.some((ls) => ls.id === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">
                        {s.shotNumber} ({s.status})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          )}

          <button
            onClick={() => {
              setEditingSound({
                id: `snd-${Date.now()}`,
                projectId,
                scene: shots[0]?.scene || 'Scene 1',
                shotId: (lockedOrApprovedShots[0] || shots[0])?.id || '',
                type: 'SFX',
                description: 'Mechanical hydraulic impact and release valve hiss',
                source: 'Soundly / Zoom H6',
                status: 'Needed',
                isFinal: false,
              });
              setIsAdding(true);
            }}
            className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Audio Stem</span>
          </button>
        </div>
      </div>

      {/* Grid of Sound Stems or Empty State */}
      {filteredSounds.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Audio Stems Found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
              Track dialogue, foley, background ambience, sound effects, and score tracks linked directly to your production shots.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setEditingSound({
                  id: `snd-${Date.now()}`,
                  projectId,
                  scene: 'Scene 1',
                  shotId: shots[0]?.id || '',
                  type: 'SFX',
                  description: 'Atmospheric room tone and mechanical hum',
                  source: 'Field Recording',
                  status: 'Needed',
                  isFinal: false,
                });
                setIsAdding(true);
              }}
              className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold text-xs rounded hover:bg-amber-300 flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Audio Stem</span>
            </button>
            {shots.length > 0 && (
              <button
                onClick={handleAutoGenerateStems}
                className="px-4 py-2 bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold text-xs rounded hover:bg-neutral-750 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Auto-Generate Stems for Production Shots</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSounds.map((snd) => {
            const shot = shots.find((s) => s.id === snd.shotId);

            return (
              <div
                key={snd.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between hover:border-neutral-750 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {snd.type === 'Music' ? (
                          <Music className="w-3.5 h-3.5" />
                        ) : snd.type === 'Dialogue' || snd.type === 'Voice-over' ? (
                          <Mic className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="font-bold text-white text-sm">{snd.type}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{snd.scene}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        snd.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium'
                          : snd.status === 'Mixed'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {snd.status}
                    </span>
                  </div>

                  {/* LINKED PRODUCTION SHOT DROPDOWN ON CARD */}
                  <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850 space-y-2 text-[11px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <Film className="w-3 h-3 text-amber-400" />
                        <span>Linked Shot:</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={snd.shotId || ''}
                          onChange={(e) => {
                            const newShotId = e.target.value;
                            const updated = sounds.map((s) =>
                              s.id === snd.id ? { ...s, shotId: newShotId || undefined } : s
                            );
                            onUpdateSounds(updated);
                          }}
                          className="bg-neutral-900 border border-neutral-750 text-amber-300 font-mono text-xs rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[190px] truncate"
                          title="Change linked production shot"
                        >
                          <option value="" className="bg-neutral-900 text-neutral-500">
                            Global Scene Audio
                          </option>
                          {lockedOrApprovedShots.length > 0 && (
                            <optgroup label="🌟 Locked / Approved Shots" className="bg-neutral-900 text-amber-300 font-semibold">
                              {lockedOrApprovedShots.map((s) => (
                                <option key={s.id} value={s.id} className="bg-neutral-900">
                                  {s.shotNumber} ({s.cameraLocked ? '🔒 Locked' : s.status})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          <optgroup label="All Production Shots" className="bg-neutral-900 text-neutral-300">
                            {shots
                              .filter((s) => !lockedOrApprovedShots.some((ls) => ls.id === s.id))
                              .map((s) => (
                                <option key={s.id} value={s.id} className="bg-neutral-900">
                                  {s.shotNumber} ({s.status})
                                </option>
                              ))}
                          </optgroup>
                        </select>

                        {shot && (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            title="Inspect Shot in Shot Inspector"
                            className="p-0.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-750 rounded hover:bg-neutral-800"
                          >
                            <Film className="w-3 h-3 text-amber-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {shot ? (
                      <div className="flex items-center justify-between text-neutral-400 pt-0.5 text-[10px]">
                        <span className="truncate max-w-[180px] text-neutral-300 font-mono">
                          {shot.shotNumber} · {shot.shotType} · {shot.durationSeconds}s
                        </span>
                        {shot.cameraLocked && (
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-500 italic block text-[10px]">
                        Global scene track (not tied to camera timing)
                      </span>
                    )}

                    <div className="flex justify-between text-neutral-400 pt-0.5 border-t border-neutral-850">
                      <span className="text-neutral-500">Source:</span>
                      <span className="font-mono text-neutral-300 truncate max-w-[170px]">{snd.source}</span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed pt-0.5">{snd.description}</p>
                </div>

                {/* Card Footer with Edit & Delete */}
                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSound(snd);
                        setIsAdding(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded flex items-center gap-1 font-medium transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Stem</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSoundToDelete(snd)}
                      className="text-neutral-400 hover:text-rose-400 p-1 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 rounded transition-colors"
                      title="Delete Sound Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Final Mix Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = sounds.map((s) =>
                        s.id === snd.id ? { ...s, isFinal: !s.isFinal } : s
                      );
                      onUpdateSounds(updated);
                    }}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                      snd.isFinal
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {snd.isFinal ? '● FINAL MIX' : 'Mark Final'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / ADD SOUND MODAL */}
      {editingSound && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isAdding ? 'Add Audio Stem' : 'Edit Sound Item'}</span>
            </h3>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Stem Type</label>
                  <select
                    value={editingSound.type}
                    onChange={(e) => setEditingSound({ ...editingSound, type: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Dialogue">Dialogue</option>
                    <option value="Voice-over">Voice-over</option>
                    <option value="Ambience">Ambience</option>
                    <option value="Foley">Foley</option>
                    <option value="SFX">SFX</option>
                    <option value="Music">Music</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Scene</label>
                  <input
                    type="text"
                    value={editingSound.scene}
                    onChange={(e) => setEditingSound({ ...editingSound, scene: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* SHOT LINKING DROPDOWN (FROM PRODUCTION) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-neutral-300 font-semibold">
                    Link to Production Shot
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Links audio timing to shot camera
                  </span>
                </div>
                <select
                  value={editingSound.shotId || ''}
                  onChange={(e) => setEditingSound({ ...editingSound, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono cursor-pointer"
                >
                  <option value="">Global Scene Audio (Not shot-specific)</option>
                  {lockedOrApprovedShots.length > 0 && (
                    <optgroup label="🌟 Locked / Approved / Completed Shots (Recommended)">
                      {lockedOrApprovedShots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shotNumber} — {s.description.slice(0, 32)} [{s.cameraLocked ? '🔒 Camera Locked' : s.status}]
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="All Production Shots">
                    {shots
                      .filter((s) => !lockedOrApprovedShots.some((ls) => ls.id === s.id))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shotNumber} — {s.description.slice(0, 32)} [{s.status}]
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Audio Description</label>
                <textarea
                  rows={2}
                  value={editingSound.description}
                  onChange={(e) => setEditingSound({ ...editingSound, description: e.target.value })}
                  placeholder="e.g. Footsteps on wet industrial grates, rising siren reverb..."
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Audio Source / Gear / Library</label>
                  <input
                    type="text"
                    value={editingSound.source}
                    onChange={(e) => setEditingSound({ ...editingSound, source: e.target.value })}
                    placeholder="e.g. Zoom F3 / Sennheiser MKH 416"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Mix Status</label>
                  <select
                    value={editingSound.status}
                    onChange={(e) => setEditingSound({ ...editingSound, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Needed">Needed</option>
                    <option value="Recorded">Recorded</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSound.isFinal}
                    onChange={(e) => setEditingSound({ ...editingSound, isFinal: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span className="font-semibold text-emerald-400">Master Stem QC Final Approved</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingSound(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingSound)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Audio Stem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!soundToDelete}
        title={`Delete Audio Stem "${soundToDelete?.type} — ${soundToDelete?.description?.slice(0, 25)}"?`}
        message="Are you sure you want to delete this audio stem? This will remove its stem timeline references."
        confirmLabel="Delete Stem"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (soundToDelete) handleDelete(soundToDelete.id);
        }}
        onCancel={() => setSoundToDelete(null)}
      />
    </div>
  );
};
