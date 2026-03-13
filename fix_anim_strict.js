const fs = require('fs');
let data = fs.readFileSync('index - Copy.html', 'utf8');

data = data.replace(
    `        .enrollbtn {
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
        }`,
    `        .enrollbtn {
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
        }`
);

data = data.replace(
    `        .btn-y {
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
        }`,
    `        .btn-y {
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
        }`
);

data = data.replace(
    `        .sbtn {
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .77rem;
            padding: 10px 15px;
            border-radius: 10px;
            white-space: nowrap;
            flex-shrink: 0;
            transition: opacity .15s
        }`,
    `        .sbtn {
            background: var(--yellow);
            color: #080C14;
            font-family: var(--h);
            font-weight: 800;
            font-size: .77rem;
            padding: 10px 15px;
            border-radius: 10px;
            white-space: nowrap;
            flex-shrink: 0;
            transition: opacity .15s;
            position: relative;
        }`
);

let newAnim = `

        @keyframes btnSignalWave {
            0% {
                top: 0; left: 0; right: 0; bottom: 0;
                opacity: 0.8;
                border: 2px solid var(--yellow);
            }
            100% {
                top: -12px; left: -12px; right: -12px; bottom: -12px;
                opacity: 0;
                border: 1px solid var(--yellow);
            }
        }

        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after,
        .sbtn::before, .sbtn::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: inherit;
            pointer-events: none;
            animation: btnSignalWave 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
            z-index: 10;
        }

        .btn-y::after, .enrollbtn::after, .sbtn::after {
            animation-delay: 1.1s;
        }
`;

if (data.includes('        .pb {')) {
    data = data.replace('        .pb {', newAnim + '\n        .pb {');
    console.log('Successfully injected animation.');
} else {
    console.log('Failed to inject animation.');
}

fs.writeFileSync('index - Copy.html', data);
console.log('Fixed button animations strictly!');
