import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Columns,
  Clapperboard,
  Video,
  Clock,
  Box,
  Flame,
  Layers,
  Scissors,
  Volume2,
  AlertOctagon,
  FolderTree,
  MapPin,
  User,
  SunMedium,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'gates'
  | 'preproduction'
  | 'references'
  | 'storyboard'
  | 'shots'
  | 'previs'
  | 'animatic'
  | 'assets'
  | 'production-hub'
  | 'production-env'
  | 'production-animation'
  | 'production-lighting'
  | 'production-vfx'
  | 'production-renders'
  | 'post-process'
  | 'editorial'
  | 'sound'
  | 'blockers'
  | 'folder-tree';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeAlert?: boolean;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  blockedCount: number;
  warningsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  blockedCount,
  warningsCount,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Today & Studio',
          icon: LayoutDashboard,
          badge: blockedCount > 0 ? `${blockedCount} Blocked` : undefined,
          badgeAlert: blockedCount > 0,
        },
        {
          id: 'gates',
          label: '5 Production Gates',
          icon: ShieldCheck,
        },
      ],
    },
    {
      group: 'Pre-Production',
      items: [
        {
          id: 'preproduction',
          label: 'Idea, Story & Script',
          icon: FileText,
        },
        {
          id: 'references',
          label: 'Moodboard & Visuals',
          icon: ImageIcon,
        },
        {
          id: 'storyboard',
          label: 'Storyboard Board',
          icon: Columns,
        },
        {
          id: 'shots',
          label: 'Shot Tracker',
          icon: Clapperboard,
          highlight: true,
        },
        {
          id: 'previs',
          label: 'Previs & Camera Lock',
          icon: Video,
        },
        {
          id: 'animatic',
          label: 'Animatic Timeline',
          icon: Clock,
        },
        {
          id: 'assets',
          label: 'Asset Database',
          icon: Box,
        },
      ],
    },
    {
      group: 'Production (Unreal Engine)',
      items: [
        {
          id: 'production-hub',
          label: 'Production Overview & Hub',
          icon: Flame,
          highlight: true,
        },
        {
          id: 'production-env',
          label: 'Virtual Sets & Nanite',
          icon: MapPin,
        },
        {
          id: 'production-animation',
          label: 'Character & Mocap',
          icon: User,
        },
        {
          id: 'production-lighting',
          label: 'Lumen Lighting & Rigging',
          icon: SunMedium,
        },
        {
          id: 'production-vfx',
          label: 'Niagara VFX & Particles',
          icon: Sparkles,
        },
        {
          id: 'production-renders',
          label: 'MRQ Render Queue',
          icon: Clapperboard,
        },
      ],
    },
    {
      group: 'Post-Production',
      items: [
        {
          id: 'post-process',
          label: 'Post-Process & Comp',
          icon: Layers,
        },
        {
          id: 'editorial',
          label: 'Editorial & Cut Lock',
          icon: Scissors,
        },
        {
          id: 'sound',
          label: 'Sound Design & Stems',
          icon: Volume2,
        },
        {
          id: 'blockers',
          label: 'Blockers & Learning',
          icon: AlertOctagon,
          badge: warningsCount > 0 ? `${warningsCount}` : undefined,
        },
        {
          id: 'folder-tree',
          label: 'Directory Generator',
          icon: FolderTree,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-4 space-y-6">
        {navSections.map((sec) => (
          <div key={sec.group}>
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 mb-1.5">
              {sec.group}
            </div>
            <nav className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-amber-400'
                            : item.highlight
                            ? 'text-amber-500/80'
                            : 'text-neutral-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                          item.badgeAlert
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-neutral-900 text-xs text-neutral-500">
        <div className="flex items-center justify-between mb-1">
          <span className="text-neutral-400 font-medium">Solo Filmmaker Hub</span>
          <span className="font-mono text-[11px] text-neutral-600">UE 5.4</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Director First. Technology Second.
        </p>
      </div>
    </aside>
  );
};
