import React, { useState, useRef } from 'react';
import { VisualReference, Shot, Asset } from '../types';
import {
  Image as ImageIcon,
  Plus,
  Tag,
  Film,
  Box,
  Trash2,
  ExternalLink,
  Edit2,
  Upload,
  Video,
  X,
  Check,
} from 'lucide-react';
import { MediaDisplay, isVideoMedia } from '../components/MediaDisplay';
import { MediaUploadInput } from '../components/MediaUploadInput';
import { ConfirmModal } from '../components/ConfirmModal';

interface ReferenceBoardViewProps {
  references: VisualReference[];
  shots: Shot[];
  assets: Asset[];
  projectId: string;
  onUpdateReferences: (updated: VisualReference[]) => void;
  onSelectShot: (shot: Shot) => void;
}

const CATEGORIES = [
  'All',
  'Lighting',
  'Environment',
  'Character',
  'Costume',
  'Architecture',
  'Props',
  'Color',
  'Camera',
  'Composition',
  'VFX',
  'Cinematography',
] as const;

export const ReferenceBoardView: React.FC<ReferenceBoardViewProps> = ({
  references,
  shots,
  assets,
  projectId,
  onUpdateReferences,
  onSelectShot,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'image'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingRef, setEditingRef] = useState<VisualReference | null>(null);

  // New reference form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VisualReference['category']>('Lighting');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newLinkedShotId, setNewLinkedShotId] = useState('');
  const [newLinkedAssetId, setNewLinkedAssetId] = useState('');

  // Per-card file input ref map or direct handler
  const [cardDragOverId, setCardDragOverId] = useState<string | null>(null);
  const [refToDelete, setRefToDelete] = useState<VisualReference | null>(null);

  const filteredReferences = references.filter((ref) => {
    const matchesCat = selectedCategory === 'All' || ref.category === selectedCategory;
    const isVid = isVideoMedia(ref.imageUrl, ref.mediaType);
    const matchesMedia =
      mediaFilter === 'all' ||
      (mediaFilter === 'video' && isVid) ||
      (mediaFilter === 'image' && !isVid);
    const matchesSearch =
      searchQuery === '' ||
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesMedia && matchesSearch;
  });

  const handleAddReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newRef: VisualReference = {
      id: `ref-${Date.now()}`,
      projectId,
      title: newTitle,
      category: newCategory,
      imageUrl: newImageUrl,
      mediaType: newMediaType,
      notes: newNotes,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      linkedShotId: newLinkedShotId || undefined,
      linkedAssetId: newLinkedAssetId || undefined,
    };

    onUpdateReferences([...references, newRef]);
    setNewTitle('');
    setNewImageUrl('');
    setNewMediaType('image');
    setNewNotes('');
    setNewTags('');
    setNewLinkedShotId('');
    setNewLinkedAssetId('');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRef) return;

    const updated = references.map((r) => (r.id === editingRef.id ? editingRef : r));
    onUpdateReferences(updated);
    setEditingRef(null);
  };

  const handleDelete = (id: string) => {
    onUpdateReferences(references.filter((r) => r.id !== id));
    setRefToDelete(null);
  };

  const handleQuickMediaUpload = (id: string, file: File) => {
    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const detected: 'image' | 'video' = isVid ? 'video' : 'image';

    if (file.size <= 25 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updated = references.map((r) =>
          r.id === id ? { ...r, imageUrl: result, mediaType: detected } : r
        );
        onUpdateReferences(updated);
      };
      reader.readAsDataURL(file);
    } else {
      const blobUrl = URL.createObjectURL(file);
      const updated = references.map((r) =>
        r.id === id ? { ...r, imageUrl: blobUrl, mediaType: detected } : r
      );
      onUpdateReferences(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>Visual Reference Board & Moodboard</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Curate cinematic references and motion clips (Image & Video) for Unreal lighting, camera composition, Niagara VFX, and MetaHuman styling.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors self-start sm:self-auto shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Media Reference</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Format filter: All / Video / Image */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded p-0.5 text-xs">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                mediaFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMediaFilter('video')}
              className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                mediaFilter === 'video' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setMediaFilter('image')}
              className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                mediaFilter === 'image' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Images</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Filter by title, tag, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-56 bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Add Reference Modal */}
      {isAdding && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>New Visual / Motion Reference (Image or Video)</span>
            </h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-neutral-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddReference} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volumetric Amber Haze & Rain Bounce"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <MediaUploadInput
                  label="Reference Media (Upload Video clip or Image, or paste link)"
                  value={newImageUrl}
                  mediaType={newMediaType}
                  onChange={(url, detectedType) => {
                    setNewImageUrl(url);
                    setNewMediaType(detectedType);
                  }}
                  placeholder="Upload MP4/WebM video or image file, or paste media URL"
                  helperText="Supports drag & drop: Video (.mp4, .webm, .mov) or Image (.png, .jpg, .webp, .gif)"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Lumen, Fog, Anamorphic, Deakins"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Link to Shot</label>
                <select
                  value={newLinkedShotId}
                  onChange={(e) => setNewLinkedShotId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">None (General Project Moodboard)</option>
                  {shots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shotNumber} — {s.description.slice(0, 35)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-300 mb-1">Link to 3D Asset</label>
                <select
                  value={newLinkedAssetId}
                  onChange={(e) => setNewLinkedAssetId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">None</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Cinematography / Technical Notes</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Explain the lighting ratios, lens choice, color temperature, or why this serves the storytelling purpose..."
                className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-400 text-neutral-950 font-medium rounded hover:bg-amber-300"
              >
                Save Reference
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Reference Modal */}
      {editingRef && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Reference: {editingRef.title}</span>
              </h2>
              <button
                onClick={() => setEditingRef(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingRef.title}
                    onChange={(e) => setEditingRef({ ...editingRef, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={editingRef.category}
                    onChange={(e) =>
                      setEditingRef({ ...editingRef, category: e.target.value as any })
                    }
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <MediaUploadInput
                  label="Reference Video or Image"
                  value={editingRef.imageUrl}
                  mediaType={editingRef.mediaType}
                  onChange={(url, detectedType) => {
                    setEditingRef({
                      ...editingRef,
                      imageUrl: url,
                      mediaType: detectedType,
                    });
                  }}
                  helperText="Upload any video (.mp4, .webm, .mov) or image file"
                />

                <div>
                  <label className="block text-neutral-400 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingRef.tags.join(', ')}
                    onChange={(e) =>
                      setEditingRef({
                        ...editingRef,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={editingRef.notes}
                    onChange={(e) => setEditingRef({ ...editingRef, notes: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingRef(null)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 text-neutral-950 font-medium rounded hover:bg-amber-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of References */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReferences.map((ref) => {
          const linkedShot = shots.find((s) => s.id === ref.linkedShotId);
          const linkedAsset = assets.find((a) => a.id === ref.linkedAssetId);
          const isDragOver = cardDragOverId === ref.id;

          return (
            <div
              key={ref.id}
              className={`bg-neutral-900 border rounded-lg overflow-hidden flex flex-col group shadow-sm transition-all ${
                isDragOver ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Media Preview (Image or Video) with Drag-and-Drop Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardDragOverId(ref.id);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardDragOverId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCardDragOverId(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleQuickMediaUpload(ref.id, file);
                  }
                }}
                className="relative border-b border-neutral-800 bg-black cursor-pointer"
              >
                <MediaDisplay
                  src={ref.imageUrl}
                  mediaType={ref.mediaType}
                  alt={ref.title}
                  aspectRatioClass="aspect-video"
                  fallbackLabel={`[ ${ref.category} Reference ]`}
                  showControls={true}
                  autoPlay={false}
                />

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-neutral-950/85 backdrop-blur-sm border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 uppercase pointer-events-none z-10">
                  {ref.category}
                </div>

                {/* Quick Upload / Replace Media Button on Hover */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <label className="inline-flex items-center gap-1 px-2 py-1 bg-black/80 hover:bg-neutral-800 text-neutral-200 text-[11px] font-medium rounded cursor-pointer border border-neutral-750 backdrop-blur-sm shadow-md transition-colors">
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Media</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleQuickMediaUpload(ref.id, file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Drag-over overlay */}
                {isDragOver && (
                  <div className="absolute inset-0 bg-amber-950/80 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-amber-300 font-mono text-xs z-30 pointer-events-none">
                    <Upload className="w-6 h-6 mb-1 text-amber-300 animate-bounce" />
                    <span>Drop Video or Image to Replace</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-white leading-snug">{ref.title}</h2>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingRef(ref)}
                        className="text-neutral-500 hover:text-amber-400 p-1 transition-colors"
                        title="Edit reference details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRefToDelete(ref)}
                        className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete reference"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-1.5 leading-relaxed line-clamp-3">
                    {ref.notes}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-850">
                  {ref.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ref.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <div className="flex items-center gap-2">
                      {linkedShot && (
                        <button
                          onClick={() => onSelectShot(linkedShot)}
                          className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Film className="w-3 h-3" />
                          <span>{linkedShot.shotNumber}</span>
                        </button>
                      )}
                      {linkedAsset && (
                        <span className="text-indigo-300 flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{linkedAsset.name}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-neutral-600">
                      {isVideoMedia(ref.imageUrl, ref.mediaType) ? 'Motion Clip' : 'Still Reference'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Visual Reference Confirmation Modal */}
      <ConfirmModal
        isOpen={!!refToDelete}
        title={`Delete Reference "${refToDelete?.title}"?`}
        message={`Are you sure you want to remove this ${refToDelete?.category} visual reference? This will unbind it from any associated shots or assets.`}
        confirmLabel="Delete Reference"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (refToDelete) {
            handleDelete(refToDelete.id);
          }
        }}
        onCancel={() => setRefToDelete(null)}
      />
    </div>
  );
};
