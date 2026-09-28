import React, { useState } from 'react';
import { Project, Shot, Asset, ProblemBlocker } from '../types';
import { ProductionWarning, GateStatus, ProjectHealthMetrics } from '../utils/automations';
import {
  Film,
  Target,
  ArrowRight,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Box,
  Layers,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';

interface DashboardViewProps {
  project: Project;
  shots: Shot[];
  assets: Asset[];
  blockers: ProblemBlocker[];
  warnings: ProductionWarning[];
  gates: GateStatus[];
  health: ProjectHealthMetrics;
  nextAction: string;
  onUpdateProject: (updated: Project) => void;
  onSelectShot: (shot: Shot) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  shots,
  assets,
  blockers,
  warnings,
  gates,
  health,
  nextAction,
  onUpdateProject,
  onSelectShot,
  onNavigateToTab,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalText, setGoalText] = useState(project.todaysGoal || 'Complete GNS-003 Previs & Camera Lock');

  const handleSaveGoal = () => {
    onUpdateProject({ ...project, todaysGoal: goalText });
    setIsEditingGoal(false);
  };

  const blockedShots = shots.filter((s) => s.status === 'Blocked' || s.blocker.trim() !== '');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Active Project Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Active Cinematic Project
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">{project.type}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs font-mono tabular-nums text-neutral-300">
                Runtime {project.runtime}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{project.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono ${
                  health.statusLevel === 'Blocked'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : health.statusLevel === 'At Risk'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                ● {health.statusLevel}
              </span>
            </h1>

            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              <strong className="text-neutral-400 font-normal">Logline: </strong>
              {project.logline}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 p-4 rounded-lg shrink-0">
            <div className="space-y-1">
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Overall Progress</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {health.overallProgress}%
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <span>Phase:</span>
                <span className="text-amber-400 font-medium">{project.currentPhase}</span>
              </div>
            </div>

            <div className="w-24 h-24 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-500"
                  strokeDasharray={`${health.overallProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-white">
                {health.overallProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S 1 MAIN GOAL & NEXT ACTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's 1 Main Goal */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Today's 1 Main Goal</span>
            </span>
            {!isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="text-neutral-400 hover:text-white p-1 rounded"
                title="Edit goal"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isEditingGoal ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="flex-1 bg-neutral-950 border border-amber-500/50 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveGoal}
                className="p-1.5 bg-amber-400 text-neutral-950 rounded hover:bg-amber-300"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-sm font-semibold text-white mt-1 leading-snug">
              {project.todaysGoal || 'Complete GNS-003 Previs & Camera Lock'}
            </div>
          )}

          <div className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-850">
            One single focus prevents getting lost in endless Unreal tutorial rabbit holes.
          </div>
        </div>

        {/* Calculated Next Action */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>Calculated Next Action</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Automated Pipeline</span>
          </div>

          <div className="text-sm font-semibold text-emerald-300 mt-1 leading-snug flex items-start gap-2">
            <span>⚡</span>
            <span>{nextAction}</span>
          </div>

          <div className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-850 flex items-center justify-between">
            <span>Direct pipeline dependency resolution</span>
            <button
              onClick={() => onNavigateToTab('shots')}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Open Shot Tracker →
            </button>
          </div>
        </div>
      </div>

      {/* 🔴 BLOCKED SHOTS SECTION */}
      {blockedShots.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/60 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                🔴 Blocked Shots ({blockedShots.length})
              </h2>
            </div>
            <span className="text-[11px] text-rose-400">Needs immediate resolution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blockedShots.map((shot) => (
              <div
                key={shot.id}
                onClick={() => onSelectShot(shot)}
                className="bg-neutral-900/90 border border-rose-800/60 hover:border-rose-600 rounded p-3 cursor-pointer transition-all hover:translate-y-[-1px]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {shot.shotNumber}
                  </span>
                  <span className="text-[11px] font-medium text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                    BLOCKED
                  </span>
                </div>
                <p className="text-xs text-neutral-200 font-medium line-clamp-1">{shot.description}</p>
                <div className="mt-2 text-[11px] text-rose-300/90 bg-rose-950/40 p-1.5 rounded border border-rose-900/30">
                  <strong>Blocker: </strong> {shot.blocker || 'Unresolved dependency'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 PRODUCTION GATES SNAPSHOT */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Mandatory Production Gates
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab('gates')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            Inspect All Gates →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {gates.map((g) => (
            <div
              key={g.id}
              className={`p-3 rounded border text-xs transition-colors ${
                g.isUnlocked
                  ? 'bg-neutral-950 border-emerald-900/50 text-neutral-200'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-neutral-500">Gate 0{g.gateNumber}</span>
                {g.isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                )}
              </div>
              <div className="font-semibold text-neutral-100">{g.name}</div>
              <div className="mt-2 text-[10px]">
                {g.isUnlocked ? (
                  <span className="text-emerald-400 font-medium">Passed</span>
                ) : (
                  <span className="text-neutral-500 line-clamp-2">{g.blockReason}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STUDIO METRICS & KEY WARNINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Progress Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Pipeline Health Breakdown
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Pre-Production Progress</span>
                <span className="font-mono tabular-nums text-neutral-200">{health.preProductionProgress}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${health.preProductionProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Storyboard & Previs</span>
                <span className="font-mono tabular-nums text-neutral-200">{health.previsProgress}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                <div
                  className="bg-sky-400 h-full transition-all duration-300"
                  style={{ width: `${health.previsProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Shot Production Completion</span>
                <span className="font-mono tabular-nums text-neutral-200">{health.shotCompletionPercent}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${health.shotCompletionPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Asset Readiness</span>
                <span className="font-mono tabular-nums text-neutral-200">{health.assetCompletionPercent}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded overflow-hidden">
                <div
                  className="bg-indigo-400 h-full transition-all duration-300"
                  style={{ width: `${health.assetCompletionPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-neutral-950 p-2 rounded">
              <div className="text-neutral-500 text-[10px]">Total Shots</div>
              <div className="font-mono font-bold text-white text-base">{health.totalShots}</div>
            </div>
            <div className="bg-neutral-950 p-2 rounded">
              <div className="text-neutral-500 text-[10px]">Approved / Final</div>
              <div className="font-mono font-bold text-emerald-400 text-base">{health.completedShots}</div>
            </div>
          </div>
        </div>

        {/* Studio Asset Check & Unused Warning */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Asset Allocation
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab('assets')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Manage →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">Total</div>
              <div className="font-mono font-bold text-white text-base">{health.totalAssets}</div>
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">Ready</div>
              <div className="font-mono font-bold text-emerald-400 text-base">{health.readyAssets}</div>
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">Unused</div>
              <div
                className={`font-mono font-bold text-base ${
                  health.unusedAssetsCount > 0 ? 'text-amber-400' : 'text-neutral-500'
                }`}
              >
                {health.unusedAssetsCount}
              </div>
            </div>
          </div>

          {health.unusedAssetsCount > 0 && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <span>⚠️ Unused Asset Warning</span>
              </div>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                You have {health.unusedAssetsCount} asset(s) not currently linked to any shot. Avoid building models that aren't in your shot list.
              </p>
            </div>
          )}

          <div className="space-y-1.5 text-xs text-neutral-300">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Recent Assets
            </div>
            {assets.slice(0, 3).map((ast) => (
              <div
                key={ast.id}
                className="flex items-center justify-between py-1 border-b border-neutral-850"
              >
                <span className="truncate max-w-[180px]">{ast.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{ast.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Quality Violations & Warnings */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Automated Warnings ({warnings.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Pipeline Sentinel</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {warnings.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                <span>All shots have approved purpose, previs, and asset links!</span>
              </div>
            ) : (
              warnings.map((warn) => (
                <div
                  key={warn.id}
                  className={`p-2.5 rounded border text-xs leading-relaxed ${
                    warn.type === 'critical'
                      ? 'bg-rose-950/50 border-rose-900/80 text-rose-200'
                      : warn.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between mb-0.5">
                    <span>{warn.title}</span>
                    <span className="text-[10px] font-mono opacity-60 uppercase">{warn.category}</span>
                  </div>
                  <p className="text-[11px] opacity-90">{warn.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
