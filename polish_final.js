const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════
// STEP 1: REMOVE the ugly hero image showcase (2 stacked cards)
// ═══════════════════════════════════════════════════════
html = html.replace(/<div class="student-hero-showcase reveal">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');

// Also remove the benefits 3-card showcase
html = html.replace(/<div class="student-showcase reveal">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, '');

// Remove the cert showcase card before countdown
html = html.replace(/<div class="student-showcase reveal"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, '');


// ═══════════════════════════════════════════════════════
// STEP 2: Make orbiting icons BEHIND text with blur
// ═══════════════════════════════════════════════════════

// Remove old orbit-related CSS and inject fresh
html = html.replace(/\/\*\s*═+\s*SOLAR SYSTEM — CENTERED ON HERO TEXT\s*═+\s*\*\/[\s\S]*?\.fl-item img \{ width: 16px !important; height: 16px !important; \}\s*\}/g, '');

const orbitCSS = `
        /* ═══ ORBITING ICONS — BEHIND TEXT, BLURRED ═══ */
        .hero-in {
            position: relative !important;
        }
        .hero {
            overflow: hidden !important;
        }
        .floating-logos {
            position: absolute !important;
            top: 30% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            pointer-events: none;
            z-index: 0 !important;
        }
        .hero-in > *:not(.floating-logos) {
            position: relative;
            z-index: 2;
        }
        .fl-item {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            margin-top: -32px !important;
            margin-left: -32px !important;
            opacity: 0.35 !important;
            filter: blur(1.5px);
            transition: opacity 0.5s ease;
        }

        @keyframes planetOrbit {
            from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }

        .fl-item:nth-child(1) { --orbit-r: 180px; animation: planetOrbit 24s linear infinite !important; animation-delay: 0s !important; }
        .fl-item:nth-child(2) { --orbit-r: 240px; animation: planetOrbit 30s linear infinite !important; animation-delay: -5s !important; }
        .fl-item:nth-child(3) { --orbit-r: 300px; animation: planetOrbit 36s linear infinite !important; animation-delay: -12s !important; }
        .fl-item:nth-child(4) { --orbit-r: 210px; animation: planetOrbit 27s linear infinite !important; animation-delay: -18s !important; }
        .fl-item:nth-child(5) { --orbit-r: 330px; animation: planetOrbit 40s linear infinite !important; animation-delay: -8s !important; }
        .fl-item:nth-child(6) { --orbit-r: 270px; animation: planetOrbit 33s linear infinite !important; animation-delay: -22s !important; }

        @media (max-width: 768px) {
            .fl-item:nth-child(1) { --orbit-r: 120px; }
            .fl-item:nth-child(2) { --orbit-r: 160px; }
            .fl-item:nth-child(3) { --orbit-r: 200px; }
            .fl-item:nth-child(4) { --orbit-r: 140px; }
            .fl-item:nth-child(5) { --orbit-r: 220px; }
            .fl-item:nth-child(6) { --orbit-r: 180px; }
            .fl-item { width: 42px !important; height: 42px !important; margin-top: -21px !important; margin-left: -21px !important; }
            .fl-item img { width: 20px !important; height: 20px !important; }
        }
        @media (max-width: 480px) {
            .fl-item:nth-child(1) { --orbit-r: 90px; }
            .fl-item:nth-child(2) { --orbit-r: 115px; }
            .fl-item:nth-child(3) { --orbit-r: 140px; }
            .fl-item:nth-child(4) { --orbit-r: 100px; }
            .fl-item:nth-child(5) { --orbit-r: 155px; }
            .fl-item:nth-child(6) { --orbit-r: 128px; }
            .fl-item { width: 34px !important; height: 34px !important; margin-top: -17px !important; margin-left: -17px !important; opacity: 0.25 !important; }
            .fl-item img { width: 16px !important; height: 16px !important; }
        }
`;

// ═══════════════════════════════════════════════════════
// STEP 3: Completely rewrite images CSS for premium blending
// ═══════════════════════════════════════════════════════

// Strip old image CSS
html = html.replace(/\/\*\s*═+\s*STUDENT SHOWCASE IMAGES[\s\S]*?\.student-showcase \{ gap: 12px; \}\s*\}/g, '');
html = html.replace(/@keyframes\s*floatGently[\s\S]*?\}/g, '');
html = html.replace(/@keyframes\s*glowPulse[\s\S]*?\}/g, '');
html = html.replace(/@keyframes\s*revealUp[\s\S]*?\}/g, '');

