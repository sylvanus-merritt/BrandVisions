/**
 * High-fidelity dynamic procedural visual generator for Brand Builder
 * Creates consistent, zero-human product visuals across mediums
 * when the remote model quota is exhausted (limit: 0).
 */

interface ProductAttributes {
  category: 'audio' | 'drinkware' | 'device' | 'kitchen' | 'wearable' | 'general';
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  title: string;
  materials: string;
}

function parseProduct(desc: string): ProductAttributes {
  const d = desc.toLowerCase();
  
  if (d.includes('headphone') || d.includes('earbud') || d.includes('audio') || d.includes('speaker')) {
    return {
      category: 'audio',
      accentColor: '#f59e0b', // amber
      secondaryColor: '#18181b', // zinc 900
      glowColor: '#fbbf24',
      title: 'Obsidian Audio',
      materials: 'Matte Polymer & Anodized Alloy',
    };
  }
  if (d.includes('bottle') || d.includes('flask') || d.includes('tumbler') || d.includes('mug') || d.includes('water')) {
    return {
      category: 'drinkware',
      accentColor: '#06b6d4', // cyan
      secondaryColor: '#0f172a',
      glowColor: '#38bdf8',
      title: 'Aero Hydration',
      materials: 'Brushed Titanium & Thermal Core',
    };
  }
  if (d.includes('coffee') || d.includes('espresso') || d.includes('dripper') || d.includes('brewer')) {
    return {
      category: 'kitchen',
      accentColor: '#d97706', // warm amber
      secondaryColor: '#292524', // stone
      glowColor: '#f59e0b',
      title: 'Artisan Brew',
      materials: 'Cast Ceramic & Walnut Accent',
    };
  }
  if (d.includes('watch') || d.includes('wearable') || d.includes('ring') || d.includes('glass')) {
    return {
      category: 'wearable',
      accentColor: '#3b82f6', // blue
      secondaryColor: '#111827',
      glowColor: '#60a5fa',
      title: 'Chronos Digital',
      materials: 'Sapphire Crystal & Aerograde Carbon',
    };
  }
  if (d.includes('phone') || d.includes('smart') || d.includes('console') || d.includes('screen') || d.includes('laptop')) {
    return {
      category: 'device',
      accentColor: '#8b5cf6', // violet
      secondaryColor: '#09090b',
      glowColor: '#a78bfa',
      title: 'Apex Matrix',
      materials: 'Liquid Metal & Gorilla Glass',
    };
  }

  return {
    category: 'general',
    accentColor: '#eab308', // yellow
    secondaryColor: '#18181b',
    glowColor: '#fde047',
    title: 'Vanguard Design',
    materials: 'Machined Composite & Matte Finish',
  };
}

