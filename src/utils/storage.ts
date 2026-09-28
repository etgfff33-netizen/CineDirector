import {
  Project,
  IdeaStory,
  ScriptScene,
  VisualReference,
  StoryboardFrame,
  Shot,
  Asset,
  CharacterAnimation,
  VfxNiagaraItem,
  LightingItem,
  RenderItem,
  CompositingItem,
  EnvironmentSetItem,
  EditSequence,
  SoundItem,
  ProblemBlocker,
  LearningItem,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_IDEA_STORY,
  INITIAL_SCRIPTS,
  INITIAL_REFERENCES,
  INITIAL_STORYBOARD,
  INITIAL_SHOTS,
  INITIAL_ASSETS,
  INITIAL_ANIMATIONS,
  INITIAL_VFX,
  INITIAL_LIGHTING,
  INITIAL_RENDERS,
  INITIAL_COMPOSITING,
  INITIAL_ENVIRONMENTS,
  INITIAL_EDIT,
  INITIAL_SOUNDS,
  INITIAL_BLOCKERS,
  INITIAL_LEARNING,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROJECTS: 'cinedirector_projects_v1',
  ACTIVE_PROJECT_ID: 'cinedirector_active_project_id_v1',
  IDEA_STORY: 'cinedirector_idea_story_v1',
  SCRIPTS: 'cinedirector_scripts_v1',
  REFERENCES: 'cinedirector_references_v1',
  STORYBOARD: 'cinedirector_storyboard_v1',
  SHOTS: 'cinedirector_shots_v1',
  ASSETS: 'cinedirector_assets_v1',
  ANIMATIONS: 'cinedirector_animations_v1',
  VFX: 'cinedirector_vfx_v1',
  LIGHTING: 'cinedirector_lighting_v1',
  RENDERS: 'cinedirector_renders_v1',
  COMPOSITING: 'cinedirector_compositing_v1',
  ENVIRONMENTS: 'cinedirector_environments_v1',
  EDIT: 'cinedirector_edit_v1',
  SOUNDS: 'cinedirector_sounds_v1',
  BLOCKERS: 'cinedirector_blockers_v1',
  LEARNING: 'cinedirector_learning_v1',
};

function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Failed to parse localStorage key ${key}`, e);
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save localStorage key ${key}`, e);
  }
}

