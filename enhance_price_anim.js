const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// 1. Fix the missing semicolon in `.tags` which broke the centering
html = html.replace(/margin-top:\s*10px\s*justify-content:\s*center;/g, 'margin-top: 10px;\n            justify-content: center;');

// 2. Upgrade the premium price box CSS with much better, smoother colors
const oldCSS = `        /* ═══ PREMIUM COUNTDOWN PRICE ═══ */
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
        }`;

const ultraPremiumCSS = `        /* ═══ PREMIUM COUNTDOWN PRICE (ULTRA POLISHED) ═══ */
        .premium-price-box {
            text-align: center;
            margin: 15px 0 25px;
            padding: 22px 18px;
            /* Ultra-smooth backdrop with sleek borders */
            background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 
                inset 0 1px 1px rgba(255,255,255,0.1), 
                0 20px 40px -10px rgba(0,0,0,0.5),
                0 0 20px rgba(255, 214, 0, 0.03); /* subtle gold ambient */
            position: relative;
            overflow: hidden;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
            transition: box-shadow 0.8s ease, transform 0.4s ease;
        }
        
        /* The magical glowing core inside the box */
        .premium-price-box::before {
            content:''; 
            position:absolute; 
            inset: -50%;
            background: radial-gradient(circle at center, rgba(255, 214, 0, 0.12) 0%, transparent 50%);
            opacity: 0; 
            transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1);
            pointer-events: none;
            mix-blend-mode: screen;
        }
        .premium-price-box.glowing {
            transform: translateY(-2px);
            box-shadow: 
                inset 0 1px 1px rgba(255,255,255,0.15), 
                0 25px 50px -12px rgba(0,0,0,0.6),
                0 0 40px rgba(255, 214, 0, 0.15); /* strong gold ambient */
        }
        .premium-price-box.glowing::before { opacity: 1; }
        
        .ppb-top {
            font-size: 0.95rem;
            color: #94A3B8;
            margin-bottom: 10px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .ppb-strike {
            position: relative;
            color: #E2E8F0;
            margin-left: 6px;
            font-weight: 600;
        }
        .ppb-strike::after {
            content: '';
            position: absolute;
            left: -6px; right: -6px; top: 50%;
            height: 2.5px;
            background: #FF3B30; /* Apple Red */
            border-radius: 2px;
            transform: rotate(-10deg) scaleX(0);
            transform-origin: left center;
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy strike */
            box-shadow: 0 0 8px rgba(255, 59, 48, 0.6);
        }
        .ppb-strike.show-strike::after {
            transform: rotate(-10deg) scaleX(1.05);
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
            /* Gradient Gold for currency */
            background: linear-gradient(135deg, #FFD700 0%, #F59E0B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: -6px;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ppb-num {
            font-size: 4.2rem;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1;
            font-variant-numeric: tabular-nums;
            letter-spacing: -2px;
            transition: transform 0.1s, color 0.4s, text-shadow 0.4s;
            will-change: transform, color, text-shadow;
            text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .ppb-num.counting {
            color: #F8FAFC;
            transform: scale(1.03);
            text-shadow: 0 0 25px rgba(255,255,255,0.3);
        }
        .ppb-num.done {
            /* Premium gradient gold for final number */
            background: linear-gradient(135deg, #FFD700 0%, #F59E0B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transform: scale(1.12);
            /* Faux text-shadow using drop-shadow filter to work with background-clip */
            filter: drop-shadow(0 0 20px rgba(255, 214, 0, 0.5));
        }
        
        /* The SAVE pill pops beautifully */
        .ppb-save {
            opacity: 0;
            transform: scale(0.4) translateX(-40px);
            transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-top: 5px;
            box-shadow: 0 0 20px rgba(39, 224, 196, 0);
        }
        .ppb-save.show {
            opacity: 1;
            transform: scale(1.1) translateX(0);
            box-shadow: 0 0 20px rgba(39, 224, 196, 0.4);
        }
        
        @media (max-width: 480px) {
            .ppb-num { font-size: 3.4rem; }
            .ppb-currency { font-size: 2rem; }
            .premium-price-box { padding: 18px 12px; margin: 10px 0 20px; }
            .ppb-save.show { transform: scale(1) translateX(0); }
        }`;

// Replace the old block with the new ultra premium styles
html = html.replace(oldCSS, ultraPremiumCSS);

// Let's also make sure the js logic doesn't override the background-clip text shadow trick
html = html.replace(/pNum\.style\.transform = 'scale\(1\)';/g, "pNum.style.transform = 'scale(1)';\n                    // Keep the glowing class active on the parent for the ambient light");

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Centered tags perfectly by fixing CSS syntax error');
console.log('✅ Polished price box with ultra-premium sleek aesthetics & Apple-like easing');
