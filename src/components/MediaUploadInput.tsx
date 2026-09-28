import React, { useState, useRef } from 'react';
import { Upload, Film, Image as ImageIcon, X, Link, Check, FolderOpen } from 'lucide-react';
import { isVideoMedia } from './MediaDisplay';

interface MediaUploadInputProps {
  label: string;
  value?: string;
  mediaType?: 'image' | 'video';
  onChange: (url: string, detectedType: 'image' | 'video') => void;
  placeholder?: string;
  helperText?: string;
  compact?: boolean;
}

export const MediaUploadInput: React.FC<MediaUploadInputProps> = ({
  label,
  value = '',
  mediaType,
  onChange,
  placeholder = 'https://... or drag & drop video/image file',
  helperText = 'Supports MP4, WebM, MOV videos and PNG, JPG, WebP, GIF images',
  compact = false,
}) => {
  const [urlInput, setUrlInput] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const detectedIsVideo = isVideoMedia(value, mediaType);

  const processFile = (file: File) => {
    setIsProcessing(true);
    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const detected: 'image' | 'video' = isVid ? 'video' : 'image';

    if (file.size <= 25 * 1024 * 1024) {
      // Up to 25MB data URL for persistence in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUrlInput(result);
        onChange(result, detected);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } else {
      // For large video files in local session
      const blobUrl = URL.createObjectURL(file);
      setUrlInput(blobUrl);
      onChange(blobUrl, detected);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlBlur = () => {
    if (urlInput !== value) {
      const isVid = isVideoMedia(urlInput, mediaType);
      onChange(urlInput, isVid ? 'video' : 'image');
    }
  };

  const handleClear = () => {
    setUrlInput('');
    onChange('', 'image');
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="text-neutral-300 font-medium flex items-center gap-1.5">
          <span>{label}</span>
          {value && (
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                detectedIsVideo
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              {detectedIsVideo ? 'VIDEO CLIP' : 'IMAGE STILL'}
            </span>
          )}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-neutral-500 hover:text-rose-400 flex items-center gap-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Drag & Drop Input Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-md transition-all ${
          isDragOver
            ? 'border-2 border-dashed border-amber-400 bg-amber-950/30'
            : 'border border-neutral-800 bg-neutral-950/90'
        } p-2`}
      >
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Link className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onBlur={handleUrlBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlBlur();
                }
              }}
              placeholder={placeholder}
              className="w-full bg-neutral-900 border border-neutral-750 rounded pl-8 pr-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded cursor-pointer shrink-0 border border-neutral-700 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{isProcessing ? 'Reading file...' : 'Choose File'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
        </div>

        {/* Drag and Drop Prompt */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500 px-1">
          <span className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3 text-neutral-600" />
            <span>{isDragOver ? 'Drop Video or Image file here!' : 'Or drag & drop media file directly here'}</span>
          </span>
          <span className="font-mono text-neutral-600">MP4 / WEBM / MOV / PNG / JPG</span>
        </div>
      </div>

      <div className="text-[10px] text-neutral-500 flex items-center justify-between px-0.5">
        <span>{helperText}</span>
        {value && value.startsWith('data:') && (
          <span className="font-mono text-[9px] text-neutral-500 flex items-center gap-1">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
            <span>Stored in project</span>
          </span>
        )}
      </div>
    </div>
  );
};
