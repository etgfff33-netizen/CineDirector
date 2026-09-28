import React, { useState, useEffect } from 'react';
import { Shot, ShotType, ShotComplexity, ShotStatus, AudienceEmotion, PipelinePhase } from '../types';
import { X, Lock, Unlock, AlertTriangle, Sparkles, Camera, Film, Layers, Video, Play, Trash2 } from 'lucide-react';
import { MediaDisplay } from './MediaDisplay';
import { MediaUploadInput } from './MediaUploadInput';
import { ConfirmModal } from './ConfirmModal';

interface ShotModalProps {
  shot: Shot | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedShot: Shot) => void;
  onDelete?: (shotId: string) => void;
}

const SHOT_TYPES: ShotType[] = [
  'Extreme Wide',
  'Wide',
  'Medium Wide',
  'Medium',
  'Medium Close-Up',
  'Close-Up',
  'Extreme Close-Up',
  'OTS',
  'POV',
  'Insert',
  'Tracking',
];

const EMOTIONS: AudienceEmotion[] = [
  'Wonder',
  'Fear',
  'Curiosity',
  'Sadness',
  'Excitement',
  'Tension',
  'Surprise',
  'Awe',
  'Despair',
  'Triumph',
];

const STAGES: PipelinePhase[] = [
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
  'Color',
  'Final QC',
  'Release',
];

