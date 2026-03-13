const fs = require('fs');

const goodFile = fs.readFileSync('index - Copy - Copy.html', 'utf8');
let badFile = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Manually slice the scripts out from the good file.
// The scripts start right after `<div class="ft-r eo">` ending and `</div>` endings right before `<script>`.
const startIdx = goodFile.indexOf('<script>\n        let lang = \'en\';');
const endIdx = goodFile.indexOf('</body>');

if (startIdx !== -1 && endIdx !== -1 && !badFile.includes('function chooseLang')) {
    const originalScripts = goodFile.substring(startIdx, endIdx);

    // Inject right before the closing body tag
    badFile = badFile.replace('</body>', originalScripts + '\n</body>');
    fs.writeFileSync('index - Copy.html', badFile, 'utf8');
    console.log('✅ Restored missing original scripts!');
} else {
    console.log('Scripts already present or could not find the exact start index.');
}
