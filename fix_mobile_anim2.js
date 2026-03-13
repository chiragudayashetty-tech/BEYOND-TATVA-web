const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// The previous fix added this block:
/*
        /* ═══ MOBILE BUTTON ANIMATION FIX ═══ */
/*
        .btn-y, .enrollbtn, .sbtn {
            position: relative;
            overflow: visible;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        ...
*/

// Let's remove the old mobile button fix block completely
html = html.replace(/\/\*\s*═+\s*MOBILE BUTTON ANIMATION FIX[\s\S]*?\}\s*\}\s*/g, '');

// Now insert a better optimized version that doesn't use overflow:hidden on sbar
// and uses a much smoother, perfectly symmetrical transform approach for mobile
const newMobileFix = `
        /* ═══ MOBILE BUTTON ANIMATION OPTIMIZED ═══ */
        .btn-y, .enrollbtn, .sbtn {
            position: relative;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .btn-y::before, .btn-y::after,
        .enrollbtn::before, .enrollbtn::after,
        .sbtn::before, .sbtn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            border: 2px solid var(--yellow);
            opacity: 0;
            pointer-events: none;
            will-change: transform, opacity;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            z-index: -1;
        }
        
        @media (max-width: 768px) {
            @keyframes mobileBtnWave {
                0% {
                    transform: scale(1);
                    opacity: 0.7;
                    border-width: 1.5px;
                }
                100% {
                    transform: scale(1.08, 1.25);
                    opacity: 0;
                    border-width: 1px;
                }
            }
            .btn-y::before, .btn-y::after,
            .enrollbtn::before, .enrollbtn::after,
            .sbtn::before, .sbtn::after {
                animation: mobileBtnWave 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important;
                /* Reset the top/left/right/bottom since we use transform now */
                top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            }
            .btn-y::after, .enrollbtn::after, .sbtn::after {
                animation-delay: 1.2s !important;
            }
        }
`;

// Insert before last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.substring(0, lastStyleIdx) + newMobileFix + '\n    </style>' + html.substring(lastStyleIdx + 8);

// Make sure to remove any inline overflow:hidden we might have accidentally added to sbar previously
html = html.replace(/\.sbar\s*\{\s*overflow:\s*hidden\s*!important;\s*\}/g, '');

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ Mobile button animation restored and optimized');
console.log('✅ Removed sbar overflow:hidden that was clipping the animation');
console.log('✅ Switched from top/bottom stretching to transform: scale(1.08, 1.25) for perfect symmetry');
