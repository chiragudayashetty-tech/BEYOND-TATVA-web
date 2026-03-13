const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The user wants to revert the red UI price box and restore the old "gold rolling odometer" style box, 
// AND they want the actual global site timers (like the bottom sticky banner) to start at 4h 30m 52s.

// 1. Revert HTML 
const redHTML = /<div class="premium-price-box" id="ppbHero">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const goldRollingHTML = `                            <div class="premium-price-box" id="ppbHero">
                                <div class="ppb-top eo">Regular Price <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-top ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-main">
                                    <span class="ppb-currency">₹</span><span id="animatedPriceNum" class="ppb-num">2499</span>
                                    <span class="savepill ppb-save" id="animatedSavePill" style="animation: breatheGlow 3s infinite">SAVE ₹1,700</span>
                                </div>
                            </div>`;
html = html.replace(redHTML, goldRollingHTML);

// 2. Revert CSS
const redCSS = /\/\*\s*═+\s*PREMIUM RED COUNTDOWN UI[\s\S]*?\}\s*\}/;
const ultraPremiumCSS = `        /* ═══ PREMIUM COUNTDOWN PRICE (ULTRA POLISHED) ═══ */
        .premium-price-box {
            text-align: center;
            margin: 15px 0 25px;
            padding: 22px 18px;
            background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(255, 214, 0, 0.03);
            position: relative;
            overflow: hidden;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
            transition: box-shadow 0.8s ease, transform 0.4s ease;
        }
        .premium-price-box::before {
            content:''; position:absolute; inset: -50%;
            background: radial-gradient(circle at center, rgba(255, 214, 0, 0.12) 0%, transparent 50%);
            opacity: 0; transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none; mix-blend-mode: screen;
        }
        .premium-price-box.glowing {
            transform: translateY(-2px);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 40px rgba(255, 214, 0, 0.15);
        }
        .premium-price-box.glowing::before { opacity: 1; }
        .ppb-top { font-size: 0.95rem; color: #94A3B8; margin-bottom: 10px; font-weight: 500; letter-spacing: 0.5px; }
        .ppb-strike { position: relative; color: #E2E8F0; margin-left: 6px; font-weight: 600; }
        .ppb-strike::after {
            content: ''; position: absolute; left: -6px; right: -6px; top: 50%; height: 2.5px;
            background: #FF3B30; border-radius: 2px; transform: rotate(-10deg) scaleX(0); transform-origin: left center;
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 0 8px rgba(255, 59, 48, 0.6);
        }
        .ppb-strike.show-strike::after { transform: rotate(-10deg) scaleX(1.05); }
        .ppb-main { display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; }
        .ppb-currency {
            font-size: 2.4rem; font-weight: 800;
            background: linear-gradient(135deg, #FFD700 0%, #F59E0B 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            margin-top: -6px; transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ppb-num {
            font-size: 4.2rem; font-weight: 900; color: #FFFFFF; line-height: 1;
            font-variant-numeric: tabular-nums; letter-spacing: -2px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: transform 0.1s, color 0.4s, text-shadow 0.4s; will-change: transform, color, text-shadow;
        }
        .ppb-num.counting { color: #F8FAFC; transform: scale(1.03); text-shadow: 0 0 25px rgba(255,255,255,0.3); }
        .ppb-num.done {
            background: linear-gradient(135deg, #FFD700 0%, #F59E0B 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            transform: scale(1.12); filter: drop-shadow(0 0 20px rgba(255, 214, 0, 0.5));
        }
        .ppb-save {
            opacity: 0; transform: scale(0.4) translateX(-40px);
            transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); margin-top: 5px; box-shadow: 0 0 20px rgba(39, 224, 196, 0);
        }
        .ppb-save.show { opacity: 1; transform: scale(1.1) translateX(0); box-shadow: 0 0 20px rgba(39, 224, 196, 0.4); }
        @media (max-width: 480px) {
            .ppb-num { font-size: 3.4rem; }
            .ppb-currency { font-size: 2rem; }
            .premium-price-box { padding: 18px 12px; margin: 10px 0 20px; }
            .ppb-save.show { transform: scale(1) translateX(0); }
        }`;
html = html.replace(redCSS, ultraPremiumCSS);

// 3. JS Logics - Remove local red JS and restore local Gold Rolling JS
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
                if (progress < 1) requestAnimationFrame(countEngine);
                else {
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

// 4. Update the actual global timers to start from 4h 30m 52s
// Original global logic usually was: `const DEADLINE = new Date(); ... DEADLINE.setHours(23, 59, 59, 999);`
html = html.replace(/const DEADLINE = new Date\(\);\s*DEADLINE\.[^;]+;\s*DEADLINE\.[^;]+;\s*(?:DEADLINE\.[^;]+;\s*)?DEADLINE\.setHours\(\d+,\s*\d+,\s*\d+,\s*\d+\);/g,
    \`const DEADLINE = new Date(new Date().getTime() + ((4 * 3600) + (30 * 60) + 52) * 1000); // 4h 30m 52s from now\`);

// Also look out for `let end = new Date(); ` from any other timers
html = html.replace(/let end = new Date\(\);\s*end\.setHours\(23, 59, 59, 999\);/g, 
\`let end = new Date(new Date().getTime() + ((4 * 3600) + (30 * 60) + 52) * 1000);\`);

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Reverted red timer back to Gold Rolling UI');
console.log('✅ Updated global timers to strictly 04:30:52 countdown');
