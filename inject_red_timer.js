const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The user wants a premium, red-themed urgency box with an active countdown timer (4h 30m 52s).
// We will replace the .premium-price-box HTML and add the new CSS and JS logic.

const redTimerCSS = `
        /* ═══ PREMIUM RED COUNTDOWN UI ═══ */
        .premium-price-box {
            text-align: center;
            margin: 15px 0 25px;
            padding: 24px 20px;
            background: linear-gradient(145deg, rgba(220, 38, 38, 0.08) 0%, rgba(20, 10, 10, 0.8) 100%);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 24px;
            border: 1px solid rgba(239, 68, 68, 0.2);
            box-shadow: 
                inset 0 1px 1px rgba(255,100,100,0.1), 
                0 25px 50px -12px rgba(220, 38, 38, 0.15),
                0 0 40px rgba(220, 38, 38, 0.05); /* glowing red ambient */
            position: relative;
            overflow: hidden;
            max-width: 440px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .premium-price-box::before {
            content:''; 
            position:absolute; 
            top: -50px; left: -50px; right: -50px; height: 100px;
            background: radial-gradient(ellipse at top, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
            opacity: 0.8; 
            pointer-events: none;
            mix-blend-mode: screen;
        }
        
        .timer-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 18px;
            padding-bottom: 15px;
            border-bottom: 1px dashed rgba(239, 68, 68, 0.3);
        }
        
        .timer-label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            color: #FCA5A5; /* Light red */
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .timer-label span {
            display: inline-block;
            width: 8px; height: 8px;
            background: #EF4444;
            border-radius: 50%;
            animation: pulse-red 1.5s infinite;
        }
        
        .timer-blocks {
            display: flex;
            gap: 8px;
        }
        .tb-unit {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 8px;
            padding: 6px 10px;
            min-width: 50px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .tb-val {
            font-size: 1.4rem;
            font-weight: 800;
            color: #FFFFFF;
            font-variant-numeric: tabular-nums;
            line-height: 1;
        }
        .tb-lbl {
            font-size: 0.6rem;
            text-transform: uppercase;
            color: #94A3B8;
            margin-top: 2px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        
        .ppb-top {
            font-size: 1rem;
            color: #94A3B8;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .ppb-strike {
            position: relative;
            color: #E2E8F0;
            margin-left: 6px;
            font-weight: 600;
            opacity: 0.6;
            text-decoration: line-through;
            text-decoration-color: #EF4444;
            text-decoration-thickness: 2px;
        }
        
        .ppb-main {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            position: relative;
        }
        .ppb-currency {
            font-size: 2.4rem;
            font-weight: 800;
            color: #F87171; /* bright red */
            margin-top: -6px;
        }
        .ppb-num {
            font-size: 4.8rem;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1;
            font-variant-numeric: tabular-nums;
            letter-spacing: -2px;
            text-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
        }
        
        .ppb-save {
            background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
            color: #fff;
            padding: 6px 14px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
            animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            margin-top: 5px;
            border: 1px solid rgba(255,255,255,0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        @media (max-width: 480px) {
            .ppb-num { font-size: 3.8rem; }
            .ppb-currency { font-size: 2rem; }
            .timer-row { flex-direction: column; gap: 10px; }
            .tb-val { font-size: 1.2rem; }
            .premium-price-box { padding: 20px 15px; border-radius: 18px; }
        }
`;

// Remove the old ultra premium css
html = html.replace(/\/\*\s*═+\s*PREMIUM COUNTDOWN PRICE \(ULTRA POLISHED\)[\s\S]*?\}\s*\}/g, '');

const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + redTimerCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);

const newHTML = `
                            <div class="premium-price-box" id="ppbHero">
                                <div class="timer-row">
                                    <div class="timer-label"><span></span> Offer Ends In</div>
                                    <div class="timer-blocks">
                                        <div class="tb-unit">
                                            <div class="tb-val" id="t-hrs">04</div>
                                            <div class="tb-lbl">HRS</div>
                                        </div>
                                        <div class="tb-unit">
                                            <div class="tb-val" id="t-min">30</div>
                                            <div class="tb-lbl">MIN</div>
                                        </div>
                                        <div class="tb-unit">
                                            <div class="tb-val" id="t-sec">52</div>
                                            <div class="tb-lbl">SEC</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ppb-top eo">Regular Price <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-top ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="ppb-strike">₹2,499</span></div>
                                <div class="ppb-main">
                                    <span class="ppb-currency">₹</span><span class="ppb-num">799</span>
                                    <span class="ppb-save">SAVE ₹1,700</span>
                                </div>
                            </div>
`;

// Replace the old HTML block
html = html.replace(/<div class="premium-price-box" id="ppbHero">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newHTML.trim());

// We also need to remove the old JS rolling logic that we previously injected
html = html.replace(/<script>[\s\S]*?countEngine[\s\S]*?<\/script>/, '');

const timerJS = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    /* 4 hours, 30 mins, 52 seconds in seconds */
    let totalSeconds = (4 * 3600) + (30 * 60) + 52;
    
    const elHrs = document.getElementById('t-hrs');
    const elMin = document.getElementById('t-min');
    const elSec = document.getElementById('t-sec');
    
    if(!elHrs) return;

    function updateTimer() {
        if (totalSeconds <= 0) return;
        
        totalSeconds--;
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        elHrs.innerText = h.toString().padStart(2, '0');
        elMin.innerText = m.toString().padStart(2, '0');
        elSec.innerText = s.toString().padStart(2, '0');
    }
    
    setInterval(updateTimer, 1000);
});
</script>
`;

html = html.replace(/<\/body>/, timerJS.trim() + '\n</body>');

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Injected premium Red Urgency UI with Countdown Timer.');