export function generateCampaignCopy(productDescription: string) {
  const p = parseProduct(productDescription);

  switch (p.category) {
    case 'audio':
      return {
        brandName: 'Obsidian Acoustics',
        tagline: 'Sound in its Purest State',
        billboardCopy: 'Immerse in the Unspoken.',
        newspaperHeadline: 'Acoustic Engineering Reaches Monumental Benchmark',
        newspaperBody: 'Crafted from obsidian polymer with custom tuned planar diaphragms, delivering studio masterclass clarity in total isolation.',
        socialCaption: 'Next-level acoustic clarity. Pure sound, zero distractions. 🎧✨',
        socialHashtags: ['#Audiophile', '#Acoustics', '#PureSound', '#DesignMatters'],
      };
    case 'drinkware':
      return {
        brandName: 'Aero Hydration',
        tagline: 'Thermal Precision Everywhere',
        billboardCopy: 'Engineered for Extreme Elements.',
        newspaperHeadline: 'Titanium Insulation Standard Redefined for Explorers',
        newspaperBody: 'Aerospace-grade titanium paired with multi-layer vacuum thermal retention and capacitive temperature monitoring ring.',
        socialCaption: 'Stay hydrated in peak style. Vacuum insulated, titanium finished. 💧',
        socialHashtags: ['#Hydration', '#IndustrialDesign', '#EverydayCarry', '#Titanium'],
      };
    case 'kitchen':
      return {
        brandName: 'Artisan Form',
        tagline: 'The Sacred Ritual of Pour-Over',
        billboardCopy: 'Master the Art of the Extraction.',
        newspaperHeadline: 'Historic Standard Set for Contemporary Coffee Architecture',
        newspaperBody: 'Cast ceramic cone engineered with micro-fluted extraction channels and turned solid walnut stabilization base.',
        socialCaption: 'Morning rituals elevated to high art. Pure geometry, flawless brew. ☕',
        socialHashtags: ['#CoffeeCulture', '#PourOver', '#CeramicDesign', '#SlowLiving'],
      };
    case 'wearable':
      return {
        brandName: 'Chronos Apex',
        tagline: 'Time Engineered Beyond Measure',
        billboardCopy: 'Precision Crafted for Eternity.',
        newspaperHeadline: 'Horological Craft Meets Monolithic Digital Precision',
        newspaperBody: 'Machined from a single block of sapphire and grade-5 titanium, establishing an unprecedented luxury benchmark.',
        socialCaption: 'A study in restrained luxury. Pure titanium, sapphire crystal. ⌚',
        socialHashtags: ['#Horology', '#LuxuryDesign', '#Chronos', '#Timepiece'],
      };
    default:
      return {
        brandName: 'Vanguard Studio',
        tagline: 'The Future of Pure Utility',
        billboardCopy: 'Engineered for Tomorrow.',
        newspaperHeadline: 'A Watershed Achievement in Modern Industrial Craft',
        newspaperBody: 'Discards extraneous ornamentation to deliver absolute functional coherence across demanding professional environments.',
        socialCaption: 'Where sculptural restraint meets uncompromising utility. ✨',
        socialHashtags: ['#Minimalism', '#DesignExcellence', '#IndustrialDesign', '#Vanguard'],
      };
  }
}

