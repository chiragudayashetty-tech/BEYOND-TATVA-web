const fs = require('fs');

let html = fs.readFileSync('index - Copy.html', 'utf8');

const brokenScrollRegex = /\/\*\s*──\s*STICKY\s*BAR\s*─────────────────────\s*\*\/[\s\S]*?\}\s*\);\s*\/\*\s*──\s*CONTACT\s*FORM\s*───────────────────\s*\*\//;

const fixedScrollBlock = `/* ── STICKY BAR ───────────────────── */
        window.addEventListener('scroll', function () {

            var grid = document.querySelector('.hero-grid');
            var heroText = document.querySelector('.hero-in');
            
            if (grid) {
                // Crazy background warp
                grid.style.transform = 'translateY(' + (window.scrollY * 0.6) + 'px) scale(' + (1 + window.scrollY * 0.001) + ')';
                grid.style.opacity = 1 - (window.scrollY * 0.002);
            }
            if (heroText) {
                // Smooth text drop
                heroText.style.transform = 'translateY(' + (window.scrollY * 0.25) + 'px)';
            }
            
            var bar = document.getElementById('stickyBar');
            if (!bar) return;
            if (window.scrollY > 600) bar.classList.add('up');
            else bar.classList.remove('up');
        });

        /* ── CONTACT FORM ─────────────────── */`;

if (brokenScrollRegex.test(html)) {
    html = html.replace(brokenScrollRegex, fixedScrollBlock);
    fs.writeFileSync('index - Copy.html', html, 'utf8');
    console.log("Successfully fixed the JS syntax error in the scroll listener.");
} else {
    console.log("Could not find the broken block to replace.");
}
