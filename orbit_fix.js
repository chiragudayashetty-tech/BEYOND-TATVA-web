const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Fix .pills CSS
html = html.replace(
    /margin-bottom:\s*20px\s*justify-content:\s*center;\s*\}/,
    'margin-bottom: 20px;\n        }'
);

// We need to ensure we don't have double flex-wrap
html = html.replace(/flex-wrap:\s*wrap;\s*flex-wrap:\s*wrap;/g, 'flex-wrap: wrap;');

// 2. Remove the crazy floatingLogos parallax from scroll listener
const crazyParallax = /if\s*\(floatingLogos\)\s*\{\s*\/\/ Scatter floating logos on scroll\s*floatingLogos\.forEach[\s\S]*?\}\s*\}/;
html = html.replace(crazyParallax, '');

// 3. Add Orbit Animation CSS
const orbitCSS = `
        @keyframes revolveBox {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes counterRevolve {
            from { transform: rotate(360deg) scale(1); }
            to { transform: rotate(0deg) scale(1); }
        }

        .floating-logos {
            transform-origin: center center;
            animation: revolveBox 45s linear infinite;
        }

        .floating-logos .fl-item {
            /* Force counter-rotation so icons don't go upside down */
            animation: counterRevolve 45s linear infinite !important;
        }
`;

// Inject before </style> or right after .floating-logos { ... }
html = html.replace(/(\.floating-logos[\s\S]*?pointer-events:\s*none;\s*z-index:\s*0;\s*\})/, '$1\n' + orbitCSS);


fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Orbital icons and pill spacing patched.');
