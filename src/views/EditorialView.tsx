import React, { useState } from 'react';
import { EditSequence, Shot } from '../types';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Film,
  Music,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface EditorialViewProps {
  editSequences: EditSequence[];
  shots: Shot[];
  projectId: string;
  onUpdateEdit: (updated: EditSequence[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const EditorialView: React.FC<EditorialViewProps> = ({
  editSequences,
  shots,
  projectId,
  onUpdateEdit,
  onSelectShot,
}) => {
  const [editingSeq, setEditingSeq] = useState<EditSequence | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [seqToDelete, setSeqToDelete] = useState<EditSequence | null>(null);

  const lockedOrApprovedShots = shots.filter(
    (s) => s.cameraLocked || s.status === 'Approved' || s.status === 'Final'
  );

  const handleDelete = (id: string) => {
    onUpdateEdit(editSequences.filter((s) => s.id !== id));
    setSeqToDelete(null);
  };

  const handleSave = (item: EditSequence) => {
    if (isAdding) {
      onUpdateEdit([...editSequences, item]);
    } else {
      onUpdateEdit(editSequences.map((s) => (s.id === item.id ? item : s)));
    }
    setEditingSeq(null);
  };

  const handleCreateAssemblyFromShots = () => {
    const newSeq: EditSequence = {
      id: `seq-${Date.now()}`,
      projectId,
      sequenceName: 'MASTER ASSEMBLY CUT',
      version: 'v01',
      pictureLock: false,
      musicTrack: 'Main Score / Temp Track',
      dialogueStatus: 'Synchronized with Production audio',
      sfxStatus: 'Foley markers positioned',
      transitions: 'Sequential narrative pacing',
      pacingNotes: 'Cut to dramatic camera action and MetaHuman reactions.',
      status: 'Assembly',
      notes: 'Full multi-shot timeline assembled from project shots.',
      linkedShotIds: shots.map((s) => s.id),
    };
    onUpdateEdit([...editSequences, newSeq]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-400" />
            <span>Editorial Assembly & Picture Lock</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Assembly cut sequence tracking, Gate 05 Picture Lock validation, and multi-shot timeline assembly linked directly to production shots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {shots.length > 0 && editSequences.length === 0 && (
            <button
              onClick={handleCreateAssemblyFromShots}
              className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-750 text-neutral-300 hover:text-white text-xs font-semibold rounded hover:bg-neutral-850 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Assemble from All Shots</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingSeq({
                id: `seq-${Date.now()}`,
                projectId,
                sequenceName: 'ACT 1 — SEQUENCE CUT',
                version: 'v01',
                pictureLock: false,
                musicTrack: 'Temp Synth Ambience',
                dialogueStatus: 'Scratch track synced',
                sfxStatus: 'Foley markers placed',
                transitions: 'Straight cuts',
                pacingNotes: 'Cut on motion beat',
                status: 'Rough Cut',
                notes: '',
                linkedShotIds: (lockedOrApprovedShots.length > 0 ? lockedOrApprovedShots : shots)
                  .slice(0, 3)
                  .map((s) => s.id),
              });
              setIsAdding(true);
            }}
            className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Editorial Sequence</span>
          </button>
        </div>
      </div>

      {/* Sequences List or Empty State */}
      {editSequences.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Editorial Sequences Created</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
              Assemble production shots into cut sequences, track picture lock for Gate 05, and synchronize audio cues across your project.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setEditingSeq({
                  id: `seq-${Date.now()}`,
                  projectId,
                  sequenceName: 'ACT 1 — SEQUENCE CUT',
                  version: 'v01',
                  pictureLock: false,
                  musicTrack: 'Temp Synth Ambience',
                  dialogueStatus: 'Scratch track synced',
                  sfxStatus: 'Foley markers placed',
                  transitions: 'Straight cuts',
                  pacingNotes: 'Cut on motion beat',
                  status: 'Rough Cut',
                  notes: '',
                  linkedShotIds: shots.slice(0, 3).map((s) => s.id),
                });
                setIsAdding(true);
              }}
              className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold text-xs rounded hover:bg-amber-300 flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Editorial Sequence</span>
            </button>
            {shots.length > 0 && (
              <button
                onClick={handleCreateAssemblyFromShots}
                className="px-4 py-2 bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold text-xs rounded hover:bg-neutral-750 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Build Assembly from {shots.length} Production Shots</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {editSequences.map((seq) => {
            const linkedShots = shots.filter((s) => seq.linkedShotIds?.includes(s.id));
            const totalDuration = linkedShots.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
            const unlinkedShots = shots.filter((s) => !seq.linkedShotIds?.includes(s.id));

            return (
              <div
                key={seq.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 hover:border-neutral-750 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{seq.sequenceName}</span>
                    <span className="font-mono text-xs text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {seq.version}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        seq.status === 'Picture Locked'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold'
                          : seq.status === 'Fine Cut'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {seq.status}
                    </span>
                    {totalDuration > 0 && (
                      <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{totalDuration.toFixed(1)}s runtime</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Picture Lock Toggle (Gate 05) */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editSequences.map((s) =>
                          s.id === seq.id
                            ? {
                                ...s,
                                pictureLock: !s.pictureLock,
                                status: !s.pictureLock ? ('Picture Locked' as const) : ('Fine Cut' as const),
                              }
                            : s
                        );
                        onUpdateEdit(updated);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors ${
                        seq.pictureLock
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 font-semibold'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                      }`}
                    >
                      {seq.pictureLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{seq.pictureLock ? 'PICTURE LOCKED (Gate 05)' : 'Lock Picture'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingSeq(seq);
                        setIsAdding(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded transition-colors flex items-center gap-1 font-medium"
                      title="Edit Sequence"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Cut</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeqToDelete(seq)}
                      className="text-neutral-400 hover:text-rose-400 px-2 py-1 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 rounded transition-colors flex items-center gap-1"
                      title="Delete Sequence"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs">Delete</span>
                    </button>
                  </div>
                </div>

                {/* LINKED PRODUCTION SHOTS TIMELINE */}
                <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-850 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Linked Production Shots ({linkedShots.length})</span>
                    </span>

                    {/* SHOT LINKING DROPDOWN DIRECTLY ON CARD */}
                    {unlinkedShots.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <select
                          value=""
                          onChange={(e) => {
                            const shotIdToAdd = e.target.value;
                            if (!shotIdToAdd) return;
                            const currentShotIds = seq.linkedShotIds || [];
                            if (!currentShotIds.includes(shotIdToAdd)) {
                              const updated = editSequences.map((s) =>
                                s.id === seq.id
                                  ? { ...s, linkedShotIds: [...currentShotIds, shotIdToAdd] }
                                  : s
                              );
                              onUpdateEdit(updated);
                            }
                          }}
                          className="bg-neutral-900 border border-neutral-750 text-amber-300 font-mono text-xs rounded px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="" disabled>
                            ＋ Link Shot from Production...
                          </option>
                          {lockedOrApprovedShots.filter((s) => !seq.linkedShotIds?.includes(s.id)).length > 0 && (
                            <optgroup label="🌟 Locked / Approved Shots" className="bg-neutral-900 text-amber-300">
                              {lockedOrApprovedShots
                                .filter((s) => !seq.linkedShotIds?.includes(s.id))
                                .map((s) => (
                                  <option key={s.id} value={s.id} className="bg-neutral-900">
                                    {s.shotNumber} ({s.cameraLocked ? '🔒 Locked' : s.status}) — {s.durationSeconds}s
                                  </option>
                                ))}
                            </optgroup>
                          )}
                          <optgroup label="All Production Shots" className="bg-neutral-900 text-neutral-300">
                            {unlinkedShots.map((s) => (
                              <option key={s.id} value={s.id} className="bg-neutral-900">
                                {s.shotNumber} ({s.status}) — {s.durationSeconds}s
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    )}
                  </div>

                  {linkedShots.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {linkedShots.map((shot, idx) => (
                        <div
                          key={shot.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/50 rounded text-xs transition-colors group"
                        >
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="flex items-center gap-2 text-left"
                            title="Inspect shot in Shot Inspector"
                          >
                            <span className="font-mono text-[10px] text-neutral-500">{idx + 1}.</span>
                            <span className="font-mono font-bold text-amber-400 group-hover:underline">
                              {shot.shotNumber}
                            </span>
                            <span className="text-neutral-400 text-[11px]">{shot.shotType}</span>
                            <span className="font-mono text-[10px] text-neutral-500 tabular-nums">
                              {shot.durationSeconds}s
                            </span>
                            {shot.cameraLocked && (
                              <span title="Camera Locked" className="flex items-center">
                                <Lock className="w-2.5 h-2.5 text-amber-400" />
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                shot.status === 'Approved' || shot.status === 'Final'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {shot.status}
                            </span>
                          </button>

                          {/* Quick unlink button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editSequences.map((s) =>
                                s.id === seq.id
                                  ? { ...s, linkedShotIds: s.linkedShotIds?.filter((id) => id !== shot.id) }
                                  : s
                              );
                              onUpdateEdit(updated);
                            }}
                            className="text-neutral-500 hover:text-rose-400 p-0.5 rounded hover:bg-neutral-800 transition-colors ml-0.5"
                            title={`Unlink shot ${shot.shotNumber} from this sequence`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-neutral-500 text-xs italic py-1">
                      <span>No production shots linked to this cut yet.</span>
                      <span className="text-[11px] text-amber-400/80 not-italic font-mono">
                        Select a shot from the dropdown above to link it.
                      </span>
                    </div>
                  )}
                </div>

                {/* Editorial Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <div>
                        <strong className="text-neutral-400 font-normal">Music Track: </strong>
                        <span className="text-white font-medium">{seq.musicTrack}</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-neutral-400 font-normal">Dialogue Sync: </strong>
                      <span className="text-neutral-200">{seq.dialogueStatus}</span>
                    </div>
                    <div>
                      <strong className="text-neutral-400 font-normal">SFX & Ambience Layers: </strong>
                      <span className="text-neutral-200">{seq.sfxStatus}</span>
                    </div>
                  </div>

                  <div className="bg-neutral-950/60 p-3 rounded border border-neutral-850 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                      Director Pacing & Transition Notes
                    </span>
                    <p className="text-neutral-300 italic text-[11px] leading-relaxed">
                      "{seq.pacingNotes || 'Straight cuts between narrative camera setups.'}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / ADD SEQUENCE MODAL */}
      {editingSeq && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-6 space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>{isAdding ? 'Add Editorial Cut Sequence' : 'Edit Sequence & Shot Linkage'}</span>
            </h3>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Sequence Name</label>
                  <input
                    type="text"
                    value={editingSeq.sequenceName}
                    onChange={(e) => setEditingSeq({ ...editingSeq, sequenceName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Cut Version</label>
                  <input
                    type="text"
                    value={editingSeq.version}
                    onChange={(e) => setEditingSeq({ ...editingSeq, version: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* LINKED PRODUCTION SHOTS SELECTOR */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-neutral-300 font-semibold">
                    Link Production Shots into this Sequence
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Select shots to build sequence
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto bg-neutral-950 border border-neutral-750 rounded p-2.5 space-y-1.5">
                  {shots.map((shot) => {
                    const isLinked = editingSeq.linkedShotIds?.includes(shot.id);
                    return (
                      <label
                        key={shot.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          isLinked
                            ? 'bg-amber-950/30 border border-amber-800/60 text-white'
                            : 'hover:bg-neutral-900 border border-transparent text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isLinked}
                            onChange={() => {
                              const currentIds = editingSeq.linkedShotIds || [];
                              const updated = isLinked
                                ? currentIds.filter((id) => id !== shot.id)
                                : [...currentIds, shot.id];
                              setEditingSeq({ ...editingSeq, linkedShotIds: updated });
                            }}
                            className="accent-amber-400 rounded"
                          />
                          <span className="font-mono font-bold text-amber-400">{shot.shotNumber}</span>
                          <span className="text-neutral-200">{shot.description.slice(0, 35)}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">({shot.shotType})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-neutral-400">{shot.durationSeconds}s</span>
                          {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                              shot.status === 'Approved' || shot.status === 'Final'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {shot.status}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Editing Stage</label>
                  <select
                    value={editingSeq.status}
                    onChange={(e) => setEditingSeq({ ...editingSeq, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Assembly">Assembly</option>
                    <option value="Rough Cut">Rough Cut</option>
                    <option value="Fine Cut">Fine Cut</option>
                    <option value="Picture Locked">Picture Locked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Temp Music Track</label>
                  <input
                    type="text"
                    value={editingSeq.musicTrack}
                    onChange={(e) => setEditingSeq({ ...editingSeq, musicTrack: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Dialogue Timing</label>
                  <input
                    type="text"
                    value={editingSeq.dialogueStatus}
                    onChange={(e) => setEditingSeq({ ...editingSeq, dialogueStatus: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">SFX Layers</label>
                  <input
                    type="text"
                    value={editingSeq.sfxStatus}
                    onChange={(e) => setEditingSeq({ ...editingSeq, sfxStatus: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Director Pacing & Cut Notes</label>
                <textarea
                  rows={2}
                  value={editingSeq.pacingNotes}
                  onChange={(e) => setEditingSeq({ ...editingSeq, pacingNotes: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white resize-none"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSeq.pictureLock}
                    onChange={(e) => setEditingSeq({ ...editingSeq, pictureLock: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span className="font-semibold text-emerald-400">Lock Picture (Gate 05 Picture Lock)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingSeq(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingSeq)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!seqToDelete}
        title={`Delete Editorial Sequence "${seqToDelete?.sequenceName}"?`}
        message="Are you sure you want to delete this sequence? Its edit timeline and linked cut references will be removed."
        confirmLabel="Delete Sequence"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (seqToDelete) handleDelete(seqToDelete.id);
        }}
        onCancel={() => setSeqToDelete(null)}
      />
    </div>
  );
};