export const ShotModal: React.FC<ShotModalProps> = ({
  shot,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !shot) return null;

  const [form, setForm] = useState<Shot>({ ...shot });
  const [activeTab, setActiveTab] = useState<'purpose' | 'camera' | 'elements' | 'media' | 'production'>('purpose');
  const [showCameraLockWarning, setShowCameraLockWarning] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (shot) {
      setForm({ ...shot });
    }
  }, [shot]);

  const handleFieldChange = (field: keyof Shot, value: any) => {
    // Check camera lock guard for camera fields
    if (
      form.cameraLocked &&
      ['lens', 'cameraMovement', 'fov', 'sensor', 'camera'].includes(field as string)
    ) {
      setShowCameraLockWarning(true);
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnlockAndBumpVersion = () => {
    const currentVerNum = parseInt(form.cameraVersion.replace(/\D/g, '') || '1', 10);
    const nextVer = `v0${currentVerNum + 1}`;
    setForm((prev) => ({
      ...prev,
      cameraLocked: false,
      cameraVersion: nextVer,
    }));
    setShowCameraLockWarning(false);
  };

  const isPurposeEmpty = !form.purpose || form.purpose.trim() === '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
              {form.shotNumber}
            </span>
            <div>
              <h2 className="text-base font-semibold text-white truncate max-w-md">
                {form.description || 'Untitled Shot'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span>{form.scene}</span>
                <span>·</span>
                <span>{form.shotType}</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{form.durationSeconds}s ({form.durationFrames}f)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFieldChange('cameraLocked', !form.cameraLocked)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
                form.cameraLocked
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
              }`}
              title={form.cameraLocked ? 'Camera is locked' : 'Lock camera settings'}
            >
              {form.cameraLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{form.cameraLocked ? `Locked (${form.cameraVersion})` : 'Lock Camera'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera lock warning banner if triggered */}
        {showCameraLockWarning && (
          <div className="px-6 py-3 bg-amber-950/80 border-b border-amber-700 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Camera is Locked!</strong> In Unreal Engine cinematics, changing lens, position, or framing after lock invalidates previs & lighting.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowCameraLockWarning(false)}
                className="px-2 py-0.5 text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlockAndBumpVersion}
                className="px-2.5 py-1 bg-amber-400 text-neutral-950 font-medium rounded hover:bg-amber-300"
              >
                Create New Version & Unlock
              </button>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-neutral-800 bg-neutral-950 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('purpose')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'purpose'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Story & Purpose</span>
            {isPurposeEmpty && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera & Lens</span>
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'elements'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Assets & FX</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Artwork & Previs Clips</span>
            {(form.previsUrl || form.finalRenderUrl) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('production')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'production'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Pipeline & Status</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'purpose' && (
            <div className="space-y-5">
              {/* Mandatory Purpose Warning */}
              {isPurposeEmpty && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded flex items-center gap-2 text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>Warning:</strong> This shot has no defined storytelling purpose.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-neutral-400 font-semibold uppercase tracking-wider text-[11px] mb-1">
                  Shot Identifier & Description
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-neutral-500 block text-[10px] mb-0.5">Shot Code</span>
                    <input
                      type="text"
                      value={form.shotNumber}
                      onChange={(e) => handleFieldChange('shotNumber', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1.5 text-neutral-200 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] mb-0.5">Scene</span>
                    <input
                      type="text"
                      value={form.scene}
                      onChange={(e) => handleFieldChange('scene', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-neutral-500 block text-[10px] mb-0.5">1-Line Action Summary</span>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="e.g. Courier leaps across catwalk as alarms trigger"
                      className="w-full bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CORE PURPOSE SYSTEM: WHAT -> WHY -> FEELING -> HOW */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                  <span className="font-semibold text-neutral-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>The Director's Intent</span>
                  </span>
                  <span className="text-neutral-500 text-[11px]">Director First. Technology Second.</span>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    1. WHAT HAPPENS? <span className="text-neutral-500 font-normal">(Physical action in the frame)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.whatHappens}
                    onChange={(e) => handleFieldChange('whatHappens', e.target.value)}
                    placeholder="Describe what physically occurs from frame 0 to end..."
                    className="w-full bg-neutral-900 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-300 font-medium">
                      2. WHY DOES THIS SHOT EXIST? <span className="text-amber-400 font-semibold">*Mandatory</span>
                    </label>
                    {isPurposeEmpty && (
                      <span className="text-rose-400 text-[11px] font-medium">No purpose defined</span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={form.purpose}
                    onChange={(e) => handleFieldChange('purpose', e.target.value)}
                    placeholder="What storytelling purpose does it serve? How does it advance character or stakes?"
                    className={`w-full bg-neutral-900 border rounded p-2.5 text-neutral-200 focus:outline-none resize-none leading-relaxed ${
                      isPurposeEmpty ? 'border-rose-700/80 focus:border-rose-500' : 'border-neutral-750 focus:border-amber-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      3. WHAT SHOULD THE AUDIENCE FEEL?
                    </label>
                    <select
                      value={form.audienceFeeling}
                      onChange={(e) => handleFieldChange('audienceFeeling', e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                    >
                      {EMOTIONS.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Duration & Speed
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={form.durationSeconds}
                        onChange={(e) => {
                          const sec = parseFloat(e.target.value) || 0;
                          setForm((prev) => ({
                            ...prev,
                            durationSeconds: sec,
                            durationFrames: Math.round(sec * prev.fps),
                          }));
                        }}
                        className="w-24 bg-neutral-900 border border-neutral-750 rounded p-1.5 font-mono text-neutral-200 text-center"
                      />
                      <span className="text-neutral-500">sec</span>
                      <span className="text-neutral-600">/</span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {form.durationFrames} frames @ {form.fps}fps
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    4. HOW WILL I ACHIEVE IT? <span className="text-neutral-500 font-normal">(Camera + performance + env + lighting + VFX)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.howAchieve}
                    onChange={(e) => handleFieldChange('howAchieve', e.target.value)}
                    placeholder="e.g. 85mm anamorphic + MetaHuman skin shader subsurface + animated ocular emissive material in Sequencer..."
                    className="w-full bg-neutral-900 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded">
                <div>
                  <span className="text-neutral-300 font-medium">Camera Lock State: </span>
                  <span className={form.cameraLocked ? 'text-amber-400 font-semibold' : 'text-neutral-400'}>
                    {form.cameraLocked ? `LOCKED (${form.cameraVersion})` : 'UNLOCKED'}
                  </span>
                </div>
                <button
                  onClick={() => handleFieldChange('cameraLocked', !form.cameraLocked)}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                >
                  {form.cameraLocked ? 'Unlock Camera' : 'Lock Camera'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Framing / Shot Type</label>
                  <select
                    value={form.shotType}
                    onChange={(e) => handleFieldChange('shotType', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  >
                    {SHOT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">CineCamera Actor Name</label>
                  <input
                    type="text"
                    value={form.camera}
                    onChange={(e) => handleFieldChange('camera', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Lens & Focal Length</label>
                  <input
                    type="text"
                    value={form.lens}
                    onChange={(e) => handleFieldChange('lens', e.target.value)}
                    placeholder="e.g. 35mm Anamorphic 2x"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Sensor Format</label>
                  <input
                    type="text"
                    value={form.sensor}
                    onChange={(e) => handleFieldChange('sensor', e.target.value)}
                    placeholder="e.g. Super 35 Anamorphic"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Field of View (FOV)</label>
                  <input
                    type="text"
                    value={form.fov}
                    onChange={(e) => handleFieldChange('fov', e.target.value)}
                    placeholder="e.g. 52°"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Depth of Field (Aperture)</label>
                  <input
                    type="text"
                    value={form.dof}
                    onChange={(e) => handleFieldChange('dof', e.target.value)}
                    placeholder="e.g. f/2.0 Shallow"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Camera Height</label>
                  <input
                    type="text"
                    value={form.cameraHeight}
                    onChange={(e) => handleFieldChange('cameraHeight', e.target.value)}
                    placeholder="e.g. 1.2m"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Subject Distance</label>
                  <input
                    type="text"
                    value={form.cameraDistance}
                    onChange={(e) => handleFieldChange('cameraDistance', e.target.value)}
                    placeholder="e.g. 4.5m"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Focus Distance</label>
                  <input
                    type="text"
                    value={form.focusDistance}
                    onChange={(e) => handleFieldChange('focusDistance', e.target.value)}
                    placeholder="e.g. 450cm"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Shutter Angle</label>
                  <input
                    type="text"
                    value={form.shutterAngle}
                    onChange={(e) => handleFieldChange('shutterAngle', e.target.value)}
                    placeholder="e.g. 180°"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Camera Shake / Rig</label>
                  <input
                    type="text"
                    value={form.cameraShake}
                    onChange={(e) => handleFieldChange('cameraShake', e.target.value)}
                    placeholder="e.g. Subtle handheld or Dolly"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Camera Movement</label>
                  <input
                    type="text"
                    value={form.cameraMovement}
                    onChange={(e) => handleFieldChange('cameraMovement', e.target.value)}
                    placeholder="e.g. High-speed lateral tracking right to left"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Character & Performance</label>
                  <input
                    type="text"
                    value={form.character}
                    onChange={(e) => handleFieldChange('character', e.target.value)}
                    placeholder="e.g. Vesper MetaHuman LOD0"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Environment / Level</label>
                  <input
                    type="text"
                    value={form.environment}
                    onChange={(e) => handleFieldChange('environment', e.target.value)}
                    placeholder="e.g. Sector 9 Catwalk Silo"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Key Props</label>
                  <input
                    type="text"
                    value={form.props}
                    onChange={(e) => handleFieldChange('props', e.target.value)}
                    placeholder="e.g. Cognitive Core case, klaxon lights"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Niagara VFX</label>
                  <input
                    type="text"
                    value={form.fx}
                    onChange={(e) => handleFieldChange('fx', e.target.value)}
                    placeholder="e.g. Sparks, Volumetric Fog, Rain"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-neutral-400 mb-1">Animation & Mocap Source</label>
                  <input
                    type="text"
                    value={form.animation}
                    onChange={(e) => handleFieldChange('animation', e.target.value)}
                    placeholder="e.g. Sprint mocap cycle retargeted + facial live link"
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Shot Visual & Motion Media Assets
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Upload or link video playblasts, storyboard frames, and final Movie Render Queue (MRQ) renders.
                </p>
              </div>

              {/* 1. Previs Video / Playblast */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Previs Motion Playblast (Video / Clip)</span>
                  </span>
                  {form.previsApproved && (
                    <span className="text-[10px] text-emerald-400 font-mono">Previs Approved</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-800 rounded overflow-hidden bg-black">
                    <MediaDisplay
                      src={form.previsUrl}
                      mediaType={form.previsMediaType}
                      aspectRatioClass="aspect-video"
                      fallbackLabel="[ NO PREVIS CLIP UPLOADED ]"
                    />
                  </div>
                  <div>
                    <MediaUploadInput
                      label="Upload Previs Playblast or Paste URL"
                      value={form.previsUrl}
                      mediaType={form.previsMediaType}
                      onChange={(url, detectedType) => {
                        setForm((prev) => ({
                          ...prev,
                          previsUrl: url,
                          previsMediaType: detectedType,
                        }));
                      }}
                      placeholder="Upload MP4/WebM playblast or paste link"
                      helperText="Unreal viewport recording, Blender previs, or greyscale blocking clip"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Storyboard Frame */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Storyboard Frame Sketch or Motion Beat</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-800 rounded overflow-hidden bg-black">
                    <MediaDisplay
                      src={form.storyboardUrl}
                      mediaType={form.storyboardMediaType}
                      aspectRatioClass="aspect-video"
                      fallbackLabel="[ NO STORYBOARD FRAME ]"
                    />
                  </div>
                  <div>
                    <MediaUploadInput
                      label="Upload Storyboard Image / Motion Clip"
                      value={form.storyboardUrl}
                      mediaType={form.storyboardMediaType}
                      onChange={(url, detectedType) => {
                        setForm((prev) => ({
                          ...prev,
                          storyboardUrl: url,
                          storyboardMediaType: detectedType,
                        }));
                      }}
                      placeholder="Upload image or motion storyboard video"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Final Master Render (MRQ) */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Final Movie Render Queue (MRQ) Video / Still</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-800 rounded overflow-hidden bg-black">
                    <MediaDisplay
                      src={form.finalRenderUrl}
                      mediaType={form.finalRenderMediaType}
                      aspectRatioClass="aspect-video"
                      fallbackLabel="[ NO FINAL RENDER LOADED ]"
                    />
                  </div>
                  <div>
                    <MediaUploadInput
                      label="Upload Final Render Clip or Still"
                      value={form.finalRenderUrl}
                      mediaType={form.finalRenderMediaType}
                      onChange={(url, detectedType) => {
                        setForm((prev) => ({
                          ...prev,
                          finalRenderUrl: url,
                          finalRenderMediaType: detectedType,
                        }));
                      }}
                      placeholder="Upload MP4 render or high-res frame"
                      helperText="Exported pass from Unreal Sequencer / Movie Render Queue"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Composite & Color Grade Pass */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nuke / DaVinci Composite or Color Grade Plate</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-800 rounded overflow-hidden bg-black">
                    <MediaDisplay
                      src={form.compositeUrl}
                      mediaType={form.compositeMediaType}
                      aspectRatioClass="aspect-video"
                      fallbackLabel="[ NO COMPOSITE CLIP LOADED ]"
                    />
                  </div>
                  <div>
                    <MediaUploadInput
                      label="Upload Composite Video or Still"
                      value={form.compositeUrl}
                      mediaType={form.compositeMediaType}
                      onChange={(url, detectedType) => {
                        setForm((prev) => ({
                          ...prev,
                          compositeUrl: url,
                          compositeMediaType: detectedType,
                        }));
                      }}
                      placeholder="Upload composite MP4 or graded frame"
                      helperText="Nuke multipass EXR composite or DaVinci Resolve color delivery"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'production' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => handleFieldChange('stage', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-semibold"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Working">Working</option>
                    <option value="Review">Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Complexity</label>
                  <select
                    value={form.complexity}
                    onChange={(e) => handleFieldChange('complexity', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="A — Simple">A — Simple</option>
                    <option value="B — Medium">B — Medium</option>
                    <option value="C — Difficult">C — Difficult</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Dependencies</label>
                <input
                  type="text"
                  value={form.dependencies}
                  onChange={(e) => handleFieldChange('dependencies', e.target.value)}
                  placeholder="e.g. Nanite alleyway lock, MetaHuman rig cleanup"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-rose-400 font-medium mb-1">Current Blocker (If any)</label>
                <input
                  type="text"
                  value={form.blocker}
                  onChange={(e) => handleFieldChange('blocker', e.target.value)}
                  placeholder="e.g. Lumen ghosting on fast pan"
                  className="w-full bg-neutral-950 border border-rose-900/60 rounded p-2 text-rose-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Production Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Render settings, grading notes, or Unreal Sequencer tips..."
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Shot</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="px-4 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              Save Shot Changes
            </button>
          </div>
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title={`Delete Shot ${form.shotNumber}?`}
        message={`Are you sure you want to delete ${form.shotNumber} (${form.description || 'Untitled Shot'})? This will remove its CineCamera bindings, storyboard links, and all asset assignments.`}
        confirmLabel="Delete Shot"
        cancelLabel="Keep Shot"
        isDestructive={true}
        onConfirm={() => {
          if (onDelete) {
            onDelete(form.id);
            onClose();
          }
        }}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};
