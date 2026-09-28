import React, { useState } from 'react';
import { IdeaStory, ScriptScene, Shot } from '../types';
import { FileText, Sparkles, BookOpen, Film, Plus, CheckCircle2, Check, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface PreProductionViewProps {
  ideaStory: IdeaStory;
  scripts: ScriptScene[];
  shots: Shot[];
  onUpdateIdeaStory: (updated: IdeaStory) => void;
  onUpdateScripts: (updated: ScriptScene[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const PreProductionView: React.FC<PreProductionViewProps> = ({
  ideaStory,
  scripts,
  shots,
  onUpdateIdeaStory,
  onUpdateScripts,
  onSelectShot,
}) => {
  const [subTab, setSubTab] = useState<'idea' | 'story' | 'script'>('idea');
  const [ideaForm, setIdeaForm] = useState<IdeaStory>(ideaStory);
  const [editingScene, setEditingScene] = useState<ScriptScene | null>(null);
  const [sceneToDelete, setSceneToDelete] = useState<ScriptScene | null>(null);

  const handleIdeaChange = (field: keyof IdeaStory, value: any) => {
    const updated = { ...ideaForm, [field]: value };
    setIdeaForm(updated);
    onUpdateIdeaStory(updated);
  };

  const handleAddScene = () => {
    const nextNum = scripts.length > 0 ? Math.max(...scripts.map((s) => s.sceneNumber)) + 1 : 1;
    const newScene: ScriptScene = {
      id: `sc-0${nextNum}`,
      projectId: ideaStory.projectId,
      sceneNumber: nextNum,
      sceneHeading: `INT. NEW LOCATION ${nextNum} - NIGHT`,
      location: 'New Location',
      timeOfDay: 'NIGHT',
      action: 'Describe character movement and atmospheric lighting...',
      dialogue: '',
      voiceOver: '',
      notes: '',
      linkedShotIds: [],
    };
    const updated = [...scripts, newScene];
    onUpdateScripts(updated);
    setEditingScene(newScene);
  };

  const handleSaveScene = (scene: ScriptScene) => {
    const updated = scripts.map((s) => (s.id === scene.id ? scene : s));
    onUpdateScripts(updated);
    setEditingScene(null);
  };

  const handleDeleteScene = (id: string) => {
    onUpdateScripts(scripts.filter((s) => s.id !== id));
    if (editingScene?.id === id) setEditingScene(null);
    setSceneToDelete(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Pre-Production Workspace</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            The storytelling bedrock. Lock your idea, three-act structure, and screenplay before launching Unreal Engine.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setSubTab('idea')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'idea'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            1. Idea & Concept
          </button>
          <button
            onClick={() => setSubTab('story')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'story'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            2. Story Structure
          </button>
          <button
            onClick={() => setSubTab('script')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'script'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            3. Script ({scripts.length} Scenes)
          </button>
        </div>
      </div>

      {/* Subtab 1: IDEA */}
      {subTab === 'idea' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Premise & Aesthetic DNA</span>
            </span>
            <span className="text-xs text-neutral-400">Section 2 — Idea</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                One-Line Concept
              </label>
              <input
                type="text"
                value={ideaForm.oneLineConcept}
                onChange={(e) => handleIdeaChange('oneLineConcept', e.target.value)}
                placeholder="The single high-concept pitch..."
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Genre</label>
                <input
                  type="text"
                  value={ideaForm.genre}
                  onChange={(e) => handleIdeaChange('genre', e.target.value)}
                  placeholder="e.g. Cyberpunk Noir / Thriller"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Theme</label>
                <input
                  type="text"
                  value={ideaForm.theme}
                  onChange={(e) => handleIdeaChange('theme', e.target.value)}
                  placeholder="What is this film truly about underneath the spectacle?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={ideaForm.audience}
                  onChange={(e) => handleIdeaChange('audience', e.target.value)}
                  placeholder="Who is this film crafted for?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Desired Audience Emotion
                </label>
                <input
                  type="text"
                  value={ideaForm.desiredEmotion}
                  onChange={(e) => handleIdeaChange('desiredEmotion', e.target.value)}
                  placeholder="e.g. Claustrophobic tension escalating into awe"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Visual & Cinematic Inspiration
              </label>
              <textarea
                rows={2}
                value={ideaForm.inspiration}
                onChange={(e) => handleIdeaChange('inspiration', e.target.value)}
                placeholder="Directors, films, DP lighting styles, artwork..."
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: STORY */}
      {subTab === 'story' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Three-Act Structure & Emotional Arc</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleIdeaChange('storyApproved', !ideaForm.storyApproved)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors ${
                  ideaForm.storyApproved
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{ideaForm.storyApproved ? 'Story Approved (Gate 01)' : 'Approve Story'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  1. Beginning (Inciting Incident)
                </label>
                <textarea
                  rows={4}
                  value={ideaForm.storyBeginning}
                  onChange={(e) => handleIdeaChange('storyBeginning', e.target.value)}
                  placeholder="Where does the protagonist start? What disrupts normal life?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  2. Middle (Escalation & Crisis)
                </label>
                <textarea
                  rows={4}
                  value={ideaForm.storyMiddle}
                  onChange={(e) => handleIdeaChange('storyMiddle', e.target.value)}
                  placeholder="What obstacles mount? What is the low point?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  3. Ending (Climax & Resolution)
                </label>
                <textarea
                  rows={4}
                  value={ideaForm.storyEnding}
                  onChange={(e) => handleIdeaChange('storyEnding', e.target.value)}
                  placeholder="How does the conflict resolve? What is the final image?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-neutral-850">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Conflict</label>
                <textarea
                  rows={2}
                  value={ideaForm.conflict}
                  onChange={(e) => handleIdeaChange('conflict', e.target.value)}
                  placeholder="Opposing forces, ticking clocks..."
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Character Goal
                </label>
                <textarea
                  rows={2}
                  value={ideaForm.characterGoal}
                  onChange={(e) => handleIdeaChange('characterGoal', e.target.value)}
                  placeholder="What does the character physically want?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Emotional Payoff
                </label>
                <textarea
                  rows={2}
                  value={ideaForm.emotionalPayoff}
                  onChange={(e) => handleIdeaChange('emotionalPayoff', e.target.value)}
                  placeholder="What internal change occurs?"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: SCRIPT */}
      {subTab === 'script' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Screenplay Scenes ({scripts.length})
              </span>
              <button
                onClick={() => handleIdeaChange('scriptApproved', !ideaForm.scriptApproved)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors ${
                  ideaForm.scriptApproved
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{ideaForm.scriptApproved ? 'Script Approved (Gate 01)' : 'Approve Script'}</span>
              </button>
            </div>

            <button
              onClick={handleAddScene}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scene</span>
            </button>
          </div>

          <div className="space-y-4">
            {scripts.map((scene) => {
              const isEditing = editingScene?.id === scene.id;
              const currentSceneData = isEditing ? editingScene : scene;
              const linkedShots = shots.filter((s) => scene.linkedShotIds.includes(s.id));

              return (
                <div
                  key={scene.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        SCENE {scene.sceneNumber}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentSceneData.sceneHeading}
                          onChange={(e) =>
                            setEditingScene({ ...currentSceneData, sceneHeading: e.target.value })
                          }
                          className="bg-neutral-950 border border-neutral-750 rounded px-2 py-1 text-xs font-mono font-bold text-white uppercase focus:outline-none"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-white uppercase">
                          {scene.sceneHeading}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveScene(editingScene!)}
                          className="px-3 py-1 bg-amber-400 text-neutral-950 text-xs font-medium rounded hover:bg-amber-300 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingScene(scene)}
                          className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setSceneToDelete(scene)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded"
                        title="Delete Scene"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 mb-1">Action & Description</label>
                        <textarea
                          rows={3}
                          value={editingScene!.action}
                          onChange={(e) =>
                            setEditingScene({ ...editingScene!, action: e.target.value })
                          }
                          className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:outline-none resize-none leading-relaxed font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-400 mb-1">Dialogue</label>
                          <textarea
                            rows={3}
                            value={editingScene!.dialogue}
                            onChange={(e) =>
                              setEditingScene({ ...editingScene!, dialogue: e.target.value })
                            }
                            placeholder="CHARACTER\n(parenthetical)\nDialogue..."
                            className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:outline-none resize-none leading-relaxed font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 mb-1">Voice-Over / Notes</label>
                          <textarea
                            rows={3}
                            value={editingScene!.voiceOver}
                            onChange={(e) =>
                              setEditingScene({ ...editingScene!, voiceOver: e.target.value })
                            }
                            placeholder="V.O. or pacing notes..."
                            className="w-full bg-neutral-950 border border-neutral-750 rounded p-2.5 text-neutral-200 focus:outline-none resize-none leading-relaxed font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs leading-relaxed font-mono">
                      <p className="text-neutral-300">{scene.action}</p>

                      {scene.dialogue && (
                        <div className="bg-neutral-950/80 p-3 rounded border border-neutral-850 whitespace-pre-line text-amber-200/90 max-w-lg mx-auto text-center">
                          {scene.dialogue}
                        </div>
                      )}

                      {scene.voiceOver && (
                        <div className="text-neutral-400 italic whitespace-pre-line max-w-lg mx-auto text-center">
                          {scene.voiceOver}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Linked Shots Section */}
                  <div className="pt-3 border-t border-neutral-850 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Linked Shots:
                    </span>
                    {linkedShots.length > 0 ? (
                      linkedShots.map((shot) => (
                        <button
                          key={shot.id}
                          onClick={() => onSelectShot(shot)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 rounded text-xs text-neutral-200 font-mono transition-colors"
                        >
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>{shot.shotNumber}</span>
                          <span className="text-neutral-500 text-[10px]">({shot.shotType})</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-neutral-500 text-xs">No shots linked yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Scene Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sceneToDelete}
        title={`Delete Scene ${sceneToDelete?.sceneNumber}?`}
        message={`Are you sure you want to delete Scene ${sceneToDelete?.sceneNumber} (${sceneToDelete?.sceneHeading})? This will remove its screenplay text and linked shot breakdown.`}
        confirmLabel="Delete Scene"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (sceneToDelete) {
            handleDeleteScene(sceneToDelete.id);
          }
        }}
        onCancel={() => setSceneToDelete(null)}
      />
    </div>
  );
};
