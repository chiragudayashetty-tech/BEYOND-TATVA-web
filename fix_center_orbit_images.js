const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════
// STEP 1: Move .floating-logos INSIDE .hero-in so it centers on the text
// ═══════════════════════════════════════════════════════

// Remove the floating-logos div from its current position (direct child of .hero section)
const floatingLogosMatch = html.match(/<div class="floating-logos">[\s\S]*?<\/div>\s*(?=<div class="hero-in">)/);
if (floatingLogosMatch) {
    const floatingLogosHTML = floatingLogosMatch[0];
    // Remove from old position
    html = html.replace(floatingLogosHTML, '');
    // Insert it right after <div class="hero-in"> opening
    html = html.replace(
        /<div class="hero-in">/,
        '<div class="hero-in" style="position:relative;">\n                ' + floatingLogosHTML.trim()
    );
    console.log('✅ Moved .floating-logos inside .hero-in for proper centering');
} else {
    console.log('⚠️ Could not find .floating-logos to move — checking if already inside hero-in');
}

// ═══════════════════════════════════════════════════════
// STEP 2: Fix .hero-in to be the orbit reference + clip overflow
// ═══════════════════════════════════════════════════════

// Rewrite the floating-logos and fl-item CSS completely
const orbitFixCSS = `
        /* ═══ SOLAR SYSTEM — CENTERED ON HERO TEXT ═══ */
        .hero-in {
            position: relative !important;
            overflow: visible;
        }
        .hero {
            overflow: hidden !important;
        }
        .floating-logos {
            position: absolute !important;
            top: 35% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            pointer-events: none;
            z-index: 0;
        }
        .fl-item {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            margin-top: -32px !important;
            margin-left: -32px !important;
        }

        @keyframes planetOrbit {
            from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }

        .fl-item:nth-child(1) { --orbit-r: 180px; animation: planetOrbit 22s linear infinite !important; animation-delay: 0s !important; }
        .fl-item:nth-child(2) { --orbit-r: 230px; animation: planetOrbit 28s linear infinite !important; animation-delay: -4s !important; }
        .fl-item:nth-child(3) { --orbit-r: 280px; animation: planetOrbit 34s linear infinite !important; animation-delay: -11s !important; }
        .fl-item:nth-child(4) { --orbit-r: 210px; animation: planetOrbit 26s linear infinite !important; animation-delay: -17s !important; }
        .fl-item:nth-child(5) { --orbit-r: 310px; animation: planetOrbit 38s linear infinite !important; animation-delay: -7s !important; }
        .fl-item:nth-child(6) { --orbit-r: 260px; animation: planetOrbit 32s linear infinite !important; animation-delay: -20s !important; }

        @media (max-width: 768px) {
            .fl-item:nth-child(1) { --orbit-r: 120px; }
            .fl-item:nth-child(2) { --orbit-r: 155px; }
            .fl-item:nth-child(3) { --orbit-r: 190px; }
            .fl-item:nth-child(4) { --orbit-r: 140px; }
            .fl-item:nth-child(5) { --orbit-r: 210px; }
            .fl-item:nth-child(6) { --orbit-r: 170px; }
            .fl-item { width: 42px !important; height: 42px !important; margin-top: -21px !important; margin-left: -21px !important; }
            .fl-item img { width: 20px !important; height: 20px !important; }
        }
        @media (max-width: 480px) {
            .fl-item:nth-child(1) { --orbit-r: 85px; }
            .fl-item:nth-child(2) { --orbit-r: 110px; }
            .fl-item:nth-child(3) { --orbit-r: 135px; }
            .fl-item:nth-child(4) { --orbit-r: 98px; }
            .fl-item:nth-child(5) { --orbit-r: 148px; }
            .fl-item:nth-child(6) { --orbit-r: 122px; }
            .fl-item { width: 34px !important; height: 34px !important; margin-top: -17px !important; margin-left: -17px !important; }
            .fl-item img { width: 16px !important; height: 16px !important; }
        }
`;

// Remove old solar system CSS block
html = html.replace(/\/\*\s*═+\s*SOLAR SYSTEM[\s\S]*?@media\s*\(max-width:\s*480px\)\s*\{[^}]*fl-item img[^}]*\}/g, '');

// ═══════════════════════════════════════════════════════
// STEP 3: Remove all old image blocks and CSS, rewrite from scratch
// ═══════════════════════════════════════════════════════

