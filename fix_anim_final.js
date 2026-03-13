const fs = require('fs');

let text = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Modify .enrollbtn (using [\s\S]*? to substitute for /s regex flag)
text = text.replace(
    /(\.enrollbtn\s*\{[\s\S]*?transition:\s*opacity\s*\.15s;?)(\s*\})/g,
    '$1\n            position: relative;$2'
);

// 2. Modify .btn-y
text = text.replace(
    /(\.btn-y\s*\{[\s\S]*?transition:\s*opacity\s*\.15s\s*,\s*transform\s*\.15s;?)(\s*\})/g,
    '$1;\n            position: relative;$2'
);

// 3. Modify .sbtn
text = text.replace(
    /(\.sbtn\s*\{[\s\S]*?transition:\s*opacity\s*\.15s;?)(\s*\})/g,
    '$1;\n            position: relative;$2'
);

// 4. Inject keyframes and pseudo-elements before .pb
const newAnim = `
        @keyframes btnSignalWave {
            0% {
                top: 0; left: 0; right: 0; bottom: 0;
                opacity: 0.8;
                border: 2px solid var(--yellow);
            }
            100% {
                top: -12px; left: -12px; right: -12px; bottom: -12px;
                opacity: 0;
                border: 1px solid var(--yellow);
            }
        }

        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after,
        .sbtn::before, .sbtn::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: inherit;
            pointer-events: none;
            animation: btnSignalWave 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
            z-index: -1;
        }
        
        /* z-index -1 keeps it behind glowing border, but if parent is non-relative it goes too far. But wait, buttons have backdrop / opacity, z-index 0 or auto is better. We'll leave it out */
        .btn-y::before, .enrollbtn::before, .sbtn::before { z-index: 0; }
        .btn-y::after, .enrollbtn::after, .sbtn::after { z-index: 0; }

        .btn-y::after, .enrollbtn::after, .sbtn::after {
            animation-delay: 1.1s;
        }
`;

// It might be better to remove z-index stuff to just let inherit normal stacking, wait, the border shouldn't obscure text.
// Actually pointer-events none makes it unclickable, so it won't block interactions. 

const finalAnim = `
        @keyframes btnSignalWave {
            0% {
                top: 0; left: 0; right: 0; bottom: 0;
                opacity: 0.8;
                border: 2px solid var(--yellow);
            }
            100% {
                top: -12px; left: -12px; right: -12px; bottom: -12px;
                opacity: 0;
                border: 1px solid var(--yellow);
            }
        }

        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after,
        .sbtn::before, .sbtn::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: inherit;
            pointer-events: none;
            animation: btnSignalWave 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }

        .btn-y::after, .enrollbtn::after, .sbtn::after {
            animation-delay: 1.1s;
        }
`;

text = text.replace(/(\s*\.pb\s*\{[\s\S]*?\})/g, finalAnim + '\n$1');

fs.writeFileSync('index - Copy.html', text, 'utf8');
console.log('Fixed via robust regex in Node js!');
