import React, { useState } from 'react';
import { EditSequence, SoundItem, Shot } from '../types';
import { Volume2, Clapperboard, Music, Lock, Unlock, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface EditorialSoundViewProps {
  editSequences: EditSequence[];
  sounds: SoundItem[];
  shots: Shot[];
  projectId: string;
  onUpdateEdit: (updated: EditSequence[]) => void;
  onUpdateSounds: (updated: SoundItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const EditorialSoundView: React.FC<EditorialSoundViewProps> = ({
  editSequences,
  sounds,
  shots,
  projectId,
  onUpdateEdit,
  onUpdateSounds,
  onSelectShot,
}) => {
  const [subTab, setSubTab] = useState<'edit' | 'sound'>('edit');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <span>Editorial & Sound Design Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Assembly cut tracking, Picture Lock validation for Gate 05, and full stem audio design (Dialogue, Ambience, Foley, SFX, Music).
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setSubTab('edit')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'edit' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Editorial & Picture Lock ({editSequences.length})
          </button>
          <button
            onClick={() => setSubTab('sound')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'sound' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sound Stems & Foley ({sounds.length})
          </button>
        </div>
      </div>

      {/* EDITORIAL VIEW */}
      {subTab === 'edit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Editorial Sequences & Cut Lock
            </span>
            <button
              onClick={() => {
                const newSeq: EditSequence = {
                  id: `seq-${Date.now()}`,
                  projectId,
                  sequenceName: 'ACT 2 — CLIMAX',
                  version: 'v01',
                  pictureLock: false,
                  musicTrack: 'Tension Synth Theme',
                  dialogueStatus: 'Scratch',
                  sfxStatus: 'Blocked',
                  transitions: 'Straight cuts',
                  pacingNotes: 'Cut tight on impacts',
                  status: 'Rough Cut',
                  notes: '',
                };
                onUpdateEdit([...editSequences, newSeq]);
              }}
              className="px-3 py-1.5 bg-amber-400 text-neutral-950 text-xs font-medium rounded hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sequence</span>
            </button>
          </div>

          <div className="space-y-4">
            {editSequences.map((seq) => (
              <div
                key={seq.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-sm">{seq.sequenceName}</span>
                    <span className="font-mono text-xs text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {seq.version}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">[{seq.status}]</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = editSequences.map((s) =>
                          s.id === seq.id ? { ...s, pictureLock: !s.pictureLock } : s
                        );
                        onUpdateEdit(updated);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors ${
                        seq.pictureLock
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                      }`}
                    >
                      {seq.pictureLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{seq.pictureLock ? 'PICTURE LOCKED (Gate 05)' : 'Lock Picture'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="text-neutral-400">
                      <strong className="text-neutral-300 font-normal">Music Track: </strong>
                      {seq.musicTrack}
                    </div>
                    <div className="text-neutral-400">
                      <strong className="text-neutral-300 font-normal">Dialogue Timing: </strong>
                      {seq.dialogueStatus}
                    </div>
                    <div className="text-neutral-400">
                      <strong className="text-neutral-300 font-normal">SFX / Ambiences: </strong>
                      {seq.sfxStatus}
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded border border-neutral-850 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                      Director Pacing Notes
                    </span>
                    <p className="text-neutral-300 italic text-[11px] leading-relaxed">
                      "{seq.pacingNotes}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SOUND TRACKER */}
      {subTab === 'sound' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Audio Stems & Foley Design
            </span>
            <button
              onClick={() => {
                const newSnd: SoundItem = {
                  id: `snd-${Date.now()}`,
                  projectId,
                  scene: 'Scene 1',
                  shotId: shots[0]?.id,
                  type: 'SFX',
                  description: 'Mechanical hydraulic impact',
                  source: 'Soundly / Zoom H6',
                  status: 'Needed',
                  isFinal: false,
                };
                onUpdateSounds([...sounds, newSnd]);
              }}
              className="px-3 py-1.5 bg-amber-400 text-neutral-950 text-xs font-medium rounded hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Audio Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sounds.map((snd) => {
              const shot = shots.find((s) => s.id === snd.shotId);

              return (
                <div key={snd.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{snd.type}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                      {snd.status}
                    </span>
                  </div>

                  <p className="text-neutral-300 leading-relaxed">{snd.description}</p>

                  <div className="text-[11px] text-neutral-500 font-mono">
                    Source: {snd.source}
                  </div>

                  <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
                    {shot ? (
                      <button
                        onClick={() => onSelectShot(shot)}
                        className="font-mono text-amber-400 font-bold hover:underline"
                      >
                        {shot.shotNumber}
                      </button>
                    ) : (
                      <span className="text-neutral-500 font-mono">{snd.scene}</span>
                    )}

                    <button
                      onClick={() => {
                        const updated = sounds.map((s) =>
                          s.id === snd.id ? { ...s, isFinal: !s.isFinal } : s
                        );
                        onUpdateSounds(updated);
                      }}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                        snd.isFinal
                          ? 'text-emerald-400 font-bold'
                          : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {snd.isFinal ? '● FINAL MIX' : 'Mark Final'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
