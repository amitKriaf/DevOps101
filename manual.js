  // ---------- State ----------
  const STORAGE_KEY = 'devops_manual_progress_v1';
  const DEF_SEEN_KEY = 'devops_manual_defs_seen_v1';
  const state = {
    progress: {},
    view: 'home',
    currentTopic: null,
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state.progress = JSON.parse(raw);
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch (e) {}
  }
  function progressFor(id) {
    if (!state.progress[id]) state.progress[id] = { visited: false, answers: {}, complete: false };
    return state.progress[id];
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
      section.innerHTML = `
        <div class="part-header">
          <span class="part-num">Part ${part.roman}</span>
          <h3 class="part-title">${part.title}</h3>
          <span class="part-desc">${part.desc}</span>
        </div>
        <div class="grid"></div>
      `;
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

  function openTopic(id) {
    state.currentTopic = id;
    state.view = 'topic';
    const t = TOPICS.find(x => x.id === id);
    const p = progressFor(id);
    p.visited = true;
    save();

    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('topic-view').classList.add('active');
    updateHomeBtn();
    window.scrollTo({ top: 0, behavior: 'instant' });

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
    openTopic(topicId);
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
    document.getElementById('topic-view').classList.remove('active');
    document.getElementById('home-view').classList.remove('hidden');
    renderHome();
    updateHomeBtn();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function updateHomeBtn() {
    const btn = document.getElementById('home-btn');
    if (state.view === 'home') {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled');
    }
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
