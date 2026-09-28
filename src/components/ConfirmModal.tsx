import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-950/80 border border-rose-800 text-rose-400'
                : 'bg-amber-950/80 border border-amber-800 text-amber-400'
            }`}
          >
            {isDestructive ? <Trash2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-neutral-500 hover:text-neutral-300 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-1.5 text-xs font-medium rounded transition-colors shadow-sm ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
