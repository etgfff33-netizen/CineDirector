import React from 'react';
import { GateStatus } from '../utils/automations';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Lock, Unlock } from 'lucide-react';

interface GatesViewProps {
  gates: GateStatus[];
  onNavigateToTab: (tab: any) => void;
}

export const GatesView: React.FC<GatesViewProps> = ({ gates, onNavigateToTab }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>The 5 Production Gates</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Mandatory checkpoints that prevent solo creators from wasting weeks on lighting and rendering before the story and cameras are locked.
        </p>
      </div>

      <div className="space-y-4">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className={`border rounded-lg p-5 transition-all ${
              gate.isUnlocked
                ? 'bg-neutral-900 border-emerald-900/60'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-amber-400">
                  GATE 0{gate.gateNumber}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <span>{gate.name}</span>
                    {gate.isUnlocked ? (
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-xs font-normal text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3" /> In Progress
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <div>
                {gate.gateNumber === 1 && (
                  <button
                    onClick={() => onNavigateToTab('preproduction')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>Edit Story & Script</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {gate.gateNumber === 2 && (
                  <button
                    onClick={() => onNavigateToTab('storyboard')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>View Storyboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {gate.gateNumber === 3 && (
                  <button
                    onClick={() => onNavigateToTab('previs')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>Previs Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {gate.gateNumber === 4 && (
                  <button
                    onClick={() => onNavigateToTab('shots')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>Inspect Cameras</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {gate.gateNumber === 5 && (
                  <button
                    onClick={() => onNavigateToTab('production-hub')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>Production Hub & MRQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {gate.blockReason && (
              <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Gate Requirement: </strong> {gate.blockReason}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {gate.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border text-xs flex items-center gap-2.5 ${
                    item.passed
                      ? 'bg-neutral-950 border-emerald-900/50 text-neutral-200'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                  )}
                  <span className={item.passed ? 'font-medium' : 'text-neutral-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
