const fs = require('fs');
let data = fs.readFileSync('index - Copy.html', 'utf8');

// First, strip old keyframes if present
let badAnimRegex = /\@keyframes btnSignal\s*\{[\s\S]*?\.btn-y::after.*?\{[\s\S]*?animation-delay:\s*1s;\s*\}/g;
data = data.replace(badAnimRegex, '');

// Strip old bad properties
data = data.replace(/transition:([^;}]*?)\s+position:\s*relative\s*;/g, 'transition:$1;');
data = data.replace(/transition:([^;}]*?);\s*position:\s*relative\s*;/g, 'transition:$1;');

// For safety, strip previously added relative positioned if they were properly added somehow
data = data.replace(/\n\s*position:\s*relative;/g, '');


// Find block for .enrollbtn
let enrollRegex = /(\.enrollbtn\s*\{[^}]*?transition:\s*opacity\s*\.15s)(;?)(\s*\})/;
data = data.replace(enrollRegex, '$1;\n            position: relative;$3');

// Find block for .btn-y
let btnyRegex = /(\.btn-y\s*\{[^}]*?transition:\s*opacity\s*\.15s\s*,\s*transform\s*\.15s)(;?)(\s*\})/;
data = data.replace(btnyRegex, '$1;\n            position: relative;$3');

// Find block for .sbtn
let sbtnRegex = /(\.sbtn\s*\{[^}]*?transition:\s*opacity\s*\.15s)(;?)(\s*\})/;
// .sbtn does not have position relative by default. Let's add it.
data = data.replace(sbtnRegex, '$1;\n            position: relative;$3');


// New smooth fading multi-wave ripple
let newAnim = `

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

data = data.replace(/(\.sbtn\s*\{[^}]*\})/g, '$1' + newAnim);

fs.writeFileSync('index - Copy.html', data);
console.log('Fixed button animations!');