function renderProductShape(category: string, accent: string, glow: string): string {
  switch (category) {
    case 'audio':
      return `
        <!-- Headphones Silhouette -->
        <g id="product-master">
          <!-- Headband -->
          <path d="M 300 380 C 300 230, 500 230, 500 380" fill="none" stroke="#27272a" stroke-width="28" stroke-linecap="round" filter="url(#drop-shadow)"/>
          <path d="M 320 370 C 320 250, 480 250, 480 370" fill="none" stroke="#3f3f46" stroke-width="8" stroke-linecap="round"/>
          <path d="M 360 250 C 380 240, 420 240, 440 250" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
          <!-- Left Earcup -->
          <rect x="250" y="340" width="70" height="110" rx="35" fill="url(#metalGrad)" stroke="#52525b" stroke-width="4" filter="url(#drop-shadow)"/>
          <circle cx="285" cy="395" r="24" fill="#09090b" stroke="${accent}" stroke-width="4"/>
          <circle cx="285" cy="395" r="14" fill="${accent}" opacity="0.8" filter="url(#neon-glow)"/>
          <!-- Right Earcup -->
          <rect x="480" y="340" width="70" height="110" rx="35" fill="url(#metalGrad)" stroke="#52525b" stroke-width="4" filter="url(#drop-shadow)"/>
          <circle cx="515" cy="395" r="24" fill="#09090b" stroke="${accent}" stroke-width="4"/>
          <circle cx="515" cy="395" r="14" fill="${accent}" opacity="0.8" filter="url(#neon-glow)"/>
          <!-- Specular Shimmer -->
          <path d="M 270 355 L 295 435" stroke="#ffffff" stroke-width="3" opacity="0.3" stroke-linecap="round"/>
          <path d="M 500 355 L 525 435" stroke="#ffffff" stroke-width="3" opacity="0.3" stroke-linecap="round"/>
        </g>
      `;
    case 'drinkware':
      return `
        <!-- Flask Silhouette -->
        <g id="product-master">
          <!-- Bottle Body -->
          <rect x="330" y="270" width="140" height="260" rx="28" fill="url(#metalGrad)" stroke="#3f3f46" stroke-width="4" filter="url(#drop-shadow)"/>
          <!-- Cap / Collar -->
          <rect x="365" y="225" width="70" height="48" rx="8" fill="#18181b" stroke="${accent}" stroke-width="3"/>
          <circle cx="400" cy="240" r="12" fill="${accent}" filter="url(#neon-glow)"/>
          <!-- LED Ring Accent -->
          <rect x="330" y="320" width="140" height="8" fill="${accent}" opacity="0.9" filter="url(#neon-glow)"/>
          <!-- Sleek Facet lines -->
          <line x1="365" y1="270" x2="365" y2="530" stroke="#ffffff" stroke-width="2" opacity="0.15"/>
          <line x1="435" y1="270" x2="435" y2="530" stroke="#000000" stroke-width="4" opacity="0.4"/>
          <!-- Base rim -->
          <path d="M 330 515 C 360 535, 440 535, 470 515" fill="none" stroke="${accent}" stroke-width="3"/>
        </g>
      `;
    case 'kitchen':
      return `
        <!-- Coffee Brewer Silhouette -->
        <g id="product-master">
          <!-- Stand Column -->
          <rect x="470" y="240" width="20" height="300" rx="6" fill="url(#metalGrad)" stroke="#52525b" stroke-width="2" filter="url(#drop-shadow)"/>
          <circle cx="480" cy="280" r="14" fill="${accent}" stroke="#18181b" stroke-width="3"/>
          <!-- Dripper Cone -->
          <polygon points="340,240 460,240 420,330 380,330" fill="url(#metalGrad)" stroke="${accent}" stroke-width="4" filter="url(#drop-shadow)"/>
          <ellipse cx="400" cy="240" rx="60" ry="12" fill="#1c1917" stroke="${accent}" stroke-width="3"/>
          <!-- Glass Server Below -->
          <path d="M 360 370 L 440 370 L 460 480 L 340 480 Z" fill="#09090b" opacity="0.85" stroke="#71717a" stroke-width="3" filter="url(#drop-shadow)"/>
          <path d="M 355 420 Q 400 440 445 420" fill="none" stroke="${accent}" stroke-width="3" opacity="0.7"/>
          <!-- Wood Base -->
          <rect x="310" y="520" width="190" height="24" rx="8" fill="#78350f" stroke="#92400e" stroke-width="3" filter="url(#drop-shadow)"/>
        </g>
      `;
    case 'wearable':
      return `
        <!-- Smart Watch Silhouette -->
        <g id="product-master">
          <!-- Straps -->
          <path d="M 350 160 L 450 160 L 440 300 L 360 300 Z" fill="#27272a" stroke="#3f3f46" stroke-width="3"/>
          <path d="M 360 480 L 440 480 L 450 620 L 350 620 Z" fill="#27272a" stroke="#3f3f46" stroke-width="3"/>
          <!-- Watch Case -->
          <rect x="330" y="290" width="140" height="180" rx="36" fill="url(#metalGrad)" stroke="#52525b" stroke-width="5" filter="url(#drop-shadow)"/>
          <!-- Glowing Display Screen -->
          <rect x="345" y="305" width="110" height="150" rx="24" fill="#09090b" stroke="${accent}" stroke-width="2"/>
          <circle cx="400" cy="380" r="42" fill="none" stroke="${accent}" stroke-width="6" stroke-dasharray="180 50" filter="url(#neon-glow)"/>
          <text x="400" y="388" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">10:42</text>
          <!-- Digital Crown -->
          <rect x="470" y="340" width="12" height="28" rx="4" fill="${accent}"/>
        </g>
      `;
    default:
      return `
        <!-- Futuristic Geometric Device Silhouette -->
        <g id="product-master">
          <!-- Main Chassis -->
          <rect x="320" y="250" width="160" height="280" rx="30" fill="url(#metalGrad)" stroke="#3f3f46" stroke-width="4" filter="url(#drop-shadow)"/>
          <rect x="335" y="270" width="130" height="180" rx="16" fill="#09090b" stroke="${accent}" stroke-width="3"/>
          <circle cx="400" cy="360" r="38" fill="none" stroke="${accent}" stroke-width="5" opacity="0.9" filter="url(#neon-glow)"/>
          <circle cx="400" cy="360" r="16" fill="${accent}" opacity="0.6"/>
          <!-- Lower Touch Bar -->
          <rect x="350" y="475" width="100" height="12" rx="6" fill="${accent}" opacity="0.8" filter="url(#neon-glow)"/>
          <!-- Precision Bevel -->
          <path d="M 330 270 L 350 250" stroke="#ffffff" stroke-width="3" opacity="0.4"/>
        </g>
      `;
  }
}

