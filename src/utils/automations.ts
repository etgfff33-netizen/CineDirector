import {
  Project,
  Shot,
  Asset,
  StoryboardFrame,
  IdeaStory,
  ProblemBlocker,
  LearningItem,
  EditSequence,
  SoundItem,
  RenderItem,
  CompositingItem,
  PipelinePhase,
} from '../types';

export interface ProductionWarning {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'Shot' | 'Asset' | 'Pipeline' | 'Learning' | 'Camera' | 'Gate';
  title: string;
  message: string;
  targetId?: string;
  targetType?: 'shot' | 'asset' | 'project' | 'learning';
}

export interface GateStatus {
  id: string;
  name: string;
  gateNumber: number;
  isUnlocked: boolean;
  blockReason?: string;
  checklist: { label: string; passed: boolean }[];
}

export interface ProjectHealthMetrics {
  overallProgress: number;
  preProductionProgress: number;
  productionProgress: number;
  postProgress: number;
  storyboardProgress: number;
  previsProgress: number;
  shotCompletionPercent: number;
  assetCompletionPercent: number;
  statusLevel: 'On Track' | 'At Risk' | 'Blocked';
  totalShots: number;
  completedShots: number;
  workingShots: number;
  blockedShots: number;
  totalAssets: number;
  readyAssets: number;
  unusedAssetsCount: number;
}

