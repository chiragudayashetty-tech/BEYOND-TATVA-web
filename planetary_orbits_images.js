const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════
// STEP 1: Strip ALL old orbit-related CSS
// ═══════════════════════════════════════════════════════

// Remove @keyframes revolveBox
html = html.replace(/@keyframes\s*revolveBox\s*\{[^}]*\}/g, '/* old revolveBox removed */');

// Remove @keyframes counterRevolve  
html = html.replace(/@keyframes\s*counterRevolve\s*\{[\s\S]*?to\s*\{[^}]*\}\s*\}/g, '/* old counterRevolve removed */');

// Remove animation on .floating-logos (both with and without !important)
html = html.replace(/\.floating-logos\s*\{\s*animation:\s*revolveBox[^}]*\}/g, '/* old floating-logos animation removed */');

// Remove animation on .floating-logos .fl-item
html = html.replace(/\.floating-logos\s*\.fl-item\s*\{\s*animation:\s*counterRevolve[^}]*\}/g, '/* old fl-item animation removed */');

// Also strip any inline animation: revolveBox lines inside .floating-logos block
html = html.replace(/(\.floating-logos\s*\{[^}]*?)animation:\s*revolveBox[^;]*;?\s*!important;?/g, '$1');

// ═══════════════════════════════════════════════════════
// STEP 2: Rewrite .floating-logos container for 3D perspective
// ═══════════════════════════════════════════════════════

// Replace the .floating-logos block
html = html.replace(
    /\.floating-logos\s*\{[^}]*?pointer-events:\s*none;[^}]*?\}/,
    `.floating-logos {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 0;
            perspective: 900px;
            transform-style: preserve-3d;
        }`
);

// ═══════════════════════════════════════════════════════
// STEP 3: Rewrite .fl-item base and nth-child positions
// ═══════════════════════════════════════════════════════

// Remove old nth-child position rules with !important
html = html.replace(/\.fl-item:nth-child\(\d+\)\s*\{[^}]*!important[^}]*\}/g, '/* old nth-child removed */');