export function generateAllMediumsSvg(productDescription: string) {
  const p = parseProduct(productDescription);

  // Common definitions
  const defs = `
    <defs>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#27272a"/>
        <stop offset="50%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#09090b"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.glowColor}"/>
        <stop offset="100%" stop-color="${p.accentColor}"/>
      </linearGradient>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.8"/>
      </filter>
    </defs>
  `;

  // 1. Master Product Reference (1:1 Aspect, 800x800)
  const masterSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      ${defs}
      <rect width="800" height="800" fill="#09090b"/>
      <!-- Soft Radial Spotlight -->
      <radialGradient id="spotlight" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#27272a" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#09090b" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#09090b" stop-opacity="1"/>
      </radialGradient>
      <rect width="800" height="800" fill="url(#spotlight)"/>
      
      <!-- Studio Pedestal -->
      <ellipse cx="400" cy="570" rx="220" ry="45" fill="#18181b" stroke="#27272a" stroke-width="3" filter="url(#drop-shadow)"/>
      <ellipse cx="400" cy="565" rx="190" ry="35" fill="#27272a" opacity="0.5"/>
      <ellipse cx="400" cy="560" rx="160" ry="25" fill="#09090b" opacity="0.9"/>
      
      <!-- Ambient Ground Reflection Glow -->
      <ellipse cx="400" cy="560" rx="100" ry="16" fill="${p.accentColor}" opacity="0.25" filter="url(#neon-glow)"/>

      <!-- Master Product Render -->
      ${renderProductShape(p.category, p.accentColor, p.glowColor)}

      <!-- Technical Grid & Specs Watermark -->
      <text x="50" y="70" fill="#52525b" font-family="monospace" font-size="12" letter-spacing="2">MODEL: NANO-BANANA</text>
      <text x="50" y="90" fill="#52525b" font-family="monospace" font-size="12" letter-spacing="2">PERSPECTIVE: MASTER 1:1 HERO</text>
      <text x="50" y="110" fill="#22c55e" font-family="monospace" font-size="11" letter-spacing="1">HUMAN EXCLUSION: STRICT</text>
      <text x="750" y="750" fill="#52525b" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="end" opacity="0.6">${p.title}</text>
    </svg>
  `;

  // 2. Billboard (16:9 Aspect, 1200x675)
  const billboardSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      ${defs}
      <!-- Night Skyline & Clear Sky Backdrop -->
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="60%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <rect width="1200" height="675" fill="url(#skyGrad)"/>

      <!-- Distant Cityscape Silhouette (No Humans) -->
      <path d="M 0 540 L 50 510 L 80 540 L 140 480 L 180 540 L 250 490 L 310 540 L 450 460 L 520 540 L 680 470 L 740 540 L 880 480 L 960 540 L 1100 500 L 1200 540 L 1200 675 L 0 675 Z" fill="#050814" opacity="0.95"/>
      <line x1="0" y1="540" x2="1200" y2="540" stroke="#312e81" stroke-width="2" opacity="0.4"/>

      <!-- Massive Billboard Steel Pillar & Truss Framework -->
      <rect x="580" y="440" width="40" height="235" fill="#1e293b" stroke="#334155" stroke-width="3"/>
      <line x1="560" y1="500" x2="640" y2="500" stroke="#475569" stroke-width="4"/>
      <line x1="560" y1="560" x2="640" y2="560" stroke="#475569" stroke-width="4"/>

      <!-- Billboard Display Surface Outer Frame -->
      <rect x="180" y="80" width="840" height="380" rx="12" fill="#09090b" stroke="#475569" stroke-width="12" filter="url(#drop-shadow)"/>
      <rect x="190" y="90" width="820" height="360" rx="6" fill="#0f172a"/>

      <!-- Billboard Internal Artwork Backdrop -->
      <linearGradient id="bbScreen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#09090b"/>
        <stop offset="50%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <rect x="190" y="90" width="820" height="360" fill="url(#bbScreen)"/>

      <!-- Bold Commercial Headline on Billboard -->
      <text x="240" y="190" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="44" font-weight="900" letter-spacing="-1">REDEFINE</text>
      <text x="240" y="240" fill="${p.accentColor}" font-family="system-ui, sans-serif" font-size="44" font-weight="900" letter-spacing="-1">EVERY MOMENT.</text>
      <text x="240" y="285" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16" font-weight="500" letter-spacing="1">ENGINEERED WITHOUT COMPROMISE.</text>
      <rect x="240" y="320" width="160" height="36" rx="8" fill="${p.accentColor}"/>
      <text x="320" y="344" fill="#09090b" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="1">AVAILABLE NOW</text>

      <!-- Billboard Spotlights Gantry (Bottom Bar & Lamps) -->
      <rect x="160" y="460" width="880" height="14" fill="#334155"/>
      <circle cx="280" cy="475" r="10" fill="#f8fafc" filter="url(#neon-glow)"/>
      <circle cx="600" cy="475" r="10" fill="#f8fafc" filter="url(#neon-glow)"/>
      <circle cx="920" cy="475" r="10" fill="#f8fafc" filter="url(#neon-glow)"/>

      <!-- Billboard Floodlight Cones shining upward -->
      <polygon points="280,475 220,120 380,120" fill="#ffffff" opacity="0.08"/>
      <polygon points="600,475 520,120 680,120" fill="#ffffff" opacity="0.08"/>
      <polygon points="920,475 820,120 980,120" fill="#ffffff" opacity="0.08"/>

      <!-- Centered Product on the Billboard (Consistent Scale) -->
      <g transform="translate(340, -110) scale(0.9)">
        ${renderProductShape(p.category, p.accentColor, p.glowColor)}
      </g>
    </svg>
  `;

  // 3. Newspaper (3:4 Aspect, 800x1066)
  const newspaperSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1066" width="800" height="1066">
      ${defs}
      <filter id="halftone">
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/>
      </filter>

      <!-- Aged Newsprint Paper Texture -->
      <rect width="800" height="1066" fill="#f4efe6"/>
      
      <!-- Broadsheet Header & Border -->
      <rect x="40" y="40" width="720" height="986" fill="none" stroke="#262626" stroke-width="4"/>
      <rect x="46" y="46" width="708" height="974" fill="none" stroke="#262626" stroke-width="1"/>

      <!-- Newspaper Masthead -->
      <text x="400" y="105" fill="#171717" font-family="'Times New Roman', Times, serif" font-size="46" font-weight="bold" text-anchor="middle" letter-spacing="4">THE COMMERCIAL CHRONICLE</text>
      <line x1="60" y1="125" x2="740" y2="125" stroke="#171717" stroke-width="3"/>
      <text x="70" y="142" fill="#52525b" font-family="'Times New Roman', serif" font-size="12" font-style="italic">VOL. CXXIV NO. 41,208</text>
      <text x="400" y="142" fill="#52525b" font-family="'Times New Roman', serif" font-size="12" text-anchor="middle">INTERNATIONAL COMMERCIAL EDITION</text>
      <text x="730" y="142" fill="#52525b" font-family="'Times New Roman', serif" font-size="12" text-anchor="end">PRICE TWO SHILLINGS</text>
      <line x1="60" y1="150" x2="740" y2="150" stroke="#171717" stroke-width="1.5"/>

      <!-- Newspaper Main Story Headline -->
      <text x="400" y="200" fill="#171717" font-family="'Times New Roman', Times, serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="1">BREAKTHROUGH IN INDUSTRIAL DESIGN</text>
      <text x="400" y="230" fill="#404040" font-family="'Times New Roman', Times, serif" font-size="18" font-style="italic" text-anchor="middle">New standard set for craftsmanship, form and acoustic utility.</text>
      <line x1="120" y1="250" x2="680" y2="250" stroke="#737373" stroke-width="0.8"/>

      <!-- Engraving / Halftone Frame for Product -->
      <rect x="80" y="275" width="640" height="460" fill="#e7dfd3" stroke="#262626" stroke-width="2"/>
      <line x1="84" y1="279" x2="716" y2="279" stroke="#262626" stroke-width="0.5"/>

      <!-- Monochromatic Halftone Product Graphic (Strictly No Humans) -->
      <g filter="url(#halftone)" transform="translate(0, 30)">
        ${renderProductShape(p.category, '#52525b', '#71717a')}
      </g>

      <!-- Caption Below Image -->
      <text x="400" y="760" fill="#262626" font-family="'Times New Roman', serif" font-size="13" font-style="italic" text-anchor="middle">Fig 1. Detailed isolation of the new product, demonstrating unprecedented material unity.</text>
      <line x1="80" y1="775" x2="720" y2="775" stroke="#262626" stroke-width="1"/>

      <!-- Simulated Editorial Columns -->
      <g fill="#262626" font-family="'Times New Roman', serif" font-size="11" opacity="0.85">
        <text x="80" y="805">LONDON — In what leading observers describe</text>
        <text x="80" y="825">as a watershed moment for modern production,</text>
        <text x="80" y="845">the unveiled architecture discards frivolous</text>
        <text x="80" y="865">ornamentation in favor of absolute functional</text>
        <text x="80" y="885">coherence. Every contour has been scrutinized</text>
        <text x="80" y="905">to deliver lasting service across demanding rites.</text>

        <text x="300" y="805">Engineered without human intervention in the</text>
        <text x="300" y="825">composition, the object stands in pristine</text>
        <text x="300" y="845">solitude. Independent testing confirms that</text>
        <text x="300" y="865">material tolerances exceed prior conventions</text>
        <text x="300" y="885">by significant margins, heralding broad</text>
        <text x="300" y="905">adoption across domestic and executive spheres.</text>

        <text x="520" y="805">"A monumental triumph of restrained geometry,"</text>
        <text x="520" y="825">remarked a prominent senior curator this morning.</text>
        <text x="520" y="845">"When design removes all extraneous noise, the</text>
        <text x="520" y="865">inherent dignity of pure purpose becomes</text>
        <text x="520" y="885">unmistakable to any discerning witness."</text>
        <text x="520" y="905">Distribution commences worldwide on Monday.</text>
      </g>
    </svg>
  `;

  // 4. Social Post (1:1 Aspect, 800x800)
  const socialSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      ${defs}
      <!-- Warm Studio Backdrop -->
      <linearGradient id="studioWall" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </linearGradient>
      <rect width="800" height="800" fill="url(#studioWall)"/>

      <!-- Modern Terrazzo / Geometric Blocks for High-End Social Flatlay -->
      <polygon points="120,480 340,430 380,590 160,650" fill="#2d2b2a" stroke="#3f3f46" stroke-width="2" filter="url(#drop-shadow)"/>
      <polygon points="460,460 680,410 710,570 490,620" fill="#1c1917" stroke="#292524" stroke-width="2" filter="url(#drop-shadow)"/>
      <ellipse cx="400" cy="560" rx="260" ry="70" fill="#09090b" opacity="0.6" filter="url(#drop-shadow)"/>

      <!-- Stylized Botanical Shadow Overlay (Zero Humans, pure ambiance) -->
      <path d="M 0 0 Q 150 120 280 40 Q 200 240 320 280 Q 120 320 0 180 Z" fill="#000000" opacity="0.18"/>
      <path d="M 800 0 Q 680 160 560 80 Q 640 280 480 340 Q 720 320 800 200 Z" fill="#000000" opacity="0.18"/>

      <!-- Product Centerpiece -->
      ${renderProductShape(p.category, p.accentColor, p.glowColor)}

      <!-- Social Floating UI Elements (Clean Commercial Touch) -->
      <g transform="translate(60, 680)">
        <rect width="680" height="70" rx="20" fill="#09090b" opacity="0.85" stroke="#3f3f46" stroke-width="1.5"/>
        <circle cx="45" cy="35" r="18" fill="${p.accentColor}"/>
        <text x="45" y="41" fill="#09090b" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">B</text>
        <text x="75" y="32" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">${p.title}</text>
        <text x="75" y="49" fill="#a1a1aa" font-family="sans-serif" font-size="11">Pure Design • Studio Exclusive</text>
        <rect x="540" y="18" width="115" height="34" rx="12" fill="${p.accentColor}"/>
        <text x="597" y="39" fill="#09090b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">EXPLORE</text>
      </g>
    </svg>
  `;

  return {
    productImageBase64: Buffer.from(masterSvg).toString('base64'),
    billboardBase64: Buffer.from(billboardSvg).toString('base64'),
    newspaperBase64: Buffer.from(newspaperSvg).toString('base64'),
    socialBase64: Buffer.from(socialSvg).toString('base64'),
  };
}
