const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The CSS is already there, we just need to replace the HTML block correctly.
// The previous replace failed because it didn't match the exact tabs/newlines/formatting in the file.
// Let's use a regex that matches the pricing div structure regardless of exact whitespace.

const newHtml = `
                            <div class="price-drop-anim reveal">
                                <div class="pd-old eo">Regular price <span class="strike-num">₹2,499</span></div>
                                <div class="pd-old ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="strike-num">₹2,499</span></div>
                                <div class="pd-new">
                                    <span class="bigprice">₹799</span>
                                    <span class="savepill glow-pulse" style="animation: breatheGlow 3s infinite">SAVE ₹1,700</span>
                                </div>
                            </div>
`;

// There are multiple pricing cards in the file (hero, maybe bottom CTA). Let's replace all of them.
// The pattern targets the old price divs followed by the bigprice div.
html = html.replace(
    /<div class="old eo">.*?<\/div>\s*<div class="old ko kn-font">.*?<\/div>\s*<div>\s*<span class="bigprice">.*?<\/span>\s*<span class="savepill">.*?<\/span>\s*<\/div>/g,
    newHtml.trim()
);

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ HTML pricing block replaced with animation block');