// Remove old student image CSS blocks
html = html.replace(/\/\*\s*═+\s*BLENDED STUDENT IMAGES[\s\S]*?@media\s*\(max-width:\s*480px\)\s*\{[^}]*student-inline[^}]*\}/g, '');
html = html.replace(/@keyframes\s*subtleFloat[\s\S]*?\}/g, '');
html = html.replace(/@keyframes\s*fadeSlideUp[\s\S]*?\}/g, '');

// Remove old student accent HTML
html = html.replace(/<div class="student-hero-accent reveal"><img src="website images\/1\.png"[^>]*\/><\/div>\s*/g, '');
html = html.replace(/<span class="student-inline-accent reveal"><img src="website images\/2\.png"[^>]*\/><\/span>/g, '');
html = html.replace(/<span class="student-inline-accent reveal"><img src="website images\/4\.png"[^>]*\/><\/span>/g, '');
html = html.replace(/<div class="student-section-accent reveal"><img src="website images\/3\.png"[^>]*\/><\/div>\s*/g, '');
html = html.replace(/<div class="student-cert-accent reveal"[^>]*><img src="website images\/5\.png"[^>]*\/><\/div>\s*/g, '');

// Also clean up any remaining old classes
html = html.replace(/\.student-hero-accent\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-hero-accent\s*img\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-section-accent\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-section-accent\s*img\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-cert-accent\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-cert-accent\s*img\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-inline-accent\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-inline-accent\s*img\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-accent\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.student-accent\s*img\s*\{[\s\S]*?\}/g, '');

// ═══════════════════════════════════════════════════════
// STEP 4: New prominent student image CSS
// ═══════════════════════════════════════════════════════

const newImageCSS = `
        /* ═══ STUDENT SHOWCASE IMAGES ═══ */
        @keyframes floatGently {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.01); }
        }
        @keyframes glowPulse {
            0%, 100% { box-shadow: 0 8px 40px rgba(10,91,255,.15), 0 0 0 0 rgba(39,224,196,0); }
            50% { box-shadow: 0 12px 50px rgba(10,91,255,.25), 0 0 50px rgba(39,224,196,.08); }
        }
        @keyframes revealUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .student-showcase {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin: 30px auto;
            max-width: 700px;
            flex-wrap: wrap;
        }
        .student-card {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            background: linear-gradient(145deg, rgba(10,91,255,.08), rgba(39,224,196,.06));
            border: 1.5px solid rgba(10,91,255,.15);
            animation: glowPulse 4s ease-in-out infinite, floatGently 6s ease-in-out infinite;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .student-card:hover {
            transform: translateY(-6px) scale(1.03) !important;
            box-shadow: 0 16px 60px rgba(10,91,255,.3), 0 0 40px rgba(39,224,196,.12) !important;
        }
        .student-card img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(1.08) saturate(0.85) brightness(0.92);
            transition: filter 0.4s ease;
        }
        .student-card:hover img {
            filter: contrast(1.12) saturate(1) brightness(1);
        }
        .student-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 50%, rgba(5,15,35,.6) 100%);
            pointer-events: none;
        }

        /* Size variants */
        .student-card-lg { width: 280px; height: 320px; }
        .student-card-md { width: 220px; height: 260px; }
        .student-card-sm { width: 180px; height: 220px; }

        /* Hero student image — prominent, centered below CTA */
        .student-hero-showcase {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 35px auto 10px;
            max-width: 600px;
            flex-wrap: wrap;
        }
        .student-hero-showcase .student-card {
            animation-delay: var(--delay, 0s);
        }

        /* Section banner image — full-width subtle background accent */
        .student-banner {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 20px auto;
            border-radius: 20px;
            overflow: hidden;
            border: 1.5px solid rgba(10,91,255,.12);
            animation: glowPulse 5s ease-in-out infinite;
        }
        .student-banner img {
            width: 100%;
            display: block;
            filter: contrast(1.05) saturate(0.8) brightness(0.9);
            transition: filter 0.4s ease, transform 0.4s ease;
        }
        .student-banner:hover img {
            filter: contrast(1.1) saturate(1) brightness(1);
            transform: scale(1.02);
        }
        .student-banner::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 40%, rgba(5,15,35,.5) 100%);
            pointer-events: none;
        }
        .student-banner .banner-label {
            position: absolute;
            bottom: 16px;
            left: 20px;
            color: #fff;
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 2;
            text-shadow: 0 2px 8px rgba(0,0,0,.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .student-card-lg { width: 200px; height: 240px; }
            .student-card-md { width: 170px; height: 200px; }
            .student-card-sm { width: 140px; height: 170px; }
            .student-banner { max-width: 90%; }
        }
        @media (max-width: 480px) {
            .student-card-lg { width: 150px; height: 180px; }
            .student-card-md { width: 130px; height: 160px; }
            .student-card-sm { width: 110px; height: 140px; }
            .student-hero-showcase { gap: 12px; }
            .student-showcase { gap: 12px; }
        }
`;

