import React, { useState } from 'react';
import { StoryboardFrame, Shot } from '../types';
import {
  Columns,
  Plus,
  Copy,
  Trash2,
  Film,
  Camera,
  Layers,
  ArrowUp,
  ArrowDown,
  Volume2,
  Upload,
  Link,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { MediaDisplay, isVideoMedia } from '../components/MediaDisplay';
import { MediaUploadInput } from '../components/MediaUploadInput';
import { ConfirmModal } from '../components/ConfirmModal';

interface StoryboardViewProps {
  storyboard: StoryboardFrame[];
  shots: Shot[];
  projectId: string;
  onUpdateStoryboard: (updated: StoryboardFrame[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  storyboard,
  shots,
  projectId,
  onUpdateStoryboard,
  onSelectShot,
}) => {
  const [editingMediaFrameId, setEditingMediaFrameId] = useState<string | null>(null);
  const [frameDragOverId, setFrameDragOverId] = useState<string | null>(null);
  const [frameToDelete, setFrameToDelete] = useState<StoryboardFrame | null>(null);

  const sortedFrames = [...storyboard].sort((a, b) => a.order - b.order);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedFrames.length) return;

    const copy = [...sortedFrames];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const updated = copy.map((f, i) => ({ ...f, order: i + 1 }));
    onUpdateStoryboard(updated);
  };

  const handleDuplicate = (frame: StoryboardFrame) => {
    const newFrame: StoryboardFrame = {
      ...frame,
      id: `sb-${Date.now()}`,
      order: sortedFrames.length + 1,
      version: `${frame.version || 'v01'}_copy`,
    };
    onUpdateStoryboard([...storyboard, newFrame]);
  };

  const handleDelete = (id: string) => {
    const updated = storyboard
      .filter((f) => f.id !== id)
      .map((f, i) => ({ ...f, order: i + 1 }));
    onUpdateStoryboard(updated);
    setFrameToDelete(null);
  };

  const handleUpdateFrame = (id: string, field: keyof StoryboardFrame, value: any) => {
    const updated = storyboard.map((f) => (f.id === id ? { ...f, [field]: value } : f));
    onUpdateStoryboard(updated);
  };

  const processFrameFileUpload = (id: string, file: File) => {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const detected: 'image' | 'video' = isVideo ? 'video' : 'image';

    if (file.size <= 25 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = storyboard.map((f) =>
          f.id === id
            ? {
                ...f,
                frameImage: reader.result as string,
                mediaType: detected,
              }
            : f
        );
        onUpdateStoryboard(updated as any);
      };
      reader.readAsDataURL(file);
    } else {
      const blobUrl = URL.createObjectURL(file);
      const updated = storyboard.map((f) =>
        f.id === id
          ? {
              ...f,
              frameImage: blobUrl,
              mediaType: detected,
            }
          : f
      );
      onUpdateStoryboard(updated as any);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Columns className="w-5 h-5 text-amber-400" />
            <span>Storyboard Board & Visual Flow</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Sequential framing, camera blocking, and motion previs clips (Image & Video). Upload sketches, render stills, or drag & drop video playblasts.
          </p>
        </div>

        <button
          onClick={() => {
            const nextOrder = sortedFrames.length + 1;
            const newShotId = shots[0]?.id || `gns-00${nextOrder}`;
            const newFrame: StoryboardFrame = {
              id: `sb-${Date.now()}`,
              shotId: newShotId,
              projectId,
              scene: 'Scene 1',
              order: nextOrder,
              frameImage: '',
              mediaType: 'image',
              shotDescription: 'New storyboard composition sketch or motion clip...',
              framing: 'Wide',
              cameraPosition: 'Eye Level Ground',
              cameraMovement: 'Static',
              characterPosition: 'Center',
              characterAction: 'Standing',
              lens: '50mm Prime',
              durationSeconds: 3.0,
              dialogue: '',
              sound: '',
              vfxNotes: '',
              purpose: 'Define purpose for this beat',
              version: 'v01',
            };
            onUpdateStoryboard([...storyboard, newFrame]);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors self-start sm:self-auto shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Frame</span>
        </button>
      </div>

      {/* Filmstrip / Cards List */}
      <div className="space-y-4">
        {sortedFrames.map((frame, index) => {
          const linkedShot = shots.find((s) => s.id === frame.shotId);
          const isEditingMedia = editingMediaFrameId === frame.id;
          const isDragOver = frameDragOverId === frame.id;
          const isVid = isVideoMedia(frame.frameImage, frame.mediaType);

          return (
            <div
              key={frame.id}
              className={`bg-neutral-900 border rounded-lg overflow-hidden flex flex-col lg:flex-row gap-0 group shadow-sm transition-all ${
                isDragOver ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Visual Thumbnail Column */}
              <div className="lg:w-84 bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-800 relative flex flex-col justify-between shrink-0">
                {/* 2.39:1 Scope Letterbox preview (Image or Video) with Drag & Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFrameDragOverId(frame.id);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFrameDragOverId(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFrameDragOverId(null);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      processFrameFileUpload(frame.id, file);
                    }
                  }}
                  className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-neutral-900 cursor-pointer"
                >
                  <MediaDisplay
                    src={frame.frameImage}
                    mediaType={frame.mediaType}
                    alt={frame.shotDescription}
                    aspectRatioClass="aspect-video"
                    fallbackLabel={`[ DROP OR CLICK TO UPLOAD IMAGE/VIDEO · FRAME ${frame.order} ]`}
                    showControls={true}
                    allowFullscreen={true}
                  />

                  {/* Frame Order Badge */}
                  <div className="absolute top-2 left-2 bg-neutral-950/90 border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 font-bold pointer-events-none z-10">
                    #{frame.order}
                  </div>

                  {/* Version tag */}
                  <div className="absolute top-2 right-2 bg-neutral-950/80 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-400 pointer-events-none z-10">
                    {frame.version}
                  </div>

                  {/* Drag-over indicator */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-amber-950/85 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-30 pointer-events-none">
                      <Upload className="w-6 h-6 mb-1 text-amber-300 animate-bounce" />
                      <span>Drop Image or Video Frame</span>
                    </div>
                  )}
                </div>

                {/* Upload or Link Image/Video Bar */}
                <div className="p-2.5 space-y-2 border-t border-neutral-850 bg-neutral-950">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1 transition-colors font-medium">
                        <Upload className="w-3 h-3" />
                        <span>Upload Media</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) processFrameFileUpload(frame.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => setEditingMediaFrameId(isEditingMedia ? null : frame.id)}
                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        <Link className="w-3 h-3" />
                        <span>URL</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {frame.frameImage && (
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateFrame(frame.id, 'frameImage', '');
                            handleUpdateFrame(frame.id, 'mediaType', 'image');
                          }}
                          className="text-[10px] text-neutral-500 hover:text-rose-400"
                          title="Remove media"
                        >
                          Clear
                        </button>
                      )}
                      <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
                        {frame.durationSeconds}s
                      </span>
                    </div>
                  </div>

                  {/* Quick URL input dropdown */}
                  {isEditingMedia && (
                    <div className="p-2 bg-neutral-900 border border-neutral-800 rounded space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Video / Image Web URL:</span>
                        <button
                          onClick={() => setEditingMediaFrameId(null)}
                          className="text-neutral-500 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="https://.../clip.mp4 or .png"
                        value={frame.frameImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isVidDetected = /\.(mp4|webm|mov|m4v|ogg)$/i.test(val);
                          handleUpdateFrame(frame.id, 'frameImage', val);
                          handleUpdateFrame(frame.id, 'mediaType', isVidDetected ? 'video' : 'image');
                        }}
                        className="w-full bg-neutral-950 border border-neutral-750 rounded p-1.5 text-xs text-neutral-200 font-mono focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Reorder and Duplicate Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-900 text-neutral-500">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:text-neutral-200 disabled:opacity-20"
                        title="Move Earlier in Timeline"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === sortedFrames.length - 1}
                        className="p-1 hover:text-neutral-200 disabled:opacity-20"
                        title="Move Later in Timeline"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(frame)}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Duplicate Frame"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFrameToDelete(frame)}
                        className="p-1 hover:text-rose-400 transition-colors"
                        title="Delete Frame"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storyboard Specifications & Purpose Details */}
              <div className="flex-1 p-4 space-y-4 text-xs">
                {/* Top Row: Link to Shot & Framing Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-800 pb-3">
                  <div>
                    <label className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                      Linked Shot
                    </label>
                    <select
                      value={frame.shotId}
                      onChange={(e) => handleUpdateFrame(frame.id, 'shotId', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-1.5 text-neutral-200 focus:outline-none font-mono"
                    >
                      {shots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shotNumber} ({s.shotType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                      Framing
                    </label>
                    <select
                      value={frame.framing}
                      onChange={(e) => handleUpdateFrame(frame.id, 'framing', e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-1.5 text-neutral-200 focus:outline-none"
                    >
                      {[
                        'Extreme Wide',
                        'Wide',
                        'Medium Wide',
                        'Medium',
                        'Medium Close-Up',
                        'Close-Up',
                        'Extreme Close-Up',
                        'OTS',
                        'POV',
                        'Insert',
                        'Tracking',
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                      Lens / Focal Length
                    </label>
                    <input
                      type="text"
                      value={frame.lens}
                      onChange={(e) => handleUpdateFrame(frame.id, 'lens', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-1.5 text-neutral-200 focus:outline-none font-mono"
                      placeholder="e.g. 35mm Prime"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                      Duration (Sec)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={frame.durationSeconds}
                      onChange={(e) =>
                        handleUpdateFrame(frame.id, 'durationSeconds', parseFloat(e.target.value) || 1)
                      }
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-1.5 text-neutral-200 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Core Description & Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-300 font-semibold block mb-1">
                      Visual Action & Composition
                    </label>
                    <textarea
                      rows={2}
                      value={frame.shotDescription}
                      onChange={(e) => handleUpdateFrame(frame.id, 'shotDescription', e.target.value)}
                      placeholder="What is visually happening in this frame..."
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-amber-400 font-semibold block mb-1">
                      Story Purpose & Emotional Beat
                    </label>
                    <textarea
                      rows={2}
                      value={frame.purpose}
                      onChange={(e) => handleUpdateFrame(frame.id, 'purpose', e.target.value)}
                      placeholder="Why does this frame exist? What must the audience feel here..."
                      className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Camera & Performance Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-950/60 p-2.5 rounded border border-neutral-850">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                      Camera Position
                    </span>
                    <input
                      type="text"
                      value={frame.cameraPosition}
                      onChange={(e) => handleUpdateFrame(frame.id, 'cameraPosition', e.target.value)}
                      placeholder="e.g. Low Angle Ground"
                      className="w-full bg-transparent border-0 text-neutral-200 focus:outline-none p-0 mt-0.5"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                      Camera Movement
                    </span>
                    <input
                      type="text"
                      value={frame.cameraMovement}
                      onChange={(e) => handleUpdateFrame(frame.id, 'cameraMovement', e.target.value)}
                      placeholder="e.g. Slow Dolly In"
                      className="w-full bg-transparent border-0 text-neutral-200 focus:outline-none p-0 mt-0.5"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                      Character Action
                    </span>
                    <input
                      type="text"
                      value={frame.characterAction}
                      onChange={(e) => handleUpdateFrame(frame.id, 'characterAction', e.target.value)}
                      placeholder="e.g. Looking up at skies"
                      className="w-full bg-transparent border-0 text-neutral-200 focus:outline-none p-0 mt-0.5"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                      Audio / SFX Cue
                    </span>
                    <input
                      type="text"
                      value={frame.sound}
                      onChange={(e) => handleUpdateFrame(frame.id, 'sound', e.target.value)}
                      placeholder="e.g. Thunder & Distant Siren"
                      className="w-full bg-transparent border-0 text-neutral-200 focus:outline-none p-0 mt-0.5"
                    />
                  </div>
                </div>

                {/* Shot Navigation Quick link */}
                {linkedShot && (
                  <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Linked to Shot Pipeline:</span>
                      <button
                        onClick={() => onSelectShot(linkedShot)}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-mono font-bold"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>{linkedShot.shotNumber}</span>
                      </button>
                      <span className="text-neutral-500">· Stage: {linkedShot.stage}</span>
                    </div>

                    <span className="font-mono text-[10px] text-neutral-500">
                      {isVid ? 'Motion Storyboard (Video)' : 'Static Storyboard (Still)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Storyboard Frame Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!frameToDelete}
        title={`Delete Storyboard Frame #${frameToDelete?.order}?`}
        message={`Are you sure you want to delete Frame #${frameToDelete?.order} (${frameToDelete?.framing} · ${frameToDelete?.shotDescription?.slice(0, 40) || 'Untitled'})? This will renumber the remaining frames in the visual timeline.`}
        confirmLabel="Delete Frame"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (frameToDelete) {
            handleDelete(frameToDelete.id);
          }
        }}
        onCancel={() => setFrameToDelete(null)}
      />
    </div>
  );
};
