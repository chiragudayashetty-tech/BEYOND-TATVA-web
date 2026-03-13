const fs = require('fs');

const data = fs.readFileSync('index - Copy.html', 'utf8');

const targetStr1 = `.enrollbtn {
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .73rem;
            padding: 9px 15px;
            border-radius: 50px;
            white-space: nowrap;
            box-shadow: 0 0 14px rgba(250, 204, 21, .22);
            transition: opacity .15s;
        }`;

const replacementStr1 = `.enrollbtn {
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .73rem;
            padding: 9px 15px;
            border-radius: 50px;
            white-space: nowrap;
            box-shadow: 0 0 14px rgba(250, 204, 21, .22);
            transition: opacity .15s;
            position: relative;
        }

        @keyframes btnSignal {
            0% {
                inset: 0;
                opacity: 0.8;
                border: 2px solid var(--yellow);
            }
            100% {
                inset: -6px;
                opacity: 0;
                border: 1px solid var(--yellow);
            }
        }

        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            border: 2px solid var(--yellow);
            animation: btnSignal 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            pointer-events: none;
        }

        .btn-y::after, .enrollbtn::after {
            animation-delay: 1s;
        }`;

const targetStr2 = `/* ── BUTTONS ─────────────────────────── */
        .btn-y {
            width: 100%;
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .94rem;
            padding: 15px;
            border-radius: var(--r);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 2px 16px rgba(10, 91, 255, .25), 0 0 24px rgba(39, 224, 196, .15), inset 0 1px 1px rgba(255, 255, 255, .15);
            transition: opacity .15s, transform .15s
        }`;

const replacementStr2 = `/* ── BUTTONS ─────────────────────────── */
        .btn-y {
            width: 100%;
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .94rem;
            padding: 15px;
            border-radius: var(--r);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 2px 16px rgba(10, 91, 255, .25), 0 0 24px rgba(39, 224, 196, .15), inset 0 1px 1px rgba(255, 255, 255, .15);
            transition: opacity .15s, transform .15s;
            position: relative;
        }`;

let newData = data;
if (newData.includes(targetStr1)) {
    newData = newData.replace(targetStr1, replacementStr1);
    console.log("Replaced targetStr1");
} else {
    console.log("Could not find targetStr1");
}

if (newData.includes(targetStr2)) {
    newData = newData.replace(targetStr2, replacementStr2);
    console.log("Replaced targetStr2");
} else {
    // try removing the lack of semicolon issue just in case
    const fallbackTarget2 = targetStr2 + ";";
    if (newData.includes(fallbackTarget2)) {
        newData = newData.replace(fallbackTarget2, replacementStr2);
        console.log("Replaced targetStr2 (with semicolon format)");
    } else {
        console.log("Could not find targetStr2");
    }
}

fs.writeFileSync('index - Copy.html', newData);
console.log("CSS Updated!");
