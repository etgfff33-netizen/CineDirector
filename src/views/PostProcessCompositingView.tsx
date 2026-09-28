import React, { useState } from 'react';
import { CompositingItem, Shot } from '../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Film,
  Sparkles,
  Camera,
  Filter,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface PostProcessCompositingViewProps {
  compositing: CompositingItem[];
  shots: Shot[];
  projectId: string;
  onUpdateCompositing: (updated: CompositingItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const PostProcessCompositingView: React.FC<PostProcessCompositingViewProps> = ({
  compositing,
  shots,
  projectId,
  onUpdateCompositing,
  onSelectShot,
}) => {
  const [selectedShotFilter, setSelectedShotFilter] = useState<string>('All');
  const [lockedApprovedOnly, setLockedApprovedOnly] = useState(false);

  // Modal states
  const [editingItem, setEditingItem] = useState<CompositingItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CompositingItem | null>(null);

  // Eligible shots: emphasize locked, approved, or completed shots
  const lockedOrApprovedShots = shots.filter(
    (s) => s.cameraLocked || s.status === 'Approved' || s.status === 'Final'
  );

  // Filtered list
  const filteredComps = compositing.filter((c) => {
    if (selectedShotFilter !== 'All' && c.shotId !== selectedShotFilter) {
      return false;
    }
    if (lockedApprovedOnly) {
      const shot = shots.find((s) => s.id === c.shotId);
      if (!shot || (!shot.cameraLocked && shot.status !== 'Approved' && shot.status !== 'Final')) {
        return false;
      }
    }
    return true;
  });

  // Quick add state
  const [quickAddShotId, setQuickAddShotId] = useState<string>('');

  const handleDelete = (id: string) => {
    onUpdateCompositing(compositing.filter((c) => c.id !== id));
    setItemToDelete(null);
  };

  const handleSave = (item: CompositingItem) => {
    if (isAdding) {
      onUpdateCompositing([...compositing, item]);
    } else {
      onUpdateCompositing(compositing.map((c) => (c.id === item.id ? item : c)));
    }
    setEditingItem(null);
  };

  const handleLinkShot = (compId: string, targetShotId: string) => {
    const targetShot = shots.find((s) => s.id === targetShotId);
    onUpdateCompositing(
      compositing.map((c) => {
        if (c.id === compId) {
          const updatedNuke =
            targetShot && (c.nukeScript.startsWith('New_Comp') || c.nukeScript.startsWith('Shot_Comp'))
              ? `${targetShot.shotNumber}_comp_v01.nk`
              : c.nukeScript;
          return {
            ...c,
            shotId: targetShotId,
            nukeScript: updatedNuke,
          };
        }
        return c;
      })
    );
  };

  const handleQuickAddForShot = (shotId: string) => {
    if (!shotId) return;
    const shot = shots.find((s) => s.id === shotId);
    if (!shot) return;
    const newItem: CompositingItem = {
      id: `cmp-${Date.now()}`,
      projectId,
      shotId: shot.id,
      nukeScript: `${shot.shotNumber}_comp_v01.nk`,
      keying: false,
      roto: false,
      tracking: true,
      lensDistortion: true,
      cgPasses: 'Beauty, Cryptomatte, ZDepth, WorldNormal, Emission',
      shadows: true,
      reflections: true,
      lightWrap: true,
      atmosphere: true,
      dof: true,
      motionBlur: true,
      grain: true,
      colorMatch: true,
      finalQc: false,
      status: 'In Progress',
      lutProfile: 'Kodak 2383 DCI-P3 Print Emulation',
      postNotes: `Optical post-processing setup for ${shot.shotNumber} (${shot.description})`,
    };
    onUpdateCompositing([...compositing, newItem]);
    setQuickAddShotId('');
  };

  const handleAutoGenerateForLocked = () => {
    const existingShotIds = new Set(compositing.map((c) => c.shotId));
    const unmappedLockedShots = lockedOrApprovedShots.filter((s) => !existingShotIds.has(s.id));
    const targetShots =
      unmappedLockedShots.length > 0
        ? unmappedLockedShots
        : shots.filter((s) => !existingShotIds.has(s.id));
    if (targetShots.length === 0) return;

    const newItems: CompositingItem[] = targetShots.map((shot, idx) => ({
      id: `cmp-${Date.now()}-${idx}`,
      projectId,
      shotId: shot.id,
      nukeScript: `${shot.shotNumber}_comp_v01.nk`,
      keying: false,
      roto: false,
      tracking: true,
      lensDistortion: true,
      cgPasses: 'Beauty, Cryptomatte, ZDepth, WorldNormal, Emission',
      shadows: true,
      reflections: true,
      lightWrap: true,
      atmosphere: true,
      dof: true,
      motionBlur: true,
      grain: true,
      colorMatch: true,
      finalQc: false,
      status: 'In Progress',
      lutProfile: 'Kodak 2383 DCI-P3 Print Emulation',
      postNotes: `Auto-linked post setup for ${shot.shotNumber}`,
    }));
    onUpdateCompositing([...compositing, ...newItems]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Post-Process & Optical Compositing Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Nuke script integration, optical color grading, lens distortion synthesis, Z-depth passes, and film grain linked directly to locked & approved shots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick toggle for locked/approved */}
          <button
            type="button"
            onClick={() => setLockedApprovedOnly(!lockedApprovedOnly)}
            className={`px-2.5 py-1.5 text-xs rounded border transition-colors flex items-center gap-1.5 ${
              lockedApprovedOnly
                ? 'bg-amber-950/60 border-amber-600 text-amber-300 font-medium'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Locked / Approved Only ({lockedOrApprovedShots.length})</span>
          </button>

          {/* Shot dropdown filter */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1.5 rounded text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-mono">Filter:</span>
            <select
              value={selectedShotFilter}
              onChange={(e) => setSelectedShotFilter(e.target.value)}
              className="bg-transparent text-neutral-200 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-neutral-900">All Shots ({shots.length})</option>
              {shots.map((s) => (
                <option key={s.id} value={s.id} className="bg-neutral-900">
                  {s.shotNumber} — {s.cameraLocked ? '🔒 Locked' : s.status}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add for Shot Dropdown */}
          {shots.length > 0 && (
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
              <select
                value={quickAddShotId}
                onChange={(e) => {
                  setQuickAddShotId(e.target.value);
                  if (e.target.value) handleQuickAddForShot(e.target.value);
                }}
                className="bg-transparent text-amber-300 text-xs font-mono focus:outline-none cursor-pointer max-w-[170px]"
              >
                <option value="" className="bg-neutral-900 text-neutral-500">
                  ＋ Quick Comp for Shot...
                </option>
                {lockedOrApprovedShots.length > 0 && (
                  <optgroup label="🌟 Locked / Approved Shots" className="bg-neutral-900 text-amber-300">
                    {lockedOrApprovedShots.map((s) => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">
                        {s.shotNumber} ({s.cameraLocked ? '🔒' : s.status})
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="All Production Shots" className="bg-neutral-900 text-neutral-300">
                  {shots
                    .filter((s) => !lockedOrApprovedShots.some((ls) => ls.id === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">
                        {s.shotNumber} ({s.status})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Add Post-Process Comp Button */}
          <button
            onClick={() => {
              const defaultShot = lockedOrApprovedShots[0] || shots[0];
              setEditingItem({
                id: `cmp-${Date.now()}`,
                projectId,
                shotId: defaultShot ? defaultShot.id : '',
                nukeScript: defaultShot ? `${defaultShot.shotNumber}_comp_v01.nk` : 'New_Comp_v01.nk',
                keying: false,
                roto: false,
                tracking: true,
                lensDistortion: true,
                cgPasses: 'Beauty, Cryptomatte, ZDepth, WorldNormal, Emission',
                shadows: true,
                reflections: true,
                lightWrap: true,
                atmosphere: true,
                dof: true,
                motionBlur: true,
                grain: true,
                colorMatch: true,
                finalQc: false,
                status: 'In Progress',
                lutProfile: 'Kodak 2383 DCI-P3 Print Emulation',
                postNotes: '',
              });
              setIsAdding(true);
            }}
            className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Post-Process Comp</span>
          </button>
        </div>
      </div>

      {/* Grid of Post-Process Items or Empty State */}
      {filteredComps.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Compositing Setups Found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
              Link optical post-processing, LUT color grading, and Nuke node setups directly to the camera shots you approved or locked in Pre-Production and Production.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const defaultShot = lockedOrApprovedShots[0] || shots[0];
                setEditingItem({
                  id: `cmp-${Date.now()}`,
                  projectId,
                  shotId: defaultShot ? defaultShot.id : '',
                  nukeScript: defaultShot ? `${defaultShot.shotNumber}_comp_v01.nk` : 'New_Comp_v01.nk',
                  keying: false,
                  roto: false,
                  tracking: true,
                  lensDistortion: true,
                  cgPasses: 'Beauty, Cryptomatte, ZDepth, WorldNormal, Emission',
                  shadows: true,
                  reflections: true,
                  lightWrap: true,
                  atmosphere: true,
                  dof: true,
                  motionBlur: true,
                  grain: true,
                  colorMatch: true,
                  finalQc: false,
                  status: 'In Progress',
                  lutProfile: 'Kodak 2383 DCI-P3 Print Emulation',
                  postNotes: '',
                });
                setIsAdding(true);
              }}
              className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold text-xs rounded hover:bg-amber-300 flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Post-Process Comp</span>
            </button>
            {shots.length > 0 && (
              <button
                onClick={handleAutoGenerateForLocked}
                className="px-4 py-2 bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold text-xs rounded hover:bg-neutral-750 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Auto-Generate from Production Shots</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComps.map((cmp) => {
            const shot = shots.find((s) => s.id === cmp.shotId);
            const isShotLocked = shot?.cameraLocked;
            const isShotApproved = shot?.status === 'Approved' || shot?.status === 'Final';

            return (
              <div
                key={cmp.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3.5 text-xs flex flex-col justify-between hover:border-neutral-750 transition-colors"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-2.5">
                    <div>
                      <h3 className="font-mono font-bold text-white text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{cmp.nukeScript}</span>
                      </h3>
                      {cmp.lutProfile && (
                        <span className="text-[10px] text-amber-400/90 font-mono block mt-0.5">
                          LUT: {cmp.lutProfile}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {cmp.finalQc && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          COMP QC OK
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          cmp.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : cmp.status === 'Review'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {cmp.status}
                      </span>
                    </div>
                  </div>

                  {/* LINKED PRODUCTION SHOT DROPDOWN ON CARD */}
                  <div className="bg-neutral-950 p-3 rounded border border-neutral-850 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-[11px] uppercase tracking-wider">
                        <Film className="w-3.5 h-3.5 text-amber-400" />
                        <span>Target Production Shot:</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={cmp.shotId || ''}
                          onChange={(e) => handleLinkShot(cmp.id, e.target.value)}
                          className="bg-neutral-900 border border-neutral-750 text-amber-300 font-mono text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[240px] truncate"
                          title="Change linked production shot"
                        >
                          <option value="" className="bg-neutral-900 text-neutral-500">
                            (No Shot Linked)
                          </option>
                          {lockedOrApprovedShots.length > 0 && (
                            <optgroup label="🌟 Locked / Approved / Final Shots" className="bg-neutral-900 text-amber-300 font-semibold">
                              {lockedOrApprovedShots.map((s) => (
                                <option key={s.id} value={s.id} className="bg-neutral-900">
                                  {s.shotNumber} — {s.cameraLocked ? '🔒 Locked' : s.status} ({s.shotType})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          <optgroup label="All Production Shots" className="bg-neutral-900 text-neutral-300">
                            {shots
                              .filter((s) => !lockedOrApprovedShots.some((ls) => ls.id === s.id))
                              .map((s) => (
                                <option key={s.id} value={s.id} className="bg-neutral-900">
                                  {s.shotNumber} — {s.status} ({s.shotType})
                                </option>
                              ))}
                          </optgroup>
                        </select>

                        {shot && (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            title="Inspect Shot in Shot Inspector"
                            className="p-1 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-750 rounded hover:bg-neutral-800"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {shot ? (
                      <div className="text-[11px] text-neutral-300 flex items-center justify-between pt-0.5">
                        <span className="text-neutral-400 truncate max-w-[300px]">
                          {shot.description}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-neutral-400">{shot.durationSeconds}s</span>
                          {isShotLocked && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-950/80 border border-amber-800 text-amber-300 rounded flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                          {isShotApproved && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded">
                              Approved
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-500 italic">No production shot linked to this post setup yet.</p>
                    )}

                    <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-850">
                      <strong className="text-neutral-500">Rendered Passes: </strong>
                      <span className="font-mono text-neutral-300">{cmp.cgPasses}</span>
                    </div>
                  </div>

                  {/* Optical & Comp Feature Badges */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                    <span className={cmp.tracking ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.tracking ? '●' : '○'}</span>
                      <span>Camera Tracking</span>
                    </span>
                    <span className={cmp.lensDistortion ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.lensDistortion ? '●' : '○'}</span>
                      <span>Lens Distortion Match</span>
                    </span>
                    <span className={cmp.lightWrap ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.lightWrap ? '●' : '○'}</span>
                      <span>Light Wrap & Bloom</span>
                    </span>
                    <span className={cmp.grain ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.grain ? '●' : '○'}</span>
                      <span>35mm Film Grain</span>
                    </span>
                    <span className={cmp.dof ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.dof ? '●' : '○'}</span>
                      <span>Z-Depth / Defocus</span>
                    </span>
                    <span className={cmp.motionBlur ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-600 flex items-center gap-1'}>
                      <span>{cmp.motionBlur ? '●' : '○'}</span>
                      <span>Optical Motion Blur</span>
                    </span>
                  </div>

                  {cmp.postNotes && (
                    <p className="text-neutral-400 italic text-[11px] leading-relaxed pt-1 border-t border-neutral-850">
                      "{cmp.postNotes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons: Edit and Delete */}
                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(cmp);
                      setIsAdding(false);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Comp Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(cmp)}
                    className="text-neutral-400 hover:text-rose-400 px-2.5 py-1.5 bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-800/50 rounded flex items-center gap-1.5 transition-colors"
                    title="Delete Comp Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isAdding ? 'Add Post-Process & Compositing Item' : 'Edit Compositing Settings'}</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Nuke Script / Post Process Setup Name
                </label>
                <input
                  type="text"
                  value={editingItem.nukeScript}
                  onChange={(e) => setEditingItem({ ...editingItem, nukeScript: e.target.value })}
                  placeholder="e.g. GNS_001_Comp_v01.nk"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-mono"
                />
              </div>

              {/* DROPDOWN LINKED TO ACTUAL LOCKED / APPROVED / PRODUCTION SHOTS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-neutral-300 font-semibold">
                    Link to Actual Shot (Pre-Production / Production)
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Prioritizing Locked / Approved shots
                  </span>
                </div>
                <select
                  value={editingItem.shotId}
                  onChange={(e) => setEditingItem({ ...editingItem, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono cursor-pointer"
                >
                  <option value="" disabled>-- Select Shot to Link --</option>
                  <optgroup label="🔒 Locked & Approved Shots (Recommended for Post)">
                    {lockedOrApprovedShots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shotNumber} — {s.description.slice(0, 32)} [{s.cameraLocked ? 'Locked' : ''} {s.status}]
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Project Shots">
                    {shots
                      .filter((s) => !lockedOrApprovedShots.includes(s))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shotNumber} — {s.description.slice(0, 32)} [{s.status}]
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Color Grading LUT Profile</label>
                <input
                  type="text"
                  value={editingItem.lutProfile || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, lutProfile: e.target.value })}
                  placeholder="e.g. Kodak 2383 DCI-P3 Print Emulation, Arri LogC to 709"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Rendered AOV & CG Passes</label>
                <input
                  type="text"
                  value={editingItem.cgPasses}
                  onChange={(e) => setEditingItem({ ...editingItem, cgPasses: e.target.value })}
                  placeholder="Beauty, Cryptomatte, ZDepth, WorldNormal, Emission"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white font-mono text-[11px]"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Optical & Comp Pipeline Passes
                </span>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.tracking}
                      onChange={(e) => setEditingItem({ ...editingItem, tracking: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>Camera Tracking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.lensDistortion}
                      onChange={(e) => setEditingItem({ ...editingItem, lensDistortion: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>Lens Distortion Match</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.lightWrap}
                      onChange={(e) => setEditingItem({ ...editingItem, lightWrap: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>Light Wrap / Bloom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.grain}
                      onChange={(e) => setEditingItem({ ...editingItem, grain: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>35mm Film Grain</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.dof}
                      onChange={(e) => setEditingItem({ ...editingItem, dof: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>Z-Depth / Optical Defocus</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.motionBlur}
                      onChange={(e) => setEditingItem({ ...editingItem, motionBlur: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span>Optical Motion Blur</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-neutral-400 mb-1">Comp Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.finalQc}
                      onChange={(e) => setEditingItem({ ...editingItem, finalQc: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span className="font-semibold text-emerald-400">Master Comp QC Approved</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Post-Processing Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.postNotes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, postNotes: e.target.value })}
                  placeholder="Grading notes, edge blend instructions, or Nuke node tree notes..."
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingItem)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Comp Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={`Delete Compositing Setup "${itemToDelete?.nukeScript}"?`}
        message="Are you sure you want to remove this compositing and optical post-processing setup?"
        confirmLabel="Delete Comp"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (itemToDelete) handleDelete(itemToDelete.id);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
