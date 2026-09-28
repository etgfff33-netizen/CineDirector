import React, { useState } from 'react';
import { Project, PipelinePhase, ProjectType } from '../types';
import { Film, X, Sparkles, Calendar, Clock, AlertCircle } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (
    project: Project,
    templateOption: 'starter' | 'blank'
  ) => void;
}

const PHASES: PipelinePhase[] = [
  'Concept',
  'Story',
  'Script',
  'References',
  'Storyboard',
  'Shot List',
  'Previs',
  'Animatic',
  'Asset Planning',
  'Environment',
  'Character',
  'Animation',
  'Lighting',
  'FX',
  'Rendering',
  'Compositing',
  'Edit',
  'Sound',
];

const PROJECT_TYPES: ProjectType[] = [
  'Cinematic',
  'Short Film',
  'Advertisement',
  'Documentary',
  'VFX Experiment',
  'Technical Experiment',
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('Cinematic');
  const [currentPhase, setCurrentPhase] = useState<PipelinePhase>('Storyboard');
  const [priority, setPriority] = useState<Project['priority']>('Medium');
  const [runtime, setRuntime] = useState('01:30');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [logline, setLogline] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [templateOption, setTemplateOption] = useState<'starter' | 'blank'>('starter');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newProj: Project = {
      id: projectId,
      name: name.trim().toUpperCase(),
      type,
      status: 'Pre-Production',
      currentPhase,
      priority,
      targetDate: targetDate || '2026-12-31',
      runtime: runtime || '01:30',
      description: logline || `${type} project built with Unreal Engine 5`,
      logline: logline || `Cinematic short exploring high-tension virtual cinematography`,
      mainGoal: mainGoal || `Lock storyboard and camera blocking for ${name.trim().toUpperCase()}`,
      todaysGoal: `Establish narrative beat sheet and shot breakdown`,
      currentTask: 'Initial script and framing review',
      blocker: '',
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProj, templateOption);
    onClose();
    // Reset form
    setName('');
    setLogline('');
    setMainGoal('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Create New Cinematic Project</h2>
              <p className="text-[11px] text-neutral-400">
                Setup a new production workspace for Unreal Engine 5 filmmaking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <label className="block text-neutral-300 font-semibold mb-1">
                Project Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NEON RECKONING, CYBER DUSK"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-semibold tracking-wide placeholder:font-normal placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Project Format / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Starting Production Phase</label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>Target Runtime (MM:SS)</span>
              </label>
              <input
                type="text"
                placeholder="01:30"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-500" />
                <span>Target Delivery Date</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Priority</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-neutral-400 mb-1">Concept / Narrative Logline</label>
              <textarea
                rows={2}
                placeholder="Describe the central story, character motivation, and visual mood..."
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* Template Selection */}
            <div className="md:col-span-2 space-y-2 pt-1">
              <label className="block text-neutral-300 font-medium">Starter Production Blueprint</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateOption('starter')}
                  className={`p-3 rounded border text-left transition-all ${
                    templateOption === 'starter'
                      ? 'border-amber-400 bg-amber-950/20 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cinematic Starter Kit</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Includes 3 initial CineCamera shots (Wide, Medium, Close-Up), storyboard frames, and lighting template.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateOption('blank')}
                  className={`p-3 rounded border text-left transition-all ${
                    templateOption === 'blank'
                      ? 'border-amber-400 bg-amber-950/20 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-200 mb-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>Clean Slate</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Completely blank workspace with 0 shots, ready for custom sequence build from scratch.
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
