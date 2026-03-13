const fs = require('fs');

const goodFile = fs.readFileSync('index - Copy - Copy.html', 'utf8');
let badFile = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Extract everything right after the ticker up to </body> from the good file
// This includes the main script, the typewriter effect, and the scroll reveals.
const scriptMatch = goodFile.match(/(<script>[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>\s*)<\/body>/);

if (scriptMatch && scriptMatch[1]) {
    const originalScripts = scriptMatch[1];

    // 2. We accidentally replaced this entire block in index - Copy.html.
    // Let's first ensure we haven't already restored it
    if (!badFile.includes('function chooseLang')) {
        // Find the current </body> and inject the original scripts BEFORE our timer script
        // Actually our timer script is already there, let's just append the original scripts right before the timer script or </body>

        badFile = badFile.replace(/(<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*\/\*\s*4 hours, 30 mins, 52 seconds)/, originalScripts + '\n$1');

        fs.writeFileSync('index - Copy.html', badFile, 'utf8');
        console.log('✅ Restored missing original scripts (Language Picker, Tabs, Typing, scroll)');
    } else {
        console.log('Scripts already seem to be present.');
    }
} else {
    console.log('Could not find original scripts in backup');
}
