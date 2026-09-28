/**
 * Stylized cinematic 2.39:1 procedural anamorphic frames
 * for default moodboard and storyboard illustrations
 */

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const CINE_FRAMES = {
  CYBERPUNK_WIDE: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 804" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050811"/>
          <stop offset="50%" stop-color="#0c1222"/>
          <stop offset="100%" stop-color="#020408"/>
        </linearGradient>
        <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00f2fe"/>
          <stop offset="100%" stop-color="#4facfe"/>
        </linearGradient>
        <linearGradient id="neonAmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffb199"/>
          <stop offset="100%" stop-color="#ff0844"/>
        </linearGradient>
        <linearGradient id="rain" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stop-color="rgba(0,242,254,0.15)"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      <rect width="1920" height="804" fill="url(#bg)"/>
      <!-- Megastructures -->
      <polygon points="120,804 180,120 420,120 480,804" fill="#090d18" stroke="#121b2d" stroke-width="2"/>
      <polygon points="380,804 420,60 760,60 800,804" fill="#060912" stroke="#101726" stroke-width="2"/>
      <polygon points="1200,804 1250,90 1550,90 1600,804" fill="#080c16" stroke="#111827" stroke-width="2"/>
      <polygon points="1520,804 1560,180 1860,180 1900,804" fill="#05070e" stroke="#0e1420" stroke-width="2"/>
      <!-- Overhang bridge -->
      <rect x="0" y="240" width="1920" height="40" fill="#0b101d" stroke="#1e293b" stroke-width="2"/>
      <line x1="0" y1="280" x2="1920" y2="280" stroke="#00f2fe" stroke-width="3" opacity="0.6"/>
      <!-- Neon signs -->
      <rect x="240" y="320" width="30" height="180" fill="url(#neonAmber)" opacity="0.8"/>
      <rect x="1350" y="290" width="40" height="220" fill="url(#neonCyan)" opacity="0.7"/>
      <!-- Wet ground reflections -->
      <ellipse cx="960" cy="740" rx="700" ry="60" fill="#00f2fe" opacity="0.08"/>
      <ellipse cx="600" cy="710" rx="300" ry="40" fill="#ff0844" opacity="0.12"/>
      <!-- Solitary Courier silhouette -->
      <ellipse cx="880" cy="620" rx="14" ry="16" fill="#020408"/>
      <path d="M850,710 L870,635 L890,635 L910,710 L895,710 L885,670 L875,710 Z" fill="#04060b"/>
      <!-- Viewfinder HUD 2.39:1 -->
      <rect x="40" y="40" width="1840" height="724" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="16 8"/>
      <line x1="960" y1="380" x2="960" y2="424" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      <line x1="938" y1="402" x2="982" y2="402" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      <text x="80" y="90" fill="#00f2fe" font-family="monospace" font-size="28" font-weight="bold">CAM A [35mm ANAMORPHIC] // T1.8</text>
      <text x="80" y="730" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="24">TC 00:01:04:12 · FPS 24.00 · ISO 800 · SHUTTER 180°</text>
      <text x="1620" y="90" fill="#ff0844" font-family="monospace" font-size="28" font-weight="bold">● REC</text>
    </svg>
  `),

  METAHUMAN_CLOSEUP: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 804" width="100%" height="100%">
      <defs>
        <radialGradient id="faceGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#1e1822"/>
          <stop offset="60%" stop-color="#0d0e14"/>
          <stop offset="100%" stop-color="#040406"/>
        </radialGradient>
        <linearGradient id="amberRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="85%" stop-color="#ff9900"/>
          <stop offset="100%" stop-color="#ff5500"/>
        </linearGradient>
      </defs>
      <rect width="1920" height="804" fill="url(#faceGlow)"/>
      <!-- Soft blurred background conduit bokeh -->
      <circle cx="300" cy="200" r="180" fill="#ff7700" opacity="0.08"/>
      <circle cx="1600" cy="500" r="220" fill="#00bbff" opacity="0.06"/>
      <!-- Stylized MetaHuman Face Profile -->
      <path d="M720,200 C800,100 1120,100 1200,200 C1280,300 1300,500 1250,680 C1200,780 720,780 670,680 C620,500 640,300 720,200 Z" fill="#151720"/>
      <!-- Amber Key Rim Light -->
      <path d="M1200,200 C1280,300 1300,500 1250,680" stroke="#ff9900" stroke-width="12" fill="none" opacity="0.85"/>
      <path d="M670,680 C620,500 640,300 720,200" stroke="#00d4ff" stroke-width="6" fill="none" opacity="0.6"/>
      <!-- Glowing Ocular HUD in Iris -->
      <circle cx="880" cy="380" r="28" fill="#0b0e14" stroke="#00f2fe" stroke-width="4"/>
      <circle cx="880" cy="380" r="12" fill="#ff0844"/>
      <circle cx="1040" cy="380" r="28" fill="#0b0e14" stroke="#00f2fe" stroke-width="4"/>
      <circle cx="1040" cy="380" r="12" fill="#00f2fe"/>
      <!-- Ocular glitch rings -->
      <circle cx="880" cy="380" r="54" fill="none" stroke="#ff0844" stroke-width="2" stroke-dasharray="10 6" opacity="0.8"/>
      <!-- Viewfinder Crosshairs -->
      <rect x="40" y="40" width="1840" height="724" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <text x="80" y="90" fill="#ffaa00" font-family="monospace" font-size="28" font-weight="bold">CAM B [85mm PRIME] // T1.4 // EYE TRACKING</text>
      <text x="80" y="730" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="24">FOCUS DIST: 92cm · METAHUMAN LOD0 · LIVE LINK ACTIVE</text>
      <text x="1620" y="90" fill="#00ff66" font-family="monospace" font-size="28" font-weight="bold">LOCKED</text>
    </svg>
  `),

  CATWALK_PREVIS: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 804" width="100%" height="100%">
      <rect width="1920" height="804" fill="#090b10"/>
      <!-- 3D Greybox Grid Perspective -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1c2438" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1920" height="804" fill="url(#grid)"/>
      <!-- Perspective Catwalk Rails (Greybox Previs) -->
      <polygon points="0,520 1920,680 1920,804 0,720" fill="#121824" stroke="#3b82f6" stroke-width="2"/>
      <line x1="0" y1="460" x2="1920" y2="620" stroke="#ff0844" stroke-width="4"/>
      <!-- Sparks Burst (Orange Niagara particles) -->
      <circle cx="1100" cy="540" r="8" fill="#ffaa00"/>
      <circle cx="1140" cy="510" r="5" fill="#ff4400"/>
      <circle cx="1080" cy="580" r="6" fill="#ffeeaa"/>
      <circle cx="1180" cy="560" r="4" fill="#ff3300"/>
      <line x1="1100" y1="540" x2="1240" y2="600" stroke="#ffaa00" stroke-width="2"/>
      <line x1="1100" y1="540" x2="1190" y2="480" stroke="#ff5500" stroke-width="2"/>
      <!-- Previs Frustum Grid Cone -->
      <polygon points="400,200 1500,100 1700,700 300,600" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
      <!-- Director Previs Stamp -->
      <rect x="40" y="40" width="1840" height="724" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <text x="80" y="90" fill="#3b82f6" font-family="monospace" font-size="28" font-weight="bold">UNREAL PREVIS // GNS-003 // HIGH-SPEED TRACKING</text>
      <text x="80" y="730" fill="#10b981" font-family="monospace" font-size="24">BLOCKING APPROVED · SPEED: 4.8m/s · NIAGARA TEST PASS</text>
    </svg>
  `),
};
