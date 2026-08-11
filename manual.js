  // ---------- State ----------
  const STORAGE_KEY = 'devops_manual_progress_v1';
  const DEF_SEEN_KEY = 'devops_manual_defs_seen_v1';
  const PART_EXAM_KEY = 'devops_manual_part_exams_v1';
  const FOLDED_KEY = 'devops_manual_folded_v1';
  const state = {
    progress: {},
    partExams: {},         // { [partIdx]: { bestScore, outOf, timesTaken, lastPercent } }
    folded: {},            // { [partIdx]: true } — parts the user has collapsed
    view: 'home',
    currentTopic: null,
    currentExam: null,     // in-memory only: { partIdx, questions, answers, complete }
    user: null,            // Supabase user object when signed in; null otherwise
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state.progress = JSON.parse(raw);
    } catch (e) {}
    try {
      const raw = localStorage.getItem(PART_EXAM_KEY);
      if (raw) state.partExams = JSON.parse(raw);
    } catch (e) {}
    try {
      const raw = localStorage.getItem(FOLDED_KEY);
      if (raw) state.folded = JSON.parse(raw);
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch (e) {}
    scheduleCloudSave();
  }
  function savePartExams() {
    try { localStorage.setItem(PART_EXAM_KEY, JSON.stringify(state.partExams)); } catch (e) {}
    scheduleCloudSave();
  }
  function saveFolded() {
    try { localStorage.setItem(FOLDED_KEY, JSON.stringify(state.folded)); } catch (e) {}
    scheduleCloudSave();
  }
  function progressFor(id) {
    if (!state.progress[id]) state.progress[id] = { visited: false, answers: {}, complete: false };
    return state.progress[id];
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Theme ----------
  function initTheme() {
    const stored = localStorage.getItem('devops_manual_theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let next;
    if (current === 'dark') next = 'light';
    else if (current === 'light') next = 'dark';
    else next = prefersDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('devops_manual_theme', next);
  }

  // ---------- Formatting ----------
  function fmtDate(d) {
    const opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
  }
  function todayIndex() {
    const sorted = [...TOPICS].sort((a, b) => a.num.localeCompare(b.num));
    for (const t of sorted) {
      if (!state.progress[t.id] || !state.progress[t.id].complete) {
        return TOPICS.indexOf(t);
      }
    }
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now - start) / 86400000);
    return day % TOPICS.length;
  }

  // ---------- Rendering ----------
  function renderHome() {
    const now = new Date();
    document.getElementById('today-date').textContent = fmtDate(now);

    const idx = todayIndex();
    const today = TOPICS[idx];
    document.getElementById('today-title').textContent = 'Ch. ' + today.num + ' — ' + today.title;
    document.getElementById('today-tag').textContent = today.tag;
    document.getElementById('today-cta').onclick = () => openTopic(today.id);

    let mastered = 0, visited = 0;
    for (const t of TOPICS) {
      const p = state.progress[t.id];
      if (!p) continue;
      if (p.visited) visited++;
      if (p.complete) mastered++;
    }
    document.getElementById('stat-mastered').textContent = mastered;
    document.getElementById('stat-visited').textContent = visited;
    document.getElementById('stat-streak').textContent = computeStreak();

    document.getElementById('masthead-status').textContent =
      mastered === TOPICS.length ? 'Manual Complete' :
      mastered > 0 ? `${mastered} Chapters Mastered` :
      visited > 0 ? 'Reader in Progress' : 'Reader in Residence';

    document.querySelectorAll('.stat-total').forEach(el => { el.textContent = TOPICS.length; });

    renderDefinitionOfTheDay();

    const container = document.getElementById('chapter-grid');
    container.innerHTML = '';
    PARTS.forEach((part, partIdx) => {
      const chapters = TOPICS.filter(t => t.part === partIdx).sort((a, b) => a.num.localeCompare(b.num));
      if (!chapters.length) return;
      const section = document.createElement('div');
      section.className = 'part-section';
      if (state.folded[partIdx]) section.classList.add('collapsed');
      section.innerHTML = `
        <div class="part-header" role="button" tabindex="0" aria-expanded="${!state.folded[partIdx]}">
          <span class="part-caret" aria-hidden="true">▾</span>
          <span class="part-num">Part ${part.roman}</span>
          <h3 class="part-title">${part.title}</h3>
          <span class="part-desc">${part.desc}</span>
        </div>
        <div class="grid"></div>
      `;
      const header = section.querySelector('.part-header');
      const togglePart = () => {
        const nowCollapsed = !section.classList.contains('collapsed');
        section.classList.toggle('collapsed');
        header.setAttribute('aria-expanded', String(!nowCollapsed));
        if (nowCollapsed) state.folded[partIdx] = true;
        else delete state.folded[partIdx];
        saveFolded();
      };
      header.addEventListener('click', togglePart);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePart(); }
      });
      const grid = section.querySelector('.grid');
      chapters.forEach(t => {
        const p = state.progress[t.id] || {};
        const btn = document.createElement('button');
        btn.className = 'chapter';
        btn.onclick = () => openTopic(t.id);
        const dotClass = p.complete ? 'mastered' : p.visited ? 'visited' : '';
        const statusText = p.complete ? 'Mastered' : p.visited ? 'In progress' : 'Unopened';
        const scoreText = p.complete ? `${quizScore(t.id)}/${t.quiz.length}` : '';
        btn.innerHTML = `
          <div class="chapter-row">
            <span class="chapter-num">Ch. ${t.num}</span>
            <span>Part ${part.roman}</span>
          </div>
          <div class="chapter-title">${t.title}</div>
          <div class="chapter-tag">${t.tag}</div>
          <div class="chapter-status">
            <span class="chapter-dot ${dotClass}"></span>
            <span>${statusText}</span>
            ${scoreText ? `<span class="chapter-score">${scoreText}</span>` : ''}
          </div>
        `;
        grid.appendChild(btn);
      });

      // Part exam card
      const allMastered = chapters.every(c => state.progress[c.id] && state.progress[c.id].complete);
      const pe = state.partExams[partIdx];
      const chapterQCount = chapters.reduce((s, c) => s + (c.quiz ? c.quiz.length : 0), 0);
      const crossCount = (typeof PART_EXAMS !== 'undefined' && PART_EXAMS[partIdx]) ? PART_EXAMS[partIdx].length : 0;
      const examSize = Math.min(20, chapterQCount + crossCount);
      const examDot = pe ? (pe.bestScore === pe.outOf ? 'mastered' : 'visited') : '';
      const bestText = pe ? `Best ${pe.bestScore}/${pe.outOf}` : '';
      const statusLabel = pe ? `Taken ${pe.timesTaken}×` : (allMastered ? 'Ready when you are' : 'Best after finishing the part');
      const examBtn = document.createElement('button');
      examBtn.className = 'exam-card';
      examBtn.onclick = () => startPartExam(partIdx);
      examBtn.innerHTML = `
        <div class="exam-card-row">
          <span class="exam-label">Exam</span>
          <span>Part ${part.roman}</span>
        </div>
        <div class="exam-title">Cumulative Examination</div>
        <div class="exam-tag">${examSize} questions — cross-chapter scenarios plus a sampling from every chapter in Part ${part.roman}. Order and options randomised.</div>
        <div class="exam-status">
          <span class="chapter-dot ${examDot}"></span>
          <span>${statusLabel}</span>
          ${bestText ? `<span class="best">${bestText}</span>` : ''}
        </div>
      `;
      grid.appendChild(examBtn);

      container.appendChild(section);
    });
  }

  function renderDefinitionOfTheDay() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    const idx = (dayOfYear * 7 + 3) % DEFS.length;
    const [term, body] = DEFS[idx];
    document.getElementById('def-term').textContent = term;
    document.getElementById('def-body').innerHTML = body;

    let seen = [];
    try { seen = JSON.parse(localStorage.getItem(DEF_SEEN_KEY) || '[]'); } catch(e){}
    if (!seen.includes(idx)) {
      seen.push(idx);
      localStorage.setItem(DEF_SEEN_KEY, JSON.stringify(seen));
    }
    document.getElementById('def-seen').textContent = seen.length;
    document.getElementById('def-total').textContent = DEFS.length;
  }

  function computeStreak() {
    const key = 'devops_manual_visits';
    let visits = [];
    try { visits = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){}
    const today = new Date().toISOString().slice(0, 10);
    if (!visits.includes(today)) {
      visits.push(today);
      visits = visits.slice(-60);
      localStorage.setItem(key, JSON.stringify(visits));
    }
    visits.sort();
    let streak = 0;
    let cursor = new Date();
    for (;;) {
      const iso = cursor.toISOString().slice(0, 10);
      if (visits.includes(iso)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return streak;
  }

  function quizScore(id) {
    const p = state.progress[id];
    if (!p || !p.answers) return 0;
    const t = TOPICS.find(x => x.id === id);
    let s = 0;
    for (let i = 0; i < t.quiz.length; i++) {
      if (p.answers[i] === t.quiz[i].correct) s++;
    }
    return s;
  }

  function openTopic(id, opts = {}) {
    state.currentTopic = id;
    state.view = 'topic';
    const t = TOPICS.find(x => x.id === id);
    const p = progressFor(id);
    p.visited = true;
    save();

    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('topic-view').classList.add('active');
    updateHomeBtn();
    if (!opts.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const el = document.getElementById('topic-content');
    const conceptsHtml = t.concepts.map(([term, def]) =>
      `<dt>${term}</dt><dd>${def}</dd>`
    ).join('');

    const quizHtml = t.quiz.map((q, i) => {
      const answered = p.answers[i];
      const optHtml = q.options.map((opt, oi) => {
        let cls = 'q-option';
        let mark = '';
        if (answered !== undefined) {
          if (oi === q.correct) { cls += ' correct'; mark = '<span class="mark">✓</span>'; }
          else if (oi === answered) { cls += ' wrong'; mark = '<span class="mark">✕</span>'; }
        }
        return `
          <button class="${cls}" ${answered !== undefined ? 'disabled' : ''}
                  onclick="answerQuestion('${t.id}', ${i}, ${oi})">
            <span class="letter">${String.fromCharCode(97 + oi)}.</span>
            <span>${opt}</span>
            ${mark}
          </button>
        `;
      }).join('');
      const explCls = answered !== undefined ? 'q-explanation shown' : 'q-explanation';
      return `
        <div class="question">
          <div class="q-label">Question <b>${String(i + 1).padStart(2, '0')}</b> of ${String(t.quiz.length).padStart(2, '0')}</div>
          <div class="q-text">${q.q}</div>
          <div class="q-options">${optHtml}</div>
          <div class="${explCls}">
            <strong>${answered === q.correct ? 'Correct.' : answered !== undefined ? 'Not quite.' : ''}</strong>
            ${q.why}
          </div>
        </div>
      `;
    }).join('');

    const score = quizScore(id);
    const total = t.quiz.length;
    const answered = Object.keys(p.answers || {}).length;
    const complete = answered === total;
    const verdict = !complete ? '' :
      score === total ? '<span class="quiz-verdict excellent">Excellent. Chapter mastered.</span>' :
      score >= total - 1 ? '<span class="quiz-verdict excellent">Nearly perfect — chapter mastered.</span>' :
      score >= Math.ceil(total / 2) ? '<span class="quiz-verdict partial">Solid pass. Review the ones you missed.</span>' :
      '<span class="quiz-verdict partial">Worth reading again before moving on.</span>';

    const started = p.quizStarted || answered > 0;
    const quizSection = started ? `
      <div class="quiz">
        <div class="quiz-heading">
          <h3>§4 · Examination</h3>
          <div class="quiz-score">Score <b>${score}</b> / ${total} &nbsp;·&nbsp; ${answered} of ${total} answered</div>
        </div>
        ${quizHtml}
        <div class="quiz-footer">
          <div>${verdict}</div>
          <button class="quiz-reset" onclick="resetQuiz('${t.id}')">Reset examination</button>
        </div>
      </div>
    ` : `
      <div class="quiz-gate">
        <div class="quiz-gate-eyebrow">§4 · Examination</div>
        <div class="quiz-gate-title">Ready to test what you just read?</div>
        <p class="quiz-gate-sub">Five questions on this chapter. Instant feedback with an explanation on each.</p>
        <button class="quiz-start" onclick="startQuiz('${t.id}')">
          <span>Start the examination</span>
          <span class="arrow">→</span>
        </button>
      </div>
    `;

    el.innerHTML = `
      <div class="topic-head">
        <div class="topic-eyebrow"><span>Chapter</span> <span class="num">${t.num}</span> <span>·</span> <span>DevOps Field Manual</span></div>
        <h1 class="topic-title">${t.title}</h1>
        <p class="topic-lede">${t.tag}</p>
      </div>

      <div class="topic-section">
        <h3><span class="sub-num">§1</span> Introduction</h3>
        <div class="prose">${t.intro.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
      </div>

      <div class="topic-section">
        <h3><span class="sub-num">§2</span> Core concepts</h3>
        <dl class="glossary">${conceptsHtml}</dl>
      </div>

      <div class="topic-section">
        <h3><span class="sub-num">§3</span> In practice</h3>
        <pre class="code-block">${t.code}</pre>
        <div class="code-cap">${t.codeCap}</div>
      </div>

      <div class="topic-section">
        ${quizSection}
      </div>
    `;
  }

  function startQuiz(topicId) {
    const p = progressFor(topicId);
    p.quizStarted = true;
    save();
    openTopic(topicId);
    const quizEl = document.querySelector('.quiz');
    if (quizEl) quizEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function answerQuestion(topicId, qIdx, optIdx) {
    const p = progressFor(topicId);
    if (!p.answers) p.answers = {};
    if (p.answers[qIdx] !== undefined) return;
    p.answers[qIdx] = optIdx;
    const t = TOPICS.find(x => x.id === topicId);
    if (Object.keys(p.answers).length === t.quiz.length) {
      p.complete = true;
    }
    save();
    const y = window.scrollY;
    openTopic(topicId, { preserveScroll: true });
    window.scrollTo({ top: y, behavior: 'instant' });
  }

  function resetQuiz(topicId) {
    const p = progressFor(topicId);
    p.answers = {};
    p.complete = false;
    save();
    openTopic(topicId);
  }

  function goHome() {
    state.view = 'home';
    state.currentTopic = null;
    state.currentExam = null;
    document.getElementById('topic-view').classList.remove('active');
    document.getElementById('home-view').classList.remove('hidden');
    renderHome();
    updateHomeBtn();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ---------- Part Examinations ----------
  function startPartExam(partIdx) {
    const partChapters = TOPICS.filter(t => t.part === partIdx);
    if (!partChapters.length) return;

    // Pool 1: chapter quiz questions from this part
    const chapterPool = [];
    partChapters.forEach(t => {
      (t.quiz || []).forEach(q => {
        chapterPool.push({
          kind: 'chapter',
          chapterId: t.id, chapterNum: t.num, chapterTitle: t.title,
          q: q.q, options: q.options, correct: q.correct, why: q.why,
        });
      });
    });

    // Pool 2: exam-only cross-chapter scenario questions
    const examOnlyPool = (typeof PART_EXAMS !== 'undefined' && PART_EXAMS[partIdx] ? PART_EXAMS[partIdx] : []).map(q => ({
      kind: 'crosschapter',
      chapterId: '__cross__', chapterNum: '—', chapterTitle: 'Cross-chapter scenario',
      q: q.q, options: q.options, correct: q.correct, why: q.why,
    }));

    // Blend: aim for ~8 exam-only + ~12 chapter, capped at 20 total, always include ALL exam-only if possible
    const TARGET_TOTAL = 20;
    const takeExamOnly = Math.min(examOnlyPool.length, TARGET_TOTAL);
    const takeChapter = Math.min(chapterPool.length, TARGET_TOTAL - takeExamOnly);
    const chosen = [
      ...shuffle(examOnlyPool).slice(0, takeExamOnly),
      ...shuffle(chapterPool).slice(0, takeChapter),
    ];

    const questions = shuffle(chosen).map(src => {
      const orderIdxs = shuffle(src.options.map((_, i) => i));
      return {
        kind: src.kind,
        chapterId: src.chapterId,
        chapterNum: src.chapterNum,
        chapterTitle: src.chapterTitle,
        q: src.q,
        options: orderIdxs.map(i => src.options[i]),
        correct: orderIdxs.indexOf(src.correct),
        why: src.why,
      };
    });

    state.currentExam = { partIdx, questions, answers: {}, complete: false };
    state.currentTopic = null;
    state.view = 'exam';
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('topic-view').classList.add('active');
    updateHomeBtn();
    renderExam();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function renderExam() {
    const exam = state.currentExam;
    if (!exam) return;
    const part = PARTS[exam.partIdx];
    const total = exam.questions.length;
    const answered = Object.keys(exam.answers).length;
    const score = exam.questions.reduce((s, q, i) => s + (exam.answers[i] === q.correct ? 1 : 0), 0);
    const complete = answered === total;
    const percent = total > 0 ? Math.round(score / total * 100) : 0;

    const byChapter = {};
    exam.questions.forEach((q, i) => {
      if (!byChapter[q.chapterId]) {
        byChapter[q.chapterId] = { title: q.chapterTitle, num: q.chapterNum, right: 0, total: 0 };
      }
      byChapter[q.chapterId].total++;
      if (exam.answers[i] === q.correct) byChapter[q.chapterId].right++;
    });

    const questionsHtml = exam.questions.map((q, i) => {
      const ans = exam.answers[i];
      const optHtml = q.options.map((opt, oi) => {
        let cls = 'q-option';
        let mark = '';
        if (ans !== undefined) {
          if (oi === q.correct) { cls += ' correct'; mark = '<span class="mark">✓</span>'; }
          else if (oi === ans) { cls += ' wrong'; mark = '<span class="mark">✕</span>'; }
        }
        return `
          <button class="${cls}" ${ans !== undefined ? 'disabled' : ''}
                  onclick="answerExamQuestion(${i}, ${oi})">
            <span class="letter">${String.fromCharCode(97 + oi)}.</span>
            <span>${opt}</span>
            ${mark}
          </button>
        `;
      }).join('');
      const explCls = ans !== undefined ? 'q-explanation shown' : 'q-explanation';
      const sourceLabel = q.kind === 'crosschapter'
        ? 'Cross-chapter · Scenario'
        : `Ch. ${q.chapterNum} · ${q.chapterTitle}`;
      return `
        <div class="question">
          <div class="q-label">
            Question <b>${String(i + 1).padStart(2, '0')}</b> of ${String(total).padStart(2, '0')}
            &nbsp;·&nbsp; <span class="q-source">${sourceLabel}</span>
          </div>
          <div class="q-text">${q.q}</div>
          <div class="q-options">${optHtml}</div>
          <div class="${explCls}">
            <strong>${ans === q.correct ? 'Correct.' : ans !== undefined ? 'Not quite.' : ''}</strong>
            ${q.why}
          </div>
        </div>
      `;
    }).join('');

    const verdict = !complete ? '' :
      percent >= 90 ? '<span class="quiz-verdict excellent">Excellent. This part is truly in.</span>' :
      percent >= 70 ? '<span class="quiz-verdict excellent">Solid pass — comfortable with the material.</span>' :
      percent >= 50 ? '<span class="quiz-verdict partial">Enough to build on. Revisit the weakest chapters below.</span>' :
      '<span class="quiz-verdict partial">Worth another pass through the part before moving on.</span>';

    const breakdownRows = Object.entries(byChapter).map(([id, c]) => ({ id, ...c }));
    // Sort: real chapters by num ascending, cross-chapter at the end
    breakdownRows.sort((a, b) => {
      if (a.id === '__cross__') return 1;
      if (b.id === '__cross__') return -1;
      return a.num.localeCompare(b.num);
    });
    const breakdownHtml = complete ? `
      <div class="exam-breakdown">
        <h3>Breakdown by chapter</h3>
        <ul class="breakdown-list">
          ${breakdownRows.map(c => {
            const pct = c.right / c.total;
            const cls = pct === 1 ? 'perfect' : pct < 0.5 ? 'weak' : '';
            const label = c.id === '__cross__'
              ? '<em>Cross-chapter scenarios</em>'
              : `Ch. ${c.num} · ${c.title}`;
            return `<li><span class="brk-ch">${label}</span> <span class="brk-score ${cls}">${c.right}/${c.total}</span></li>`;
          }).join('')}
        </ul>
      </div>
    ` : '';

    document.getElementById('topic-content').innerHTML = `
      <div class="topic-head">
        <div class="topic-eyebrow"><span>Part ${part.roman}</span> <span>·</span> <span>Cumulative Examination</span></div>
        <h1 class="topic-title">${part.title}</h1>
        <p class="topic-lede">${total} questions mixed from every chapter in Part ${part.roman}, in random order — the exam that ties it all together.</p>
      </div>

      <div class="topic-section">
        <div class="quiz">
          <div class="quiz-heading">
            <h3>Examination</h3>
            <div class="quiz-score">Score <b>${score}</b> / ${total} &nbsp;·&nbsp; ${answered} of ${total} answered</div>
          </div>
          ${questionsHtml}
          ${breakdownHtml}
          <div class="quiz-footer">
            <div>${verdict}</div>
            <button class="quiz-reset" onclick="retryPartExam(${exam.partIdx})">Retry with new mix</button>
          </div>
        </div>
      </div>
    `;
  }

  function answerExamQuestion(qIdx, optIdx) {
    const exam = state.currentExam;
    if (!exam || exam.answers[qIdx] !== undefined) return;
    exam.answers[qIdx] = optIdx;
    const total = exam.questions.length;
    const answered = Object.keys(exam.answers).length;
    if (answered === total) {
      exam.complete = true;
      const score = exam.questions.reduce((s, q, i) => s + (exam.answers[i] === q.correct ? 1 : 0), 0);
      const prev = state.partExams[exam.partIdx] || { bestScore: 0, outOf: total, timesTaken: 0 };
      state.partExams[exam.partIdx] = {
        bestScore: Math.max(prev.bestScore, score),
        outOf: total,
        timesTaken: (prev.timesTaken || 0) + 1,
        lastPercent: Math.round(score / total * 100),
      };
      savePartExams();
    }
    const y = window.scrollY;
    renderExam();
    window.scrollTo({ top: y, behavior: 'instant' });
  }

  function retryPartExam(partIdx) {
    startPartExam(partIdx);
  }

  function updateHomeBtn() {
    const btn = document.getElementById('home-btn');
    if (state.view === 'home') {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled');
    }
  }

  window.startPartExam = startPartExam;
  window.answerExamQuestion = answerExamQuestion;
  window.retryPartExam = retryPartExam;

  // ---------- Cloud sync (Supabase) ----------
  const supa = initSupabase();

  function initSupabase() {
    const cfg = window.APP_CONFIG || {};
    const url = cfg.SUPABASE_URL || '';
    const key = cfg.SUPABASE_ANON_KEY || '';
    if (!url || !key || url.startsWith('https://YOUR-') || key.startsWith('YOUR-')) return null;
    if (typeof supabase === 'undefined' || !supabase.createClient) return null;
    try {
      return supabase.createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      });
    } catch (e) {
      console.error('Supabase init failed:', e);
      return null;
    }
  }

  let authMode = 'signin';
  let cloudSaveTimer = null;

  async function initAuth() {
    if (!supa) return;
    document.getElementById('auth-signin-btn').hidden = false;
    document.getElementById('auth-signin-btn').addEventListener('click', openAuthModal);
    document.getElementById('auth-signout-btn').addEventListener('click', signOut);
    document.getElementById('auth-close').addEventListener('click', closeAuthModal);
    document.getElementById('auth-backdrop').addEventListener('click', closeAuthModal);
    document.getElementById('auth-tab-signin').addEventListener('click', () => setAuthMode('signin'));
    document.getElementById('auth-tab-signup').addEventListener('click', () => setAuthMode('signup'));
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('auth-modal').hidden) closeAuthModal();
    });

    try {
      const { data: { session } } = await supa.auth.getSession();
      if (session && session.user) await onAuthSignedIn(session.user);
    } catch (e) { console.error('getSession failed:', e); }

    supa.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && session.user) onAuthSignedIn(session.user);
      else if (event === 'SIGNED_OUT') onAuthSignedOut();
    });
  }

  function setAuthMode(mode) {
    authMode = mode;
    const isSignin = mode === 'signin';
    document.getElementById('auth-tab-signin').classList.toggle('active', isSignin);
    document.getElementById('auth-tab-signup').classList.toggle('active', !isSignin);
    document.getElementById('auth-tab-signin').setAttribute('aria-selected', String(isSignin));
    document.getElementById('auth-tab-signup').setAttribute('aria-selected', String(!isSignin));
    document.getElementById('auth-title').textContent = isSignin ? 'Sign in' : 'Create account';
    document.getElementById('auth-submit').textContent = isSignin ? 'Sign in →' : 'Create account →';
    document.getElementById('auth-password').setAttribute('autocomplete', isSignin ? 'current-password' : 'new-password');
    document.getElementById('auth-error').textContent = '';
  }

  function openAuthModal() {
    document.getElementById('auth-modal').hidden = false;
    setTimeout(() => document.getElementById('auth-email').focus(), 60);
  }
  function closeAuthModal() {
    document.getElementById('auth-modal').hidden = true;
    document.getElementById('auth-error').textContent = '';
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');
    errorEl.textContent = '';
    submitBtn.disabled = true;
    try {
      if (authMode === 'signup') {
        const { error } = await supa.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      closeAuthModal();
    } catch (err) {
      errorEl.textContent = (err && err.message) ? err.message : String(err);
    } finally {
      submitBtn.disabled = false;
    }
  }

  async function signOut() {
    if (!supa) return;
    try { await supa.auth.signOut(); } catch (e) { console.error(e); }
  }

  async function onAuthSignedIn(user) {
    state.user = user;
    document.getElementById('auth-signin-btn').hidden = true;
    const info = document.getElementById('auth-user-info');
    info.hidden = false;
    document.getElementById('auth-user-email').textContent = user.email || 'signed in';

    let data = null, error = null;
    try {
      const res = await supa.from('progress').select('*').eq('user_id', user.id).maybeSingle();
      data = res.data; error = res.error;
    } catch (e) { error = e; }
    if (error) { console.error('cloud load error:', error); return; }

    const localHasData =
      Object.keys(state.progress).length > 0 ||
      Object.keys(state.partExams).length > 0;

    if (!data) {
      // New cloud account — offer to import local
      if (localHasData && window.confirm('Import your existing local progress into your new cloud account?')) {
        await cloudSaveNow();
      } else {
        state.progress = {};
        state.partExams = {};
        state.folded = {};
        try { await supa.from('progress').insert({ user_id: user.id }); } catch (e) {}
      }
    } else {
      state.progress   = data.progress   || {};
      state.partExams  = data.part_exams || {};
      state.folded     = data.folded     || {};
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
        localStorage.setItem(PART_EXAM_KEY, JSON.stringify(state.partExams));
        localStorage.setItem(FOLDED_KEY, JSON.stringify(state.folded));
      } catch (e) {}
    }
    if (state.view === 'home') renderHome();
  }

  function onAuthSignedOut() {
    state.user = null;
    document.getElementById('auth-signin-btn').hidden = false;
    document.getElementById('auth-user-info').hidden = true;
    document.getElementById('auth-user-email').textContent = '';
    // localStorage keeps the last known state; app continues in local mode.
  }

  async function cloudSaveNow() {
    if (!supa || !state.user) return;
    try {
      const { error } = await supa.from('progress').upsert({
        user_id: state.user.id,
        progress: state.progress,
        part_exams: state.partExams,
        folded: state.folded,
      });
      if (error) console.error('cloud save error:', error);
    } catch (e) { console.error('cloud save exception:', e); }
  }
  function scheduleCloudSave() {
    if (!supa || !state.user) return;
    if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(cloudSaveNow, 800);
  }

  // ---------- Boot ----------
  window.answerQuestion = answerQuestion;
  window.resetQuiz = resetQuiz;
  window.startQuiz = startQuiz;

  initTheme();
  load();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('back-link').addEventListener('click', goHome);
  document.getElementById('home-btn').addEventListener('click', goHome);
  renderHome();
  updateHomeBtn();
  initAuth();
