const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Remove the old price drop CSS
html = html.replace(/\/\*\s*═+\s*PRICE DROP ANIMATION[\s\S]*?@keyframes\s+priceDropIn.*?\}\s*\}/g, '');

// 2. Add the new premium Countdown CSS
const newCSS = `
        /* ═══ PREMIUM COUNTDOWN PRICE ═══ */
        .premium-price-box {
            text-align: center;
            margin: 15px 0 25px;
            padding: 20px 15px;
            background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.06);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        .premium-price-box::before {
            content:''; position:absolute; inset:0;
            background: radial-gradient(circle at center, rgba(255,214,0,0.15) 0%, transparent 65%);
            opacity: 0; transition: opacity 0.8s ease;
        }
        .premium-price-box.glowing::before { opacity: 1; }
        
        .ppb-top {
            font-size: 0.95rem;
            color: #94A3B8;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .ppb-strike {
            position: relative;
            color: #fff;
            margin-left: 6px;
        }
        .ppb-strike::after {
            content: '';
            position: absolute;
            left: -4px; right: -4px; top: 50%;
            height: 2px;
            background: #FF3B30;
            transform: rotate(-10deg) scaleX(0);
            transform-origin: left center;
            transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .ppb-strike.show-strike::after {
            transform: rotate(-10deg) scaleX(1);
        }
        .ppb-main {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            position: relative;
        }
        .ppb-currency {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--yellow);
            margin-top: -6px;
        }
        .ppb-num {
            font-size: 3.8rem;
            font-weight: 900;
            color: #fff;
            line-height: 1;
            font-variant-numeric: tabular-nums;
            letter-spacing: -1px;
            text-shadow: 0 0 0 rgba(255,214,0,0);
            transition: transform 0.1s, color 0.3s, text-shadow 0.3s;
            will-change: transform, color, text-shadow;
        }
        .ppb-num.counting {
            color: #fff;
            transform: scale(1.05);
            text-shadow: 0 0 20px rgba(255,255,255,0.4);
        }
        .ppb-num.done {
            color: var(--yellow);
            transform: scale(1.15);
            text-shadow: 0 0 40px rgba(255,214,0,0.8);
        }
        .ppb-save {
            opacity: 0;
            transform: scale(0.5) translateX(-30px);
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-top: 5px;
        }
        .ppb-save.show {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
        @media (max-width: 480px) {
            .ppb-num { font-size: 3.2rem; }
            .ppb-currency { font-size: 1.8rem; }
            .premium-price-box { padding: 15px 10px; }
        }
`;

const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + newCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);

// 3. Replace HTML
const newHTML = `
                            <div class="premium-price-box" id="ppbHero">
                                <div class="ppb-top eo">Regular Price <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-top ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-main">
                                    <span class="ppb-currency">₹</span><span id="animatedPriceNum" class="ppb-num">2499</span>
                                    <span class="savepill ppb-save" id="animatedSavePill" style="animation: breatheGlow 3s infinite">SAVE ₹1,700</span>
                                </div>
                            </div>
`;

// Replace price-drop-anim div
html = html.replace(/<div class="price-drop-anim[\s\S]*?SAVE ₹1,700<\/span>\s*<\/div>\s*<\/div>/g, newHTML.trim());

// 4. Inject JS script logic at the bottom of the body
const jsLogic = `
<script>
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
            const duration = 1600; // 1.6s dramatic roll
            const startTime = performance.now();
            
            function countEngine(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeOutExpo for dramatic slowdown at the end
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
                    
                    pSave.classList.add('show');
                    pStrikes.forEach(s => s.classList.add('show-strike'));
                    
                    setTimeout(() => {
                        pNum.classList.remove('done');
                        pNum.style.transform = 'scale(1)';
                    }, 500);
                }
            }
            
            // tiny delay before start for suspense
            setTimeout(() => {
                requestAnimationFrame(countEngine);
            }, 500);
        }
    }, { threshold: 0.2 });
    
    observer.observe(pBox);
});
</script>
</body>
`;

html = html.replace(/<\/body>/g, jsLogic.trim());

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Injected JS countdown rolling animation');
