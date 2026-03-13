const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');
const newBlock = fs.readFileSync('ui_block.txt', 'utf8');

const regex = /<div class="old eo">Regular price ₹2,499<\/div>[\s\S]*?<div><span class="bigprice">₹799<\/span><span class="savepill">SAVE ₹1,700<\/span><\/div>/;

if (regex.test(html)) {
    html = html.replace(regex, newBlock);

    // Also inject the global timer fix!
    // Original global logic usually was: `const DEADLINE = new Date(); ... DEADLINE.setHours(23, 59, 59, 999);`
    html = html.replace(/const DEADLINE = new Date\(\);\s*DEADLINE\.[^;]+;\s*DEADLINE\.[^;]+;\s*(?:DEADLINE\.[^;]+;\s*)?DEADLINE\.setHours\(\d+,\s*\d+,\s*\d+,\s*\d+\);/g,
        `const DEADLINE = new Date(new Date().getTime() + ((4 * 3600) + (30 * 60) + 52) * 1000); // 4h 30m 52s from now`);

    // Format stCD appropriately:
    html = html.replace(/var st = document.getElementById\('stCD'\); if \(st\) st\.textContent = String\(d\) \+ 'd ' \+ String\(h\).padStart\(2, '0'\) \+ 'h';/g,
        `var st = document.getElementById('stCD'); if (st) st.textContent = String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';`);

    fs.writeFileSync('index - Copy.html', html, 'utf8');
    console.log("SUCCESS: Replaced hero UI and locked global timers!");
} else {
    console.log("ERROR: Couldn't find the target old HTML block using RegExp.");
}