const imageCSS = `
        /* ═══ PREMIUM STUDENT IMAGERY ═══ */
        @keyframes breatheGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(10,91,255,.1), inset 0 0 60px rgba(5,15,35,.4); }
            50% { box-shadow: 0 0 50px rgba(10,91,255,.2), inset 0 0 80px rgba(5,15,35,.3); }
        }
        @keyframes gentleDrift {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-6px) rotate(0.3deg); }
            66% { transform: translateY(3px) rotate(-0.2deg); }
        }

        .student-banner {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 24px auto;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(10,91,255,.12);
            background: linear-gradient(145deg, rgba(10,91,255,.06), rgba(5,15,35,.9));
            animation: breatheGlow 5s ease-in-out infinite, gentleDrift 8s ease-in-out infinite;
        }
        .student-banner img {
            width: 100%;
            display: block;
            /* Deep dark-theme color grading */
            filter: brightness(0.75) contrast(1.2) saturate(0.7) hue-rotate(8deg);
            mix-blend-mode: luminosity;
            transition: filter 0.6s ease, transform 0.6s ease, mix-blend-mode 0.6s ease;
        }
        .student-banner:hover img {
            filter: brightness(0.9) contrast(1.15) saturate(0.9) hue-rotate(4deg);
            mix-blend-mode: normal;
            transform: scale(1.04);
        }
        /* Multi-directional gradient overlays for seamless blending */
        .student-banner::before {
            content: '';
            position: absolute;
            inset: 0;
            background: 
                linear-gradient(180deg, rgba(5,15,35,.5) 0%, transparent 30%, transparent 60%, rgba(5,15,35,.7) 100%),
                linear-gradient(90deg, rgba(5,15,35,.4) 0%, transparent 20%, transparent 80%, rgba(5,15,35,.4) 100%);
            z-index: 1;
            pointer-events: none;
        }
        .student-banner::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,15,35,.6) 100%);
            z-index: 1;
            pointer-events: none;
        }
        .student-banner .banner-label {
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,.7);
            font-size: 0.75rem;
            font-weight: 500;
            z-index: 3;
            text-shadow: 0 1px 6px rgba(0,0,0,.6);
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
        }

        @media (max-width: 768px) { .student-banner { max-width: 85%; border-radius: 18px; } }
        @media (max-width: 480px) { .student-banner { max-width: 92%; border-radius: 14px; margin: 16px auto; } }
`;

// Inject all CSS before last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + orbitCSS + imageCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);


// ═══════════════════════════════════════════════════════
// STEP 4: Verify and fix remaining banners — update their styling
// ═══════════════════════════════════════════════════════

// The banners for 3.png and 4.png should already exist. Let's also add 
// image 5.png as a compact banner near the countdown, and place 1.png 
// subtly in the hero as a background-like accent

// Hero background accent with 1.png — absolute positioned, huge, very faded
const heroAccentHTML = `<div style="position:absolute;top:15%;left:50%;transform:translateX(-50%);width:500px;height:500px;z-index:0;pointer-events:none;opacity:0.08;filter:blur(3px) saturate(0.3) brightness(0.6);">
                    <img src="website images/1.png" alt="" style="width:100%;height:100%;object-fit:contain;" />
                </div>`;
// Insert after the floating-logos div inside hero-in
html = html.replace(
    /(<div class="hero-in"[^>]*>)\s*(<div class="floating-logos">)/,
    `$1\n                ${heroAccentHTML}\n                $2`
);

// Image 5 banner before countdown
const certBannerHTML = `
                <div class="student-banner reveal" style="max-width:320px; margin: 20px auto;">
                    <img src="website images/5.png" alt="AI certified graduate" />
                    <span class="banner-label eo">AI Certified Graduate</span>
                    <span class="banner-label ko kn-font">AI ಪ್ರಮಾಣಿತ ಪದವೀಧರ</span>
                </div>`;
// Check if there's already a 5.png banner; if not, add one
if (!html.includes('student-banner') || !html.match(/5\.png[^>]*>[\s\S]*?banner-label/)) {
    html = html.replace(
        /(<!-- COUNTDOWN -->)/,
        certBannerHTML + '\n            $1'
    );
}

// Image 2 banner in benefits section
const benefitsBannerHTML = `
                    <div class="student-banner reveal" style="max-width:400px;">
                        <img src="website images/2.png" alt="Student learning AI" />
                        <span class="banner-label eo">Hands-on AI Learning</span>
                        <span class="banner-label ko kn-font">ಪ್ರಾಯೋಗಿಕ AI ಕಲಿಕೆ</span>
                    </div>`;
html = html.replace(
    /(ಕೋರ್ಸ್ ಮುಗಿದ ಮೇಲೆ ನಿಮ್ಮ ಮಗುವಿಗೆ[\s\S]*?ಕೌಶಲ್ಯಗಳು\.<\/p>)\s*(<div class="benefits-grid">)/,
    '$1\n' + benefitsBannerHTML + '\n                    $2'
);

// ═══════════════════════════════════════════════════════
fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Removed ugly hero stacked cards');
console.log('✅ Orbiting icons: z-index:0, opacity:0.35, blur(1.5px) — behind text');
console.log('✅ Images: mix-blend-mode:luminosity, deep color grading, multi-directional gradient overlays');
console.log('✅ Hero ghost accent: 1.png as huge faded background (8% opacity, blur 3px)');
console.log('✅ All banners: breathing glow animation + gentle drift');
