const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The issue: if the element is already in the viewport on load (like in the hero section), 
// sometimes IntersectionObserver doesn't fire immediately or the .active class isn't appended right away.
// Let's remove the `.reveal.active` requirement so the animation just plays.

html = html.replace(/\.reveal\.active \.pd-old/g, '.price-drop-anim .pd-old');
html = html.replace(/\.reveal\.active \.strike-num::after/g, '.price-drop-anim .strike-num::after');
html = html.replace(/\.reveal\.active \.pd-new/g, '.price-drop-anim .pd-new');

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Removed .reveal.active dependency from price drop animation.');
