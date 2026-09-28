import React, { useState, useRef } from 'react';
import { Play, Pause, Film, Volume2, VolumeX, Maximize2, X } from 'lucide-react';

export interface MediaDisplayProps {
  src?: string;
  mediaType?: 'image' | 'video';
  alt?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  fallbackLabel?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  aspectRatioClass?: string;
  allowFullscreen?: boolean;
}

export function isVideoMedia(src?: string, mediaType?: 'image' | 'video'): boolean {
  if (!src) return false;
  if (mediaType === 'video') return true;
  if (mediaType === 'image') return false;
  if (src.startsWith('data:video/')) return true;
  if (src.startsWith('blob:') && mediaType === 'video') return true;
  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(src);
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  src,
  mediaType,
  alt = 'Media Asset',
  className = 'w-full h-full object-cover',
  fallbackIcon,
  fallbackLabel,
  autoPlay = false,
  loop = true,
  muted = true,
  showControls = true,
  aspectRatioClass = 'aspect-video',
  allowFullscreen = true,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = isVideoMedia(src, mediaType);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (modalVideoRef.current) {
      modalVideoRef.current.playbackRate = speed;
    }
  };

  if (!src || loadError) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-neutral-950 flex flex-col items-center justify-center p-4 text-center select-none`}
      >
        {fallbackIcon || <Film className="w-8 h-8 text-neutral-850 mb-1" />}
        <span className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
          {fallbackLabel || '[ NO MEDIA LOADED ]'}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={`relative w-full ${aspectRatioClass} bg-black overflow-hidden group select-none`}>
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={src}
              className={className}
              loop={loop}
              muted={isMuted}
              playsInline
              autoPlay={autoPlay}
              controls={showControls}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setLoadError(true)}
            />

            {/* Video type indicator badge */}
            <div className="absolute top-2 left-2 bg-neutral-950/85 backdrop-blur-sm border border-neutral-800 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-400 font-semibold tracking-wider uppercase pointer-events-none flex items-center gap-1 z-10 shadow-sm">
              <Film className="w-2.5 h-2.5" />
              <span>VIDEO</span>
            </div>
          </>
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className={className}
            onError={() => setLoadError(true)}
          />
        )}

        {/* Hover Action Bar: Cinema Fullscreen View */}
        {allowFullscreen && (
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCinemaOpen(true);
              }}
              className="p-1.5 bg-black/80 hover:bg-neutral-800 border border-neutral-700/80 rounded text-neutral-300 hover:text-white transition-colors backdrop-blur-sm shadow-md"
              title="Open Cinema Preview (Fullscreen Player)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Custom quick toggle controls for video if controls=false */}
        {isVideo && !showControls && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/85 backdrop-blur-sm border border-neutral-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 hover:text-amber-400 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 hover:text-amber-400 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Cinema Lightbox Modal */}
      {isCinemaOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsCinemaOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-neutral-400 border-b border-neutral-850 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 uppercase">
                {isVideo ? 'Cinema Video Player' : 'High-Res Frame Preview'}
              </span>
              <span className="text-xs text-neutral-300 font-medium truncate max-w-sm">
                {alt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isVideo && (
                <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-xs">
                  <span className="text-[10px] text-neutral-500 font-mono">SPEED:</span>
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                        playbackSpeed === spd
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsCinemaOpen(false)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Centered Media Player Container */}
          <div
            className="flex-1 flex items-center justify-center py-4 px-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                ref={modalVideoRef}
                src={src}
                controls
                autoPlay
                loop={loop}
                playsInline
                className="max-h-[80vh] max-w-full rounded border border-neutral-800 shadow-2xl object-contain bg-black"
              />
            ) : (
              <img
                src={src}
                alt={alt}
                referrerPolicy="no-referrer"
                className="max-h-[82vh] max-w-full rounded border border-neutral-800 shadow-2xl object-contain"
              />
            )}
          </div>

          {/* Bottom Bar Info */}
          <div
            className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-850 pt-2 font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Format: {isVideo ? 'Motion Playblast / Render Video' : 'Still Visual Frame'}</span>
            <span>Click outside or press Esc to close</span>
          </div>
        </div>
      )}
    </>
  );
};
