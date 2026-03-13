const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The CSS we want to replace
const targetRegex = /\.ppb-save\s*\{[\s\S]*?@keyframes pulseSave\s*\{[\s\S]*?\}/;

const replacement = \`.ppb-save {
    display: inline-block; position: relative; margin-top: 18px; margin-bottom: 2px; transform: translateY(20px) scale(0.8);
    background: linear-gradient(90deg, #10B981, #059669); color: #fff; padding: 6px 20px;
    border-radius: 20px; font-size: 0.85rem; font-weight: 800; letter-spacing: 1px;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); opacity: 0; pointer-events: none; border: 1px solid rgba(255,255,255,0.25);
    transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10;
}
.ppb-save.show {
    opacity: 1; transform: translateY(0) scale(1); animation: pulseSave 2.5s infinite 1s;
}
@keyframes shineSweep { 0% { left: -100% } 20% { left: 200% } 100% { left: 200% } }
@keyframes pulseSave {
    0% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: scale(1); }
    50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.7); transform: scale(1.05); }
    100% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: scale(1); }
}\`;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, replacement);
    fs.writeFileSync('index - Copy.html', html, 'utf8');
    console.log("SUCCESS: Replaced .ppb-save CSS.");
} else {
    console.log("ERROR: Could not find .ppb-save block.");
}
