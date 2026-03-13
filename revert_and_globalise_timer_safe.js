const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The user wants to revert the red UI price box and restore the old "gold rolling odometer" style box, 
// AND they want the actual global site timers (like the bottom sticky banner) to start at 4h 30m 52s.

// 1. Revert HTML 
const redHTMLRegex = /<div class="premium-price-box" id="ppbHero">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const goldRollingHTML = `                            <div class="premium-price-box" id="ppbHero">
                                <div class="ppb-top eo">Regular Price <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-top ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-main">
                                    <span class="ppb-currency">₹</span><span id="animatedPriceNum" class="ppb-num">2499</span>
                                    <span class="savepill ppb-save" id="animatedSavePill" style="animation: breatheGlow 3s infinite">SAVE ₹1,700</span>
                                </div>
                            </div>`;
html = html.replace(redHTMLRegex, goldRollingHTML);

// 2. JS Logics - Remove local red JS and restore local Gold Rolling JS
const badTimerJSRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*\/\*\s*4 hours, 30 mins, 52 seconds[\s\S]*?<\/script>/;
const goldRollingJS = `<script>
document.addEventListener('DOMContentLoaded', () => {
    const pNum = document.getElementById('animatedPriceNum');
    const pSave = document.getElementById('animatedSavePill');
    const pStrikes = document.querySelectorAll('.ppb-strike');
    const pBox = document.getElementById('ppbHero');
    if(!pNum || !pBox) return;
    let animatedp = false;
    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !animatedp) {
            animatedp = true;
            pNum.classList.add('counting');
            let startPrice = 2499;
            const targetPrice = 799;
            const duration = 1600; 
            const startTime = performance.now();
            function countEngine(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentPrice = Math.floor(startPrice - (startPrice - targetPrice) * easeOutExpo);
                pNum.innerText = currentPrice;
                if (progress < 1) {
                    requestAnimationFrame(countEngine);
                } else {
                    pNum.innerText = targetPrice;
                    pNum.classList.remove('counting');
                    pNum.classList.add('done');
                    pBox.classList.add('glowing');
                    if(pSave) pSave.classList.add('show');
                    if(pStrikes) pStrikes.forEach(s => s.classList.add('show-strike'));
                    setTimeout(() => {
                        pNum.style.transform = 'scale(1)';
                    }, 500);
                }
            }
            setTimeout(() => requestAnimationFrame(countEngine), 500);
        }
    }, { threshold: 0.2 });
    observer.observe(pBox);
});
</script>`;
html = html.replace(badTimerJSRegex, goldRollingJS);

// 3. Update the actual global timers to start from 4h 30m 52s (4 * 3600 * 1000 + 30 * 60 * 1000 + 52 * 1000 = 16252000 ms)
const regexTimer1 = /const DEADLINE = new Date\(\);\s*DEADLINE\.[^;]+;\s*DEADLINE\.[^;]+;\s*(?:DEADLINE\.[^;]+;\s*)?DEADLINE\.setHours\(\d+,\s*\d+,\s*\d+,\s*\d+\);/g;
const replacement1 = `const DEADLINE = new Date(new Date().getTime() + 16252000); // 4h 30m 52s`;
html = html.replace(regexTimer1, replacement1);

const regexTimer2 = /let end = new Date\(\);\s*end\.setHours\(23, 59, 59, 999\);/g;
const replacement2 = `let end = new Date(new Date().getTime() + 16252000);`;
html = html.replace(regexTimer2, replacement2);

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Reverted red timer back to Gold Rolling UI');
console.log('✅ Updated global timers to strictly 04:30:52 countdown');
