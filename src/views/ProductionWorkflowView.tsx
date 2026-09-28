import React, { useState } from 'react';
import {
  CharacterAnimation,
  VfxNiagaraItem,
  LightingItem,
  RenderItem,
  EnvironmentSetItem,
  Shot,
} from '../types';
import {
  Flame,
  User,
  SunMedium,
  Clapperboard,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Box,
  MapPin,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

interface ProductionWorkflowViewProps {
  environments: EnvironmentSetItem[];
  animations: CharacterAnimation[];
  vfx: VfxNiagaraItem[];
  lighting: LightingItem[];
  renders: RenderItem[];
  shots: Shot[];
  projectId: string;
  initialSubTab?: 'env' | 'animation' | 'lighting' | 'vfx' | 'renders';
  onSubTabChange?: (tab: 'env' | 'animation' | 'lighting' | 'vfx' | 'renders') => void;
  onUpdateEnvironments: (updated: EnvironmentSetItem[]) => void;
  onUpdateAnimations: (updated: CharacterAnimation[]) => void;
  onUpdateVfx: (updated: VfxNiagaraItem[]) => void;
  onUpdateLighting: (updated: LightingItem[]) => void;
  onUpdateRenders: (updated: RenderItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const ProductionWorkflowView: React.FC<ProductionWorkflowViewProps> = ({
  environments,
  animations,
  vfx,
  lighting,
  renders,
  shots,
  projectId,
  initialSubTab,
  onSubTabChange,
  onUpdateEnvironments,
  onUpdateAnimations,
  onUpdateVfx,
  onUpdateLighting,
  onUpdateRenders,
  onSelectShot,
}) => {
  const [subTab, setSubTab] = useState<'env' | 'animation' | 'lighting' | 'vfx' | 'renders'>(
    initialSubTab || 'env'
  );

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSetSubTab = (newTab: 'env' | 'animation' | 'lighting' | 'vfx' | 'renders') => {
    setSubTab(newTab);
    onSubTabChange?.(newTab);
  };

  const [shotFilter, setShotFilter] = useState<string>('All');

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'env' | 'animation' | 'lighting' | 'vfx' | 'renders';
    id: string;
    name: string;
  } | null>(null);

  // Edit/Add modal states
  const [editingEnv, setEditingEnv] = useState<EnvironmentSetItem | null>(null);
  const [isAddingEnv, setIsAddingEnv] = useState(false);

  const [editingAnim, setEditingAnim] = useState<CharacterAnimation | null>(null);
  const [isAddingAnim, setIsAddingAnim] = useState(false);

  const [editingLight, setEditingLight] = useState<LightingItem | null>(null);
  const [isAddingLight, setIsAddingLight] = useState(false);

  const [editingVfx, setEditingVfx] = useState<VfxNiagaraItem | null>(null);
  const [isAddingVfx, setIsAddingVfx] = useState(false);

  const [editingRender, setEditingRender] = useState<RenderItem | null>(null);
  const [isAddingRender, setIsAddingRender] = useState(false);

  // Delete handler
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'env') {
      onUpdateEnvironments(environments.filter((e) => e.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'animation') {
      onUpdateAnimations(animations.filter((a) => a.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'lighting') {
      onUpdateLighting(lighting.filter((l) => l.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'vfx') {
      onUpdateVfx(vfx.filter((v) => v.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'renders') {
      onUpdateRenders(renders.filter((r) => r.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  // Filtered lists
  const filteredEnvs = environments.filter((e) => shotFilter === 'All' || e.shotId === shotFilter);
  const filteredAnims = animations.filter((a) => shotFilter === 'All' || a.shotId === shotFilter);
  const filteredLights = lighting.filter((l) => shotFilter === 'All' || l.shotId === shotFilter);
  const filteredVfx = vfx.filter((v) => shotFilter === 'All' || v.shotId === shotFilter);
  const filteredRenders = renders.filter((r) => shotFilter === 'All' || r.shotId === shotFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Subtabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Unreal Engine Production Workflow</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full physical and digital production execution across Virtual Sets, MetaHumans, Lumen Lighting, Niagara VFX, and MRQ EXR Renders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Global Shot Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 uppercase font-mono">Filter Shot:</span>
            <select
              value={shotFilter}
              onChange={(e) => setShotFilter(e.target.value)}
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

          {/* Subtabs */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => handleSetSubTab('env')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                subTab === 'env' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Virtual Sets ({environments.length})
            </button>
            <button
              onClick={() => handleSetSubTab('animation')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                subTab === 'animation' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Character & Mocap ({animations.length})
            </button>
            <button
              onClick={() => handleSetSubTab('lighting')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                subTab === 'lighting' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lumen Lighting ({lighting.length})
            </button>
            <button
              onClick={() => handleSetSubTab('vfx')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                subTab === 'vfx' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Niagara VFX ({vfx.length})
            </button>
            <button
              onClick={() => handleSetSubTab('renders')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                subTab === 'renders' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              MRQ Renders ({renders.length})
            </button>
          </div>
        </div>
      </div>

      {/* 1. VIRTUAL SETS & ENVIRONMENTS */}
      {subTab === 'env' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Virtual Sets, Nanite Geometry & Level Assembly
              </span>
              <span className="text-[11px] text-neutral-500">
                World Partition streaming, foliage LODs, and environment readiness for camera tracking.
              </span>
            </div>
            <button
              onClick={() => {
                setEditingEnv({
                  id: `env-${Date.now()}`,
                  projectId,
                  shotId: shots[0]?.id || '',
                  setName: 'New Set Environment',
                  levelPath: '/Game/Cinematics/Maps/MAP_NewSet',
                  naniteGeometry: 'Nanite High-Poly',
                  worldPartition: true,
                  foliageLOD: 'Nanite geometry',
                  lightingReady: false,
                  status: 'Blocking',
                  notes: '',
                });
                setIsAddingEnv(true);
              }}
              className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Virtual Set</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEnvs.map((env) => {
              const shot = shots.find((s) => s.id === env.shotId);

              return (
                <div key={env.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-2.5">
                      <div>
                        <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                          <Box className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{env.setName}</span>
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 truncate block mt-0.5" title={env.levelPath}>
                          {env.levelPath}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                        env.status === 'Locked'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : env.status === 'Dressed'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {env.status}
                      </span>
                    </div>

                    {/* Linked Shot Dropdown Preview */}
                    <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Linked Shot:</span>
                        {shot ? (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{shot.shotNumber}</span>
                            {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </button>
                        ) : (
                          <span className="text-neutral-500 italic">Project Global</span>
                        )}
                      </div>

                      <div className="flex justify-between text-neutral-400">
                        <span className="text-neutral-500">Nanite:</span>
                        <span className="font-mono text-neutral-300 truncate max-w-[170px]">{env.naniteGeometry}</span>
                      </div>

                      <div className="flex justify-between text-neutral-400">
                        <span className="text-neutral-500">World Partition:</span>
                        <span className={env.worldPartition ? 'text-emerald-400' : 'text-neutral-500'}>
                          {env.worldPartition ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {env.notes && (
                      <p className="text-neutral-400 italic text-[11px] leading-relaxed line-clamp-2">
                        "{env.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEnv(env);
                        setIsAddingEnv(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Set</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'env', id: env.id, name: env.setName })}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete Environment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CHARACTER & ANIMATION */}
      {subTab === 'animation' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Character Animation, MetaHuman Rigging & Mocap Cleanup
              </span>
              <span className="text-[11px] text-neutral-500">
                Track full performance capture, LiveLink facial expressions, and animation retargeting per shot.
              </span>
            </div>
            <button
              onClick={() => {
                setEditingAnim({
                  id: `anim-${Date.now()}`,
                  projectId,
                  character: 'Protagonist',
                  shotId: shots[0]?.id || '',
                  animationRequired: 'Action sequence / movement',
                  source: 'MetaHuman',
                  mocap: true,
                  retarget: true,
                  cleanup: false,
                  facialAnimation: true,
                  interaction: 'Prop interaction',
                  status: 'In Progress',
                  notes: '',
                });
                setIsAddingAnim(true);
              }}
              className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Animation Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnims.map((anim) => {
              const shot = shots.find((s) => s.id === anim.shotId);

              return (
                <div key={anim.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white text-sm">{anim.character}</span>
                        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
                          {anim.source}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        anim.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {anim.status}
                      </span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Linked Shot:</span>
                        {shot ? (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{shot.shotNumber}</span>
                            <span className="text-[10px] text-neutral-500 font-normal">({shot.shotType})</span>
                            {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </button>
                        ) : (
                          <span className="text-neutral-500 italic">None linked</span>
                        )}
                      </div>
                      <p className="text-neutral-300 leading-relaxed pt-1">{anim.animationRequired}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-neutral-400">
                      <span className={anim.mocap ? 'text-emerald-400' : 'text-neutral-600'}>● Mocap</span>
                      <span className={anim.retarget ? 'text-emerald-400' : 'text-neutral-600'}>● Retarget</span>
                      <span className={anim.cleanup ? 'text-emerald-400' : 'text-amber-500'}>
                        {anim.cleanup ? '● Curve Cleaned' : '○ Needs Curve Cleanup'}
                      </span>
                      <span className={anim.facialAnimation ? 'text-emerald-400' : 'text-neutral-600'}>● Facial LiveLink</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnim(anim);
                        setIsAddingAnim(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Animation Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'animation', id: anim.id, name: `${anim.character} Pass` })}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete Animation Pass"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LUMEN LIGHTING */}
      {subTab === 'lighting' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Cinematic Lighting Rigs & Lumen LookDev
              </span>
              <span className="text-[11px] text-neutral-500">
                Key, fill, rim/silhouette lights, bounce cards, exposure compensation, and volumetric haze.
              </span>
            </div>
            <button
              onClick={() => {
                setEditingLight({
                  id: `light-${Date.now()}`,
                  projectId,
                  shotId: shots[0]?.id || '',
                  setup: 'Three-Point Cinematic Rig',
                  keyLight: 'Key Light (5600K)',
                  fill: 'Fill bounce (3200K)',
                  rim: 'Sharp Rim / Silhouette',
                  practical: 'Neon practical emission',
                  atmosphere: 'Exponential Height Fog / Volumetrics',
                  characterLight: 'Eye sparkle catchlight',
                  cgLightInteraction: 'Emissive particle bounce',
                  reference: 'Greg Fraser Cinematography',
                  status: 'Blocked',
                });
                setIsAddingLight(true);
              }}
              className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lighting Rig</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLights.map((light) => {
              const shot = shots.find((s) => s.id === light.shotId);

              return (
                <div key={light.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <SunMedium className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white text-sm">{light.setup}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        light.status === 'Final Polish'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : light.status === 'Balanced'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {light.status}
                      </span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-850/60">
                        <span className="text-neutral-500">Linked Shot:</span>
                        {shot ? (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{shot.shotNumber}</span>
                            <span className="text-[10px] text-neutral-500 font-normal">({shot.shotType})</span>
                            {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </button>
                        ) : (
                          <span className="text-neutral-500 italic">None linked</span>
                        )}
                      </div>
                      <div><strong className="text-neutral-400">Key: </strong><span className="text-neutral-200">{light.keyLight}</span></div>
                      <div><strong className="text-neutral-400">Fill: </strong><span className="text-neutral-200">{light.fill}</span></div>
                      <div><strong className="text-neutral-400">Rim: </strong><span className="text-neutral-200">{light.rim}</span></div>
                      <div><strong className="text-neutral-400">Volumetric: </strong><span className="text-neutral-200">{light.atmosphere}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLight(light);
                        setIsAddingLight(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Lighting Rig</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'lighting', id: light.id, name: light.setup })}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete Lighting Rig"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. NIAGARA VFX */}
      {subTab === 'vfx' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Niagara VFX Particle Systems & Physical Simulation
              </span>
              <span className="text-[11px] text-neutral-500">
                Sparks, smoke, environmental dust, embers, and volumetric interactions tied to specific shots.
              </span>
            </div>
            <button
              onClick={() => {
                setEditingVfx({
                  id: `vfx-${Date.now()}`,
                  projectId,
                  shotId: shots[0]?.id || '',
                  effect: 'Sparks',
                  type: 'GPU Particle',
                  trigger: 'Contact Frame 0',
                  interaction: 'Nanite collision',
                  simulation: 'Vector field turbulence',
                  lightingInteraction: 'Emissive Lumen bounce',
                  complexity: 'Medium',
                  status: 'Planning',
                });
                setIsAddingVfx(true);
              }}
              className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Niagara Effect</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVfx.map((item) => {
              const shot = shots.find((s) => s.id === item.shotId);

              return (
                <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                      <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>{item.effect}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-850 text-neutral-300">
                        {item.type}
                      </span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded border border-neutral-850 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Linked Shot:</span>
                        {shot ? (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{shot.shotNumber}</span>
                            {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </button>
                        ) : (
                          <span className="text-neutral-500 italic">None linked</span>
                        )}
                      </div>

                      <div className="text-neutral-300">
                        <strong className="text-neutral-500 font-normal">Trigger: </strong>
                        {item.trigger}
                      </div>

                      <div className="text-neutral-300">
                        <strong className="text-neutral-500 font-normal">Lighting Bounce: </strong>
                        {item.lightingInteraction}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVfx(item);
                        setIsAddingVfx(false);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Effect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: 'vfx', id: item.id, name: `${item.effect} Effect` })}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Delete Effect"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MOVIE RENDER QUEUE (MRQ) */}
      {subTab === 'renders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Movie Render Queue (MRQ) Passes & High-Fidelity EXRs
              </span>
              <span className="text-[11px] text-neutral-500">
                Sequencer render passes, anti-aliasing sample overrides, warmup frames, and EXR master outputs.
              </span>
            </div>
            <button
              onClick={() => {
                setEditingRender({
                  id: `rnd-${Date.now()}`,
                  projectId,
                  shotId: shots[0]?.id || '',
                  renderVersion: 'v001',
                  resolution: 'Custom Anamorphic (3840x1608)',
                  fps: 24,
                  engine: 'Unreal Engine 5.4',
                  renderMethod: 'Movie Render Queue (MRQ)',
                  samples: 'Spatial: 16 | Temporal: 4',
                  renderSettings: 'Anti-aliasing 64 samples override',
                  renderTime: '30 min',
                  fileLocation: 'D:/Projects/Renders/Final.exr',
                  problems: '',
                  status: 'Queued',
                  isFinal: false,
                });
                setIsAddingRender(true);
              }}
              className="px-3.5 py-1.5 bg-amber-400 text-neutral-950 text-xs font-semibold rounded hover:bg-amber-300 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Render Pass</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] text-neutral-500 font-mono uppercase">
                <tr>
                  <th className="p-3">Shot</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Resolution & Engine</th>
                  <th className="p-3">Samples</th>
                  <th className="p-3">Render Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Master QC</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {filteredRenders.map((rnd) => {
                  const shot = shots.find((s) => s.id === rnd.shotId);

                  return (
                    <tr key={rnd.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {shot ? (
                          <button
                            type="button"
                            onClick={() => onSelectShot(shot)}
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>{shot.shotNumber}</span>
                            {shot.cameraLocked && <Lock className="w-3 h-3 text-amber-400" />}
                          </button>
                        ) : (
                          rnd.shotId
                        )}
                      </td>
                      <td className="p-3 font-mono text-neutral-300">{rnd.renderVersion}</td>
                      <td className="p-3">
                        <div className="text-white font-medium">{rnd.resolution}</div>
                        <div className="text-[10px] text-neutral-500">{rnd.engine} ({rnd.renderMethod})</div>
                      </td>
                      <td className="p-3 font-mono text-neutral-300 text-[11px]">{rnd.samples}</td>
                      <td className="p-3 font-mono text-neutral-300 tabular-nums">{rnd.renderTime}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          rnd.status === 'QC Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {rnd.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {rnd.isFinal ? (
                          <span className="text-emerald-400 font-bold font-mono text-[11px]">FINAL EXR</span>
                        ) : (
                          <span className="text-neutral-500 font-mono text-[11px]">WIP</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRender(rnd);
                              setIsAddingRender(false);
                            }}
                            className="text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-neutral-800"
                            title="Edit Render Settings"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'renders', id: rnd.id, name: `Render ${rnd.renderVersion}` })}
                            className="text-neutral-500 hover:text-rose-400 p-1 rounded hover:bg-neutral-800"
                            title="Delete Render"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ENV MODAL */}
      {editingEnv && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              {isAddingEnv ? 'Add Virtual Set Environment' : 'Edit Virtual Set'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Set Name</label>
                <input
                  type="text"
                  value={editingEnv.setName}
                  onChange={(e) => setEditingEnv({ ...editingEnv, setName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Linked Shot (Pre-Production / Production)</label>
                <select
                  value={editingEnv.shotId || ''}
                  onChange={(e) => setEditingEnv({ ...editingEnv, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono"
                >
                  <option value="">None / Project Global Set</option>
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 30)} ({s.cameraLocked ? 'Locked' : s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Nanite Geometry</label>
                  <input
                    type="text"
                    value={editingEnv.naniteGeometry}
                    onChange={(e) => setEditingEnv({ ...editingEnv, naniteGeometry: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={editingEnv.status}
                    onChange={(e) => setEditingEnv({ ...editingEnv, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Blocking">Blocking</option>
                    <option value="Dressed">Dressed</option>
                    <option value="Optimized">Optimized</option>
                    <option value="Locked">Locked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Unreal Level Path</label>
                <input
                  type="text"
                  value={editingEnv.levelPath}
                  onChange={(e) => setEditingEnv({ ...editingEnv, levelPath: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Production Notes</label>
                <textarea
                  rows={2}
                  value={editingEnv.notes}
                  onChange={(e) => setEditingEnv({ ...editingEnv, notes: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingEnv(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingEnv) {
                    onUpdateEnvironments([...environments, editingEnv]);
                  } else {
                    onUpdateEnvironments(environments.map((e) => (e.id === editingEnv.id ? editingEnv : e)));
                  }
                  setEditingEnv(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Virtual Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION MODAL */}
      {editingAnim && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              {isAddingAnim ? 'Add Character Animation Pass' : 'Edit Animation Pass'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Character</label>
                  <input
                    type="text"
                    value={editingAnim.character}
                    onChange={(e) => setEditingAnim({ ...editingAnim, character: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Source Rig</label>
                  <select
                    value={editingAnim.source}
                    onChange={(e) => setEditingAnim({ ...editingAnim, source: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="MetaHuman">MetaHuman</option>
                    <option value="Motion Capture">Motion Capture</option>
                    <option value="Mixamo">Mixamo</option>
                    <option value="Cascadeur">Cascadeur</option>
                    <option value="iClone">iClone</option>
                    <option value="Hand Animation">Hand Animation</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Linked Shot (Production)</label>
                <select
                  value={editingAnim.shotId}
                  onChange={(e) => setEditingAnim({ ...editingAnim, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono"
                >
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 30)} ({s.cameraLocked ? 'Locked' : s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Animation Action Required</label>
                <textarea
                  rows={2}
                  value={editingAnim.animationRequired}
                  onChange={(e) => setEditingAnim({ ...editingAnim, animationRequired: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAnim.mocap}
                    onChange={(e) => setEditingAnim({ ...editingAnim, mocap: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span>Mocap Captured</span>
                </label>
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAnim.facialAnimation}
                    onChange={(e) => setEditingAnim({ ...editingAnim, facialAnimation: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span>Facial LiveLink</span>
                </label>
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAnim.retarget}
                    onChange={(e) => setEditingAnim({ ...editingAnim, retarget: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span>Retarget Completed</span>
                </label>
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAnim.cleanup}
                    onChange={(e) => setEditingAnim({ ...editingAnim, cleanup: e.target.checked })}
                    className="accent-amber-400 rounded"
                  />
                  <span>Curves Cleaned</span>
                </label>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Approval Status</label>
                <select
                  value={editingAnim.status}
                  onChange={(e) => setEditingAnim({ ...editingAnim, status: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingAnim(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingAnim) {
                    onUpdateAnimations([...animations, editingAnim]);
                  } else {
                    onUpdateAnimations(animations.map((a) => (a.id === editingAnim.id ? editingAnim : a)));
                  }
                  setEditingAnim(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Animation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTING MODAL */}
      {editingLight && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              {isAddingLight ? 'Add Lumen Lighting Rig' : 'Edit Lighting Rig'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Rig Name / Setup</label>
                <input
                  type="text"
                  value={editingLight.setup}
                  onChange={(e) => setEditingLight({ ...editingLight, setup: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Linked Shot (Production)</label>
                <select
                  value={editingLight.shotId}
                  onChange={(e) => setEditingLight({ ...editingLight, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono"
                >
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 30)} ({s.cameraLocked ? 'Locked' : s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Key Light</label>
                  <input
                    type="text"
                    value={editingLight.keyLight}
                    onChange={(e) => setEditingLight({ ...editingLight, keyLight: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Fill Light</label>
                  <input
                    type="text"
                    value={editingLight.fill}
                    onChange={(e) => setEditingLight({ ...editingLight, fill: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Rim / Silhouette</label>
                  <input
                    type="text"
                    value={editingLight.rim}
                    onChange={(e) => setEditingLight({ ...editingLight, rim: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Atmosphere / Fog</label>
                  <input
                    type="text"
                    value={editingLight.atmosphere}
                    onChange={(e) => setEditingLight({ ...editingLight, atmosphere: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Lighting Phase Status</label>
                <select
                  value={editingLight.status}
                  onChange={(e) => setEditingLight({ ...editingLight, status: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                >
                  <option value="Concept">Concept</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Final Polish">Final Polish</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingLight(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingLight) {
                    onUpdateLighting([...lighting, editingLight]);
                  } else {
                    onUpdateLighting(lighting.map((l) => (l.id === editingLight.id ? editingLight : l)));
                  }
                  setEditingLight(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Lighting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VFX MODAL */}
      {editingVfx && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              {isAddingVfx ? 'Add Niagara VFX System' : 'Edit Niagara Effect'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Effect Category</label>
                  <select
                    value={editingVfx.effect}
                    onChange={(e) => setEditingVfx({ ...editingVfx, effect: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Sparks">Sparks</option>
                    <option value="Smoke">Smoke</option>
                    <option value="Dust">Dust</option>
                    <option value="Fire">Fire</option>
                    <option value="Explosion">Explosion</option>
                    <option value="Debris">Debris</option>
                    <option value="Magic">Magic</option>
                    <option value="Energy">Energy</option>
                    <option value="Rain">Rain</option>
                    <option value="Fog">Fog</option>
                    <option value="Destruction">Destruction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Simulation Type</label>
                  <select
                    value={editingVfx.type}
                    onChange={(e) => setEditingVfx({ ...editingVfx, type: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="GPU Particle">GPU Particle</option>
                    <option value="CPU">CPU</option>
                    <option value="Ribbon">Ribbon</option>
                    <option value="Fluid Simulation">Fluid Simulation</option>
                    <option value="Mesh Emitter">Mesh Emitter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Linked Shot (Production)</label>
                <select
                  value={editingVfx.shotId}
                  onChange={(e) => setEditingVfx({ ...editingVfx, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono"
                >
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 30)} ({s.cameraLocked ? 'Locked' : s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Trigger Condition</label>
                <input
                  type="text"
                  value={editingVfx.trigger}
                  onChange={(e) => setEditingVfx({ ...editingVfx, trigger: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Lighting Bounce</label>
                  <input
                    type="text"
                    value={editingVfx.lightingInteraction}
                    onChange={(e) => setEditingVfx({ ...editingVfx, lightingInteraction: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={editingVfx.status}
                    onChange={(e) => setEditingVfx({ ...editingVfx, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Setup">Setup</option>
                    <option value="Tuning">Tuning</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingVfx(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingVfx) {
                    onUpdateVfx([...vfx, editingVfx]);
                  } else {
                    onUpdateVfx(vfx.map((v) => (v.id === editingVfx.id ? editingVfx : v)));
                  }
                  setEditingVfx(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Niagara VFX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODAL */}
      {editingRender && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2">
              {isAddingRender ? 'Add Movie Render Queue (MRQ) Pass' : 'Edit Render Settings'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Render Version</label>
                  <select
                    value={editingRender.renderVersion}
                    onChange={(e) => setEditingRender({ ...editingRender, renderVersion: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="v001">v001</option>
                    <option value="v002">v002</option>
                    <option value="v003">v003</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Resolution</label>
                  <select
                    value={editingRender.resolution}
                    onChange={(e) => setEditingRender({ ...editingRender, resolution: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Custom Anamorphic (3840x1608)">Custom Anamorphic (3840x1608)</option>
                    <option value="3840x2160 (4K)">3840x2160 (4K)</option>
                    <option value="2560x1440">2560x1440 (2K)</option>
                    <option value="1920x1080">1920x1080 (HD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Linked Shot (Production)</label>
                <select
                  value={editingRender.shotId}
                  onChange={(e) => setEditingRender({ ...editingRender, shotId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-amber-300 font-mono"
                >
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 30)} ({s.cameraLocked ? 'Locked' : s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Render Engine</label>
                  <select
                    value={editingRender.engine}
                    onChange={(e) => setEditingRender({ ...editingRender, engine: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Unreal Engine 5.4">Unreal Engine 5.4</option>
                    <option value="Unreal Engine 5.5">Unreal Engine 5.5</option>
                    <option value="Path Tracer">Path Tracer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Anti-Aliasing Samples</label>
                  <input
                    type="text"
                    value={editingRender.samples}
                    onChange={(e) => setEditingRender({ ...editingRender, samples: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    value={editingRender.status}
                    onChange={(e) => setEditingRender({ ...editingRender, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-white"
                  >
                    <option value="Queued">Queued</option>
                    <option value="Rendering">Rendering</option>
                    <option value="Completed">Completed</option>
                    <option value="QC Approved">QC Approved</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRender.isFinal}
                      onChange={(e) => setEditingRender({ ...editingRender, isFinal: e.target.checked })}
                      className="accent-amber-400 rounded"
                    />
                    <span className="font-semibold text-emerald-400">Master Final EXR</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingRender(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingRender) {
                    onUpdateRenders([...renders, editingRender]);
                  } else {
                    onUpdateRenders(renders.map((r) => (r.id === editingRender.id ? editingRender : r)));
                  }
                  setEditingRender(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded"
              >
                Save Render
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.name}?`}
        message={`Are you sure you want to delete this production item? This action will remove its tracking data.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