export function evaluateProductionAutomations(params: {
  project: Project;
  shots: Shot[];
  assets: Asset[];
  storyboards: StoryboardFrame[];
  ideaStory?: IdeaStory;
  blockers: ProblemBlocker[];
  learning: LearningItem[];
  editSequences: EditSequence[];
  sounds: SoundItem[];
  renders: RenderItem[];
  compositing: CompositingItem[];
}): {
  warnings: ProductionWarning[];
  gates: GateStatus[];
  health: ProjectHealthMetrics;
  nextAction: string;
} {
  const {
    project,
    shots,
    assets,
    storyboards,
    ideaStory,
    blockers,
    learning,
    editSequences,
    sounds,
    renders,
    compositing,
  } = params;

  const warnings: ProductionWarning[] = [];

  // 1. Problem 1: Shot has no purpose
  shots.forEach((shot) => {
    if (!shot.purpose || shot.purpose.trim() === '') {
      warnings.push({
        id: `warn-purpose-${shot.id}`,
        type: 'warning',
        category: 'Shot',
        title: `Shot ${shot.shotNumber}: No Storytelling Purpose`,
        message: 'This shot has no defined storytelling purpose. Why does this shot exist?',
        targetId: shot.id,
        targetType: 'shot',
      });
    }
  });

  // 2. Problem 2: Shot has no storyboard
  const shotIdsWithStoryboard = new Set(storyboards.map((s) => s.shotId));
  shots.forEach((shot) => {
    if (!shotIdsWithStoryboard.has(shot.id)) {
      warnings.push({
        id: `warn-storyboard-${shot.id}`,
        type: 'warning',
        category: 'Shot',
        title: `Shot ${shot.shotNumber}: Missing Storyboard`,
        message: 'Shot has no storyboard visual frame.',
        targetId: shot.id,
        targetType: 'shot',
      });
    }
  });

  // 3. Problem 3: Shot has no previs
  shots.forEach((shot) => {
    if (!shot.previsApproved && (!shot.previsUrl || shot.previsUrl.trim() === '')) {
      warnings.push({
        id: `warn-previs-${shot.id}`,
        type: 'warning',
        category: 'Shot',
        title: `Shot ${shot.shotNumber}: Missing Previs`,
        message: 'Shot has no previs blockout or camera timing approval.',
        targetId: shot.id,
        targetType: 'shot',
      });
    }
  });

  // 4. Problem 4: Final asset being created but isn't used by any shot
  assets.forEach((asset) => {
    if (asset.requiredShotIds.length === 0) {
      warnings.push({
        id: `warn-unused-asset-${asset.id}`,
        type: 'warning',
        category: 'Asset',
        title: `Unused Asset: ${asset.name}`,
        message: 'This asset is not currently required by any shot. Prevent wasted time on unlinked models.',
        targetId: asset.id,
        targetType: 'asset',
      });
    }
  });

  // 5. Problem 5: Shot is blocked
  const openBlockers = blockers.filter((b) => b.status !== 'Resolved');
  shots.forEach((shot) => {
    const isBlocked = shot.status === 'Blocked' || shot.blocker.trim() !== '';
    if (isBlocked) {
      warnings.push({
        id: `warn-blocked-${shot.id}`,
        type: 'critical',
        category: 'Shot',
        title: `🔴 Shot ${shot.shotNumber} is Blocked`,
        message: shot.blocker || 'Shot is blocked by an unresolved technical issue.',
        targetId: shot.id,
        targetType: 'shot',
      });
    }
  });

  // 6. Problem 6: Project has entered production but previs isn't approved
  const isProductionOrLater = [
    'Asset Planning',
    'Environment',
    'Character',
    'Animation',
    'Lighting',
    'FX',
    'Rendering',
    'Compositing',
  ].includes(project.currentPhase);

  const unapprovedPrevisCount = shots.filter((s) => !s.previsApproved).length;
  if (isProductionOrLater && unapprovedPrevisCount > 0) {
    warnings.push({
      id: 'warn-premature-production',
      type: 'critical',
      category: 'Pipeline',
      title: 'Premature Production Gate Violation',
      message: `Project has entered ${project.currentPhase} stage, but ${unapprovedPrevisCount} shot(s) lack approved previs and camera lock!`,
      targetType: 'project',
    });
  }

  // 7. Problem 7: Shot marked Final but required assets incomplete
  shots.forEach((shot) => {
    if (shot.status === 'Final') {
      const requiredAssets = assets.filter((a) => a.requiredShotIds.includes(shot.id));
      const incompleteAssets = requiredAssets.filter((a) => a.status !== 'Ready' && a.status !== 'Used');
      if (incompleteAssets.length > 0) {
        warnings.push({
          id: `warn-shot-incomplete-asset-${shot.id}`,
          type: 'warning',
          category: 'Shot',
          title: `Shot ${shot.shotNumber}: Incomplete Assets`,
          message: `Shot marked Final, but required asset "${incompleteAssets[0].name}" is still in ${incompleteAssets[0].status} state.`,
          targetId: shot.id,
          targetType: 'shot',
        });
      }
    }
  });

  // 8. Problem 8: User adding new learning resources while current project has unfinished tasks
  const hasUnfinishedTasks = shots.some((s) => s.status !== 'Approved' && s.status !== 'Final');
  if (learning.length > 0 && hasUnfinishedTasks) {
    const unmasteredLearning = learning.filter((l) => l.status !== 'Mastered');
    if (unmasteredLearning.length > 1) {
      warnings.push({
        id: 'warn-course-hopping',
        type: 'info',
        category: 'Learning',
        title: 'Anti-Course Hopping Discipline',
        message: 'Finish current production blocker before opening multiple learning topics.',
        targetType: 'learning',
      });
    }
  }

  // 5 Production Gates
  const storyApproved = ideaStory?.storyApproved ?? false;
  const scriptApproved = ideaStory?.scriptApproved ?? false;
  const gate01: GateStatus = {
    id: 'gate-01',
    gateNumber: 1,
    name: 'Story Lock',
    isUnlocked: storyApproved && scriptApproved,
    blockReason: !(storyApproved && scriptApproved)
      ? 'Requires Story approved and Script approved before moving into detailed production'
      : undefined,
    checklist: [
      { label: 'Story structure approved', passed: storyApproved },
      { label: 'Script scenes finalized', passed: scriptApproved },
    ],
  };

  const allShotsHaveStoryboard = shots.length > 0 && shots.every((s) => shotIdsWithStoryboard.has(s.id));
  const shotListComplete = shots.length > 0;
  const gate02: GateStatus = {
    id: 'gate-02',
    gateNumber: 2,
    name: 'Storyboard Lock',
    isUnlocked: allShotsHaveStoryboard && shotListComplete,
    blockReason: !allShotsHaveStoryboard
      ? 'Every shot must have an associated storyboard frame before asset building'
      : undefined,
    checklist: [
      { label: 'Shot list defined', passed: shotListComplete },
      { label: 'All shots storyboarded', passed: allShotsHaveStoryboard },
    ],
  };

  const allPrevisApproved = shots.length > 0 && shots.every((s) => s.previsApproved);
  const allCamerasApproved = shots.length > 0 && shots.every((s) => s.cameraLocked);
  const gate03: GateStatus = {
    id: 'gate-03',
    gateNumber: 3,
    name: 'Previs Lock',
    isUnlocked: allPrevisApproved && allCamerasApproved,
    blockReason: !allPrevisApproved
      ? 'All shots must have approved previs & camera blocking before lighting/rendering'
      : undefined,
    checklist: [
      { label: 'All shot previs approved', passed: allPrevisApproved },
      { label: 'Camera positions & focal lengths verified', passed: allCamerasApproved },
      { label: 'Animatic timing verified', passed: true },
    ],
  };

  const gate04: GateStatus = {
    id: 'gate-04',
    gateNumber: 4,
    name: 'Camera Lock',
    isUnlocked: allCamerasApproved,
    blockReason: !allCamerasApproved
      ? 'Camera must be locked across all shots to prevent breaking lighting & FX caches'
      : undefined,
    checklist: [
      { label: 'Focal lengths locked', passed: allCamerasApproved },
      { label: 'Sensor & aspect ratio locked', passed: allCamerasApproved },
      { label: 'Tracking & motion passes baked', passed: allCamerasApproved },
    ],
  };

  const pictureLocked = editSequences.length > 0 && editSequences.every((e) => e.pictureLock);
  const soundFinal = sounds.length > 0 && sounds.some((s) => s.isFinal);
  const rendersFinal = renders.length > 0 && renders.some((r) => r.isFinal);
  const compApproved = compositing.length > 0 && compositing.every((c) => c.status === 'Approved');
  const gate05: GateStatus = {
    id: 'gate-05',
    gateNumber: 5,
    name: 'Final QC',
    isUnlocked: pictureLocked && soundFinal && rendersFinal && compApproved,
    blockReason: !pictureLocked ? 'Picture lock and final QC passes required for release' : undefined,
    checklist: [
      { label: 'Picture lock confirmed', passed: pictureLocked },
      { label: 'Sound mix completed', passed: soundFinal },
      { label: 'VFX & Nuke comps approved', passed: compApproved },
      { label: 'Final high-sample master render passed QC', passed: rendersFinal },
    ],
  };

  // Health Metrics
  const totalShots = shots.length;
  const completedShots = shots.filter((s) => s.status === 'Approved' || s.status === 'Final').length;
  const workingShots = shots.filter((s) => s.status === 'Working' || s.status === 'Review').length;
  const blockedShots = shots.filter((s) => s.status === 'Blocked' || s.blocker.trim() !== '').length;

  const shotCompletionPercent = totalShots > 0 ? Math.round((completedShots / totalShots) * 100) : 0;

  const totalAssets = assets.length;
  const readyAssets = assets.filter((a) => a.status === 'Ready' || a.status === 'Used').length;
  const unusedAssetsCount = assets.filter((a) => a.requiredShotIds.length === 0).length;
  const assetCompletionPercent = totalAssets > 0 ? Math.round((readyAssets / totalAssets) * 100) : 0;

  const storyboardProgress =
    totalShots > 0
      ? Math.round((shots.filter((s) => shotIdsWithStoryboard.has(s.id)).length / totalShots) * 100)
      : 0;

  const previsProgress =
    totalShots > 0 ? Math.round((shots.filter((s) => s.previsApproved).length / totalShots) * 100) : 0;

  const preProductionProgress = Math.round(
    ((storyApproved ? 25 : 0) + (scriptApproved ? 25 : 0) + storyboardProgress * 0.25 + previsProgress * 0.25),
  );

  const productionProgress = shotCompletionPercent;
  const postProgress = Math.round(
    ((pictureLocked ? 40 : 15) + (soundFinal ? 30 : 10) + (rendersFinal ? 30 : 10)),
  );

  const overallProgress = Math.round(
    preProductionProgress * 0.35 + productionProgress * 0.45 + postProgress * 0.2,
  );

  let statusLevel: 'On Track' | 'At Risk' | 'Blocked' = 'On Track';
  if (blockedShots > 0 || openBlockers.length > 0) {
    statusLevel = 'Blocked';
  } else if (unapprovedPrevisCount > 0 && isProductionOrLater) {
    statusLevel = 'At Risk';
  }

  // Next Action Calculation
  let nextAction = 'Review project goals';
  const blockedShot = shots.find((s) => s.status === 'Blocked' || s.blocker.trim() !== '');
  if (blockedShot) {
    nextAction = `Resolve blocker on ${blockedShot.shotNumber}: "${blockedShot.blocker || 'Unblock shot'}"`;
  } else {
    const unapprovedPrevis = shots.find((s) => !s.previsApproved);
    if (unapprovedPrevis) {
      nextAction = `Complete Previs & Camera Lock on ${unapprovedPrevis.shotNumber}`;
    } else {
      const workingShot = shots.find((s) => s.status === 'Working');
      if (workingShot) {
        nextAction = `Continue ${workingShot.stage} on ${workingShot.shotNumber}`;
      } else {
        const notStarted = shots.find((s) => s.status === 'Not Started');
        if (notStarted) {
          nextAction = `Begin production setup for ${notStarted.shotNumber}`;
        } else {
          nextAction = 'Review final cut in Edit timeline for Picture Lock';
        }
      }
    }
  }

  return {
    warnings,
    gates: [gate01, gate02, gate03, gate04, gate05],
    health: {
      overallProgress,
      preProductionProgress,
      productionProgress,
      postProgress,
      storyboardProgress,
      previsProgress,
      shotCompletionPercent,
      assetCompletionPercent,
      statusLevel,
      totalShots,
      completedShots,
      workingShots,
      blockedShots,
      totalAssets,
      readyAssets,
      unusedAssetsCount,
    },
    nextAction,
  };
}
