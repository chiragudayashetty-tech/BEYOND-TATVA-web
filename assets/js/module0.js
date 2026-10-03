/* ═══════════════════════════════════════════════════════════════
   BEYOND TATVA · Module 0 · Bindu (free starter lesson)
   Unlocked after the Bindu chat on the home page.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const C = window.BT_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEY = 'bt_v3';
  let S = { lang: null, xp: 0, done: false, ans: {}, m0: {} };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  S.m0 = S.m0 || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  let LANG = new URLSearchParams(location.search).get('lang') || S.lang || 'en';

  /* ── Words ── */
  const W = {
    en: {
      title: 'Module 0 · Bindu — Beyond Tatva', eyebrow: 'Module 0 · ಬಿಂದು · Free', h1: 'The Starting <em>Point</em>',
      sub: n => (n ? 'Made for ' + n + '. ' : '') + '15 minutes, 4 small steps.',
      track: ['What AI is', 'Golden rules', 'First prompt', 'Quick check'],
      lockH: 'Module 0 is free', lockP: 'Chat with Bindu for one minute to unlock it.', lockBtn: 'Chat with Bindu →', home: 'Back to home',
      s1h: '1 · What AI really is', s1p: 'Three ideas that change how you use it.', got: 'Got it ✓',
      facts: [['🧩', 'It predicts, it doesn\'t "know"', 'Tools like ChatGPT learned patterns from huge amounts of text. They build an answer by predicting one word at a time.'],
        ['⚠️', 'It can be confidently wrong', 'AI sometimes makes up facts that sound right. That\'s why we always check.'],
        ['🧮', 'A calculator for words', 'A calculator helps with maths you understand. AI helps with ideas you understand.']],
      s2h: '2 · The 3 golden rules', s2p: 'Tap each rule to see why it matters.', flip: 'Tap to see why',
      rules: [['Think first, then ask', 'Try the question yourself for 2 minutes. Then use AI to check or go deeper. Your brain does the lifting.'],
        ['Check with your textbook', 'Exams follow your textbook, not the internet. If AI and the textbook disagree, the textbook wins.'],
        ['Never in exams or graded work', 'Marked homework, tests and exams are your own work. Using AI there is cheating, and it robs you of practice.']],
      s3h: '3 · Your first study prompt', s3p: 'Build it, copy it, and try it in ChatGPT or Gemini tonight.',
      cls: 'Class', subj: 'Subject', chap: 'Chapter', chapPh: 'e.g. Life Processes', goal: 'I want AI to…',
      subjects: ['Science', 'Maths', 'Social Science', 'English', 'Kannada'],
      goals: [['explain', 'Explain it simply'], ['quiz', 'Quiz me'], ['notes', 'Make revision notes']],
      tpl: {
        explain: 'I\'m a Class {c} student. Explain "{ch}" from my {s} textbook in simple words, with one real-life example. Then ask me 3 questions to check I understood. Wait for my answers before telling me if I\'m right.',
        quiz: 'I\'m a Class {c} student. Quiz me on "{ch}" from my {s} textbook: 5 exam-style questions, one at a time. After each answer, tell me what I got right and what to revise.',
        notes: 'Make 1-page revision notes on "{ch}" from my Class {c} {s} textbook: key terms, 5 main points and 2 likely exam questions. Use only facts from my textbook, and tell me if you\'re unsure about anything.'
      },
      chapDefault: 'chapter name', yourPrompt: 'YOUR PROMPT', copy: 'Copy prompt', copied: 'Copied! ✨', openGpt: 'Open ChatGPT', openGem: 'Open Gemini',
      s4h: '4 · Quick check', s4p: 'Three questions. No pressure.',
      quiz: [
        ['You have a Science test tomorrow. What\'s the honest way to use AI?', ['Ask it to quiz me on the chapter', 'Ask it to write my answers for the test', 'Skip studying, AI will help in the exam'], 'Asking AI to quiz you is practice. Getting it to write test answers is cheating.'],
        ['AI and your textbook say different things. Which wins?', ['The textbook', 'AI, it\'s smarter', 'Whichever answer is longer'], 'Exams follow your textbook. If they disagree, the textbook wins.'],
        ['Before asking AI for help with a sum, you should…', ['Try it yourself first', 'Copy the AI answer', 'Skip the sum'], 'Think first, then ask. Your brain has to do the lifting.']
      ],
      right: 'Correct!', wrong: 'Not quite.', score: s => 'You got ' + s + '/3', stepDone: 'Step complete', xp: n => '+' + n + ' XP',
      finH: 'Module 0 complete! 🎉', finP: n => 'Well done' + (n ? ', ' + n : '') + '. You\'ve taken the first step.', certTop: 'MODULE 0 · BINDU · COMPLETE',
      next: 'Ready for Module 1? Get all 5 tatvas for ₹799.', enroll: 'Enroll for ₹799', allDone: 'Module 0 complete'
    },
    kn: {
      title: 'ಮಾಡ್ಯೂಲ್ 0 · ಬಿಂದು — Beyond Tatva', eyebrow: 'ಮಾಡ್ಯೂಲ್ 0 · ಬಿಂದು · ಉಚಿತ', h1: 'ಆರಂಭದ <em>ಬಿಂದು</em>',
      sub: n => (n ? n + ' ಅವರಿಗಾಗಿ. ' : '') + '15 ನಿಮಿಷ, 4 ಸಣ್ಣ ಹಂತಗಳು.',
      track: ['AI ಎಂದರೇನು', 'ಸುವರ್ಣ ನಿಯಮಗಳು', 'ಮೊದಲ ಪ್ರಾಂಪ್ಟ್', 'ಸಣ್ಣ ಪರೀಕ್ಷೆ'],
      lockH: 'ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತ', lockP: 'ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಬಿಂದು ಜೊತೆ ಒಂದು ನಿಮಿಷ ಮಾತನಾಡಿ.', lockBtn: 'ಬಿಂದು ಜೊತೆ ಮಾತನಾಡಿ →', home: 'ಮುಖಪುಟಕ್ಕೆ',
      s1h: '1 · AI ಅಂದರೆ ನಿಜವಾಗಿ ಏನು', s1p: 'ಬಳಸುವ ರೀತಿಯನ್ನೇ ಬದಲಿಸುವ ಮೂರು ವಿಚಾರಗಳು.', got: 'ಅರ್ಥವಾಯಿತು ✓',
      facts: [['🧩', 'ಅದು ಊಹಿಸುತ್ತದೆ, "ತಿಳಿದಿರುವುದಿಲ್ಲ"', 'ChatGPT ನಂತಹ ಟೂಲ್‌ಗಳು ಅಪಾರ ಪಠ್ಯದಿಂದ ಮಾದರಿಗಳನ್ನು ಕಲಿತಿವೆ. ಅವು ಒಂದೊಂದೇ ಪದವನ್ನು ಊಹಿಸುತ್ತಾ ಉತ್ತರ ರಚಿಸುತ್ತವೆ.'],
        ['⚠️', 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ತಪ್ಪು ಹೇಳಬಹುದು', 'AI ಕೆಲವೊಮ್ಮೆ ಸರಿಯೆನಿಸುವ ತಪ್ಪು ಮಾಹಿತಿಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ. ಅದಕ್ಕೇ ನಾವು ಯಾವಾಗಲೂ ಪರಿಶೀಲಿಸುತ್ತೇವೆ.'],
        ['🧮', 'ಪದಗಳ ಕ್ಯಾಲ್ಕುಲೇಟರ್', 'ಅರ್ಥವಾದ ಗಣಿತಕ್ಕೆ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಸಹಾಯ ಮಾಡುವಂತೆ, ಅರ್ಥವಾದ ವಿಚಾರಗಳಿಗೆ AI ಸಹಾಯ ಮಾಡುತ್ತದೆ.']],
      s2h: '2 · 3 ಸುವರ್ಣ ನಿಯಮಗಳು', s2p: 'ಏಕೆ ಮುಖ್ಯ ಎಂದು ತಿಳಿಯಲು ಪ್ರತಿ ನಿಯಮವನ್ನು ಒತ್ತಿ.', flip: 'ಏಕೆ ಎಂದು ನೋಡಲು ಒತ್ತಿ',
      rules: [['ಮೊದಲು ಯೋಚಿಸಿ, ನಂತರ ಕೇಳಿ', '2 ನಿಮಿಷ ನೀವೇ ಪ್ರಯತ್ನಿಸಿ. ನಂತರ ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಆಳವಾಗಿ ತಿಳಿಯಲು AI ಬಳಸಿ. ಕೆಲಸ ಮಾಡಬೇಕಾದದ್ದು ನಿಮ್ಮ ಮೆದುಳು.'],
        ['ಪಠ್ಯಪುಸ್ತಕದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ', 'ಪರೀಕ್ಷೆಗಳು ಪಠ್ಯಪುಸ್ತಕವನ್ನು ಅನುಸರಿಸುತ್ತವೆ, ಇಂಟರ್ನೆಟ್ ಅನ್ನಲ್ಲ. AI ಮತ್ತು ಪಠ್ಯಪುಸ್ತಕ ಬೇರೆ ಹೇಳಿದರೆ, ಪಠ್ಯಪುಸ್ತಕವೇ ಸರಿ.'],
        ['ಪರೀಕ್ಷೆ ಮತ್ತು ಅಂಕದ ಕೆಲಸದಲ್ಲಿ ಎಂದಿಗೂ ಬೇಡ', 'ಅಂಕ ನೀಡುವ ಹೋಂವರ್ಕ್, ಟೆಸ್ಟ್ ಮತ್ತು ಪರೀಕ್ಷೆಗಳು ನಿಮ್ಮದೇ ಕೆಲಸ. ಅಲ್ಲಿ AI ಬಳಸುವುದು ಮೋಸ, ಮತ್ತು ನಿಮ್ಮ ಅಭ್ಯಾಸವನ್ನೂ ಕಸಿಯುತ್ತದೆ.']],
      s3h: '3 · ನಿಮ್ಮ ಮೊದಲ ಸ್ಟಡಿ ಪ್ರಾಂಪ್ಟ್', s3p: 'ರಚಿಸಿ, ನಕಲಿಸಿ, ಇಂದು ರಾತ್ರಿ ChatGPT ಅಥವಾ Gemini ನಲ್ಲಿ ಪ್ರಯತ್ನಿಸಿ.',
      cls: 'ತರಗತಿ', subj: 'ವಿಷಯ', chap: 'ಅಧ್ಯಾಯ', chapPh: 'ಉದಾ: ಜೀವ ಕ್ರಿಯೆಗಳು', goal: 'AI ಏನು ಮಾಡಬೇಕು…',
      subjects: ['ವಿಜ್ಞಾನ', 'ಗಣಿತ', 'ಸಮಾಜ ವಿಜ್ಞಾನ', 'ಇಂಗ್ಲಿಷ್', 'ಕನ್ನಡ'],
      goals: [['explain', 'ಸರಳವಾಗಿ ವಿವರಿಸಲಿ'], ['quiz', 'ನನಗೆ ಪ್ರಶ್ನೆ ಕೇಳಲಿ'], ['notes', 'ರಿವಿಷನ್ ನೋಟ್ಸ್ ಮಾಡಲಿ']],
      tpl: {
        explain: 'ನಾನು {c}ನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿ. ನನ್ನ {s} ಪಠ್ಯಪುಸ್ತಕದ "{ch}" ಅನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ, ಒಂದು ನಿಜ ಜೀವನದ ಉದಾಹರಣೆಯೊಂದಿಗೆ ವಿವರಿಸು. ನಂತರ ನನಗೆ ಅರ್ಥವಾಗಿದೆಯೇ ಎಂದು ತಿಳಿಯಲು 3 ಪ್ರಶ್ನೆ ಕೇಳು. ನನ್ನ ಉತ್ತರ ಬರುವವರೆಗೆ ಸರಿ-ತಪ್ಪು ಹೇಳಬೇಡ.',
        quiz: 'ನಾನು {c}ನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿ. ನನ್ನ {s} ಪಠ್ಯಪುಸ್ತಕದ "{ch}" ಮೇಲೆ ಪರೀಕ್ಷಾ ಮಾದರಿಯ 5 ಪ್ರಶ್ನೆಗಳನ್ನು ಒಂದೊಂದಾಗಿ ಕೇಳು. ಪ್ರತಿ ಉತ್ತರದ ನಂತರ ಯಾವುದು ಸರಿ, ಯಾವುದನ್ನು ಮತ್ತೆ ಓದಬೇಕು ಎಂದು ಹೇಳು.',
        notes: 'ನನ್ನ {c}ನೇ ತರಗತಿಯ {s} ಪಠ್ಯಪುಸ್ತಕದ "{ch}" ಮೇಲೆ 1 ಪುಟದ ರಿವಿಷನ್ ನೋಟ್ಸ್ ಮಾಡು: ಮುಖ್ಯ ಪದಗಳು, 5 ಮುಖ್ಯ ಅಂಶಗಳು ಮತ್ತು 2 ಸಂಭಾವ್ಯ ಪರೀಕ್ಷಾ ಪ್ರಶ್ನೆಗಳು. ಪಠ್ಯಪುಸ್ತಕದ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಬಳಸು, ಖಚಿತವಿಲ್ಲದಿದ್ದರೆ ಹೇಳು.'
      },
      chapDefault: 'ಅಧ್ಯಾಯದ ಹೆಸರು', yourPrompt: 'ನಿಮ್ಮ ಪ್ರಾಂಪ್ಟ್', copy: 'ಪ್ರಾಂಪ್ಟ್ ನಕಲಿಸಿ', copied: 'ನಕಲಾಯಿತು! ✨', openGpt: 'ChatGPT ತೆರೆಯಿರಿ', openGem: 'Gemini ತೆರೆಯಿರಿ',
      s4h: '4 · ಸಣ್ಣ ಪರೀಕ್ಷೆ', s4p: 'ಮೂರು ಪ್ರಶ್ನೆಗಳು. ಒತ್ತಡ ಇಲ್ಲ.',
      quiz: [
        ['ನಾಳೆ ವಿಜ್ಞಾನ ಟೆಸ್ಟ್ ಇದೆ. AI ಅನ್ನು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಬಳಸುವ ದಾರಿ ಯಾವುದು?', ['ಅಧ್ಯಾಯದ ಮೇಲೆ ನನಗೆ ಪ್ರಶ್ನೆ ಕೇಳಲು ಹೇಳುವುದು', 'ಟೆಸ್ಟ್‌ನ ಉತ್ತರಗಳನ್ನು ಅದರಿಂದ ಬರೆಸುವುದು', 'ಓದದೇ ಇರುವುದು, ಪರೀಕ್ಷೆಯಲ್ಲಿ AI ಸಹಾಯ ಮಾಡುತ್ತದೆ'], 'ಪ್ರಶ್ನೆ ಕೇಳಿಸಿಕೊಳ್ಳುವುದು ಅಭ್ಯಾಸ. ಟೆಸ್ಟ್ ಉತ್ತರ ಬರೆಸುವುದು ಮೋಸ.'],
        ['AI ಮತ್ತು ಪಠ್ಯಪುಸ್ತಕ ಬೇರೆ ಬೇರೆ ಹೇಳುತ್ತಿವೆ. ಯಾವುದು ಸರಿ?', ['ಪಠ್ಯಪುಸ್ತಕ', 'AI, ಅದು ಹೆಚ್ಚು ಬುದ್ಧಿವಂತ', 'ಯಾವ ಉತ್ತರ ಉದ್ದವಾಗಿದೆಯೋ ಅದು'], 'ಪರೀಕ್ಷೆಗಳು ಪಠ್ಯಪುಸ್ತಕವನ್ನು ಅನುಸರಿಸುತ್ತವೆ. ಬೇರೆ ಹೇಳಿದರೆ ಪಠ್ಯಪುಸ್ತಕವೇ ಸರಿ.'],
        ['ಲೆಕ್ಕಕ್ಕೆ AI ಸಹಾಯ ಕೇಳುವ ಮೊದಲು ನೀವು…', ['ಮೊದಲು ನೀವೇ ಪ್ರಯತ್ನಿಸಬೇಕು', 'AI ಉತ್ತರವನ್ನು ನಕಲು ಮಾಡಬೇಕು', 'ಆ ಲೆಕ್ಕವನ್ನು ಬಿಡಬೇಕು'], 'ಮೊದಲು ಯೋಚಿಸಿ, ನಂತರ ಕೇಳಿ. ಕೆಲಸ ಮಾಡಬೇಕಾದದ್ದು ನಿಮ್ಮ ಮೆದುಳು.']
      ],
      right: 'ಸರಿಯಾದ ಉತ್ತರ!', wrong: 'ಸರಿಯಲ್ಲ.', score: s => 'ನೀವು 3ರಲ್ಲಿ ' + s + ' ಸರಿ', stepDone: 'ಹಂತ ಪೂರ್ಣ', xp: n => '+' + n + ' XP',
      finH: 'ಮಾಡ್ಯೂಲ್ 0 ಪೂರ್ಣ! 🎉', finP: n => 'ಶಭಾಷ್' + (n ? ', ' + n : '') + '! ಮೊದಲ ಹೆಜ್ಜೆ ಇಟ್ಟಿದ್ದೀರಿ.', certTop: 'ಮಾಡ್ಯೂಲ್ 0 · ಬಿಂದು · ಪೂರ್ಣ',
      next: 'ಮಾಡ್ಯೂಲ್ 1ಕ್ಕೆ ಸಿದ್ಧವೇ? ಎಲ್ಲಾ 5 ತತ್ವಗಳು ₹799ಕ್ಕೆ.', enroll: '₹799ಕ್ಕೆ ದಾಖಲಾಗಿ', allDone: 'ಮಾಡ್ಯೂಲ್ 0 ಪೂರ್ಣ'
    }
  };
  const T = () => W[LANG];

  /* ── Tiny confetti + toast ── */
  const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], raf = 0;
  function size() { const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  size(); addEventListener('resize', size);
  function burst(x, y, n = 80) {
    if (reduced) return;
    const cols = ['#F6C453', '#FF5E3A', '#2CC6B5', '#8ED6FF', '#9D87FF', '#F3EADB'];
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 2 + Math.random() * 7; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, s: 5 + Math.random() * 6, c: cols[i % cols.length], l: 1 }); }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.l > 0 && p.y < innerHeight + 40);
    parts.forEach(p => { p.vy += .22; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.l -= .006; cx.save(); cx.globalAlpha = Math.min(1, p.l * 1.6); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  }
  function toast(em, title, sub) {
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = '<span class="bd">' + em + '</span><div><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></div>';
    $('#toasts').appendChild(t); setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3000);
  }
  const xpNum = $('#xpNum'); xpNum.textContent = S.xp || 0;
  function complete(step, el, xp = 25) {
    if (S.m0['s' + step]) return;
    S.m0['s' + step] = true; S.xp = (S.xp || 0) + xp; save();
    xpNum.textContent = S.xp;
    const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 60);
    toast('✨', T().stepDone + ' · ' + T().track[step - 1], T().xp(xp));
    try { navigator.vibrate && navigator.vibrate(20); } catch (e) {}
    renderTrack();
    if ([1, 2, 3, 4].every(i => S.m0['s' + i])) setTimeout(renderFinish, 600);
  }

  /* ── Render ── */
  const root = $('#m0');
  const name = () => (S.ans && S.ans.who === 'parent' || S.ans && S.ans.who === 'student') ? S.ans.name : '';
  let pb = { c: (S.ans && ['8', '9', '10'].includes(S.ans.cls)) ? S.ans.cls : '9', s: 0, ch: '', g: 'explain' };

  function renderTrack() {
    const t = $('.track'); if (!t) return;
    t.innerHTML = T().track.map((l, i) => '<span class="' + (S.m0['s' + (i + 1)] ? 'on' : '') + '"><i>' + (S.m0['s' + (i + 1)] ? '✓' : i + 1) + '</i>' + esc(l) + '</span>').join('');
  }
  function promptText(forCopy) {
    const t = T(), ch = pb.ch.trim() || (forCopy ? '[' + t.chapDefault + ']' : '\u0000' + t.chapDefault + '\u0001');
    return t.tpl[pb.g].replace('{c}', pb.c).replace('{s}', t.subjects[pb.s]).replace('{ch}', ch);
  }
  function renderPreview() {
    const p = $('#pv'); if (!p) return;
    p.innerHTML = esc(promptText(false)).replace('\u0000', '<mark>[').replace('\u0001', ']</mark>');
  }
  function render() {
    document.documentElement.lang = LANG;
    document.title = T().title;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
    if (C.checkoutUrl) $$('[data-enroll]').forEach(a => { a.href = C.checkoutUrl; a.rel = 'noopener'; });
    const t = T();
    if (!S.done) {
      root.innerHTML = '<div class="card lock"><div class="bot big"><i class="eye l"></i><i class="eye r"></i></div><h1>' + esc(t.lockH) + '</h1><p>' + esc(t.lockP) + '</p><a class="btn btn-gold" href="/#chat">' + esc(t.lockBtn) + '</a><p style="margin-top:18px"><a class="back-home" href="/">← ' + esc(t.home) + '</a></p></div>';
      return;
    }
    const n = name() ? esc(name()) : '';
    root.innerHTML =
      '<section class="m0-hero"><div class="bot big"><i class="eye l"></i><i class="eye r"></i></div><p class="eyebrow" style="justify-content:center">' + esc(t.eyebrow) + '</p><h1>' + t.h1 + '</h1><p>' + t.sub(n) + '</p><div class="track"></div></section>' +

      '<section class="step"><h2>' + esc(t.s1h) + '</h2><p>' + esc(t.s1p) + '</p><div class="facts">' +
        t.facts.map(f => '<div class="card fact"><div class="em">' + f[0] + '</div><h3>' + esc(f[1]) + '</h3><p>' + esc(f[2]) + '</p></div>').join('') +
        '</div><button class="btn btn-ghost done-btn" type="button" id="s1">' + esc(t.got) + '</button></section>' +

      '<section class="step"><h2>' + esc(t.s2h) + '</h2><p>' + esc(t.s2p) + '</p><div class="rules">' +
        t.rules.map((r, i) => '<button class="rule" type="button" aria-pressed="false"><span class="inner"><span class="face front"><span class="num">' + (i + 1) + '</span><p>' + esc(r[0]) + '</p><span class="flip" style="font-size:13px;color:var(--muted);font-weight:700">👆 ' + esc(t.flip) + '</span></span><span class="face back"><p>' + esc(r[1]) + '</p></span></span></button>').join('') +
        '</div></section>' +

      '<section class="step"><h2>' + esc(t.s3h) + '</h2><p>' + esc(t.s3p) + '</p><div class="builder"><div>' +
        '<div class="bgroup"><b>' + esc(t.cls) + '</b><div class="opts" id="pbC">' + ['8', '9', '10'].map(c => '<button class="opt" type="button" data-v="' + c + '" aria-pressed="' + (pb.c === c) + '">' + c + '</button>').join('') + '</div></div>' +
        '<div class="bgroup" style="margin-top:16px"><b>' + esc(t.subj) + '</b><div class="opts" id="pbS">' + t.subjects.map((s, i) => '<button class="opt" type="button" data-v="' + i + '" aria-pressed="' + (pb.s === i) + '">' + esc(s) + '</button>').join('') + '</div></div>' +
        '<div class="bgroup" style="margin-top:16px"><b>' + esc(t.chap) + '</b><input class="field" id="pbCh" style="width:100%" maxlength="60" placeholder="' + esc(t.chapPh) + '" value="' + esc(pb.ch) + '" /></div>' +
        '<div class="bgroup" style="margin-top:16px"><b>' + esc(t.goal) + '</b><div class="opts" id="pbG">' + t.goals.map(g => '<button class="opt" type="button" data-v="' + g[0] + '" aria-pressed="' + (pb.g === g[0]) + '">' + esc(g[1]) + '</button>').join('') + '</div></div>' +
        '</div><div class="card preview"><small>' + esc(t.yourPrompt) + '</small><p id="pv"></p><div class="row"><button class="copy" type="button" id="pbCopy" style="--c:var(--gold)"><svg class="i"><use href="#i-copy"/></svg><span>' + esc(t.copy) + '</span></button>' +
        '<a class="copy" href="https://chatgpt.com/" target="_blank" rel="noopener">' + esc(t.openGpt) + ' ↗</a><a class="copy" href="https://gemini.google.com/" target="_blank" rel="noopener">' + esc(t.openGem) + ' ↗</a></div></div></div></section>' +

      '<section class="step"><h2>' + esc(t.s4h) + '</h2><p>' + esc(t.s4p) + '</p>' +
        t.quiz.map((q, qi) => '<div class="card mcq" data-q="' + qi + '"><h3>' + esc(q[0]) + '</h3><div class="qopts">' + q[1].map((o, oi) => '<button class="qopt" type="button" data-i="' + oi + '">' + esc(o) + '</button>').join('') + '</div><p class="qfb" hidden></p></div>').join('') +
        '<p class="tatva-count" id="qScore" hidden></p></section>' +
      '<div id="fin"></div>';

    renderTrack(); renderPreview();
    $('#s1').addEventListener('click', e => complete(1, e.currentTarget));
    const flipped = new Set();
    $$('.rule').forEach((r, i) => r.addEventListener('click', () => { const on = r.getAttribute('aria-pressed') !== 'true'; r.setAttribute('aria-pressed', String(on)); if (on) { flipped.add(i); if (flipped.size === 3) complete(2, r); } }));
    const group = (id, key, cast) => $$('#' + id + ' .opt').forEach(b => b.addEventListener('click', () => { pb[key] = cast(b.dataset.v); $$('#' + id + ' .opt').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderPreview(); }));
    group('pbC', 'c', String); group('pbS', 's', Number); group('pbG', 'g', String);
    $('#pbCh').addEventListener('input', e => { pb.ch = e.target.value; renderPreview(); });
    $('#pbCopy').addEventListener('click', async e => {
      const b = e.currentTarget, txt = promptText(true);
      try { await navigator.clipboard.writeText(txt); } catch (err) { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); }
      b.classList.add('done'); $('span', b).textContent = T().copied; setTimeout(() => { b.classList.remove('done'); $('span', b).textContent = T().copy; }, 2000);
      complete(3, b);
    });
    let answered = 0, score = 0;
    $$('.mcq').forEach(card => {
      const q = T().quiz[+card.dataset.q];
      $$('.qopt', card).forEach(b => b.addEventListener('click', () => {
        const ok = +b.dataset.i === 0;
        $$('.qopt', card).forEach(x => { x.disabled = true; if (+x.dataset.i === 0) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong'); else { score++; const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, 30); }
        const fb = $('.qfb', card); fb.innerHTML = '<b class="' + (ok ? 'ok' : 'no') + '">' + esc(ok ? T().right : T().wrong) + '</b> ' + esc(q[2]); fb.hidden = false;
        if (++answered === 3) { const s = $('#qScore'); s.textContent = T().score(score); s.hidden = false; complete(4, s, 25 + score * 5); }
      }));
    });
    if ([1, 2, 3, 4].every(i => S.m0['s' + i])) renderFinish(true);
  }
  function renderFinish(quiet) {
    const t = T(), f = $('#fin'); if (!f) return;
    const n = name() ? esc(name()) : '';
    const date = new Date(S.m0.at || Date.now()).toLocaleDateString(LANG === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!S.m0.at) { S.m0.at = Date.now(); save(); }
    f.innerHTML = '<div class="card finish"><h2>' + esc(t.finH) + '</h2><p>' + t.finP(n) + '</p><div class="cert-mini"><small>' + esc(t.certTop) + '</small><b>' + (n || 'Beyond Tatva') + '</b><span>' + esc(date) + '</span></div><p>' + esc(t.next) + '</p><div class="row"><a class="btn btn-gold" data-enroll href="/#offer">' + esc(t.enroll) + '</a><a class="btn btn-ghost" href="/">' + esc(t.home) + '</a></div></div>';
    if (C.checkoutUrl) $$('[data-enroll]', f).forEach(a => { a.href = C.checkoutUrl; a.rel = 'noopener'; });
    if (!quiet) { burst(innerWidth / 2, innerHeight / 3, 200); f.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => { LANG = b.dataset.lang; S.lang = LANG; save(); render(); }));
  render();
})();
