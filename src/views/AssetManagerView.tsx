import React, { useState } from 'react';
import { Asset, Shot } from '../types';
import { Box, Plus, AlertTriangle, Film, Check, Trash2, Search, Filter } from 'lucide-react';
import { MediaDisplay } from '../components/MediaDisplay';
import { MediaUploadInput } from '../components/MediaUploadInput';
import { ConfirmModal } from '../components/ConfirmModal';

interface AssetManagerViewProps {
  assets: Asset[];
  shots: Shot[];
  projectId: string;
  onUpdateAssets: (updated: Asset[]) => void;
  onSelectShot: (shot: Shot) => void;
}

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({
  assets,
  shots,
  projectId,
  onUpdateAssets,
  onSelectShot,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const filteredAssets = assets.filter((asset) => {
    const matchesType = filterType === 'All' || asset.type === filterType;
    const matchesStatus = filterStatus === 'All' || asset.status === filterStatus;
    const isUnused = asset.requiredShotIds.length === 0;
    const matchesUnused = !showUnusedOnly || isUnused;
    const matchesSearch =
      search === '' ||
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.source.toLowerCase().includes(search.toLowerCase()) ||
      asset.notes.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesStatus && matchesUnused && matchesSearch;
  });

  const handleToggleShotRequirement = (assetId: string, shotId: string) => {
    const updated = assets.map((a) => {
      if (a.id !== assetId) return a;
      const exists = a.requiredShotIds.includes(shotId);
      const newShots = exists
        ? a.requiredShotIds.filter((id) => id !== shotId)
        : [...a.requiredShotIds, shotId];
      return { ...a, requiredShotIds: newShots };
    });
    onUpdateAssets(updated);
  };

  const handleDelete = (id: string) => {
    onUpdateAssets(assets.filter((a) => a.id !== id));
    if (editingAsset?.id === id) setEditingAsset(null);
    setAssetToDelete(null);
  };

  const handleSaveAsset = (asset: Asset) => {
    const exists = assets.some((a) => a.id === asset.id);
    const updated = exists ? assets.map((a) => (a.id === asset.id ? asset : a)) : [...assets, asset];
    onUpdateAssets(updated);
    setEditingAsset(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <span>Asset Management & Link Tracker</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Track 3D characters, Nanite environments, and props. Built-in automation flags any asset being modeled without a shot requirement.
          </p>
        </div>

        <button
          onClick={() => {
            const newAst: Asset = {
              id: `ast-${Date.now()}`,
              projectId,
              name: 'New Asset',
              type: 'Prop',
              requiredShotIds: [],
              source: 'Blender / Fab',
              status: 'Need',
              quality: 'Mid-Poly',
              priority: 'Medium',
              material: 'Substrate PBR',
              texture: '4K',
              rig: 'None',
              animation: 'None',
              optimization: 'Nanite',
              fileLocation: '/Game/Props/',
              notes: '',
            };
            setEditingAsset(newAst);
            setIsAdding(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Asset</span>
        </button>
      </div>

      {/* Filter and Unused warning strip */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 w-44"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Types</option>
            <option value="Character">Character</option>
            <option value="Environment">Environment</option>
            <option value="Prop">Prop</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Material">Material</option>
            <option value="Texture">Texture</option>
            <option value="Animation">Animation</option>
            <option value="FX">FX</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-neutral-950 border border-neutral-750 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Need">Need</option>
            <option value="Searching">Searching</option>
            <option value="Creating">Creating</option>
            <option value="Working">Working</option>
            <option value="Ready">Ready</option>
            <option value="Used">Used</option>
          </select>

          <button
            onClick={() => setShowUnusedOnly(!showUnusedOnly)}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
              showUnusedOnly
                ? 'bg-amber-950 text-amber-300 border-amber-800 font-semibold'
                : 'bg-neutral-950 text-neutral-400 border-neutral-750 hover:text-white'
            }`}
          >
            ⚠️ Unused Only
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Showing <span className="text-white font-bold">{filteredAssets.length}</span> assets
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => {
          const isUnused = asset.requiredShotIds.length === 0;

          return (
            <div
              key={asset.id}
              className={`bg-neutral-900 border rounded-lg overflow-hidden flex flex-col justify-between transition-all ${
                isUnused ? 'border-amber-900/60 bg-neutral-900/90' : 'border-neutral-800'
              }`}
            >
              {/* Asset Turntable Video / Preview Still */}
              {asset.previewUrl && (
                <div className="relative border-b border-neutral-800 bg-black aspect-video overflow-hidden">
                  <MediaDisplay
                    src={asset.previewUrl}
                    mediaType={asset.previewMediaType}
                    alt={asset.name}
                    aspectRatioClass="aspect-video"
                    showControls={false}
                    autoPlay={false}
                  />
                  <div className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                    3D ASSET
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Header: Type, Status, Edit */}
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {asset.type}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{asset.quality}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      asset.status === 'Ready' || asset.status === 'Used'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : asset.status === 'Creating' || asset.status === 'Working'
                        ? 'bg-sky-950 text-sky-300 border border-sky-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white leading-snug">{asset.name}</h2>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Source: {asset.source}
                  </div>
                </div>

                {/* UNUSED ASSET WARNING (Prompt Section 10) */}
                {isUnused ? (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Unused Asset Warning</span>
                    </div>
                    <p className="text-[11px] text-amber-300/80 leading-relaxed">
                      This asset is not currently required by any shot.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                      Required by Shots ({asset.requiredShotIds.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {asset.requiredShotIds.map((sId) => {
                        const s = shots.find((item) => item.id === sId);
                        return (
                          <button
                            key={sId}
                            onClick={() => s && onSelectShot(s)}
                            className="font-mono text-[10px] text-amber-400 bg-neutral-950 hover:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-800 transition-colors"
                          >
                            {s ? s.shotNumber : sId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Technical specs */}
                <div className="text-[11px] space-y-1 pt-2 border-t border-neutral-850 text-neutral-400">
                  <div className="flex justify-between">
                    <span>Optimization:</span>
                    <span className="font-mono text-neutral-200">{asset.optimization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Location:</span>
                    <span className="font-mono text-neutral-300 truncate max-w-[170px]" title={asset.fileLocation}>
                      {asset.fileLocation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-850 flex items-center justify-between text-xs">
                <button
                  onClick={() => setEditingAsset(asset)}
                  className="text-amber-400 hover:text-amber-300 font-medium text-xs"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setAssetToDelete(asset)}
                  className="text-neutral-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* Edit / Add Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              {isAdding ? 'New 3D Asset' : `Edit: ${editingAsset.name}`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Asset Type</label>
                <select
                  value={editingAsset.type}
                  onChange={(e) => setEditingAsset({ ...editingAsset, type: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                >
                  {['Character', 'Environment', 'Prop', 'Vehicle', 'Material', 'Texture', 'Animation', 'FX', 'Lighting', 'Sound'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Status</label>
                <select
                  value={editingAsset.status}
                  onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                >
                  {['Need', 'Searching', 'Creating', 'Working', 'Ready', 'Used'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Quality Tier</label>
                <select
                  value={editingAsset.quality}
                  onChange={(e) => setEditingAsset({ ...editingAsset, quality: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                >
                  {['Proxy', 'Mid-Poly', 'High-Poly', 'Nanite', 'Final Polish'].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Source Pipeline</label>
                <input
                  type="text"
                  value={editingAsset.source}
                  onChange={(e) => setEditingAsset({ ...editingAsset, source: e.target.value })}
                  placeholder="e.g. MetaHuman Creator, KitBash3D"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-400 mb-1">Unreal File Location</label>
                <input
                  type="text"
                  value={editingAsset.fileLocation}
                  onChange={(e) => setEditingAsset({ ...editingAsset, fileLocation: e.target.value })}
                  placeholder="/Game/Characters/..."
                  className="w-full bg-neutral-950 border border-neutral-750 rounded p-2 text-neutral-200 focus:outline-none font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <MediaUploadInput
                  label="3D Asset Preview (Turntable Video or Concept Still)"
                  value={editingAsset.previewUrl || ''}
                  mediaType={editingAsset.previewMediaType}
                  onChange={(url, detectedType) => {
                    setEditingAsset({
                      ...editingAsset,
                      previewUrl: url,
                      previewMediaType: detectedType,
                    });
                  }}
                  placeholder="Upload turnaround MP4 video or preview image"
                  helperText="MetaHuman turntable, weapon 360 preview, or high-res texture render"
                />
              </div>
            </div>

            {/* Shot Linker Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
              <label className="block text-neutral-300 font-semibold">
                Link to Required Shots (Avoid Unused Asset Warning)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {shots.map((shot) => {
                  const isChecked = editingAsset.requiredShotIds.includes(shot.id);
                  return (
                    <label
                      key={shot.id}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                        isChecked
                          ? 'bg-neutral-950 border-amber-500/50 text-amber-300'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? editingAsset.requiredShotIds.filter((id) => id !== shot.id)
                            : [...editingAsset.requiredShotIds, shot.id];
                          setEditingAsset({ ...editingAsset, requiredShotIds: updated });
                        }}
                        className="rounded accent-amber-400"
                      />
                      <span className="font-mono">{shot.shotNumber}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveAsset(editingAsset)}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium rounded text-xs"
              >
                Save Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Asset Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assetToDelete}
        title={`Delete Asset "${assetToDelete?.name}"?`}
        message={`Are you sure you want to delete ${assetToDelete?.name} (${assetToDelete?.type} · ${assetToDelete?.quality})? This will remove its bindings across all linked shots.`}
        confirmLabel="Delete Asset"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (assetToDelete) {
            handleDelete(assetToDelete.id);
          }
        }}
        onCancel={() => setAssetToDelete(null)}
      />
    </div>
  );
};
