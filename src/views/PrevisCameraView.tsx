import React, { useState } from 'react';
import { Shot } from '../types';
import { Video, Lock, Unlock, CheckCircle2, AlertTriangle, Camera, Check, Plus, Film } from 'lucide-react';
import { MediaDisplay } from '../components/MediaDisplay';
import { MediaUploadInput } from '../components/MediaUploadInput';

interface PrevisCameraViewProps {
  shots: Shot[];
  onUpdateShot: (updated: Shot) => void;
  onSelectShot: (shot: Shot) => void;
}

export const PrevisCameraView: React.FC<PrevisCameraViewProps> = ({
  shots,
  onUpdateShot,
  onSelectShot,
}) => {
  const [selectedShotId, setSelectedShotId] = useState<string>(shots[0]?.id || '');
  const [viewportDragOver, setViewportDragOver] = useState(false);
  const activeShot = shots.find((s) => s.id === selectedShotId) || shots[0];

  const handleViewportDrop = (file: File) => {
    if (!activeShot) return;
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const detected: 'image' | 'video' = isVideo ? 'video' : 'image';

    if (file.size <= 25 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateShot({
          ...activeShot,
          previsUrl: reader.result as string,
          previsMediaType: detected,
        });
      };
      reader.readAsDataURL(file);
    } else {
      const blobUrl = URL.createObjectURL(file);
      onUpdateShot({
        ...activeShot,
        previsUrl: blobUrl,
        previsMediaType: detected,
      });
    }
  };

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    storyWorks: true,
    cameraWorks: true,
    compositionWorks: true,
    characterMovementWorks: true,
    timingWorks: true,
    transitionWorks: true,
    shotTechnicallyAchievable: true,
    shotIsNecessary: true,
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTogglePrevisApproved = () => {
    if (!activeShot) return;
    const isApproved = !activeShot.previsApproved;
    onUpdateShot({
      ...activeShot,
      previsApproved: isApproved,
      cameraLocked: isApproved ? true : activeShot.cameraLocked,
    });
  };

  const handleToggleCameraLock = () => {
    if (!activeShot) return;
    onUpdateShot({
      ...activeShot,
      cameraLocked: !activeShot.cameraLocked,
    });
  };

  const handleBumpCameraVersion = () => {
    if (!activeShot) return;
    const currentNum = parseInt(activeShot.cameraVersion.replace(/\D/g, '') || '1', 10);
    const nextVer = `v0${currentNum + 1}`;
    onUpdateShot({
      ...activeShot,
      cameraVersion: nextVer,
      cameraLocked: false,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            <span>Previs System & Camera / Lens Tracker</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Validate story timing and lens choices before committing GPU power. Camera Lock ensures downstream lighting and FX do not break.
          </p>
        </div>

        {activeShot && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePrevisApproved}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeShot.previsApproved
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-750'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeShot.previsApproved ? 'PREVIS APPROVED' : 'Approve Previs'}</span>
            </button>

            <button
              onClick={handleToggleCameraLock}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeShot.cameraLocked
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white'
              }`}
            >
              {activeShot.cameraLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{activeShot.cameraLocked ? `Camera Locked (${activeShot.cameraVersion})` : 'Lock Camera'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Shot Selector on Left, Inspection on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Shot List */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 space-y-1.5 lg:col-span-1 max-h-[80vh] overflow-y-auto">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
            Select Shot ({shots.length})
          </div>
          {shots.map((shot) => {
            const isSelected = shot.id === selectedShotId;
            return (
              <button
                key={shot.id}
                onClick={() => setSelectedShotId(shot.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-colors text-xs ${
                  isSelected
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200'
                }`}
              >
                <div>
                  <div className="font-mono font-bold text-amber-400">{shot.shotNumber}</div>
                  <div className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                    {shot.description}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {shot.previsApproved ? (
                    <span className="text-[10px] text-emerald-400 font-mono">Previs OK</span>
                  ) : (
                    <span className="text-[10px] text-amber-500/80 font-mono">Needs Previs</span>
                  )}
                  {shot.cameraLocked && (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Previs Checklist and Camera Specs */}
        {activeShot ? (
          <div className="lg:col-span-3 space-y-5">
            {/* Camera Lock Notice Banner */}
            {activeShot.cameraLocked ? (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Camera Locked ({activeShot.cameraVersion}):</strong> Focal length ({activeShot.lens}), FOV ({activeShot.fov}), and camera trajectory are locked for production.
                  </span>
                </div>
                <button
                  onClick={handleBumpCameraVersion}
                  className="px-2.5 py-1 bg-amber-400 text-neutral-950 font-medium rounded hover:bg-amber-300 shrink-0"
                >
                  Create New Camera Version
                </button>
              </div>
            ) : (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>Camera is currently unlocked. Once framing is approved, lock camera to protect downstream lighting.</span>
                </div>
                <button
                  onClick={handleToggleCameraLock}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded shrink-0"
                >
                  Lock Camera
                </button>
              </div>
            )}

            {/* Previs Playblast Video Viewport & Upload */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Previs Playblast Viewport ({activeShot.shotNumber})
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {activeShot.lens} · {activeShot.cameraMovement}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewportDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewportDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewportDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleViewportDrop(file);
                  }}
                  className={`relative border rounded overflow-hidden bg-black shadow-lg transition-all ${
                    viewportDragOver
                      ? 'border-amber-400 ring-2 ring-amber-400/40'
                      : 'border-neutral-800'
                  }`}
                >
                  <MediaDisplay
                    src={activeShot.previsUrl || activeShot.storyboardUrl}
                    mediaType={activeShot.previsUrl ? activeShot.previsMediaType : activeShot.storyboardMediaType}
                    alt={activeShot.description}
                    aspectRatioClass="aspect-video"
                    fallbackLabel="[ DROP PLAYBLAST VIDEO OR CLICK TO LOAD ]"
                    showControls={true}
                    autoPlay={false}
                    allowFullscreen={true}
                  />

                  {viewportDragOver && (
                    <div className="absolute inset-0 bg-amber-950/85 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-30 pointer-events-none">
                      <Film className="w-8 h-8 mb-1 text-amber-300 animate-bounce" />
                      <span>Drop Unreal Playblast Video / Image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <MediaUploadInput
                    label="Upload Previs Video Playblast or Image"
                    value={activeShot.previsUrl || ''}
                    mediaType={activeShot.previsMediaType}
                    onChange={(url, detectedType) => {
                      onUpdateShot({
                        ...activeShot,
                        previsUrl: url,
                        previsMediaType: detectedType,
                      });
                    }}
                    placeholder="Upload MP4/WebM playblast or paste URL"
                    helperText="Upload Unreal CineCamera playblast (.mp4, .webm, .mov) or blocking image"
                  />

                  <div className="p-3 bg-neutral-950 rounded border border-neutral-850 text-xs space-y-1">
                    <span className="text-neutral-500 font-mono text-[10px] uppercase block">
                      Camera Trajectory Note:
                    </span>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">
                      {activeShot.cameraMovement} at {activeShot.cameraHeight} height, {activeShot.cameraDistance} distance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previs Approval Checklist */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Previs Approval Checklist
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-400">
                  All 8 points required before Gate 03 sign-off
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'storyWorks', label: '1. Story works in context of sequence' },
                  { id: 'cameraWorks', label: '2. Camera angle and lens choice are effective' },
                  { id: 'compositionWorks', label: '3. Composition and negative space work' },
                  { id: 'characterMovementWorks', label: '4. Character movement and blocking work' },
                  { id: 'timingWorks', label: '5. Shot timing and duration feel natural' },
                  { id: 'transitionWorks', label: '6. Cut transitions seamlessly with adjacent shots' },
                  { id: 'shotTechnicallyAchievable', label: '7. Shot is technically achievable in Unreal' },
                  { id: 'shotIsNecessary', label: '8. Shot is strictly necessary for narrative' },
                ].map((item) => {
                  const isChecked = checklist[item.id] ?? false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-2.5 rounded border cursor-pointer flex items-center gap-2.5 transition-colors ${
                        isChecked
                          ? 'bg-neutral-950 border-emerald-900/50 text-neutral-200'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={isChecked ? 'font-medium' : ''}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cinematic Camera & Lens Tracker Grid */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Unreal CineCamera Specification
                  </h2>
                </div>
                <button
                  onClick={() => onSelectShot(activeShot)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  Edit Full Shot Specs →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Camera Actor</span>
                  <span className="font-mono text-neutral-200 font-medium">{activeShot.camera}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Lens Prime</span>
                  <span className="font-mono text-neutral-200 font-medium">{activeShot.lens}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Sensor Size</span>
                  <span className="text-neutral-200 font-medium">{activeShot.sensor}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Field of View</span>
                  <span className="font-mono text-amber-400 font-bold">{activeShot.fov}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Camera Height</span>
                  <span className="font-mono text-neutral-300">{activeShot.cameraHeight}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Subject Distance</span>
                  <span className="font-mono text-neutral-300">{activeShot.cameraDistance}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Focus Distance</span>
                  <span className="font-mono text-neutral-300">{activeShot.focusDistance}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase">Depth of Field</span>
                  <span className="text-neutral-300">{activeShot.dof}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase mb-0.5">Camera Movement & Rig</span>
                  <span className="text-neutral-200 font-medium">{activeShot.cameraMovement}</span>
                </div>

                <div className="bg-neutral-950 p-3 rounded border border-neutral-850">
                  <span className="text-neutral-500 text-[10px] block uppercase mb-0.5">Shutter & Camera Shake</span>
                  <span className="text-neutral-200 font-medium">
                    {activeShot.shutterAngle} Shutter · {activeShot.cameraShake}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-neutral-500 text-xs">No shot selected</div>
        )}
      </div>
    </div>
  );
};
