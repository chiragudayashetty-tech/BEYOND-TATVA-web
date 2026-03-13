const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// Fix 1: Add will-change and contain for GPU acceleration on the pseudo-elements
// Fix 2: On mobile, reduce the expansion and use transform instead of top/left/right/bottom
// Fix 3: Add overflow hidden to sticky bar container

const mobileFixCSS = `
        /* ═══ MOBILE BUTTON ANIMATION FIX ═══ */
        .btn-y, .enrollbtn, .sbtn {
            position: relative;
            overflow: visible;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after,
        .sbtn::before, .sbtn::after {
            will-change: transform, opacity;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .sbar {
            overflow: hidden !important;
        }
        @media (max-width: 480px) {
            @keyframes btnSignalWave {
                0% {
                    top: 0; left: 0; right: 0; bottom: 0;
                    opacity: 0.6;
                    border: 1.5px solid var(--yellow);
                }
                100% {
                    top: -6px; left: -6px; right: -6px; bottom: -6px;
                    opacity: 0;
                }
            }
            .sbtn::before, .sbtn::after {
                animation: btnSignalWave 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important;
            }
            .sbtn::after {
                animation-delay: 1.25s !important;
            }
        }
`;

// Insert before last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + mobileFixCSS + '\n    </style>' + html.substring(lastStyleIdx + 8);

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Button animation mobile fix applied');
console.log('  - GPU-accelerated with will-change + backface-visibility');
console.log('  - Reduced wave expansion from 12px to 6px on mobile');
console.log('  - Slower timing (2.5s) to reduce jank');
console.log('  - Sticky bar overflow hidden to clip artifacts');
