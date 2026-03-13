const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Center the tying animation text container explicitly
html = html.replace(
    /(\.hero-animated\s*\{[^}]*?text-align:\s*)left(\s*;\s*margin-bottom:[^}]*\})/,
    '$1center$2'
);

// 2. Ensure flex row elements for pills are centered
html = html.replace(
    /(\.pills\s*\{[^}]*?display:\s*flex;)/,
    '$1\n            justify-content: center;\n            flex-wrap: wrap;'
);

// 3. Make the highlight gradient animated
const animatedGradientCSS = `
        .hl {
            background: linear-gradient(90deg, #27e0c4, #0a5bff, #27e0c4);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s linear infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
`;

// Inject this right before the original .hl or replace it entirely
html = html.replace(/(\.hl\s*\{[^}]*\})/, animatedGradientCSS);

// 4. Crazy Parallax Animation
// We will modify the recent scroll listener to do more dramatic multi-element parallax
const newParallax = `
            var grid = document.querySelector('.hero-grid');
            var heroText = document.querySelector('.hero-in');
            var floatingLogos = document.querySelectorAll('.fl-item');
            
            if (grid) {
                // Crazy background warp
                grid.style.transform = 'translateY(' + (window.scrollY * 0.6) + 'px) scale(' + (1 + window.scrollY * 0.001) + ')';
                grid.style.opacity = 1 - (window.scrollY * 0.002);
            }
            if (heroText) {
                // Smooth text drop
                heroText.style.transform = 'translateY(' + (window.scrollY * 0.25) + 'px)';
            }
            if (floatingLogos) {
                // Scatter floating logos on scroll
                floatingLogos.forEach((logo, index) => {
                    let speed = (index % 2 === 0 ? 0.8 : -0.5);
                    let rotate = window.scrollY * (index % 2 === 0 ? 0.1 : -0.1);
                    logo.style.transform = 'translateY(' + (window.scrollY * speed) + 'px) rotate(' + rotate + 'deg)';
                });
            }
`;

const scrollRegex = /(window\.addEventListener\('scroll',\s*function\s*\(\)\s*\{)[\s\S]*?(if\s*\(window\.scrollY)/;
html = html.replace(scrollRegex, '$1\n' + newParallax + '\n            $2');


fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Centering fixes, gradient animation, and crazy parallax applied successfully.');
