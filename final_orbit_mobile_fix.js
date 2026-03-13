const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Double-check and force the animation onto the .floating-logos container
// Some CSS selectors or !important overrides might be preventing it from spinning
html = html.replace(
    /\.floating-logos\s*\{/,
    `.floating-logos {
            animation: revolveBox 45s linear infinite !important;`
);

// 2. Add extra responsive fixes to ensure nothing clashes on mobile
const extraMobileFixes = `
            .floating-logos {
                width: 320px !important;
                height: 320px !important;
                margin-top: -160px !important;
                margin-left: -160px !important;
            }
            .hero-grid {
                background-size: 35px 35px;
            }
            .fl-item {
                width: 38px !important;
                height: 38px !important;
            }
            .fl-item img {
                width: 18px !important;
                height: 18px !important;
            }
            .hero h1 { font-size: 2rem; line-height: 1.15; padding: 0 10px; }
            .hero-sub { padding: 0 15px; font-size: 0.95rem; }
`;

html = html.replace(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?\}/, match => {
    return match.replace(/}\s*$/, extraMobileFixes + '\n        }');
});

// Write to file
fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Final orbit and mobile optimizations bound to HTML.');
