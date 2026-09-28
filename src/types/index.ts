export type ProjectType =
  | 'Short Film'
  | 'Cinematic'
  | 'Advertisement'
  | 'Documentary'
  | 'VFX Experiment'
  | 'Technical Experiment';

export type ProjectStatus =
  | 'Idea'
  | 'Story'
  | 'Pre-Production'
  | 'Production'
  | 'Post-Production'
  | 'Review'
  | 'Completed'
  | 'On Hold'
  | 'Abandoned';

export type PipelinePhase =
  | 'Concept'
  | 'Story'
  | 'Script'
  | 'References'
  | 'Storyboard'
  | 'Shot List'
  | 'Previs'
  | 'Animatic'
  | 'Asset Planning'
  | 'Environment'
  | 'Character'
  | 'Animation'
  | 'Lighting'
  | 'FX'
  | 'Rendering'
  | 'Compositing'
  | 'Edit'
  | 'Sound'
  | 'Color'
  | 'Final QC'
  | 'Release';

export type ShotType =
  | 'Extreme Wide'
  | 'Wide'
  | 'Medium Wide'
  | 'Medium'
  | 'Medium Close-Up'
  | 'Close-Up'
  | 'Extreme Close-Up'
  | 'OTS'
  | 'POV'
  | 'Insert'
  | 'Tracking';

export type ShotComplexity = 'A — Simple' | 'B — Medium' | 'C — Difficult';

export type ShotStatus =
  | 'Not Started'
  | 'Working'
  | 'Review'
  | 'Approved'
  | 'Blocked'
  | 'Final';

export type AudienceEmotion =
  | 'Wonder'
  | 'Fear'
  | 'Curiosity'
  | 'Sadness'
  | 'Excitement'
  | 'Tension'
  | 'Surprise'
  | 'Awe'
  | 'Despair'
  | 'Triumph';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  currentPhase: PipelinePhase;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  targetDate: string;
  runtime: string; // e.g. "03:45"
  description: string;
  logline: string;
  mainGoal: string;
  todaysGoal: string;
  currentTask: string;
  blocker: string;
  notes: string;
  createdAt: string;
}

export interface IdeaStory {
  projectId: string;
  oneLineConcept: string;
  genre: string;
  theme: string;
  audience: string;
  desiredEmotion: string;
  inspiration: string;
  storyBeginning: string;
  storyMiddle: string;
  storyEnding: string;
  conflict: string;
  characterGoal: string;
  emotionalPayoff: string;
  storyApproved: boolean;
  scriptApproved: boolean;
}

export interface ScriptScene {
  id: string;
  projectId: string;
  sceneNumber: number;
  sceneHeading: string; // e.g. "INT. REPLICA LAB - NIGHT"
  location: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN' | 'GOLDEN HOUR';
  action: string;
  dialogue: string;
  voiceOver: string;
  notes: string;
  linkedShotIds: string[];
}

export interface VisualReference {
  id: string;
  projectId: string;
  category:
    | 'Environment'
    | 'Character'
    | 'Costume'
    | 'Architecture'
    | 'Props'
    | 'Lighting'
    | 'Color'
    | 'Camera'
    | 'Composition'
    | 'VFX'
    | 'Cinematography';
  title: string;
  imageUrl: string; // supports image or video dataUrl / webUrl
  mediaType?: 'image' | 'video';
  notes: string;
  tags: string[];
  linkedScene?: string;
  linkedShotId?: string;
  linkedAssetId?: string;
}

export interface StoryboardFrame {
  id: string;
  shotId: string;
  projectId: string;
  scene: string;
  order: number;
  frameImage: string; // supports image or video dataUrl / webUrl
  mediaType?: 'image' | 'video';
  shotDescription: string;
  framing: ShotType;
  cameraPosition: string;
  cameraMovement: string;
  characterPosition: string;
  characterAction: string;
  lens: string;
  durationSeconds: number;
  dialogue: string;
  sound: string;
  vfxNotes: string;
  purpose: string;
  version: string; // 'v01', 'v02'
}