// Now inject the new planetary orbit CSS right before closing </style>
const planetaryCSS = `
        /* ═══ PLANETARY ORBIT SYSTEM ═══ */
        .fl-item {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: auto !important;
            transform-style: preserve-3d;
        }

        /* Each icon gets its own unique elliptical orbit */
        .fl-item:nth-child(1) {
            animation: orbit1 32s linear infinite !important;
        }
        .fl-item:nth-child(2) {
            animation: orbit2 38s linear infinite !important;
        }
        .fl-item:nth-child(3) {
            animation: orbit3 28s linear infinite !important;
        }
        .fl-item:nth-child(4) {
            animation: orbit4 42s linear infinite !important;
        }
        .fl-item:nth-child(5) {
            animation: orbit5 35s linear infinite !important;
        }
        .fl-item:nth-child(6) {
            animation: orbit6 30s linear infinite !important;
        }

        /* Orbit 1: Wide horizontal ellipse, slight tilt */
        @keyframes orbit1 {
            0%   { transform: rotate(0deg)   translateX(320px) rotateZ(0deg)   rotate(0deg); opacity: 0.9; }
            25%  { transform: rotate(90deg)  translateX(320px) rotateZ(-8deg)  rotate(-90deg); opacity: 0.7; }
            50%  { transform: rotate(180deg) translateX(320px) rotateZ(0deg)   rotate(-180deg); opacity: 0.5; }
            75%  { transform: rotate(270deg) translateX(320px) rotateZ(8deg)   rotate(-270deg); opacity: 0.7; }
            100% { transform: rotate(360deg) translateX(320px) rotateZ(0deg)   rotate(-360deg); opacity: 0.9; }
        }

        /* Orbit 2: Tighter orbit, tilted 30deg on X axis */
        @keyframes orbit2 {
            0%   { transform: rotateX(55deg) rotate(0deg)   translateX(260px) rotate(0deg)   rotateX(-55deg); opacity: 0.85; }
            50%  { transform: rotateX(55deg) rotate(180deg) translateX(260px) rotate(-180deg) rotateX(-55deg); opacity: 0.5; }
            100% { transform: rotateX(55deg) rotate(360deg) translateX(260px) rotate(-360deg) rotateX(-55deg); opacity: 0.85; }
        }

        /* Orbit 3: Steep vertical ellipse */
        @keyframes orbit3 {
            0%   { transform: rotateX(75deg) rotate(0deg)   translateX(290px) rotate(0deg)   rotateX(-75deg); opacity: 0.9; }
            50%  { transform: rotateX(75deg) rotate(180deg) translateX(290px) rotate(-180deg) rotateX(-75deg); opacity: 0.45; }
            100% { transform: rotateX(75deg) rotate(360deg) translateX(290px) rotate(-360deg) rotateX(-75deg); opacity: 0.9; }
        }

        /* Orbit 4: Wide & slow, slight Y tilt */
        @keyframes orbit4 {
            0%   { transform: rotateY(25deg) rotate(0deg)   translateX(370px) rotate(0deg)   rotateY(-25deg); opacity: 0.8; }
            50%  { transform: rotateY(25deg) rotate(180deg) translateX(370px) rotate(-180deg) rotateY(-25deg); opacity: 0.45; }
            100% { transform: rotateY(25deg) rotate(360deg) translateX(370px) rotate(-360deg) rotateY(-25deg); opacity: 0.8; }
        }

        /* Orbit 5: Combined X+Y tilt, medium distance */
        @keyframes orbit5 {
            0%   { transform: rotateX(40deg) rotateY(-20deg) rotate(0deg)   translateX(300px) rotate(0deg)   rotateY(20deg) rotateX(-40deg); opacity: 0.85; }
            50%  { transform: rotateX(40deg) rotateY(-20deg) rotate(180deg) translateX(300px) rotate(-180deg) rotateY(20deg) rotateX(-40deg); opacity: 0.4; }
            100% { transform: rotateX(40deg) rotateY(-20deg) rotate(360deg) translateX(300px) rotate(-360deg) rotateY(20deg) rotateX(-40deg); opacity: 0.85; }
        }

        /* Orbit 6: Nearly vertical, close-ish */
        @keyframes orbit6 {
            0%   { transform: rotateX(65deg) rotateZ(15deg) rotate(0deg)   translateX(280px) rotate(0deg)   rotateZ(-15deg) rotateX(-65deg); opacity: 0.9; }
            50%  { transform: rotateX(65deg) rotateZ(15deg) rotate(180deg) translateX(280px) rotate(-180deg) rotateZ(-15deg) rotateX(-65deg); opacity: 0.4; }
            100% { transform: rotateX(65deg) rotateZ(15deg) rotate(360deg) translateX(280px) rotate(-360deg) rotateZ(-15deg) rotateX(-65deg); opacity: 0.9; }
        }

        /* ═══ RESPONSIVE ORBITS ═══ */
        @media (max-width: 768px) {
            @keyframes orbit1 { 0% { transform: rotate(0deg) translateX(180px) rotate(0deg); } 25% { transform: rotate(90deg) translateX(180px) rotateZ(-8deg) rotate(-90deg); } 50% { transform: rotate(180deg) translateX(180px) rotate(-180deg); opacity:0.4; } 75% { transform: rotate(270deg) translateX(180px) rotateZ(8deg) rotate(-270deg); } 100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); } }
            @keyframes orbit2 { 0% { transform: rotateX(55deg) rotate(0deg) translateX(150px) rotate(0deg) rotateX(-55deg); } 50% { transform: rotateX(55deg) rotate(180deg) translateX(150px) rotate(-180deg) rotateX(-55deg); opacity:0.4; } 100% { transform: rotateX(55deg) rotate(360deg) translateX(150px) rotate(-360deg) rotateX(-55deg); } }
            @keyframes orbit3 { 0% { transform: rotateX(75deg) rotate(0deg) translateX(160px) rotate(0deg) rotateX(-75deg); } 50% { transform: rotateX(75deg) rotate(180deg) translateX(160px) rotate(-180deg) rotateX(-75deg); opacity:0.4; } 100% { transform: rotateX(75deg) rotate(360deg) translateX(160px) rotate(-360deg) rotateX(-75deg); } }
            @keyframes orbit4 { 0% { transform: rotateY(25deg) rotate(0deg) translateX(200px) rotate(0deg) rotateY(-25deg); } 50% { transform: rotateY(25deg) rotate(180deg) translateX(200px) rotate(-180deg) rotateY(-25deg); opacity:0.4; } 100% { transform: rotateY(25deg) rotate(360deg) translateX(200px) rotate(-360deg) rotateY(-25deg); } }
            @keyframes orbit5 { 0% { transform: rotateX(40deg) rotateY(-20deg) rotate(0deg) translateX(170px) rotate(0deg) rotateY(20deg) rotateX(-40deg); } 50% { transform: rotateX(40deg) rotateY(-20deg) rotate(180deg) translateX(170px) rotate(-180deg) rotateY(20deg) rotateX(-40deg); opacity:0.4; } 100% { transform: rotateX(40deg) rotateY(-20deg) rotate(360deg) translateX(170px) rotate(-360deg) rotateY(20deg) rotateX(-40deg); } }
            @keyframes orbit6 { 0% { transform: rotateX(65deg) rotateZ(15deg) rotate(0deg) translateX(150px) rotate(0deg) rotateZ(-15deg) rotateX(-65deg); } 50% { transform: rotateX(65deg) rotateZ(15deg) rotate(180deg) translateX(150px) rotate(-180deg) rotateZ(-15deg) rotateX(-65deg); opacity:0.4; } 100% { transform: rotateX(65deg) rotateZ(15deg) rotate(360deg) translateX(150px) rotate(-360deg) rotateZ(-15deg) rotateX(-65deg); } }
        }
        @media (max-width: 480px) {
            @keyframes orbit1 { 0% { transform: rotate(0deg) translateX(120px) rotate(0deg); } 50% { transform: rotate(180deg) translateX(120px) rotate(-180deg); opacity:0.3; } 100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
            @keyframes orbit2 { 0% { transform: rotateX(55deg) rotate(0deg) translateX(100px) rotate(0deg) rotateX(-55deg); } 50% { transform: rotateX(55deg) rotate(180deg) translateX(100px) rotate(-180deg) rotateX(-55deg); opacity:0.3; } 100% { transform: rotateX(55deg) rotate(360deg) translateX(100px) rotate(-360deg) rotateX(-55deg); } }
            @keyframes orbit3 { 0% { transform: rotateX(75deg) rotate(0deg) translateX(110px) rotate(0deg) rotateX(-75deg); } 50% { transform: rotateX(75deg) rotate(180deg) translateX(110px) rotate(-180deg) rotateX(-75deg); opacity:0.3; } 100% { transform: rotateX(75deg) rotate(360deg) translateX(110px) rotate(-360deg) rotateX(-75deg); } }
            @keyframes orbit4 { 0% { transform: rotateY(25deg) rotate(0deg) translateX(135px) rotate(0deg) rotateY(-25deg); } 50% { transform: rotateY(25deg) rotate(180deg) translateX(135px) rotate(-180deg) rotateY(-25deg); opacity:0.3; } 100% { transform: rotateY(25deg) rotate(360deg) translateX(135px) rotate(-360deg) rotateY(-25deg); } }
            @keyframes orbit5 { 0% { transform: rotateX(40deg) rotateY(-20deg) rotate(0deg) translateX(115px) rotate(0deg) rotateY(20deg) rotateX(-40deg); } 50% { transform: rotateX(40deg) rotateY(-20deg) rotate(180deg) translateX(115px) rotate(-180deg) rotateY(20deg) rotateX(-40deg); opacity:0.3; } 100% { transform: rotateX(40deg) rotateY(-20deg) rotate(360deg) translateX(115px) rotate(-360deg) rotateY(20deg) rotateX(-40deg); } }
            @keyframes orbit6 { 0% { transform: rotateX(65deg) rotateZ(15deg) rotate(0deg) translateX(100px) rotate(0deg) rotateZ(-15deg) rotateX(-65deg); } 50% { transform: rotateX(65deg) rotateZ(15deg) rotate(180deg) translateX(100px) rotate(-180deg) rotateZ(-15deg) rotateX(-65deg); opacity:0.3; } 100% { transform: rotateX(65deg) rotateZ(15deg) rotate(360deg) translateX(100px) rotate(-360deg) rotateZ(-15deg) rotateX(-65deg); } }
            .fl-item { width: 36px !important; height: 36px !important; }
            .fl-item img { width: 18px !important; height: 18px !important; }
        }

        /* ═══ STUDENT IMAGES ═══ */
        .student-img-wrap {
            text-align: center;
            margin: 30px auto 10px;
            max-width: 100%;
        }
        .student-img-wrap img {
            max-width: 340px;
            width: 100%;
            height: auto;
            filter: drop-shadow(0 8px 24px rgba(0,0,0,.15));
            border-radius: 12px;
        }
        .student-img-hero {
            max-width: 380px !important;
            margin-top: 20px;
        }
        .student-img-section {
            max-width: 300px !important;
        }
        @media (max-width: 480px) {
            .student-img-wrap img { max-width: 240px; }
            .student-img-hero { max-width: 260px !important; }
            .student-img-section { max-width: 200px !important; }
        }
`;

