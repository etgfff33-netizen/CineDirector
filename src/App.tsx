/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Project,
  Shot,
  Asset,
  VisualReference,
  StoryboardFrame,
  ScriptScene,
  IdeaStory,
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
  ShotStatus,
} from './types';
import { Storage } from './utils/storage';
import { evaluateProductionAutomations } from './utils/automations';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ShotModal } from './components/ShotModal';
import { NewProjectModal } from './components/NewProjectModal';

import { DashboardView } from './views/DashboardView';
import { GatesView } from './views/GatesView';
import { PreProductionView } from './views/PreProductionView';
import { ReferenceBoardView } from './views/ReferenceBoardView';
import { StoryboardView } from './views/StoryboardView';
import { ShotTrackerView } from './views/ShotTrackerView';
import { PrevisCameraView } from './views/PrevisCameraView';
import { AnimaticView } from './views/AnimaticView';
import { AssetManagerView } from './views/AssetManagerView';
import { ProductionWorkflowView } from './views/ProductionWorkflowView';
import { PostProcessCompositingView } from './views/PostProcessCompositingView';
import { EditorialView } from './views/EditorialView';
import { SoundDesignView } from './views/SoundDesignView';
import { BlockersLearningView } from './views/BlockersLearningView';
import { FolderStructureView } from './views/FolderStructureView';

