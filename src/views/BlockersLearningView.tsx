import React, { useState } from 'react';
import { ProblemBlocker, LearningItem, Shot } from '../types';
import {
  AlertOctagon,
  GraduationCap,
  Plus,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  BookOpen,
  Film,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface BlockersLearningViewProps {
  blockers: ProblemBlocker[];
  learning: LearningItem[];
  shots: Shot[];
  projectId: string;
  onUpdateBlockers: (updated: ProblemBlocker[]) => void;
  onUpdateLearning: (updated: LearningItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const BlockersLearningView: React.FC<BlockersLearningViewProps> = ({
  blockers,
  learning,
  shots,
  projectId,
  onUpdateBlockers,
  onUpdateLearning,
  onSelectShot,
}) => {
  const [activeTab, setActiveTab] = useState<'blockers' | 'learning'>('blockers');
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'learning' | 'blocker';
    id: string;
    name: string;
  } | null>(null);
  const [isAddingBlocker, setIsAddingBlocker] = useState(false);
  const [isAddingLearning, setIsAddingLearning] = useState(false);

  // New Blocker Form State
  const [bProblem, setBProblem] = useState('');
  const [bShotId, setBShotId] = useState(shots[0]?.id || '');
  const [bCategory, setBCategory] = useState<ProblemBlocker['category']>('Rendering');
  const [bSeverity, setBSeverity] = useState<ProblemBlocker['severity']>('High');
  const [bCause, setBCause] = useState('');
  const [bSolution, setBSolution] = useState('');

  // New Learning Form State
  const [lSkill, setLSkill] = useState('');
  const [lTopic, setLTopic] = useState('');
  const [lResource, setLResource] = useState('');
  const [lWhy, setLWhy] = useState('');
  const [lShotId, setLShotId] = useState(shots[0]?.id || '');

  const handleAddBlocker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bProblem) return;

    const newBlocker: ProblemBlocker = {
      id: `blk-${Date.now()}`,
      projectId,
      shotId: bShotId || undefined,
      problem: bProblem,
      category: bCategory,
      severity: bSeverity,
      cause: bCause,
      solution: bSolution,
      status: 'Open',
      lessonLearned: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateBlockers([newBlocker, ...blockers]);
    setBProblem('');
    setBCause('');
    setBSolution('');
    setIsAddingBlocker(false);
  };

  const handleAddLearning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lSkill || !lShotId) return;

    const newItem: LearningItem = {
      id: `lrn-${Date.now()}`,
      projectId,
      shotId: lShotId, // Strictly enforced: must link to shot!
      skill: lSkill,
      topic: lTopic,
      resource: lResource,
      whyINeedIt: lWhy,
      priority: 'High',
      status: 'Queued',
      practiceTask: '',
      result: '',
      notes: '',
    };

    onUpdateLearning([newItem, ...learning]);
    setLSkill('');
    setLTopic('');
    setLResource('');
    setLWhy('');
    setIsAddingLearning(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <span>Problem Log & Solo Learning Discipline</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Resolve production bottlenecks directly. The learning system enforces: "No course or tutorial without a specific shot blocker."
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveTab('blockers')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'blockers'
                ? 'bg-neutral-800 text-rose-300 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🔴 Problem / Blocker Log ({blockers.length})
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'learning'
                ? 'bg-neutral-800 text-amber-300 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎓 Targeted Learning ({learning.length})
          </button>
        </div>
      </div>

      {/* 1. PROBLEM / BLOCKER TRACKER */}
      {activeTab === 'blockers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Active Production Blockers
            </span>
            <button
              onClick={() => setIsAddingBlocker(true)}
              className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-neutral-950 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Blocker</span>
            </button>
          </div>

          {/* Add Blocker Form */}
          {isAddingBlocker && (
            <form onSubmit={handleAddBlocker} className="bg-neutral-900 border border-rose-900/60 rounded-lg p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="font-semibold text-rose-400 uppercase tracking-wider text-[11px]">
                  Log Production Problem
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingBlocker(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-neutral-300 mb-1">Problem Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lumen ghosting on rapid camera pan during courier sprint"
                    value={bProblem}
                    onChange={(e) => setBProblem(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Impacted Shot</label>
                  <select
                    value={bShotId}
                    onChange={(e) => setBShotId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none font-mono"
                  >
                    <option value="">General Project</option>
                    {shots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shotNumber} — {s.description.slice(0, 25)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Category</label>
                  <select
                    value={bCategory}
                    onChange={(e) => setBCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  >
                    {[
                      'Story',
                      'Camera',
                      'Animation',
                      'Environment',
                      'Lighting',
                      'Material',
                      'FX',
                      'Performance',
                      'Rendering',
                      'Compositing',
                      'Sound',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Severity</label>
                  <select
                    value={bSeverity}
                    onChange={(e) => setBSeverity(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none font-semibold text-rose-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Root Cause</label>
                  <textarea
                    rows={2}
                    placeholder="Why is this failing technically?"
                    value={bCause}
                    onChange={(e) => setBCause(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Actionable Solution</label>
                  <textarea
                    rows={2}
                    placeholder="Exact fix or workaround..."
                    value={bSolution}
                    onChange={(e) => setBSolution(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-400 text-neutral-950 font-semibold rounded text-xs"
                >
                  Save Blocker
                </button>
              </div>
            </form>
          )}

          {/* List of Blockers */}
          <div className="space-y-3">
            {blockers.map((b) => {
              const shot = shots.find((s) => s.id === b.shotId);

              return (
                <div
                  key={b.id}
                  className={`bg-neutral-900 border rounded-lg p-5 space-y-3 text-xs transition-colors ${
                    b.status === 'Resolved'
                      ? 'border-neutral-800 opacity-60'
                      : b.severity === 'Critical'
                      ? 'border-rose-900/80 bg-neutral-900/90'
                      : 'border-neutral-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-2.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          b.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {b.severity}
                      </span>
                      <h2 className="font-semibold text-white text-sm">{b.problem}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {shot && (
                        <button
                          onClick={() => onSelectShot(shot)}
                          className="font-mono text-amber-400 font-bold hover:underline"
                        >
                          {shot.shotNumber}
                        </button>
                      )}
                      <span className="text-[10px] text-neutral-500 font-mono">[{b.category}]</span>

                      <button
                        onClick={() => {
                          const updated = blockers.map((item) =>
                            item.id === b.id
                              ? {
                                  ...item,
                                  status: item.status === 'Resolved' ? 'Open' : 'Resolved',
                                }
                              : item
                          );
                          onUpdateBlockers(updated as any);
                        }}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          b.status === 'Resolved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {b.status === 'Resolved' ? '✓ Resolved' : 'Mark Resolved'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setItemToDelete({
                            type: 'blocker',
                            id: b.id,
                            name: b.problem,
                          })
                        }
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete Blocker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300">
                    <div>
                      <strong className="text-neutral-500 uppercase text-[10px] block mb-0.5">
                        Technical Root Cause:
                      </strong>
                      <p className="leading-relaxed">{b.cause}</p>
                    </div>

                    <div>
                      <strong className="text-neutral-500 uppercase text-[10px] block mb-0.5">
                        Implemented Solution:
                      </strong>
                      <p className="leading-relaxed">{b.solution}</p>
                    </div>
                  </div>

                  {b.lessonLearned && (
                    <div className="p-2.5 bg-neutral-950 rounded border border-neutral-850 text-neutral-400 italic">
                      <strong>Lesson Learned: </strong> {b.lessonLearned}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TARGETED LEARNING TRACKER (Enforces Anti-Course-Hopping) */}
      {activeTab === 'learning' && (
        <div className="space-y-4">
          {/* Iron Rule Banner */}
          <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-0.5">
                The Solo Creator Rule: No Learning Without A Specific Shot Blocker
              </div>
              <p className="text-amber-200/90 leading-relaxed text-[11px]">
                Prevent endless course-hopping and tutorial paralysis. Every skill you study must directly unblock an active shot in your production.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Active Learning Tasks ({learning.length})
            </span>
            <button
              onClick={() => setIsAddingLearning(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Linked Skill Goal</span>
            </button>
          </div>

          {/* Add Learning Form */}
          {isAddingLearning && (
            <form onSubmit={handleAddLearning} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                  Add Shot-Linked Learning Topic
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingLearning(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Required Shot Link *</label>
                  <select
                    required
                    value={lShotId}
                    onChange={(e) => setLShotId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none font-mono"
                  >
                    {shots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shotNumber} — {s.description.slice(0, 25)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Skill / Software</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unreal Engine 5.4 Lumen"
                    value={lSkill}
                    onChange={(e) => setLSkill(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Specific Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hardware Raytracing Hit Lighting in Fast Pans"
                    value={lTopic}
                    onChange={(e) => setLTopic(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Curated Resource / Link</label>
                  <input
                    type="text"
                    placeholder="e.g. Epic Dev Community Guide or Hugo Guerra Masterclass"
                    value={lResource}
                    onChange={(e) => setLResource(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">WHY I Need It (Specific Story / Technical Blocker)</label>
                  <input
                    type="text"
                    required
                    placeholder="What will break in the film if this isn't mastered?"
                    value={lWhy}
                    onChange={(e) => setLWhy(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium rounded text-xs"
                >
                  Save Learning Goal
                </button>
              </div>
            </form>
          )}

          {/* Learning items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learning.map((lrn) => {
              const shot = shots.find((s) => s.id === lrn.shotId);

              return (
                <div key={lrn.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 text-xs font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {lrn.skill}
                      </span>

                      {shot && (
                        <button
                          onClick={() => onSelectShot(shot)}
                          className="font-mono text-xs text-neutral-300 hover:text-white flex items-center gap-1"
                        >
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>{shot.shotNumber}</span>
                        </button>
                      )}
                    </div>

                    <h2 className="font-semibold text-white text-sm leading-snug">{lrn.topic}</h2>

                    <div className="p-2.5 bg-neutral-950 rounded border border-neutral-850 space-y-1">
                      <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                        Why I Need It For This Film:
                      </span>
                      <p className="text-neutral-300 leading-relaxed text-[11px]">{lrn.whyINeedIt}</p>
                    </div>

                    <div className="text-[11px] text-neutral-400">
                      <strong>Resource: </strong>
                      <span className="text-neutral-300">{lrn.resource}</span>
                    </div>

                    {lrn.result && (
                      <div className="p-2 bg-emerald-950/40 border border-emerald-900/60 rounded text-emerald-300 text-[11px]">
                        <strong>Result: </strong> {lrn.result}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                    <select
                      value={lrn.status}
                      onChange={(e) => {
                        const updated = learning.map((l) =>
                          l.id === lrn.id ? { ...l, status: e.target.value as any } : l
                        );
                        onUpdateLearning(updated);
                      }}
                      className="bg-neutral-950 border border-neutral-750 text-neutral-200 text-xs rounded px-2 py-1"
                    >
                      <option value="Queued">Queued</option>
                      <option value="Studying">Studying</option>
                      <option value="Practicing">Practicing</option>
                      <option value="Mastered">Mastered</option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setItemToDelete({
                          type: 'learning',
                          id: lrn.id,
                          name: lrn.topic,
                        })
                      }
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete Learning Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={`Delete ${itemToDelete?.type === 'blocker' ? 'Blocker' : 'Learning Goal'}?`}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (!itemToDelete) return;
          if (itemToDelete.type === 'learning') {
            onUpdateLearning(learning.filter((l) => l.id !== itemToDelete.id));
          } else {
            onUpdateBlockers(blockers.filter((b) => b.id !== itemToDelete.id));
          }
          setItemToDelete(null);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