// Inject all CSS before last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + orbitFixCSS + newImageCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);


// ═══════════════════════════════════════════════════════
// STEP 5: Insert student images as prominent visual elements
// ═══════════════════════════════════════════════════════

// IMAGE 1 + 2: Hero section — two student cards side by side below the guarantee box
const heroImagesHTML = `
                        <div class="student-hero-showcase reveal">
                            <div class="student-card student-card-lg" style="--delay: 0s;">
                                <img src="website images/1.png" alt="Student studying with AI" />
                            </div>
                            <div class="student-card student-card-lg" style="--delay: 0.3s;">
                                <img src="website images/2.png" alt="Student coding with AI" />
                            </div>
                        </div>`;

// Insert after the guarantee div, before closing hero-in
html = html.replace(
    /(<div class="guar">[\s\S]*?<\/div>\s*<\/div>)\s*(<\/div>\s*<\/div>\s*<\/section>)/,
    '$1\n' + heroImagesHTML + '\n                    $2'
);

// IMAGE 3: "Parent Perspectives" section — banner with label
const perspectiveBannerHTML = `
                    <div class="student-banner reveal">
                        <img src="website images/3.png" alt="Student creating with AI" />
                        <span class="banner-label eo">Students building with AI tools</span>
                        <span class="banner-label ko kn-font">AI ಉಪಕರಣಗಳೊಂದಿಗೆ ವಿದ್ಯಾರ್ಥಿಗಳು</span>
                    </div>`;
html = html.replace(
    /(<div class="sentiment-grid">)/,
    perspectiveBannerHTML + '\n                    $1'
);

// IMAGE 4: "Parent Assurance" section — banner with label
const assuranceBannerHTML = `
                    <div class="student-banner reveal" style="max-width:420px;">
                        <img src="website images/4.png" alt="Student with structured AI study plan" />
                        <span class="banner-label eo">Structured, safe AI learning</span>
                        <span class="banner-label ko kn-font">ವ್ಯವಸ್ಥಿತ, ಸುರಕ್ಷಿತ AI ಕಲಿಕೆ</span>
                    </div>`;
html = html.replace(
    /(ಪೋಷಕರ ಸಾಮಾನ್ಯ ಚಿಂತೆಗಳಿಗೆ ನೇರ[\s\S]*?ಉತ್ತರ\.<\/p>)\s*(<div class="aitem)/,
    '$1\n' + assuranceBannerHTML + '\n                    $2'
);

// IMAGE 5: Before enrollment countdown — prominent certification showcase
const certShowcaseHTML = `
                <div class="student-showcase reveal" style="margin-bottom:25px;">
                    <div class="student-card student-card-md" style="--delay:0.2s;">
                        <img src="website images/5.png" alt="Graduate with AI certification" />
                    </div>
                </div>`;
html = html.replace(
    /(<!-- COUNTDOWN -->)/,
    certShowcaseHTML + '\n            $1'
);

// ═══════════════════════════════════════════════════════
// STEP 6: Benefits section — add a 3-image showcase  
// ═══════════════════════════════════════════════════════
const benefitsImagesHTML = `
                    <div class="student-showcase reveal">
                        <div class="student-card student-card-sm" style="--delay:0s;">
                            <img src="website images/1.png" alt="AI study tools" />
                        </div>
                        <div class="student-card student-card-md" style="--delay:0.15s;">
                            <img src="website images/3.png" alt="Creative AI projects" />
                        </div>
                        <div class="student-card student-card-sm" style="--delay:0.3s;">
                            <img src="website images/2.png" alt="Coding with AI" />
                        </div>
                    </div>`;
html = html.replace(
    /(ಕೋರ್ಸ್ ಮುಗಿದ ಮೇಲೆ ನಿಮ್ಮ ಮಗುವಿಗೆ[\s\S]*?ಕೌಶಲ್ಯಗಳು\.<\/p>)\s*(<div class="benefits-grid">)/,
    '$1\n' + benefitsImagesHTML + '\n                    $2'
);


// ═══════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════
fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Orbit center moved inside .hero-in (centered on headline text)');
console.log('✅ Hero overflow clips orbiting icons at page edges');
console.log('✅ 5 student images placed as prominent cards/banners with glow borders');
console.log('✅ Color grading: contrast, saturate, brightness + gradient overlays');
console.log('✅ Hover effects: scale + enhanced glow');
console.log('✅ Float + glow-pulse animations on all image cards');
