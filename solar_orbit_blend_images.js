const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════════════
// PART A: REMOVE ALL OLD ORBIT + IMAGE CSS AND HTML
// ═══════════════════════════════════════════════════════════════

// 1. Remove ALL old orbit keyframes (orbit1-6, revolveBox, counterRevolve)
html = html.replace(/@keyframes\s*orbit[1-6]\s*\{[\s\S]*?\}\s*\}/g, '');
html = html.replace(/\/\*\s*old\s*(revolveBox|counterRevolve|nth-child|floating-logos)\s*removed\s*\*\//g, '');

// 2. Remove the planetary orbit CSS block entirely  
html = html.replace(/\/\*\s*═+\s*PLANETARY ORBIT SYSTEM[\s\S]*?\/\*\s*═+\s*STUDENT IMAGES[\s\S]*?@media\s*\(max-width:\s*480px\)\s*\{[^}]*student-img[^}]*\}/g, '');

// 3. Remove ALL student-img-wrap HTML blocks (all 5 of them)
html = html.replace(/<div class="student-img-wrap reveal">\s*<img src="website images\/\d\.png"[^>]*\/>\s*<\/div>/g, '');

// 4. Remove old student-img CSS rules
html = html.replace(/\.student-img-wrap\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-img-wrap\s*img\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-img-hero\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-img-section\s*\{[\s\S]*?\}/g, '');

// 5. Clean up old responsive orbit overrides inside media queries  
html = html.replace(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?@keyframes\s*orbit6[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?@keyframes\s*orbit6[\s\S]*?\}\s*\}/g, '');


// ═══════════════════════════════════════════════════════════════
// PART B: INJECT SOLAR-SYSTEM ORBIT CSS
// ═══════════════════════════════════════════════════════════════

const solarSystemCSS = `
        /* ═══ SOLAR SYSTEM ORBIT ═══ */
        .floating-logos {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            pointer-events: none;
            z-index: 1;
        }

        .fl-item {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            margin-top: -32px;
            margin-left: -32px;
        }

        /* Single shared keyframe — each icon uses different radius via translateX */
        @keyframes planetOrbit {
            from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }

        /* Each icon: unique radius, speed, and starting angle (delay) */
        .fl-item:nth-child(1) {
            --orbit-r: 200px;
            animation: planetOrbit 24s linear infinite !important;
            animation-delay: 0s !important;
        }
        .fl-item:nth-child(2) {
            --orbit-r: 260px;
            animation: planetOrbit 30s linear infinite !important;
            animation-delay: -5s !important;
        }
        .fl-item:nth-child(3) {
            --orbit-r: 320px;
            animation: planetOrbit 36s linear infinite !important;
            animation-delay: -12s !important;
        }
        .fl-item:nth-child(4) {
            --orbit-r: 240px;
            animation: planetOrbit 28s linear infinite !important;
            animation-delay: -18s !important;
        }
        .fl-item:nth-child(5) {
            --orbit-r: 350px;
            animation: planetOrbit 40s linear infinite !important;
            animation-delay: -8s !important;
        }
        .fl-item:nth-child(6) {
            --orbit-r: 290px;
            animation: planetOrbit 33s linear infinite !important;
            animation-delay: -22s !important;
        }

        /* Tablet responsive */
        @media (max-width: 768px) {
            .fl-item:nth-child(1) { --orbit-r: 130px; }
            .fl-item:nth-child(2) { --orbit-r: 165px; }
            .fl-item:nth-child(3) { --orbit-r: 200px; }
            .fl-item:nth-child(4) { --orbit-r: 150px; }
            .fl-item:nth-child(5) { --orbit-r: 220px; }
            .fl-item:nth-child(6) { --orbit-r: 180px; }
            .fl-item { width: 44px !important; height: 44px !important; margin-top: -22px; margin-left: -22px; }
            .fl-item img { width: 22px !important; height: 22px !important; }
        }
        /* Mobile responsive */
        @media (max-width: 480px) {
            .fl-item:nth-child(1) { --orbit-r: 95px; }
            .fl-item:nth-child(2) { --orbit-r: 120px; }
            .fl-item:nth-child(3) { --orbit-r: 145px; }
            .fl-item:nth-child(4) { --orbit-r: 108px; }
            .fl-item:nth-child(5) { --orbit-r: 158px; }
            .fl-item:nth-child(6) { --orbit-r: 132px; }
            .fl-item { width: 34px !important; height: 34px !important; margin-top: -17px; margin-left: -17px; }
            .fl-item img { width: 16px !important; height: 16px !important; }
        }

        /* ═══ BLENDED STUDENT IMAGES ═══ */
        @keyframes subtleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
        }
        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .student-accent {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            overflow: visible;
        }
        .student-accent img {
            height: auto;
            object-fit: contain;
            filter: brightness(0.95) contrast(1.05) saturate(0.85) drop-shadow(0 4px 20px rgba(10,91,255,.18));
            animation: subtleFloat 6s ease-in-out infinite;
        }

        /* Hero accent — floating beside or behind the CTA */
        .student-hero-accent {
            position: absolute;
            bottom: -40px;
            right: -60px;
            width: 200px;
            opacity: 0.3;
            z-index: 0;
            pointer-events: none;
        }
        .student-hero-accent img {
            width: 100%;
            filter: brightness(0.7) saturate(0.6) hue-rotate(10deg) drop-shadow(0 0 30px rgba(10,91,255,.25));
            animation: subtleFloat 8s ease-in-out infinite;
            opacity: 0.6;
        }

        /* Section accent — subtle inline with glow */
        .student-section-accent {
            max-width: 180px;
            margin: 15px auto;
        }
        .student-section-accent img {
            width: 100%;
            border-radius: 16px;
            filter: brightness(0.88) contrast(1.08) saturate(0.7) hue-rotate(15deg) drop-shadow(0 6px 25px rgba(10,91,255,.2));
            mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }

        /* Certificate accent — glowing badge style */
        .student-cert-accent {
            max-width: 160px;
            margin: 10px auto;
            position: relative;
        }
        .student-cert-accent img {
            width: 100%;
            border-radius: 50%;
            border: 2px solid rgba(10, 91, 255, 0.3);
            box-shadow: 0 0 30px rgba(10, 91, 255, 0.15), 0 0 60px rgba(39, 224, 196, 0.08);
            filter: brightness(0.9) saturate(0.75) hue-rotate(10deg);
            animation: subtleFloat 7s ease-in-out infinite;
        }

        /* Inline decorative — sits beside text, small */
        .student-inline-accent {
            display: inline-block;
            width: 120px;
            vertical-align: middle;
            margin: 0 10px;
        }
        .student-inline-accent img {
            width: 100%;
            filter: brightness(0.85) saturate(0.65) hue-rotate(20deg) drop-shadow(0 3px 15px rgba(10,91,255,.15));
            mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
            animation: subtleFloat 5s ease-in-out infinite;
            animation-delay: -2s;
        }

        @media (max-width: 480px) {
            .student-hero-accent { width: 120px; bottom: -20px; right: -20px; opacity: 0.2; }
            .student-section-accent { max-width: 120px; }
            .student-cert-accent { max-width: 100px; }
            .student-inline-accent { width: 80px; }
        }
`;

