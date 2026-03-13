const fs = require('fs');

const data = fs.readFileSync('index - Copy.html', 'utf8');
const lines = data.split('\n');

let insertIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div id="tab-course" class="pg">')) {
        insertIdx = i + 1;
        break;
    }
}

let occurrences = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!-- ENROLL CTA -->')) {
        occurrences.push(i);
    }
}

let startIdx = -1;
if (occurrences.length >= 2) {
    startIdx = occurrences[1];
} else if (occurrences.length === 1) {
    startIdx = occurrences[0];
}

let endIdx = -1;
if (startIdx !== -1) {
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('</div><!-- /course -->')) {
            endIdx = i; // Do not include this closing div in the slice, it belongs to the tab container
            break;
        }
    }
}

if (insertIdx !== -1 && startIdx !== -1 && endIdx !== -1) {
    const ctaBlock = lines.slice(startIdx, endIdx);
    
    // Remove from original position
    lines.splice(startIdx, endIdx - startIdx);
    
    // Insert at new position
    // Since startIdx > insertIdx, removing it from below doesn't change insertIdx
    lines.splice(insertIdx, 0, ...ctaBlock);
    
    fs.writeFileSync('index - Copy.html', lines.join('\n'));
    console.log('Success');
} else {
    console.log('Failed:', {insertIdx, startIdx, endIdx, occurrences: occurrences.length});
}
