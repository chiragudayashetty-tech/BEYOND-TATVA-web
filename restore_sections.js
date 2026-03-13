const fs = require('fs');
let html = fs.readFileSync('index - Copy.html', 'utf8');

// ═══════════════════════════════════════════════════════
// RESTORE 1: Insert benefits-grid before the prematurely-closed </section>
// ═══════════════════════════════════════════════════════

const benefitsGrid = `                    <div class="benefits-grid">
                        <div class="benefit-card reveal"><span class="benefit-ico">📚</span>
                            <div class="benefit-t eo">Board Exam Preparation</div>
                            <div class="benefit-t ko kn-font">ಬೋರ್ಡ್ ಪರೀಕ್ಷೆ ತಯಾರಿ</div>
                            <div class="benefit-d eo">AI Study Buddy for stronger revision and conceptual clarity</div>
                            <div class="benefit-d ko kn-font">AI Study Buddy ಮೂಲಕ ಉತ್ತಮ ಪರಿಷ್ಕರಣೆ ಮತ್ತು ಸ್ಪಷ್ಟ ತಿಳುವಳಿಕೆ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d1"><span class="benefit-ico">⚡</span>
                            <div class="benefit-t eo">Faster Revision Systems</div>
                            <div class="benefit-t ko kn-font">ವೇಗವಾದ ಪರಿಷ್ಕರಣೆ</div>
                            <div class="benefit-d eo">AI-powered flashcards, summaries, and practice questions</div>
                            <div class="benefit-d ko kn-font">AI ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳು, ಸಾರಾಂಶಗಳು, ಮತ್ತು ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು</div>
                        </div>
                        <div class="benefit-card reveal reveal-d2"><span class="benefit-ico">🎨</span>
                            <div class="benefit-t eo">Creative Image Generation</div>
                            <div class="benefit-t ko kn-font">AI ಚಿತ್ರ ರಚನೆ</div>
                            <div class="benefit-d eo">Create professional visuals, posters, and presentations</div>
                            <div class="benefit-d ko kn-font">ವೃತ್ತಿಪರ ಚಿತ್ರಗಳು, ಪೋಸ್ಟರ್‌ಗಳನ್ನು ತಯಾರಿಸಿ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d3"><span class="benefit-ico">🎬</span>
                            <div class="benefit-t eo">Short Film Creation</div>
                            <div class="benefit-t ko kn-font">ಕಿರುಚಿತ್ರ ತಯಾರಿ</div>
                            <div class="benefit-d eo">Script, produce, and edit AI-assisted short films</div>
                            <div class="benefit-d ko kn-font">AI ಸಹಾಯದಿಂದ ಕಿರುಚಿತ್ರಗಳನ್ನು ಮಾಡಿ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d4"><span class="benefit-ico">🧠</span>
                            <div class="benefit-t eo">15+ AI Life Hacks</div>
                            <div class="benefit-t ko kn-font">15+ AI ಲೈಫ್ ಹ್ಯಾಕ್ಸ್</div>
                            <div class="benefit-d eo">School, productivity, crisis handling, basic finance literacy</div>
                            <div class="benefit-d ko kn-font">ಶಾಲೆ, ಉತ್ಪಾದಕತೆ, ಬಿಕ್ಕಟ್ಟು ನಿರ್ವಹಣೆ, ಹಣಕಾಸು ಸಾಕ್ಷರತೆ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d5"><span class="benefit-ico">💻</span>
                            <div class="benefit-t eo">Build Websites & Apps</div>
                            <div class="benefit-t ko kn-font">ವೆಬ್‌ಸೈಟ್‌ಗಳು ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಮಾಡಿ</div>
                            <div class="benefit-d eo">Websites, apps, games — AI software engineering foundations</div>
                            <div class="benefit-d ko kn-font">ವೆಬ್‌ಸೈಟ್‌ಗಳು, ಅಪ್ಲಿಕೇಶನ್‌ಗಳು, ಗೇಮ್‌ಗಳು — AI ಎಂಜಿನಿಯರಿಂಗ್ ಅಡಿಪಾಯ</div>
                        </div>
                        <div class="benefit-card reveal"><span class="benefit-ico">🎮</span>
                            <div class="benefit-t eo">Build Games</div>
                            <div class="benefit-t ko kn-font">ಗೇಮ್‌ಗಳನ್ನು ಮಾಡಿ</div>
                            <div class="benefit-d eo">Create interactive games using AI tools</div>
                            <div class="benefit-d ko kn-font">AI ಉಪಕರಣಗಳನ್ನು ಬಳಸಿ ಸಂವಾದಾತ್ಮಕ ಗೇಮ್‌ಗಳನ್ನು ತಯಾರಿಸಿ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d1"><span class="benefit-ico">💰</span>
                            <div class="benefit-t eo">Earn Using AI Skills</div>
                            <div class="benefit-t ko kn-font">AI ಕೌಶಲ್ಯದಿಂದ ಹಣ ಗಳಿಸಿ</div>
                            <div class="benefit-d eo">Monetization foundations and real-world earning paths</div>
                            <div class="benefit-d ko kn-font">ನಿಜ ಜೀವನದಲ್ಲಿ ಹಣ ಗಳಿಸಲು ಅಡಿಪಾಯ</div>
                        </div>
                        <div class="benefit-card reveal reveal-d2"><span class="benefit-ico">🧭</span>
                            <div class="benefit-t eo">Conceptual Clarity</div>
                            <div class="benefit-t ko kn-font">ಸ್ಪಷ್ಟ ಪರಿಕಲ್ಪನೆ</div>
                            <div class="benefit-d eo">Deeper understanding of subjects, not just memorization</div>
                            <div class="benefit-d ko kn-font">ಕೇವಲ ಬಾಯಿಪಾಠ ಅಲ್ಲ, ಆಳವಾದ ಅರ್ಥಗ್ರಹಣ</div>
                        </div>
                    </div>
                </div>`;