export interface Shot {
  id: string;
  projectId: string;
  scene: string;
  shotNumber: string; // e.g. "GNS-001"
  description: string;
  
  // Shot Purpose System
  whatHappens: string; // What physically happens?
  purpose: string; // Why does this shot exist? (Warns if empty!)
  audienceFeeling: AudienceEmotion | string; // What should audience feel?
  howAchieve: string; // Camera + performance + env + lighting + VFX
  
  shotType: ShotType;
  camera: string;
  lens: string;
  cameraMovement: string;
  durationFrames: number;
  durationSeconds: number;
  fps: number;
  
  // Elements
  character: string;
  environment: string;
  props: string;
  cgElements: string;
  fx: string;
  animation: string;
  
  stage: PipelinePhase;
  status: ShotStatus;
  complexity: ShotComplexity;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dependencies: string;
  blocker: string;
  
  // Artwork links / previews (Image or Video)
  referenceUrl?: string;
  referenceMediaType?: 'image' | 'video';
  storyboardUrl?: string;
  storyboardMediaType?: 'image' | 'video';
  previsUrl?: string;
  previsMediaType?: 'image' | 'video';
  finalRenderUrl?: string;
  finalRenderMediaType?: 'image' | 'video';
  compositeUrl?: string;
  compositeMediaType?: 'image' | 'video';
  
  notes: string;
  
  // Previs & Camera specs
  previsApproved: boolean;
  previsVersion: string;
  cameraLocked: boolean;
  cameraVersion: string;
  sensor: string;
  fov: string;
  cameraHeight: string;
  cameraDistance: string;
  focusDistance: string;
  dof: string;
  shutterAngle: string;
  cameraShake: string;
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  type:
    | 'Character'
    | 'Environment'
    | 'Prop'
    | 'Vehicle'
    | 'Material'
    | 'Texture'
    | 'Animation'
    | 'FX'
    | 'Lighting'
    | 'Sound';
  requiredShotIds: string[]; // Shot IDs that require this
  source: string; // e.g. 'Fab / Quixel', 'MetaHuman Creator', 'Blender Scratch', 'KitBash3D'
  status: 'Need' | 'Searching' | 'Creating' | 'Working' | 'Ready' | 'Used';
  quality: 'Proxy' | 'Mid-Poly' | 'High-Poly' | 'Nanite' | 'Final Polish';
  priority: 'Low' | 'Medium' | 'High';
  material: string;
  texture: string;
  rig: string;
  animation: string;
  optimization: string;
  fileLocation: string;
  previewUrl?: string; // Image or turntable video
  previewMediaType?: 'image' | 'video';
  notes: string;
}

export interface CharacterAnimation {
  id: string;
  projectId: string;
  character: string;
  shotId: string;
  animationRequired: string;
  source:
    | 'MetaHuman'
    | 'Mixamo'
    | 'Motion Capture'
    | 'Hand Animation'
    | 'Cascadeur'
    | 'iClone'
    | 'Custom';
  mocap: boolean;
  retarget: boolean;
  cleanup: boolean;
  facialAnimation: boolean;
  interaction: string;
  status: 'Not Started' | 'In Progress' | 'Review' | 'Approved';
  notes: string;
}

export interface VfxNiagaraItem {
  id: string;
  projectId: string;
  shotId: string;
  effect:
    | 'Fire'
    | 'Smoke'
    | 'Sparks'
    | 'Dust'
    | 'Explosion'
    | 'Debris'
    | 'Magic'
    | 'Energy'
    | 'Rain'
    | 'Snow'
    | 'Fog'
    | 'Destruction';
  type: 'CPU' | 'GPU Particle' | 'Ribbon' | 'Fluid Simulation' | 'Mesh Emitter';
  trigger: string;
  interaction: string;
  simulation: string;
  lightingInteraction: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  status: 'Planning' | 'Setup' | 'Tuning' | 'Approved';
}

export interface LightingItem {
  id: string;
  projectId: string;
  shotId: string;
  setup: string;
  keyLight: string;
  fill: string;
  rim: string;
  practical: string;
  atmosphere: string;
  characterLight: string;
  cgLightInteraction: string;
  reference: string;
  status: 'Concept' | 'Blocked' | 'Balanced' | 'Final Polish';
}

