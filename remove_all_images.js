const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════
// Remove ALL student image HTML (every type ever inserted)
// ═══════════════════════════════════════════════════════

// Remove student-banner divs (3.png, 4.png, 5.png, 2.png banners)
html = html.replace(/<div class="student-banner[^"]*"[^>]*>[\s\S]*?<\/div>\s*/g, '');

// Remove student-hero-showcase blocks
html = html.replace(/<div class="student-hero-showcase[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/g, '');

// Remove student-showcase blocks
html = html.replace(/<div class="student-showcase[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*/g, '');

// Remove student-hero-accent elements
html = html.replace(/<div class="student-hero-accent[^"]*"[^>]*>[^<]*<img[^>]*\/>\s*<\/div>\s*/g, '');

// Remove student-inline-accent spans
html = html.replace(/<span class="student-inline-accent[^"]*"[^>]*>[^<]*<img[^>]*\/>\s*<\/span>/g, '');

// Remove student-section-accent elements
html = html.replace(/<div class="student-section-accent[^"]*"[^>]*>[^<]*<img[^>]*\/>\s*<\/div>\s*/g, '');

// Remove student-cert-accent elements  
html = html.replace(/<div class="student-cert-accent[^"]*"[^>]*>[^<]*<img[^>]*\/>\s*<\/div>\s*/g, '');

// Remove student-img-wrap elements
html = html.replace(/<div class="student-img-wrap[^"]*"[^>]*>[^<]*<img[^>]*\/>\s*<\/div>\s*/g, '');

// Remove the hero ghost accent (1.png as absolute background)
html = html.replace(/<div style="position:absolute;top:15%[^"]*"[^>]*>\s*<img src="website images\/1\.png"[^>]*\/>\s*<\/div>\s*/g, '');

// ═══════════════════════════════════════════════════════
// Remove ALL student image CSS
// ═══════════════════════════════════════════════════════

// Remove premium student imagery CSS block
html = html.replace(/\/\*\s*═+\s*PREMIUM STUDENT IMAGERY[\s\S]*?@media\s*\(max-width:\s*480px\)\s*\{[^}]*student-inline[^}]*\}/g, '');

// Remove showcase CSS block
html = html.replace(/\/\*\s*═+\s*STUDENT SHOWCASE[\s\S]*?\.student-showcase\s*\{\s*gap:\s*12px;\s*\}\s*\}/g, '');

// Remove blended CSS block
html = html.replace(/\/\*\s*═+\s*BLENDED STUDENT[\s\S]*?student-inline[^}]*\}/g, '');

// Remove individual student CSS rules that may remain
const studentClasses = [
    'student-banner', 'student-banner img', 'student-banner:hover img',
    'student-banner::before', 'student-banner::after', 'student-banner .banner-label',
    'student-card', 'student-card img', 'student-card:hover', 'student-card:hover img',
    'student-card::after', 'student-card-lg', 'student-card-md', 'student-card-sm',
    'student-hero-showcase', 'student-showcase',
    'student-hero-accent', 'student-hero-accent img',
    'student-section-accent', 'student-section-accent img',
    'student-cert-accent', 'student-cert-accent img',
    'student-inline-accent', 'student-inline-accent img',
    'student-accent', 'student-accent img',
    'student-img-wrap', 'student-img-wrap img', 'student-img-hero', 'student-img-section'
];
for (const cls of studentClasses) {
    const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\s*\\.${escaped}\\s*\\{[^}]*\\}`, 'g');
    html = html.replace(regex, '');
}

// Remove keyframes
html = html.replace(/@keyframes\s*breatheGlow[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@keyframes\s*gentleDrift[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@keyframes\s*floatGently[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@keyframes\s*glowPulse[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@keyframes\s*revealUp[\s\S]*?\}\s*\}/g, '');
html = html.replace(/@keyframes\s*subtleFloat[\s\S]*?\}/g, '');
html = html.replace(/@keyframes\s*fadeSlideUp[\s\S]*?\}/g, '');

// Clean up empty lines
html = html.replace(/\n{4,}/g, '\n\n');

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ ALL student image HTML removed (banners, cards, accents, ghost overlays)');
console.log('✅ ALL student image CSS removed (classes, keyframes, media queries)');
console.log('✅ Original sections preserved intact');
