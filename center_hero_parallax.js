const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// Center <div style="text-align:left"> 
html = html.replace('<div style="text-align:left">', '<div style="text-align:center">');

// .hero h1
html = html.replace(
    /(\.hero\s*h1\s*\{[^}]*?text-align:\s*)left(\s*\})/,
    '$1center$2'
);

// .hero-sub
html = html.replace(
    /(\.hero-sub\s*\{[^}]*?text-align:\s*)left(\s*\})/,
    '$1center$2'
);

// .hero-animated
html = html.replace(
    /(\.hero-animated\s*\{[^}]*?text-align:\s*)left(\s*\})/,
    '$1center$2'
);

// .pcard
html = html.replace(
    /(\.pcard\s*\{[^}]*?text-align:\s*)left(\s*,[^\}]*\}|\s*\})/,
    '$1center$2'
);

// .batch-notice
html = html.replace(
    /(\.batch-notice\s*\{[^}]*?)(\})/,
    '$1    text-align: center;\n$2'
);

// .guar
html = html.replace(
    /(\.guar\s*\{[^}]*?text-align:\s*)left(\s*\})/,
    '$1center;\n            justify-content: center$2'
);

// .pills
html = html.replace(
    /(\.pills\s*\{[^}]*?)(\})/,
    '$1    justify-content: center;\n$2'
);

// .tags
html = html.replace(
    /(\.tags\s*\{[^}]*?)(\})/,
    '$1    justify-content: center;\n$2'
);

// Parallax
// Find the scroll event listener
const scrollListenerRegex = /(window\.addEventListener\('scroll',\s*function\s*\(\)\s*\{[\s\S]*?)(?=\}\);)/;
let match = html.match(scrollListenerRegex);
if (match) {
    let parallaxCode = `
            var grid = document.querySelector('.hero-grid');
            if (grid) {
                grid.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
            }
        `;
    if (!match[1].includes("grid.style.transform")) {
        html = html.replace(scrollListenerRegex, '$1' + parallaxCode);
    }
}

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('Centering and parallax applied.');
