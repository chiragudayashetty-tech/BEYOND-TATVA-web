const fs = require('fs');

const goodFile = fs.readFileSync('index - Copy - Copy.html', 'utf8');
let badFile = fs.readFileSync('index - Copy.html', 'utf8');

// Match everything from <script>\s*let lang = 'en'; up to </body>
const match = goodFile.match(/<script>\s*let lang = 'en';[\s\S]*?(?=<\/body>)/);

if (match && !badFile.includes("let lang = 'en';")) {
    const scriptsToInject = match[0];

    // Inject right before </body>
    badFile = badFile.replace('</body>', scriptsToInject + '\n</body>');
    fs.writeFileSync('index - Copy.html', badFile, 'utf8');
    console.log('✅ Successfully matched and restored the missing JavaScript logic!');
} else {
    console.log('Failed to match or already injected.');
}