export default function App() {
  // State from Storage
  const [projects, setProjects] = useState<Project[]>(() => Storage.loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => Storage.loadActiveProjectId());
  const [ideaStories, setIdeaStories] = useState<Record<string, IdeaStory>>(() => Storage.loadIdeaStory());
  const [scripts, setScripts] = useState<ScriptScene[]>(() => Storage.loadScripts());
  const [references, setReferences] = useState<VisualReference[]>(() => Storage.loadReferences());
  const [storyboard, setStoryboard] = useState<StoryboardFrame[]>(() => Storage.loadStoryboard());
  const [shots, setShots] = useState<Shot[]>(() => Storage.loadShots());
  const [assets, setAssets] = useState<Asset[]>(() => Storage.loadAssets());
  const [animations, setAnimations] = useState<CharacterAnimation[]>(() => Storage.loadAnimations());
  const [vfx, setVfx] = useState<VfxNiagaraItem[]>(() => Storage.loadVfx());
  const [lighting, setLighting] = useState<LightingItem[]>(() => Storage.loadLighting());
  const [renders, setRenders] = useState<RenderItem[]>(() => Storage.loadRenders());
  const [compositing, setCompositing] = useState<CompositingItem[]>(() => Storage.loadCompositing());
  const [environments, setEnvironments] = useState<EnvironmentSetItem[]>(() => Storage.loadEnvironments());
  const [editSequences, setEditSequences] = useState<EditSequence[]>(() => Storage.loadEdit());
  const [sounds, setSounds] = useState<SoundItem[]>(() => Storage.loadSounds());
  const [blockers, setBlockers] = useState<ProblemBlocker[]>(() => Storage.loadBlockers());
  const [learning, setLearning] = useState<LearningItem[]>(() => Storage.loadLearning());

  // UI Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedShotForModal, setSelectedShotForModal] = useState<Shot | null>(null);
  const [isShotModalOpen, setIsShotModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [animaticApproved, setAnimaticApproved] = useState(false);

  // Sync to Storage
  useEffect(() => {
    Storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    Storage.saveActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    Storage.saveIdeaStory(ideaStories);
  }, [ideaStories]);

  useEffect(() => {
    Storage.saveScripts(scripts);
  }, [scripts]);

  useEffect(() => {
    Storage.saveReferences(references);
  }, [references]);

  useEffect(() => {
    Storage.saveStoryboard(storyboard);
  }, [storyboard]);

  useEffect(() => {
    Storage.saveShots(shots);
  }, [shots]);

  useEffect(() => {
    Storage.saveAssets(assets);
  }, [assets]);

  useEffect(() => {
    Storage.saveAnimations(animations);
  }, [animations]);

  useEffect(() => {
    Storage.saveVfx(vfx);
  }, [vfx]);

  useEffect(() => {
    Storage.saveLighting(lighting);
  }, [lighting]);

  useEffect(() => {
    Storage.saveRenders(renders);
  }, [renders]);

  useEffect(() => {
    Storage.saveCompositing(compositing);
  }, [compositing]);

  useEffect(() => {
    Storage.saveEnvironments(environments);
  }, [environments]);

  useEffect(() => {
    Storage.saveEdit(editSequences);
  }, [editSequences]);

  useEffect(() => {
    Storage.saveSounds(sounds);
  }, [sounds]);

  useEffect(() => {
    Storage.saveBlockers(blockers);
  }, [blockers]);

  useEffect(() => {
    Storage.saveLearning(learning);
  }, [learning]);

  // Active Project Data
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || {
      id: 'proj-omega-dawn',
      name: 'OMEGA DAWN',
      type: 'Cinematic',
      status: 'Production',
      currentPhase: 'Lighting',
      priority: 'Critical',
      targetDate: '2026-11-15',
      runtime: '02:45',
      description: 'Unreal Engine 5.4 sci-fi short film',
      logline: 'Courier scaling a dying reactor shaft before purge',
      mainGoal: 'Complete GNS-003 lighting in Lumen',
      todaysGoal: 'Complete GNS-003 Previs & Camera Lock',
      currentTask: 'Tune key rim light',
      blocker: '',
      notes: '',
      createdAt: '2026-08-10',
    };

  const projectShots = shots.filter((s) => s.projectId === activeProject.id);
  const projectAssets = assets.filter((a) => a.projectId === activeProject.id);
  const projectReferences = references.filter((r) => r.projectId === activeProject.id);
  const projectStoryboard = storyboard.filter((sb) => sb.projectId === activeProject.id);
  const projectScripts = scripts.filter((sc) => sc.projectId === activeProject.id);
  const projectIdea =
    ideaStories[activeProject.id] || {
      projectId: activeProject.id,
      oneLineConcept: activeProject.logline,
      genre: 'Sci-Fi Cinematic',
      theme: 'Survival and memory',
      audience: 'Cinematic creators',
      desiredEmotion: 'Tension and awe',
      inspiration: 'Blade Runner 2049',
      storyBeginning: 'Courier begins run in Sector 9',
      storyMiddle: 'Sprint across reactor catwalk',
      storyEnding: 'Core locks into transmitter at dawn',
      conflict: 'Expiring battery vs security grid',
      characterGoal: 'Deliver cognitive core',
      emotionalPayoff: 'Cathartic redemption',
      storyApproved: true,
      scriptApproved: true,
    };

  const projectAnimations = animations.filter((an) => an.projectId === activeProject.id);
  const projectVfx = vfx.filter((v) => v.projectId === activeProject.id);
  const projectLighting = lighting.filter((l) => l.projectId === activeProject.id);
  const projectRenders = renders.filter((r) => r.projectId === activeProject.id);
  const projectCompositing = compositing.filter((c) => c.projectId === activeProject.id);
  const projectEnvironments = environments.filter((env) => env.projectId === activeProject.id);
  const projectEdit = editSequences.filter((e) => e.projectId === activeProject.id);
  const projectSounds = sounds.filter((s) => s.projectId === activeProject.id);
  const projectBlockers = blockers.filter((b) => b.projectId === activeProject.id);
  const projectLearning = learning.filter((l) => l.projectId === activeProject.id);

  // Automations & Sentinel Analysis
  const { warnings, gates, health, nextAction } = evaluateProductionAutomations({
    project: activeProject,
    shots: projectShots,
    assets: projectAssets,
    storyboards: projectStoryboard,
    ideaStory: projectIdea,
    blockers: projectBlockers,
    learning: projectLearning,
    editSequences: projectEdit,
    sounds: projectSounds,
    renders: projectRenders,
    compositing: projectCompositing,
  });

  const handleUpdateActiveProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateProject = (newProject: Project, templateOption: 'starter' | 'blank') => {
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);

    // Initialize narrative idea record
    setIdeaStories((prev) => ({
      ...prev,
      [newProject.id]: {
        projectId: newProject.id,
        oneLineConcept: newProject.logline,
        genre: `${newProject.type} Cinematic`,
        theme: 'Cinematic worldbuilding and visual emotion',
        audience: 'Film and game cinematic audience',
        desiredEmotion: 'Tension and awe',
        inspiration: 'Cinematic masterworks',
        storyBeginning: 'Opening cinematic reveal',
        storyMiddle: 'Core dramatic conflict',
        storyEnding: 'Cinematic resolution',
        conflict: 'Central tension',
        characterGoal: 'Main objective',
        emotionalPayoff: 'Story climax',
        storyApproved: false,
        scriptApproved: false,
      },
    }));

    if (templateOption === 'starter') {
      const shot1: Shot = {
        id: `shot-${Date.now()}-1`,
        projectId: newProject.id,
        scene: 'Scene 1',
        shotNumber: 'GNS-001',
        description: 'Wide Establishing Shot — Environment Atmosphere',
        whatHappens: 'Camera slowly tracks in revealing the scale and lighting of the world.',
        purpose: 'Establish visual scale and geography of the world',
        audienceFeeling: 'Awe',
        howAchieve: 'CineCameraActor + 24mm Prime lens + Lumen volumetric lighting',
        shotType: 'Wide',
        camera: 'CineCamera_001',
        lens: '24mm Prime T1.5',
        cameraMovement: 'Slow Forward Dolly',
        durationFrames: 120,
        durationSeconds: 5.0,
        fps: 24,
        character: 'Protagonist (Silhouette)',
        environment: 'Main Environment Set',
        props: 'Environment props',
        cgElements: 'Atmospheric dust particles',
        fx: 'Niagara smoke fog',
        animation: 'Subtle idle breathing',
        stage: 'Storyboard',
        status: 'Working',
        complexity: 'B — Medium',
        priority: 'High',
        dependencies: 'Nanite geometry layout',
        blocker: '',
        notes: 'Calibrate exposure for anamorphic look',
        previsApproved: false,
        previsVersion: 'v01',
        cameraLocked: false,
        cameraVersion: 'v01',
        sensor: 'Super 35',
        fov: '73°',
        cameraHeight: '1.6m',
        cameraDistance: '8.0m',
        focusDistance: '800cm',
        dof: 'f/4.0',
        shutterAngle: '180°',
        cameraShake: 'None',
      };

      const shot2: Shot = {
        id: `shot-${Date.now()}-2`,
        projectId: newProject.id,
        scene: 'Scene 1',
        shotNumber: 'GNS-002',
        description: 'Medium Profile Track — Character in Motion',
        whatHappens: 'Character advances forward through the central corridor.',
        purpose: 'Introduce character determination and urgency',
        audienceFeeling: 'Curiosity',
        howAchieve: 'CineCameraActor + 50mm Prime on track rail',
        shotType: 'Medium',
        camera: 'CineCamera_002',
        lens: '50mm Prime T1.8',
        cameraMovement: 'Tracking with Character',
        durationFrames: 72,
        durationSeconds: 3.0,
        fps: 24,
        character: 'Protagonist',
        environment: 'Main Corridor',
        props: 'Key prop',
        cgElements: '',
        fx: 'Niagara spark bounce',
        animation: 'Walk cycle motion capture',
        stage: 'Shot List',
        status: 'Not Started',
        complexity: 'B — Medium',
        priority: 'Medium',
        dependencies: 'GNS-001 lighting continuity',
        blocker: '',
        notes: 'Keep focal plane locked to eyes',
        previsApproved: false,
        previsVersion: 'v01',
        cameraLocked: false,
        cameraVersion: 'v01',
        sensor: 'Super 35',
        fov: '48°',
        cameraHeight: '1.4m',
        cameraDistance: '3.2m',
        focusDistance: '320cm',
        dof: 'f/2.8',
        shutterAngle: '180°',
        cameraShake: 'Handheld 10%',
      };

      const shot3: Shot = {
        id: `shot-${Date.now()}-3`,
        projectId: newProject.id,
        scene: 'Scene 1',
        shotNumber: 'GNS-003',
        description: 'Tight Close-Up Reaction & Reveal',
        whatHappens: 'Tight framing on character eyes reacting to off-screen discovery.',
        purpose: 'Deliver emotional turning point of the sequence',
        audienceFeeling: 'Tension',
        howAchieve: 'CineCameraActor + 85mm Portrait Prime shallow DOF',
        shotType: 'Close-Up',
        camera: 'CineCamera_003',
        lens: '85mm Prime T1.4',
        cameraMovement: 'Static Subtle Push',
        durationFrames: 60,
        durationSeconds: 2.5,
        fps: 24,
        character: 'Protagonist',
        environment: 'Main Corridor',
        props: '',
        cgElements: '',
        fx: '',
        animation: 'Facial MetaHuman expression',
        stage: 'Concept',
        status: 'Not Started',
        complexity: 'C — Difficult',
        priority: 'High',
        dependencies: 'MetaHuman facial blendshapes',
        blocker: '',
        notes: 'Key light reflection in pupil is critical',
        previsApproved: false,
        previsVersion: 'v01',
        cameraLocked: false,
        cameraVersion: 'v01',
        sensor: 'Super 35',
        fov: '28°',
        cameraHeight: '1.5m',
        cameraDistance: '1.8m',
        focusDistance: '180cm',
        dof: 'f/1.8',
        shutterAngle: '180°',
        cameraShake: 'None',
      };

      setShots((prev) => [...prev, shot1, shot2, shot3]);

      const sb1: StoryboardFrame = {
        id: `sb-${Date.now()}-1`,
        shotId: shot1.id,
        projectId: newProject.id,
        scene: 'Scene 1',
        order: 1,
        frameImage: '',
        mediaType: 'image',
        shotDescription: 'Extreme wide angle revealing the towering architectural framework.',
        framing: 'Wide',
        cameraPosition: 'Low Angle Ground',
        cameraMovement: 'Slow Dolly In',
        characterPosition: 'Distant center',
        characterAction: 'Walking forward',
        lens: '24mm Prime',
        durationSeconds: 5.0,
        dialogue: '',
        sound: 'Wind ambience and distant low rumble',
        vfxNotes: 'Volumetric fog in background',
        purpose: 'Establish environment mood',
        version: 'v01',
      };

      const sb2: StoryboardFrame = {
        id: `sb-${Date.now()}-2`,
        shotId: shot2.id,
        projectId: newProject.id,
        scene: 'Scene 1',
        order: 2,
        frameImage: '',
        mediaType: 'image',
        shotDescription: 'Medium profile track as protagonist moves forward.',
        framing: 'Medium',
        cameraPosition: 'Eye Level',
        cameraMovement: 'Tracking Left to Right',
        characterPosition: 'Center-Right',
        characterAction: 'Moving with purpose',
        lens: '50mm Prime',
        durationSeconds: 3.0,
        dialogue: '',
        sound: 'Footsteps on metallic grid',
        vfxNotes: '',
        purpose: 'Show character mission',
        version: 'v01',
      };

      const starterEnv: EnvironmentSetItem = {
        id: `env-${Date.now()}-1`,
        projectId: newProject.id,
        shotId: shot1.id,
        setName: 'Main Cinematic Set',
        levelPath: `/Game/Cinematics/Maps/MAP_${newProject.name.replace(/\s+/g, '_')}_Master`,
        naniteGeometry: 'Nanite High-Poly Set Assembly',
        worldPartition: true,
        foliageLOD: 'Nanite Geometry',
        lightingReady: true,
        status: 'Dressed',
        notes: 'Primary set geometry and lighting volume established.',
      };

      setStoryboard((prev) => [...prev, sb1, sb2]);
      setEnvironments((prev) => [...prev, starterEnv]);
    }

    setActiveTab('dashboard');
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0].id);
    }
    // Clean up project-associated records
    setShots((prev) => prev.filter((s) => s.projectId !== projectId));
    setStoryboard((prev) => prev.filter((sb) => sb.projectId !== projectId));
    setReferences((prev) => prev.filter((r) => r.projectId !== projectId));
    setAssets((prev) => prev.filter((a) => a.projectId !== projectId));
    setScripts((prev) => prev.filter((sc) => sc.projectId !== projectId));
    setAnimations((prev) => prev.filter((an) => an.projectId !== projectId));
    setVfx((prev) => prev.filter((v) => v.projectId !== projectId));
    setLighting((prev) => prev.filter((l) => l.projectId !== projectId));
    setRenders((prev) => prev.filter((r) => r.projectId !== projectId));
    setEnvironments((prev) => prev.filter((env) => env.projectId !== projectId));
    setCompositing((prev) => prev.filter((c) => c.projectId !== projectId));
    setEditSequences((prev) => prev.filter((e) => e.projectId !== projectId));
    setSounds((prev) => prev.filter((s) => s.projectId !== projectId));
    setBlockers((prev) => prev.filter((b) => b.projectId !== projectId));
    setLearning((prev) => prev.filter((lrn) => lrn.projectId !== projectId));
  };

  const handleSelectShot = (shot: Shot) => {
    setSelectedShotForModal(shot);
    setIsShotModalOpen(true);
  };

  const handleSaveShotFromModal = (updatedShot: Shot) => {
    const exists = shots.some((s) => s.id === updatedShot.id);
    const updated = exists ? shots.map((s) => (s.id === updatedShot.id ? updatedShot : s)) : [...shots, updatedShot];
    setShots(updated);
  };

  const handleDeleteShot = (shotId: string) => {
    setShots((prev) => prev.filter((s) => s.id !== shotId));
    setStoryboard((prev) => prev.filter((sb) => sb.shotId !== shotId));
  };

  const handleNewShot = () => {
    const nextNum = projectShots.length + 1;
    const padNum = nextNum < 10 ? `00${nextNum}` : `0${nextNum}`;
    const newShotNumber = `GNS-${padNum}`;

    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      projectId: activeProject.id,
      scene: 'Scene 1',
      shotNumber: newShotNumber,
      description: 'New cinematic camera setup',
      whatHappens: 'Character enters frame...',
      purpose: '', // Intentionally blank initially so warning engine triggers
      audienceFeeling: 'Curiosity',
      howAchieve: 'CineCameraActor + 50mm Prime + Lumen illumination',
      shotType: 'Medium Wide',
      camera: `CineCamera_${padNum}`,
      lens: '50mm Prime T1.8',
      cameraMovement: 'Static or Subtle Track',
      durationFrames: 72,
      durationSeconds: 3.0,
      fps: 24,
      character: 'Protagonist',
      environment: 'Main Environment Set',
      props: '',
      cgElements: '',
      fx: '',
      animation: '',
      stage: 'Shot List',
      status: 'Not Started',
      complexity: 'B — Medium',
      priority: 'Medium',
      dependencies: '',
      blocker: '',
      notes: '',
      previsApproved: false,
      previsVersion: 'v01',
      cameraLocked: false,
      cameraVersion: 'v01',
      sensor: 'Super 35',
      fov: '48°',
      cameraHeight: '1.4m',
      cameraDistance: '3.5m',
      focusDistance: '350cm',
      dof: 'f/2.8',
      shutterAngle: '180°',
      cameraShake: 'None',
    };

    setShots((prev) => [...prev, newShot]);
    setSelectedShotForModal(newShot);
    setIsShotModalOpen(true);
  };

  const handleUpdateShotStatus = (shotId: string, status: ShotStatus) => {
    setShots((prev) => prev.map((s) => (s.id === shotId ? { ...s, status } : s)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(id) => setActiveProjectId(id)}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        onNewShot={handleNewShot}
        onOpenFolderGen={() => setActiveTab('folder-tree')}
        blockedCount={health.blockedShots}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          blockedCount={health.blockedShots}
          warningsCount={warnings.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-950">
          {activeTab === 'dashboard' && (
            <DashboardView
              project={activeProject}
              shots={projectShots}
              assets={projectAssets}
              blockers={projectBlockers}
              warnings={warnings}
              gates={gates}
              health={health}
              nextAction={nextAction}
              onUpdateProject={handleUpdateActiveProject}
              onSelectShot={handleSelectShot}
              onNavigateToTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'gates' && (
            <GatesView gates={gates} onNavigateToTab={(t) => setActiveTab(t)} />
          )}

          {activeTab === 'preproduction' && (
            <PreProductionView
              ideaStory={projectIdea}
              scripts={projectScripts}
              shots={projectShots}
              onUpdateIdeaStory={(updated) =>
                setIdeaStories((prev) => ({ ...prev, [activeProject.id]: updated }))
              }
              onUpdateScripts={(updated) => setScripts(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'references' && (
            <ReferenceBoardView
              references={projectReferences}
              shots={projectShots}
              assets={projectAssets}
              projectId={activeProject.id}
              onUpdateReferences={(updated) => setReferences(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'storyboard' && (
            <StoryboardView
              storyboard={projectStoryboard}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateStoryboard={(updated) => setStoryboard(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'shots' && (
            <ShotTrackerView
              shots={projectShots}
              onSelectShot={handleSelectShot}
              onNewShot={handleNewShot}
              onUpdateShotStatus={handleUpdateShotStatus}
              onDeleteShot={handleDeleteShot}
            />
          )}

          {activeTab === 'previs' && (
            <PrevisCameraView
              shots={projectShots}
              onUpdateShot={(updated) =>
                setShots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
              }
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'animatic' && (
            <AnimaticView
              shots={projectShots}
              onSelectShot={handleSelectShot}
              animaticApproved={animaticApproved}
              onToggleAnimaticApproved={(approved) => setAnimaticApproved(approved)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetManagerView
              assets={projectAssets}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateAssets={(updated) => setAssets(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {(activeTab === 'production-hub' ||
            activeTab === 'production-env' ||
            activeTab === 'production-animation' ||
            activeTab === 'production-lighting' ||
            activeTab === 'production-vfx' ||
            activeTab === 'production-renders') && (
            <ProductionWorkflowView
              environments={projectEnvironments}
              animations={projectAnimations}
              vfx={projectVfx}
              lighting={projectLighting}
              renders={projectRenders}
              shots={projectShots}
              projectId={activeProject.id}
              initialSubTab={
                activeTab === 'production-env'
                  ? 'env'
                  : activeTab === 'production-animation'
                  ? 'animation'
                  : activeTab === 'production-lighting'
                  ? 'lighting'
                  : activeTab === 'production-vfx'
                  ? 'vfx'
                  : activeTab === 'production-renders'
                  ? 'renders'
                  : 'env'
              }
              onSubTabChange={(sub) => {
                const tabMap: Record<string, ActiveTab> = {
                  env: 'production-env',
                  animation: 'production-animation',
                  lighting: 'production-lighting',
                  vfx: 'production-vfx',
                  renders: 'production-renders',
                };
                if (tabMap[sub]) setActiveTab(tabMap[sub]);
              }}
              onUpdateEnvironments={(updated) => setEnvironments(updated)}
              onUpdateAnimations={(updated) => setAnimations(updated)}
              onUpdateVfx={(updated) => setVfx(updated)}
              onUpdateLighting={(updated) => setLighting(updated)}
              onUpdateRenders={(updated) => setRenders(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'post-process' && (
            <PostProcessCompositingView
              compositing={projectCompositing}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateCompositing={(updated) => setCompositing(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'editorial' && (
            <EditorialView
              editSequences={projectEdit}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateEdit={(updated) => setEditSequences(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'sound' && (
            <SoundDesignView
              sounds={projectSounds}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateSounds={(updated) => setSounds(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'blockers' && (
            <BlockersLearningView
              blockers={projectBlockers}
              learning={projectLearning}
              shots={projectShots}
              projectId={activeProject.id}
              onUpdateBlockers={(updated) => setBlockers(updated)}
              onUpdateLearning={(updated) => setLearning(updated)}
              onSelectShot={handleSelectShot}
            />
          )}

          {activeTab === 'folder-tree' && (
            <FolderStructureView project={activeProject} />
          )}
        </main>
      </div>

      {/* Global Shot Inspector Modal */}
      <ShotModal
        shot={selectedShotForModal}
        isOpen={isShotModalOpen}
        onClose={() => {
          setIsShotModalOpen(false);
          setSelectedShotForModal(null);
        }}
        onSave={handleSaveShotFromModal}
        onDelete={handleDeleteShot}
      />

      {/* New Project Creation Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
