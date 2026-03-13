const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. REWRITE gradientShift and .hl for a subtle, slower sweep
html = html.replace(
    /\.hero\s*h1\s*\.hl\s*\{[\s\S]*?\}/,
    `.hero h1 .hl {
            background: linear-gradient(135deg, #60A5FA, var(--teal), #60A5FA);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease-in-out infinite alternate;
        }`
);

// 2. REWRITE .floating-logos container
const floatingLogosRegex = /\.floating-logos\s*\{\s*position:\s*absolute;\s*inset:\s*0;\s*pointer-events:\s*none;\s*overflow:\s*hidden;\s*z-index:\s*0\s*\}/;

html = html.replace(floatingLogosRegex, `.floating-logos {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 750px;
            height: 750px;
            margin-top: -375px;
            margin-left: -375px;
            pointer-events: none;
            z-index: 0;
            border-radius: 50%;
        }`);

// 3. REWRITE the .fl-item:nth-child positions to create a perfect circle based on angle math
const childrenPositionsRegex = /\.fl-item:nth-child\(1\)[\s\S]*?\.fl-item:nth-child\(6\)[\s\S]*?\}/;

const circularPositions = `.fl-item:nth-child(1) { top: 50%; left: 100%; top: 50% !important; left: 100% !important; right: auto !important; }
        .fl-item:nth-child(2) { top: 93.3%; left: 75%; top: 93.3% !important; left: 75% !important; right: auto !important; }
        .fl-item:nth-child(3) { top: 93.3%; left: 25%; top: 93.3% !important; left: 25% !important; right: auto !important; }
        .fl-item:nth-child(4) { top: 50%; left: 0%; top: 50% !important; left: 0% !important; right: auto !important; }
        .fl-item:nth-child(5) { top: 6.7%; left: 25%; top: 6.7% !important; left: 25% !important; right: auto !important; }
        .fl-item:nth-child(6) { top: 6.7%; left: 75%; top: 6.7% !important; left: 75% !important; right: auto !important; }`;

html = html.replace(childrenPositionsRegex, circularPositions);

// 4. Update the counterRevolve to include translate(-50%, -50%) to perfectly center icons on orbit line
html = html.replace(
    /@keyframes\s*counterRevolve\s*\{[\s\S]*?\}/,
    `@keyframes counterRevolve {
            from { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
            to { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
        }`
);

// 5. Update media query for floating logos responsive resizing
html = html.replace(
    /@media\s*\(min-width:\s*481px\)\s*and\s*\(max-width:\s*767px\)\s*\{/,
    `@media (min-width: 481px) and (max-width: 767px) {
            .floating-logos { width: 450px; height: 450px; margin-top: -225px; margin-left: -225px; }`
);

// We should also inject a mobile breakpoint
html = html.replace(
    /<\/style>/,
    `
        @media (max-width: 480px) {
            .floating-logos { width: 340px; height: 340px; margin-top: -170px; margin-left: -170px; }
            .hero-in { padding-top: 30px; }
        }
    </style>`
);


fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Orbital icons constraints and gradient animation updated.');
