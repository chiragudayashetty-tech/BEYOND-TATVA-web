import re

with open('index - Copy.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Modify .enrollbtn
text = re.sub(
    r'(\.enrollbtn\s*\{[^}]*?transition:\s*opacity\s*\.15s;?)(\s*\})',
    r'\1\n            position: relative;\2',
    text,
    flags=re.DOTALL
)

# 2. Modify .btn-y
text = re.sub(
    r'(\.btn-y\s*\{[^}]*?transition:\s*opacity\s*\.15s\s*,\s*transform\s*\.15s;?)(\s*\})',
    r'\1;\n            position: relative;\2',
    text,
    flags=re.DOTALL
)

# 3. Modify .sbtn
text = re.sub(
    r'(\.sbtn\s*\{[^}]*?transition:\s*opacity\s*\.15s;?)(\s*\})',
    r'\1;\n            position: relative;\2',
    text,
    flags=re.DOTALL
)

# 4. Inject keyframes and pseudo-elements before </style> or right after .sbtn
new_anim = """
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
"""

text = re.sub(r'(        \.pb\s*\{)', new_anim + r'\n\1', text, count=1, flags=re.DOTALL)

with open('index - Copy.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fix applied successfully via Python!")
