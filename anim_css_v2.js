const fs = require('fs');
let data = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Add position: relative to .enrollbtn
let enrollMatch = data.match(/\.enrollbtn\s*\{[\s\S]*?transition:\s*opacity\s*\.15s;?[\s\r\n]*\}/);
if (enrollMatch) {
    let replaced = enrollMatch[0].replace(/\}[\s\r\n]*$/, '    position: relative;\n        }');
    data = data.replace(enrollMatch[0], replaced);
    console.log("Updated .enrollbtn");
}

// 2. Add position: relative to .btn-y
let btnyMatch = data.match(/\.btn-y\s*\{[\s\S]*?transition:\s*opacity\s*\.15s\s*,\s*transform\s*\.15s;?[\s\r\n]*\}/);
if (btnyMatch) {
    let replaced = btnyMatch[0].replace(/\}[\s\r\n]*$/, '    position: relative;\n        }');

    // Also append the keyframes and pseudo elements right after .btn-y
    let animationCSS = `

        @keyframes btnSignal {
            0% {
                inset: 0;
                opacity: 0.8;
                border-width: 2px;
            }
            100% {
                inset: -6px;
                opacity: 0;
                border-width: 1px;
            }
        }

        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            border: 2px solid var(--yellow);
            animation: btnSignal 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            pointer-events: none;
        }

        .btn-y::after, .enrollbtn::after {
            animation-delay: 1s;
        }
`;
    data = data.replace(btnyMatch[0], replaced + animationCSS);
    console.log("Updated .btn-y and added animations");
}

fs.writeFileSync('index - Copy.html', data);
console.log("Done");
