const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// I am entirely replacing the old price drop CSS with a hyper-polished, silky smooth version.
// Using custom spring-like cubic-beziers for the drop, a smoother strike, and better sub-pixel rendering.

const newAnimCSS = `
        /* ═══ PRICE DROP ANIMATION (OPTIMIZED V2) ═══ */
        .price-drop-anim {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 6px 0 16px;
            min-height: 84px;
            justify-content: flex-end;
            position: relative;
        }
        .pd-old {
            color: #fff;
            font-size: 1.15rem;
            font-weight: 600;
            margin-bottom: 2px;
            transform-origin: center;
            will-change: transform, color, font-size;
        }
        .pd-old .strike-num {
            display: inline-block;
            position: relative;
            transform: scale(1.15);
            margin: 0 4px;
            will-change: transform;
        }
        .pd-old .strike-num::after {
            content: '';
            position: absolute;
            left: -6px;
            right: -6px;
            top: 50%;
            height: 3px;
            background: #FF3B30;
            border-radius: 4px;
            transform: rotate(-10deg) scaleX(0);
            transform-origin: left center;
            box-shadow: 0 0 12px rgba(255, 59, 48, 0.6);
            will-change: transform, opacity;
        }
        .pd-new {
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
            margin-top: -8px;
            will-change: transform, opacity;
        }
        
        /* Triggers unconditionally on load without relying on .active */
        .price-drop-anim .pd-old {
            animation: shrinkOldText 0.7s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .price-drop-anim .strike-num::after {
            animation: strikeDraw 0.5s 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .price-drop-anim .pd-new {
            /* Apple-like spring physics */
            animation: priceDropIn 0.9s 1.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shrinkOldText {
            to { 
                color: rgba(148, 163, 184, 0.85); 
                font-size: 0.85rem; 
                font-weight: 500;
                transform: translateY(-4px); 
            }
        }
        @keyframes strikeDraw {
            0% { transform: rotate(-10deg) scaleX(0); opacity: 0; }
            40% { transform: rotate(-10deg) scaleX(1.05); opacity: 1; }
            100% { transform: rotate(-10deg) scaleX(1); opacity: 0.9; }
        }
        @keyframes priceDropIn {
            0% { opacity: 0; transform: translateY(-30px) scale(0.85); }
            40% { opacity: 1; transform: translateY(6px) scale(1.02); }
            70% { transform: translateY(-2px) scale(0.99); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
`;

// Extract old CSS block using regex and replace with new
html = html.replace(/\/\*\s*═+\s*PRICE DROP ANIMATION\s*═+[\s\S]*?@keyframes\s+priceDropIn.*?\}\s*\}/g, newAnimCSS.trim());

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Polished price drop animation CSS injected successfully');