// Insert before last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + solarSystemCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);


// ═══════════════════════════════════════════════════════════════
// PART C: INSERT BLENDED STUDENT IMAGES AT SMART LOCATIONS
// ═══════════════════════════════════════════════════════════════

// Image 1: Hero section — as a subtle ghost accent behind the pricing card
html = html.replace(
    /(<div class="pcard">)/,
    `<div class="student-hero-accent reveal"><img src="website images/1.png" alt="" /></div>\n                        $1`
);

// Image 2: Benefits section header — tiny inline accent beside the title
html = html.replace(
    /(Real skills\. Real outcomes\.)/,
    `$1 <span class="student-inline-accent reveal"><img src="website images/2.png" alt="" /></span>`
);

// Image 4: Parent Assurance — small section accent between title and items
html = html.replace(
    /(Safe\. Structured\. Supervised\.)/,
    `$1 <span class="student-inline-accent reveal"><img src="website images/4.png" alt="" /></span>`
);

// Image 5: Certificate/CTA — glowing badge accent before countdown
html = html.replace(
    /(<!-- COUNTDOWN -->)/,
    `<div class="student-cert-accent reveal" style="margin-bottom:20px;"><img src="website images/5.png" alt="" /></div>\n            $1`
);

// Image 3: Parent Perspectives — section accent image
html = html.replace(
    /(<div class="sentiment-grid">)/,
    `<div class="student-section-accent reveal"><img src="website images/3.png" alt="" /></div>\n                    $1`
);


// ═══════════════════════════════════════════════════════════════
// PART D: WRITE OUTPUT
// ═══════════════════════════════════════════════════════════════
fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Solar-system orbit: 6 icons at different radii (200–350px), staggered angles, no clashing');
console.log('✅ Student images: blended with color grading, float animations, mask-image fading');
console.log('✅ Responsive scaling for tablet + mobile');