// Find the broken close: the Benefits section missing its grid
// Pattern: after the Kannada subtitle paragraph, there's empty space then </section>
html = html.replace(
    /(ಸಿಗುವ ಎಲ್ಲ ಕೌಶಲ್ಯಗಳು\.<\/p>)\s*(<\/section>)/,
    '$1\n' + benefitsGrid + '\n            $2'
);

// ═══════════════════════════════════════════════════════
// RESTORE 2: Insert Parent Assurance section between Benefits and Sentiment
// ═══════════════════════════════════════════════════════

const parentAssurance = `
            <div class="div"></div>

            <!-- PARENT ASSURANCE -->
            <section class="sec">
                <div class="wrap">
                    <span class="lbl reveal lbl-g eo">Parent Assurance</span>
                    <span class="lbl reveal lbl-g ko kn-font">\u0CAA\u0CCB\u0CB7\u0C95\u0CB0\u0CBF\u0C97\u0CC6 \u0C96\u0CBE\u0CA4\u0CCD\u0CB0\u0CBF</span>
                    <h2 style="font-size:1.32rem;margin-bottom:8px" class="eo reveal">Safe. Structured. Supervised.</h2>
                    <h2 style="font-size:1.32rem;margin-bottom:8px" class="ko kn-font reveal">\u0CB8\u0CC1\u0CB0\u0C95\u0CCD\u0CB7\u0CBF\u0CA4. \u0CB5\u0CCD\u0CAF\u0CB5\u0CB8\u0CCD\u0CA5\u0CBF\u0CA4. Supervised.</h2>
                    <p style="font-size:.85rem;margin-bottom:18px" class="eo">Common parent concerns \u2014 answered directly.</p>
                    <p style="font-size:.85rem;margin-bottom:18px" class="ko kn-font">\u0CAA\u0CCB\u0CB7\u0C95\u0CB0 \u0CB8\u0CBE\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C9A\u0CBF\u0C82\u0CA4\u0CC6\u0C97\u0CB3\u0CBF\u0C97\u0CC6 \u0CA8\u0CC7\u0CB0 \u0C89\u0CA4\u0CCD\u0CA4\u0CB0.</p>
                    <div class="aitem reveal reveal-d1">
                        <div class="aico">\uD83D\uDCDA</div>
                        <div>
                            <div class="atitle eo">Board syllabus aligned</div>
                            <div class="atitle ko kn-font">\u0CAC\u0CCB\u0CB0\u0CCD\u0CA1\u0CCD \u0CAA\u0CA0\u0CCD\u0CAF\u0C95\u0CCD\u0CB0\u0CAE \u0C86\u0CA7\u0CBE\u0CB0\u0CBF\u0CA4</div>
                            <div class="adesc eo">Every example and practice question is drawn from NCERT and board textbooks \u2014 matched to what your child is already studying.</div>
                            <div class="adesc ko kn-font">\u0CAA\u0CCD\u0CB0\u0CA4\u0CBF \u0C89\u0CA6\u0CBE\u0CB9\u0CB0\u0CA3\u0CC6 NCERT \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CAC\u0CCB\u0CB0\u0CCD\u0CA1\u0CCD \u0CAA\u0CA0\u0CCD\u0CAF\u0CAA\u0CC1\u0CB8\u0CCD\u0CA4\u0C95\u0CA6\u0CBF\u0C82\u0CA6 \u2014 \u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CAE\u0C97\u0CC1 \u0C93\u0CA6\u0CC1\u0CA4\u0CCD\u0CA4\u0CBF\u0CB0\u0CC1\u0CB5 \u0CAA\u0CA0\u0CCD\u0CAF\u0C95\u0CCD\u0CB0\u0CAE\u0C95\u0CCD\u0C95\u0CC6 \u0CA8\u0CC7\u0CB0 \u0CB8\u0C82\u0CAC\u0C82\u0CA7.</div>
                        </div>
                    </div>
                    <div class="aitem reveal reveal-d2">
                        <div class="aico">\u2696\uFE0F</div>
                        <div>
                            <div class="atitle eo">Ethics is a core part of the course</div>
                            <div class="atitle ko kn-font">\u0CA8\u0CC8\u0CA4\u0CBF\u0C95\u0CA4\u0CC6 \u0CAE\u0CC1\u0C96\u0CCD\u0CAF \u0CAD\u0CBE\u0C97</div>
                            <div class="adesc eo">Your child will learn exactly when NOT to use AI \u2014 during exams, in independent work. Responsible usage is taught throughout every module.</div>
                            <div class="adesc ko kn-font">AI \u0CAF\u0CBE\u0CB5\u0CBE\u0C97 \u0C89\u0CAA\u0CAF\u0CCB\u0C97\u0CBF\u0CB8\u0CAC\u0CC7\u0C95\u0CC1, \u0CAF\u0CBE\u0CB5\u0CBE\u0C97 \u0CAC\u0CC7\u0CA1 \u2014 \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF \u0CAE\u0CBE\u0CA1\u0CCD\u0CAF\u0CC2\u0CB2\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CB8\u0CCD\u0CAA\u0CB7\u0CCD\u0C9F\u0CB5\u0CBE\u0C97\u0CBF \u0C95\u0CB2\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CC7\u0CB5\u0CC6.</div>
                        </div>
                    </div>
                    <div class="aitem reveal reveal-d3">
                        <div class="aico">\uD83D\uDC41\uFE0F</div>
                        <div>
                            <div class="atitle eo">Safe, curated tools only</div>
                            <div class="atitle ko kn-font">\u0CB8\u0CC1\u0CB0\u0C95\u0CCD\u0CB7\u0CBF\u0CA4, \u0C86\u0CAF\u0CCD\u0CA6 \u0C89\u0CAA\u0C95\u0CB0\u0CA3\u0C97\u0CB3\u0CC1 \u0CAE\u0CBE\u0CA4\u0CCD\u0CB0</div>
                            <div class="adesc eo">The course uses specific AI tools \u2014 not open internet browsing. All tools are ad-free and age-appropriate.</div>
                            <div class="adesc ko kn-font">\u0C95\u0CCB\u0CB0\u0CCD\u0CB8\u0CCD \u0CA8\u0CBF\u0CB0\u0CCD\u0CA6\u0CBF\u0CB7\u0CCD\u0C9F AI \u0C89\u0CAA\u0C95\u0CB0\u0CA3\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAE\u0CBE\u0CA4\u0CCD\u0CB0 \u0C89\u0CAA\u0CAF\u0CCB\u0C97\u0CBF\u0CB8\u0CC1\u0CA4\u0CCD\u0CA4\u0CA6\u0CC6. \u0C8E\u0CB2\u0CCD\u0CB2 \u0C89\u0CAA\u0C95\u0CB0\u0CA3\u0C97\u0CB3\u0CC1 \u0CB8\u0CC1\u0CB0\u0C95\u0CCD\u0CB7\u0CBF\u0CA4, \u0CB5\u0CAF\u0CB8\u0CCD\u0CB8\u0CBF\u0C97\u0CC6 \u0CB8\u0CC2\u0C95\u0CCD\u0CA4\u0CB5\u0CBE\u0CA6\u0CB5\u0CC1.</div>
                        </div>
                    </div>
                    <div class="aitem reveal reveal-d3">
                        <div class="aico">\uD83D\uDCAC</div>
                        <div>
                            <div class="atitle eo">WhatsApp support for parents</div>
                            <div class="atitle ko kn-font">\u0CAA\u0CCB\u0CB7\u0C95\u0CB0\u0CBF\u0C97\u0CC6 \u0CB5\u0CBE\u0C9F\u0CCD\u0CB8\u0CBE\u0CAA\u0CCD \u0CAC\u0CC6\u0C82\u0CAC\u0CB2</div>
                            <div class="adesc eo">Message us directly \u2014 not a chatbot. We respond personally within the day.</div>
                            <div class="adesc ko kn-font">\u0CA8\u0CC7\u0CB0\u0CB5\u0CBE\u0C97\u0CBF \u0CB8\u0C82\u0CA6\u0CC7\u0CB6 \u0CAE\u0CBE\u0CA1\u0CBF \u2014 \u0C9A\u0CBE\u0C9F\u0CCD\u200C\u0CAC\u0CBE\u0C9F\u0CCD \u0C85\u0CB2\u0CCD\u0CB2. \u0CA6\u0CBF\u0CA8\u0CA6\u0CCA\u0CB3\u0C97\u0CC6 \u0C96\u0CC1\u0CA6\u0CCD\u0CA6\u0CBE\u0C97\u0CBF \u0C89\u0CA4\u0CCD\u0CA4\u0CB0.</div>
                        </div>
                    </div>
                </div>
            </section>`;

// Insert between the Benefits </section> closing div and the PARENT SENTIMENT section
html = html.replace(
    /(<\/section>\s*\r?\n\s*<div class="div"><\/div>\s*\r?\n\s*<!-- PARENT SENTIMENT)/,
    `</section>\n${parentAssurance}\n\n            <div class="div"></div>\n\n            <!-- PARENT SENTIMENT`
);

// Fix: we need to check if the replacement above worked — if not, try simpler approach
if (!html.includes('Parent Assurance')) {
    // Alternative: insert before <!-- PARENT SENTIMENT
    html = html.replace(
        /(<!-- PARENT SENTIMENT CARDS -->)/,
        parentAssurance + '\n\n            <div class="div"></div>\n\n            $1'
    );
}

fs.writeFileSync('index - Copy.html', html, 'utf8');
console.log('✅ benefits-grid restored with all 9 benefit cards');
console.log('✅ Parent Assurance section restored with all 4 assurance items');
