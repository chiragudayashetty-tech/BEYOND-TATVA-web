const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

const priceAnimCSS = `
        /* ═══ PRICE DROP ANIMATION ═══ */
        .price-drop-anim {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px 0 16px;
            min-height: 80px;
            justify-content: flex-end;
            position: relative;
        }
        .pd-old {
            color: #fff;
            font-size: 1.05rem;
            font-weight: 600;
            margin-bottom: 2px;
            transform-origin: center;
            transition: all 0.5s ease;
        }
        .pd-old .strike-num {
            display: inline-block;
            position: relative;
            transform: scale(1.3);
            margin: 0 4px;
        }
        .pd-old .strike-num::after {
            content: '';
            position: absolute;
            left: -4px;
            right: -4px;
            top: 50%;
            height: 3px;
            background: #FF3B30;
            border-radius: 2px;
            transform: rotate(-12deg) scaleX(0);
            transform-origin: left center;
            box-shadow: 0 0 10px rgba(255, 59, 48, 0.5);
        }
        .pd-new {
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transform: translateY(-25px) scale(0.8);
            margin-top: -5px;
        }
        
        /* The animation classes triggered by scroll (.reveal.active) */
        .reveal.active .pd-old {
            animation: shrinkOldText 0.5s 0.4s forwards;
        }
        .reveal.active .strike-num::after {
            animation: strikeDraw 0.4s 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .reveal.active .pd-new {
            animation: priceDropIn 0.8s 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shrinkOldText {
            to { color: #94A3B8; font-size: 0.9rem; font-weight: 500; }
        }
        @keyframes strikeDraw {
            0% { transform: rotate(-12deg) scaleX(0); opacity: 1; }
            50% { transform: rotate(-12deg) scaleX(1.1); opacity: 1; }
            100% { transform: rotate(-12deg) scaleX(1); opacity: 0.85; }
        }
        @keyframes priceDropIn {
            0% { opacity: 0; transform: translateY(-40px) scale(0.8); }
            50% { opacity: 1; transform: translateY(8px) scale(1.05); }
            80% { transform: translateY(-3px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
`;

// Insert CSS
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + priceAnimCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);

// Replace HTML
const oldHtml = `                            <div class="old eo">Regular price ₹2,499</div>
                            <div class="old ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ ₹2,499</div>
                            <div><span class="bigprice">₹799</span><span class="savepill">SAVE ₹1,700</span></div>`;

const newHtml = `                            <div class="price-drop-anim reveal">
                                <div class="pd-old eo">Regular price <span class="strike-num">₹2,499</span></div>
                                <div class="pd-old ko kn-font">ಸಾಮಾನ್ಯ ಬೆಲೆ <span class="strike-num">₹2,499</span></div>
                                <div class="pd-new">
                                    <span class="bigprice">₹799</span>
                                    <span class="savepill glow-pulse" style="animation: breatheGlow 3s infinite">SAVE ₹1,700</span>
                                </div>
                            </div>`;

html = html.replace(oldHtml, newHtml);

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Price drop animation injected successfully');