export interface RenderItem {
  id: string;
  projectId: string;
  shotId: string;
  renderVersion: 'v001' | 'v002' | 'v003' | 'Final';
  resolution: '1920x1080' | '2560x1440' | '3840x2160 (4K)' | 'Custom Anamorphic (3840x1608)';
  fps: number;
  engine: 'Unreal Engine 5.4' | 'Unreal Engine 5.5' | 'Path Tracer';
  renderMethod: 'Movie Render Queue (MRQ)' | 'Lumen Hardware Raytracing' | 'Substrate Path Tracer';
  samples: string;
  renderSettings: string;
  renderTime: string;
  fileLocation: string;
  problems: string;
  status: 'Queued' | 'Rendering' | 'Failed' | 'Completed' | 'QC Approved';
  isFinal: boolean;
}

export interface CompositingItem {
  id: string;
  projectId: string;
  shotId: string;
  nukeScript: string;
  keying: boolean;
  roto: boolean;
  tracking: boolean;
  lensDistortion: boolean;
  cgPasses: string; // Cryptomatte, Depth, WorldNormal, AmbientOcclusion
  shadows: boolean;
  reflections: boolean;
  lightWrap: boolean;
  atmosphere: boolean;
  dof: boolean;
  motionBlur: boolean;
  grain: boolean;
  colorMatch: boolean;
  finalQc: boolean;
  status: 'Not Started' | 'In Progress' | 'Review' | 'Approved';
  // Green Screen specific
  isGreenScreen?: boolean;
  greenScreenQuality?: string;
  spillRemoval?: boolean;
  edgeTreatment?: boolean;
  hairDetail?: boolean;
  lutProfile?: string;
  postNotes?: string;
}

export interface EnvironmentSetItem {
  id: string;
  projectId: string;
  shotId?: string;
  setName: string;
  levelPath: string;
  naniteGeometry: string;
  worldPartition: boolean;
  foliageLOD: string;
  lightingReady: boolean;
  status: 'Planning' | 'Blocking' | 'Dressed' | 'Optimized' | 'Locked';
  notes: string;
}

export interface EditSequence {
  id: string;
  projectId: string;
  sequenceName: string;
  version: string;
  pictureLock: boolean;
  musicTrack: string;
  dialogueStatus: string;
  sfxStatus: string;
  transitions: string;
  pacingNotes: string;
  status: 'Assembly' | 'Rough Cut' | 'Fine Cut' | 'Picture Locked';
  notes: string;
  linkedShotIds?: string[];
}

export interface SoundItem {
  id: string;
  projectId: string;
  scene: string;
  shotId?: string;
  type: 'Dialogue' | 'Voice-over' | 'Ambience' | 'Foley' | 'SFX' | 'Music';
  description: string;
  source: string;
  status: 'Needed' | 'Recorded' | 'Mixed' | 'Approved';
  isFinal: boolean;
}

export interface ProblemBlocker {
  id: string;
  projectId: string;
  shotId?: string;
  problem: string;
  category:
    | 'Story'
    | 'Camera'
    | 'Animation'
    | 'Environment'
    | 'Lighting'
    | 'Material'
    | 'FX'
    | 'Performance'
    | 'Rendering'
    | 'Compositing'
    | 'Sound';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  cause: string;
  solution: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  lessonLearned: string;
  createdAt: string;
}

export interface LearningItem {
  id: string;
  projectId: string;
  shotId: string; // Enforce rule: must link to project or specific shot!
  skill: string;
  topic: string;
  resource: string;
  whyINeedIt: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Queued' | 'Studying' | 'Practicing' | 'Mastered';
  practiceTask: string;
  result: string;
  notes: string;
}

export interface PrevisChecklist {
  storyWorks: boolean;
  cameraWorks: boolean;
  compositionWorks: boolean;
  characterMovementWorks: boolean;
  timingWorks: boolean;
  transitionWorks: boolean;
  shotTechnicallyAchievable: boolean;
  shotIsNecessary: boolean;
}
