const fs = require('fs');

const goodContent = fs.readFileSync('index - Copy - Copy.html', 'utf8');
let badContent = fs.readFileSync('index - Copy.html', 'utf8');

// The scripts start EXACTLY after `<div class="fcopy">© 2025 Beyond Tatva. All rights reserved.</div>\n        </footer>\n\n    </div><!-- /site -->`
// And they end right before `</body>`
const scriptsSegmentMatch = goodContent.match(/<\/div>\s*<!-- \/site -->\s*(<script>[\s\S]*?)<\/body>/i);

if (scriptsSegmentMatch && scriptsSegmentMatch[1]) {
    const scripts = scriptsSegmentMatch[1];

    // Inject right before the existing <script> timer logic we added, or right before </body>
    // It's safest to inject it right after `</div><!-- /site -->` since that's where it naturally lived.
    if (!badContent.includes("function chooseLang")) {
        badContent = badContent.replace(/<\/div><!-- \/site -->/, '</div><!-- /site -->\n\n' + scripts);
        fs.writeFileSync('index - Copy.html', badContent, 'utf8');
        console.log('✅ Found and restored the original script chunk block.');
    } else {
        console.log('Scripts already there?');
    }
} else {
    console.log('Could not reliably find the missing chunk.');
}
