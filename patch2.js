const fs = require('fs');
let text = fs.readFileSync('index - Copy.html', 'utf8');

text = text.replace('position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%) translateY(20px) scale(0.8);',
    'display: inline-block; position: relative; margin-top: 18px; margin-bottom: 2px; transform: translateY(20px) scale(0.8); z-index: 10;');

text = text.replace('opacity: 1; transform: translateX(-50%) translateY(0) scale(1); animation: pulseSave 2.5s infinite 1s;',
    'opacity: 1; transform: translateY(0) scale(1); animation: pulseSave 2.5s infinite 1s;');

text = text.replace('0% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: translateX(-50%) scale(1); }',
    '0% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: scale(1); }');

text = text.replace('50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.7); transform: translateX(-50%) scale(1.05); }',
    '50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.7); transform: scale(1.05); }');

text = text.replace('100% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: translateX(-50%) scale(1); }',
    '100% { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: scale(1); }');

fs.writeFileSync('index - Copy.html', text, 'utf8');
console.log('Patch complete.');