// Insert before the last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + planetaryCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);


// ═══════════════════════════════════════════════════════
// STEP 4: Insert student images at strategic locations
// ═══════════════════════════════════════════════════════

// Image 1: Hero section — after the guarantee box (</div> closing .guar)
const heroImageHTML = `
                        <div class="student-img-wrap reveal">
                            <img src="website images/1.png" alt="Student studying with AI tools" class="student-img-hero" />
                        </div>`;
html = html.replace(
    /(<div class="guar">[\s\S]*?<\/div>\s*<\/div>)\s*(<\/div>\s*<\/div>\s*<\/section>)/,
    '$1\n' + heroImageHTML + '\n                    $2'
);

// Image 2: "What Students Gain" section — after the subtitle paragraph, before benefits-grid
const benefitsImageHTML = `
                    <div class="student-img-wrap reveal">
                        <img src="website images/2.png" alt="Student learning AI on laptop" class="student-img-section" />
                    </div>`;
html = html.replace(
    /(ಕೋರ್ಸ್ ಮುಗಿದ ಮೇಲೆ ನಿಮ್ಮ ಮಗುವಿಗೆ[\s\S]*?<\/p>)\s*(<div class="benefits-grid">)/,
    '$1\n' + benefitsImageHTML + '\n                    $2'
);

