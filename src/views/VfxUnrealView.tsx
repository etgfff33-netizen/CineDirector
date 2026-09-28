import React, { useState } from 'react';
import {
  CharacterAnimation,
  VfxNiagaraItem,
  LightingItem,
  RenderItem,
  CompositingItem,
  Shot,
} from '../types';
import { Flame, User, SunMedium, Clapperboard, Layers, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

interface VfxUnrealViewProps {
  animations: CharacterAnimation[];
  vfx: VfxNiagaraItem[];
  lighting: LightingItem[];
  renders: RenderItem[];
  compositing: CompositingItem[];
  shots: Shot[];
  projectId: string;
  onUpdateAnimations: (updated: CharacterAnimation[]) => void;
  onUpdateVfx: (updated: VfxNiagaraItem[]) => void;
  onUpdateLighting: (updated: LightingItem[]) => void;
  onUpdateRenders: (updated: RenderItem[]) => void;
  onUpdateCompositing: (updated: CompositingItem[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const VfxUnrealView: React.FC<VfxUnrealViewProps> = ({
  animations,
  vfx,
  lighting,
  renders,
  compositing,
  shots,
  projectId,
  onUpdateAnimations,
  onUpdateVfx,
  onUpdateLighting,
  onUpdateRenders,
  onUpdateCompositing,
  onSelectShot,
}) => {
  const [subTab, setSubTab] = useState<'vfx' | 'animation' | 'lighting' | 'renders' | 'compositing'>('vfx');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Unreal Engine & VFX Pipeline Hub</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Technical execution trackers for Niagara particle systems, MetaHuman mocap, Lumen lighting rigs, Movie Render Queue, and Nuke comps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setSubTab('vfx')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'vfx' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Niagara VFX ({vfx.length})
          </button>
          <button
            onClick={() => setSubTab('animation')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'animation' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Character & Mocap ({animations.length})
          </button>
          <button
            onClick={() => setSubTab('lighting')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'lighting' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Lumen Lighting ({lighting.length})
          </button>
          <button
            onClick={() => setSubTab('renders')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'renders' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            MRQ Renders ({renders.length})
          </button>
          <button
            onClick={() => setSubTab('compositing')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              subTab === 'compositing' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Nuke Comp ({compositing.length})
          </button>
        </div>
      </div>

      {/* 1. NIAGARA VFX TRACKER */}
      {subTab === 'vfx' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Niagara Particle Systems linked to Shots
            </span>
            <button
              onClick={() => {
                const newVfx: VfxNiagaraItem = {
                  id: `vfx-${Date.now()}`,
                  projectId,
                  shotId: shots[0]?.id || 'gns-001',
                  effect: 'Sparks',
                  type: 'GPU Particle',
                  trigger: 'Contact Frame 0',
                  interaction: 'Collision with Nanite environment',
                  simulation: 'Vector Field physics',
                  lightingInteraction: 'Emissive Lumen illumination',
                  complexity: 'Medium',
                  status: 'Planning',
                };
                onUpdateVfx([...vfx, newVfx]);
              }}
              className="px-3 py-1.5 bg-amber-400 text-neutral-950 text-xs font-medium rounded hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Niagara Effect</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vfx.map((item) => {
              const shot = shots.find((s) => s.id === item.shotId);

              return (
                <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>{item.effect}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                      {item.type}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5">
                    {shot && (
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Linked Shot:</span>
                        <button
                          onClick={() => onSelectShot(shot)}
                          className="font-mono text-amber-400 font-bold hover:underline"
                        >
                          {shot.shotNumber}
                        </button>
                      </div>
                    )}
                    <div className="text-neutral-400">
                      <strong className="text-neutral-300 font-normal">Trigger: </strong>
                      {item.trigger}
                    </div>
                    <div className="text-neutral-400">
                      <strong className="text-neutral-300 font-normal">Lighting Bounce: </strong>
                      {item.lightingInteraction}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono text-[10px]">{item.complexity}</span>
                    <select
                      value={item.status}
                      onChange={(e) => {
                        const updated = vfx.map((v) =>
                          v.id === item.id ? { ...v, status: e.target.value as any } : v
                        );
                        onUpdateVfx(updated);
                      }}
                      className="bg-neutral-950 border border-neutral-750 text-neutral-200 text-[11px] rounded px-2 py-0.5"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Setup">Setup</option>
                      <option value="Tuning">Tuning</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CHARACTER & ANIMATION TRACKER */}
      {subTab === 'animation' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Character Animation & Mocap Pass
            </span>
            <button
              onClick={() => {
                const newAnim: CharacterAnimation = {
                  id: `anim-${Date.now()}`,
                  projectId,
                  character: 'Vesper',
                  shotId: shots[0]?.id || 'gns-001',
                  animationRequired: 'Walk / idle cycle',
                  source: 'MetaHuman',
                  mocap: true,
                  retarget: true,
                  cleanup: false,
                  facialAnimation: true,
                  interaction: 'Gantry interaction',
                  status: 'In Progress',
                  notes: '',
                };
                onUpdateAnimations([...animations, newAnim]);
              }}
              className="px-3 py-1.5 bg-amber-400 text-neutral-950 text-xs font-medium rounded hover:bg-amber-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Animation Pass</span>
            </button>
          </div>

          <div className="space-y-3">
            {animations.map((anim) => {
              const shot = shots.find((s) => s.id === anim.shotId);

              return (
                <div key={anim.id} className="bg-neutral-950 p-4 rounded border border-neutral-850 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{anim.character}</span>
                      {shot && (
                        <button
                          onClick={() => onSelectShot(shot)}
                          className="font-mono text-amber-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 font-bold"
                        >
                          {shot.shotNumber}
                        </button>
                      )}
                      <span className="text-neutral-400">Source: {anim.source}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          anim.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {anim.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed">{anim.animationRequired}</p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900 text-[11px] text-neutral-400">
                    <span className={anim.mocap ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Mocap
                    </span>
                    <span className={anim.retarget ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Retargeted
                    </span>
                    <span className={anim.cleanup ? 'text-emerald-400' : 'text-amber-500'}>
                      ● Curve Cleanup
                    </span>
                    <span className={anim.facialAnimation ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Facial LiveLink
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LIGHTING TRACKER */}
      {subTab === 'lighting' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
              Cinematic Lighting Rigs & Lumen Radiance
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lighting.map((light) => {
                const shot = shots.find((s) => s.id === light.shotId);

                return (
                  <div key={light.id} className="bg-neutral-950 p-4 rounded border border-neutral-850 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SunMedium className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white">{light.setup}</span>
                      </div>
                      {shot && (
                        <button
                          onClick={() => onSelectShot(shot)}
                          className="font-mono text-amber-400 font-bold"
                        >
                          {shot.shotNumber}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 text-neutral-400 text-[11px]">
                      <div>
                        <strong className="text-neutral-300">Key: </strong>
                        {light.keyLight}
                      </div>
                      <div>
                        <strong className="text-neutral-300">Fill: </strong>
                        {light.fill}
                      </div>
                      <div>
                        <strong className="text-neutral-300">Rim / Silhouette: </strong>
                        {light.rim}
                      </div>
                      <div>
                        <strong className="text-neutral-300">Volumetric Atmosphere: </strong>
                        {light.atmosphere}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-900 flex justify-between text-[11px]">
                      <span className="text-neutral-500 font-mono">{light.status}</span>
                      <span className="text-neutral-400 italic">Ref: {light.reference}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. MOVIE RENDER QUEUE (MRQ) TRACKER */}
      {subTab === 'renders' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Movie Render Queue (MRQ) Passes & Final EXRs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] text-neutral-500 font-mono uppercase">
                <tr>
                  <th className="p-3">Shot</th>
                  <th className="p-3">Ver</th>
                  <th className="p-3">Resolution & Engine</th>
                  <th className="p-3">Samples</th>
                  <th className="p-3">Render Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Master QC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {renders.map((rnd) => {
                  const shot = shots.find((s) => s.id === rnd.shotId);

                  return (
                    <tr key={rnd.id} className="hover:bg-neutral-850/50">
                      <td className="p-3 font-mono font-bold text-amber-400">
                        {shot ? shot.shotNumber : rnd.shotId}
                      </td>
                      <td className="p-3 font-mono text-neutral-400">{rnd.renderVersion}</td>
                      <td className="p-3">
                        <div className="text-white">{rnd.resolution}</div>
                        <div className="text-[10px] text-neutral-500">{rnd.engine} ({rnd.renderMethod})</div>
                      </td>
                      <td className="p-3 font-mono text-neutral-300 text-[11px]">{rnd.samples}</td>
                      <td className="p-3 font-mono text-neutral-300 tabular-nums">{rnd.renderTime}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            rnd.status === 'QC Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {rnd.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {rnd.isFinal ? (
                          <span className="text-emerald-400 text-[11px] font-bold">FINAL EXR</span>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">WIP</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. COMPOSITING TRACKER */}
      {subTab === 'compositing' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
            Nuke Compositing, Depth Passes & Optical Integration
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compositing.map((cmp) => {
              const shot = shots.find((s) => s.id === cmp.shotId);

              return (
                <div key={cmp.id} className="bg-neutral-950 p-4 rounded border border-neutral-850 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white font-semibold">{cmp.nukeScript}</span>
                    {shot && (
                      <span className="font-mono text-amber-400 font-bold">{shot.shotNumber}</span>
                    )}
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    <strong>AOV / CG Passes: </strong>
                    <span className="font-mono">{cmp.cgPasses}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                    <span className={cmp.tracking ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Camera Tracking
                    </span>
                    <span className={cmp.lensDistortion ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Lens Distortion Match
                    </span>
                    <span className={cmp.lightWrap ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● Light Wrap / Bloom
                    </span>
                    <span className={cmp.grain ? 'text-emerald-400' : 'text-neutral-600'}>
                      ● 35mm Film Grain
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Status: {cmp.status}</span>
                    {cmp.finalQc && (
                      <span className="text-emerald-400 font-mono text-[10px] font-bold">COMP QC OK</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
