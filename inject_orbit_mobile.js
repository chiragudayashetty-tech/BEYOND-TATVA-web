const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Re-add Orbit Animation CSS
const orbitCSS = `
        @keyframes revolveBox {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes counterRevolve {
            from { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
            to { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
        }

        .floating-logos {
            animation: revolveBox 45s linear infinite;
        }

        .floating-logos .fl-item {
            animation: counterRevolve 45s linear infinite !important;
        }
`;

// Insert it right before the media queries block
html = html.replace(/@media\s*\(min-width:\s*481px\)/, orbitCSS + '\n        @media (min-width: 481px)');

// 2. Fix mobile alignments (center .hero-sub, padding for sections)
const mobileFixes = `
        @media (max-width: 480px) {
            .hero-sub {
                text-align: center;
                margin-left: auto;
                margin-right: auto;
            }
            .pcard {
                margin-left: 10px;
                margin-right: 10px;
            }
            .value-stack {
                margin-left: 0;
                margin-right: 0;
                padding-left: 15px;
                padding-right: 15px;
            }
            .value-stack h3 {
                text-align: center;
            }
            .wstep {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            .wtime {
                align-self: flex-start;
            }
            .sitem {
                flex-direction: column;
                gap: 15px;
            }
            .snum {
                margin: 0 auto;
            }
            .stitle, .sdesc {
                text-align: center;
            }
            .spill {
                margin: 5px auto 0;
            }
        }
`;

html = html.replace(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?\}/, match => {
    // Insert into the existing mobile block
    return match.replace(/}\s*$/, `
            .hero-sub { text-align: center; padding: 0 10px; }
            .wstep { flex-direction: column; align-items: flex-start; gap: 10px; }
            .wtime { align-self: flex-start; }
            .sitem { flex-direction: column; text-align: center; }
            .snum { margin: 0 auto 10px auto; }
            .stitle { justify-content: center; flex-wrap: wrap; }
            .pcard { padding: 25px 15px; }
        }`);
});


fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Orbit keyframes and mobile CSS fixes injected.');