export const Storage = {
  loadProjects: () => load<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: Project[]) => save(STORAGE_KEYS.PROJECTS, data),

  loadActiveProjectId: () => load<string>(STORAGE_KEYS.ACTIVE_PROJECT_ID, 'proj-omega-dawn'),
  saveActiveProjectId: (id: string) => save(STORAGE_KEYS.ACTIVE_PROJECT_ID, id),

  loadIdeaStory: () => load<Record<string, IdeaStory>>(STORAGE_KEYS.IDEA_STORY, INITIAL_IDEA_STORY),
  saveIdeaStory: (data: Record<string, IdeaStory>) => save(STORAGE_KEYS.IDEA_STORY, data),

  loadScripts: () => load<ScriptScene[]>(STORAGE_KEYS.SCRIPTS, INITIAL_SCRIPTS),
  saveScripts: (data: ScriptScene[]) => save(STORAGE_KEYS.SCRIPTS, data),

  loadReferences: () => load<VisualReference[]>(STORAGE_KEYS.REFERENCES, INITIAL_REFERENCES),
  saveReferences: (data: VisualReference[]) => save(STORAGE_KEYS.REFERENCES, data),

  loadStoryboard: () => load<StoryboardFrame[]>(STORAGE_KEYS.STORYBOARD, INITIAL_STORYBOARD),
  saveStoryboard: (data: StoryboardFrame[]) => save(STORAGE_KEYS.STORYBOARD, data),

  loadShots: () => load<Shot[]>(STORAGE_KEYS.SHOTS, INITIAL_SHOTS),
  saveShots: (data: Shot[]) => save(STORAGE_KEYS.SHOTS, data),

  loadAssets: () => load<Asset[]>(STORAGE_KEYS.ASSETS, INITIAL_ASSETS),
  saveAssets: (data: Asset[]) => save(STORAGE_KEYS.ASSETS, data),

  loadAnimations: () => load<CharacterAnimation[]>(STORAGE_KEYS.ANIMATIONS, INITIAL_ANIMATIONS),
  saveAnimations: (data: CharacterAnimation[]) => save(STORAGE_KEYS.ANIMATIONS, data),

  loadVfx: () => load<VfxNiagaraItem[]>(STORAGE_KEYS.VFX, INITIAL_VFX),
  saveVfx: (data: VfxNiagaraItem[]) => save(STORAGE_KEYS.VFX, data),

  loadLighting: () => load<LightingItem[]>(STORAGE_KEYS.LIGHTING, INITIAL_LIGHTING),
  saveLighting: (data: LightingItem[]) => save(STORAGE_KEYS.LIGHTING, data),

  loadRenders: () => load<RenderItem[]>(STORAGE_KEYS.RENDERS, INITIAL_RENDERS),
  saveRenders: (data: RenderItem[]) => save(STORAGE_KEYS.RENDERS, data),

  loadCompositing: () => load<CompositingItem[]>(STORAGE_KEYS.COMPOSITING, INITIAL_COMPOSITING),
  saveCompositing: (data: CompositingItem[]) => save(STORAGE_KEYS.COMPOSITING, data),

  loadEnvironments: () => load<EnvironmentSetItem[]>(STORAGE_KEYS.ENVIRONMENTS, INITIAL_ENVIRONMENTS),
  saveEnvironments: (data: EnvironmentSetItem[]) => save(STORAGE_KEYS.ENVIRONMENTS, data),

  loadEdit: () => load<EditSequence[]>(STORAGE_KEYS.EDIT, INITIAL_EDIT),
  saveEdit: (data: EditSequence[]) => save(STORAGE_KEYS.EDIT, data),

  loadSounds: () => load<SoundItem[]>(STORAGE_KEYS.SOUNDS, INITIAL_SOUNDS),
  saveSounds: (data: SoundItem[]) => save(STORAGE_KEYS.SOUNDS, data),

  loadBlockers: () => load<ProblemBlocker[]>(STORAGE_KEYS.BLOCKERS, INITIAL_BLOCKERS),
  saveBlockers: (data: ProblemBlocker[]) => save(STORAGE_KEYS.BLOCKERS, data),

  loadLearning: () => load<LearningItem[]>(STORAGE_KEYS.LEARNING, INITIAL_LEARNING),
  saveLearning: (data: LearningItem[]) => save(STORAGE_KEYS.LEARNING, data),

  resetToDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  },

  exportAllDataJson: () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects: Storage.loadProjects(),
      ideaStory: Storage.loadIdeaStory(),
      scripts: Storage.loadScripts(),
      references: Storage.loadReferences(),
      storyboard: Storage.loadStoryboard(),
      shots: Storage.loadShots(),
      assets: Storage.loadAssets(),
      animations: Storage.loadAnimations(),
      vfx: Storage.loadVfx(),
      lighting: Storage.loadLighting(),
      renders: Storage.loadRenders(),
      compositing: Storage.loadCompositing(),
      environments: Storage.loadEnvironments(),
      edit: Storage.loadEdit(),
      sounds: Storage.loadSounds(),
      blockers: Storage.loadBlockers(),
      learning: Storage.loadLearning(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CineDirector_Production_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importDataJson: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects) Storage.saveProjects(data.projects);
      if (data.ideaStory) Storage.saveIdeaStory(data.ideaStory);
      if (data.scripts) Storage.saveScripts(data.scripts);
      if (data.references) Storage.saveReferences(data.references);
      if (data.storyboard) Storage.saveStoryboard(data.storyboard);
      if (data.shots) Storage.saveShots(data.shots);
      if (data.assets) Storage.saveAssets(data.assets);
      if (data.animations) Storage.saveAnimations(data.animations);
      if (data.vfx) Storage.saveVfx(data.vfx);
      if (data.lighting) Storage.saveLighting(data.lighting);
      if (data.renders) Storage.saveRenders(data.renders);
      if (data.compositing) Storage.saveCompositing(data.compositing);
      if (data.environments) Storage.saveEnvironments(data.environments);
      if (data.edit) Storage.saveEdit(data.edit);
      if (data.sounds) Storage.saveSounds(data.sounds);
      if (data.blockers) Storage.saveBlockers(data.blockers);
      if (data.learning) Storage.saveLearning(data.learning);
      window.location.reload();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};
