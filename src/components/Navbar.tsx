import React, { useState } from 'react';
import { Project } from '../types';
import { Storage } from '../utils/storage';
import { Download, RefreshCw, Plus, Film, Trash2, ChevronDown, AlertTriangle, Clock, Calendar, Check } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface NavbarProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onDeleteProject: (projectId: string) => void;
  onNewShot: () => void;
  onOpenFolderGen: () => void;
  blockedCount?: number;
  onNavigateToTab?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProjectModal,
  onDeleteProject,
  onNewShot,
  onOpenFolderGen,
  blockedCount = 0,
  onNavigateToTab,
}) => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteProjectConfirmOpen, setIsDeleteProjectConfirmOpen] = useState(false);
  const [isQuickDetailsOpen, setIsQuickDetailsOpen] = useState(false);

  // Check if project has critical urgency or needs attention
  const isCriticalPriority = activeProject.priority === 'Critical';
  const isHighPriority = activeProject.priority === 'High';
  const hasBlockers = blockedCount > 0;

  return (
    <>
      <header className="h-14 border-b border-neutral-800 bg-neutral-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-4">
        {/* Zone 1: Wordmark & Project Selector + New Project Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-500" />
            <span className="hidden sm:inline">CineDirector</span>
          </a>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          {/* Project Switcher + New Project Button */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-0.5 rounded-md">
            <select
              value={activeProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-transparent text-neutral-200 text-xs font-medium px-2 py-1 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              title="Switch Active Project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-neutral-900 text-neutral-200">
                  {p.name} ({p.type})
                </option>
              ))}
            </select>

            {/* "+ New Project" Action Button */}
            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-neutral-950 hover:bg-amber-400 bg-neutral-850 rounded transition-all shrink-0"
              title="Create New Project"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden md:inline">New Project</span>
            </button>

            {/* Delete Project Button (only when multiple projects exist) */}
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => setIsDeleteProjectConfirmOpen(true)}
                className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                title={`Delete project "${activeProject.name}"`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 2: Clean Status (Clean, unobtrusive, only displaying alerts when actually needed) */}
        <div className="relative">
          <div
            onClick={() => setIsQuickDetailsOpen(!isQuickDetailsOpen)}
            className="flex items-center gap-2 cursor-pointer select-none group"
            title="Click to view project details"
          >
            {/* Core Clean Status: Phase & Runtime */}
            <div className="flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 px-2.5 py-1 rounded-full text-xs text-neutral-300 transition-colors shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
              <span className="font-medium text-neutral-200">{activeProject.currentPhase}</span>
              {activeProject.runtime && (
                <>
                  <span className="text-neutral-700">·</span>
                  <span className="font-mono text-neutral-400 tabular-nums text-[11px]">
                    {activeProject.runtime}
                  </span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
            </div>

            {/* ONLY WHEN NEEDED: Blockers Alert Badge */}
            {hasBlockers && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToTab?.('blockers');
                }}
                className="flex items-center gap-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 px-2 py-0.5 rounded-full text-[11px] font-mono text-rose-300 transition-colors"
                title={`${blockedCount} shots blocked. Click to inspect.`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>{blockedCount} Blocked</span>
              </button>
            )}

            {/* ONLY WHEN NEEDED: Critical/High Priority Badge */}
            {isCriticalPriority && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-rose-950/70 border border-rose-800/80 px-2 py-0.5 rounded-full text-[10px] font-mono text-rose-300 uppercase tracking-wider">
                ⚡ Critical
              </span>
            )}
            {isHighPriority && !isCriticalPriority && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                High
              </span>
            )}
          </div>

          {/* Quick Details Dropdown Popover */}
          {isQuickDetailsOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-11 w-72 bg-neutral-900 border border-neutral-800 rounded-lg p-3.5 shadow-2xl space-y-2.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-semibold text-white truncate">{activeProject.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {activeProject.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-neutral-400 text-[11px]">
                <div className="bg-neutral-950 p-2 rounded border border-neutral-850">
                  <span className="block text-[10px] text-neutral-500 uppercase font-mono">Phase</span>
                  <span className="text-amber-400 font-medium">{activeProject.currentPhase}</span>
                </div>

                <div className="bg-neutral-950 p-2 rounded border border-neutral-850">
                  <span className="block text-[10px] text-neutral-500 uppercase font-mono">Runtime</span>
                  <span className="text-neutral-200 font-mono">{activeProject.runtime}</span>
                </div>

                <div className="bg-neutral-950 p-2 rounded border border-neutral-850">
                  <span className="block text-[10px] text-neutral-500 uppercase font-mono">Priority</span>
                  <span
                    className={
                      isCriticalPriority
                        ? 'text-rose-400 font-medium'
                        : isHighPriority
                        ? 'text-amber-400 font-medium'
                        : 'text-neutral-300'
                    }
                  >
                    {activeProject.priority}
                  </span>
                </div>

                <div className="bg-neutral-950 p-2 rounded border border-neutral-850">
                  <span className="block text-[10px] text-neutral-500 uppercase font-mono">Target Date</span>
                  <span className="text-neutral-200 font-mono">{activeProject.targetDate}</span>
                </div>
              </div>

              {activeProject.logline && (
                <div className="text-[11px] text-neutral-400 italic bg-neutral-950/60 p-2 rounded border border-neutral-850 leading-relaxed">
                  "{activeProject.logline}"
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickDetailsOpen(false)}
                  className="text-[11px] text-neutral-400 hover:text-white px-2 py-0.5"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenFolderGen}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded transition-colors"
            title="Unreal Studio Folder Generator"
          >
            <span>Studio Tree</span>
          </button>

          <button
            onClick={() => Storage.exportAllDataJson()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded transition-colors"
            title="Export Backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Backup</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center p-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded transition-colors"
            title="Reset Demo Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onNewShot}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Shot</span>
          </button>
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Project Data to Defaults?"
        message="This will overwrite current project modifications and restore the standard sample Unreal Engine production setup. Make sure to download a backup first if you have custom work."
        confirmLabel="Reset Everything"
        cancelLabel="Keep My Data"
        isDestructive={true}
        onConfirm={() => Storage.resetToDefaults()}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Confirmation Modal for Deleting Project */}
      <ConfirmModal
        isOpen={isDeleteProjectConfirmOpen}
        title={`Delete Project "${activeProject.name}"?`}
        message="Are you sure you want to delete this project? All associated shots, storyboard frames, and visual references belonging to this project will be permanently removed."
        confirmLabel="Delete Project"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          onDeleteProject(activeProject.id);
        }}
        onCancel={() => setIsDeleteProjectConfirmOpen(false)}
      />
    </>
  );
};
