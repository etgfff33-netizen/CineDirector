import React, { useState } from 'react';
import { Project } from '../types';
import { FolderTree, Download, Copy, Check, Terminal, Folder } from 'lucide-react';

interface FolderStructureViewProps {
  project: Project;
}

export const FolderStructureView: React.FC<FolderStructureViewProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const cleanName = project.name.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();

  const folderTree = [
    {
      dir: '01_PREPRODUCTION',
      subdirs: ['01_Story', '02_Script', '03_References', '04_Storyboard', '05_Shot_List', '06_Previs', '07_Animatic'],
    },
    {
      dir: '02_ASSETS',
      subdirs: ['Characters', 'Environment', 'Props', 'Materials', 'Textures', 'Animation', 'FX'],
    },
    {
      dir: '03_UNREAL',
      subdirs: ['Project', 'Maps', 'Sequencer', 'Cameras', 'Blueprints'],
    },
    {
      dir: '04_RENDER',
      subdirs: ['Preview', 'Final', 'Stills'],
    },
    {
      dir: '05_COMPOSITING',
      subdirs: ['Nuke', 'Plates', 'CG', 'AOV', 'Final'],
    },
    {
      dir: '06_EDIT',
      subdirs: ['Project', 'Exports', 'XML'],
    },
    {
      dir: '07_SOUND',
      subdirs: ['Dialogue', 'SFX', 'Music', 'Ambiences'],
    },
    {
      dir: '08_FINAL',
      subdirs: ['Master', 'Social', 'Showreel'],
    },
    {
      dir: '09_DOCUMENTATION',
      subdirs: ['Notes', 'Lessons', 'BTS'],
    },
  ];

  const bashScript = `#!/usr/bin/env bash
# Production Folder Generator for ${project.name}
ROOT_DIR="${cleanName}"
echo "Creating studio directory tree for $ROOT_DIR..."

mkdir -p "$ROOT_DIR"/01_PREPRODUCTION/{01_Story,02_Script,03_References,04_Storyboard,05_Shot_List,06_Previs,07_Animatic}
mkdir -p "$ROOT_DIR"/02_ASSETS/{Characters,Environment,Props,Materials,Textures,Animation,FX}
mkdir -p "$ROOT_DIR"/03_UNREAL/{Project,Maps,Sequencer,Cameras,Blueprints}
mkdir -p "$ROOT_DIR"/04_RENDER/{Preview,Final,Stills}
mkdir -p "$ROOT_DIR"/05_COMPOSITING/{Nuke,Plates,CG,AOV,Final}
mkdir -p "$ROOT_DIR"/06_EDIT/{Project,Exports,XML}
mkdir -p "$ROOT_DIR"/07_SOUND/{Dialogue,SFX,Music,Ambiences}
mkdir -p "$ROOT_DIR"/08_FINAL/{Master,Social,Showreel}
mkdir -p "$ROOT_DIR"/09_DOCUMENTATION/{Notes,Lessons,BTS}

echo "✓ Filmmaking directory tree successfully initialized at ./$ROOT_DIR"
`;

  const psScript = `# PowerShell Production Folder Generator for ${project.name}
$Root = "${cleanName}"
Write-Host "Creating studio directory tree for $Root..."

$dirs = @(
  "01_PREPRODUCTION/01_Story", "01_PREPRODUCTION/02_Script", "01_PREPRODUCTION/03_References", "01_PREPRODUCTION/04_Storyboard", "01_PREPRODUCTION/05_Shot_List", "01_PREPRODUCTION/06_Previs", "01_PREPRODUCTION/07_Animatic",
  "02_ASSETS/Characters", "02_ASSETS/Environment", "02_ASSETS/Props", "02_ASSETS/Materials", "02_ASSETS/Textures", "02_ASSETS/Animation", "02_ASSETS/FX",
  "03_UNREAL/Project", "03_UNREAL/Maps", "03_UNREAL/Sequencer", "03_UNREAL/Cameras", "03_UNREAL/Blueprints",
  "04_RENDER/Preview", "04_RENDER/Final", "04_RENDER/Stills",
  "05_COMPOSITING/Nuke", "05_COMPOSITING/Plates", "05_COMPOSITING/CG", "05_COMPOSITING/AOV", "05_COMPOSITING/Final",
  "06_EDIT/Project", "06_EDIT/Exports", "06_EDIT/XML",
  "07_SOUND/Dialogue", "07_SOUND/SFX", "07_SOUND/Music", "07_SOUND/Ambiences",
  "08_FINAL/Master", "08_FINAL/Social", "08_FINAL/Showreel",
  "09_DOCUMENTATION/Notes", "09_DOCUMENTATION/Lessons", "09_DOCUMENTATION/BTS"
)

foreach ($d in $dirs) {
  New-Item -ItemType Directory -Path (Join-Path $Root $d) -Force | Out-Null
}

Write-Host "✓ Filmmaking directory tree initialized for $Root"
`;

  const handleCopyBash = () => {
    navigator.clipboard.writeText(bashScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-400" />
            <span>Studio Directory Tree Generator</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Automatically generates the standard solo filmmaking folder architecture on your NVMe storage drive to keep Unreal, Nuke, and DaVinci assets organized.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBash}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Bash Script'}</span>
          </button>

          <button
            onClick={() => handleDownload(bashScript, `setup_${cleanName}.sh`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .sh</span>
          </button>

          <button
            onClick={() => handleDownload(psScript, `setup_${cleanName}.ps1`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ps1 (Windows)</span>
          </button>
        </div>
      </div>

      {/* Directory Hierarchy Visual Display */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-mono">
          <Folder className="w-4 h-4" />
          <span>{cleanName}/</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {folderTree.map((sec) => (
            <div key={sec.dir} className="bg-neutral-950 p-4 rounded border border-neutral-850 space-y-2">
              <div className="text-white font-bold flex items-center gap-1.5">
                <span className="text-amber-500">📁</span>
                <span>{sec.dir}/</span>
              </div>
              <ul className="space-y-1 pl-5 border-l border-neutral-800 text-neutral-400 text-[11px]">
                {sec.subdirs.map((sub) => (
                  <li key={sub} className="truncate">
                    └─ {sub}/
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Command Snippet */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Terminal Quick Run</span>
        </div>
        <div className="bg-neutral-950 p-3 rounded border border-neutral-850 font-mono text-xs text-neutral-300 overflow-x-auto select-all">
          mkdir -p {cleanName}/&#123;01_PREPRODUCTION,02_ASSETS,03_UNREAL,04_RENDER,05_COMPOSITING,06_EDIT,07_SOUND,08_FINAL,09_DOCUMENTATION&#125;
        </div>
      </div>
    </div>
  );
};