// Image 4: "Parent Assurance" section — after the subtitle, before first aitem
const parentImageHTML = `
                    <div class="student-img-wrap reveal">
                        <img src="website images/4.png" alt="Student studying with AI schedule" class="student-img-section" />
                    </div>`;
html = html.replace(
    /(ಪೋಷಕರ ಸಾಮಾನ್ಯ ಚಿಂತೆಗಳಿಗೆ ನೇರ[\s\S]*?ಉತ್ತರ\.<\/p>)\s*(<div class="aitem)/,
    '$1\n' + parentImageHTML + '\n                    $2'
);

// Image 5: Near the enrollment CTA in the course tab — after "What You Get" section title  
const certImageHTML = `
                    <div class="student-img-wrap reveal">
                        <img src="website images/5.png" alt="Student with AI certification" class="student-img-section" />
                    </div>`;
// Insert near the countdown/enroll section at bottom of course tab. Find COUNTDOWN comment
html = html.replace(
    /(<!-- COUNTDOWN -->)/,
    certImageHTML + '\n            $1'
);

// Image 3: In the "Parent Perspectives" section — after subtitle
const creativeImageHTML = `
                    <div class="student-img-wrap reveal">
                        <img src="website images/3.png" alt="Student creating with AI tools" class="student-img-section" />
                    </div>`;
html = html.replace(
    /(ಪೋಷಕರನ್ನು ಕ್ರಿಯೆಗೆ ಪ್ರೇರೇಪಿಸುವ[\s\S]*?ಚಿಂತೆಗಳು\.<\/p>)\s*(<div class="sentiment-grid">)/,
    '$1\n' + creativeImageHTML + '\n                    $2'
);


// ═══════════════════════════════════════════════════════
// STEP 5: Write the result
// ═══════════════════════════════════════════════════════
fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Planetary orbits injected (6 unique elliptical paths)');
console.log('✅ 5 student images placed across the site');
console.log('✅ Responsive CSS added for mobile');
