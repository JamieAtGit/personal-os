const routines = {
  easy: [
    "10 min walk",
    "Protein + water",
    "Stretch 5 min",
    "One honest journal line"
  ],
  medium: [
    "Gym or run",
    "Read 15 min",
    "Guitar 20 min",
    "Log spending",
    "Journal"
  ],
  hard: [
    "Gym + cardio",
    "Deep work (90 min)",
    "Mobility work",
    "Creative session",
    "Full reflection"
  ]
};

function setMood(level) {
  localStorage.setItem("mood", level);
  renderTasks(level);
}

function renderTasks(level) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  routines[level].forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("span");
    label.textContent = " " + task;

    li.appendChild(checkbox);
    li.appendChild(label);
    taskList.appendChild(li);
  });
}

function saveReflection() {
  const text = document.getElementById("reflectionText").value;
  const date = new Date().toISOString().split("T")[0];

  localStorage.setItem(`reflection-${date}`, text);
  alert("Reflection saved.");
}

window.onload = () => {
  const savedMood = localStorage.getItem("mood");
  if (savedMood) {
    renderTasks(savedMood);
  }
};

/* ------------------ Goals / Resolutions Tracker ------------------ */

const GOALS_KEY = 'personal_goals_v1';

const METRICS_KEY = 'personal_metrics_v1';

// metrics: separate arrays per metric type
let metricsData = {
  weight: [],
  squat: [],
  bench: [],
  deadlift: [],
  studyHours: [],
  readingMinutes: [],
  guitarMinutes: []
};

// Per-metric visual and scale hints
const METRIC_CONFIGS = {
  weight: { label: 'Weight (kg)', color: '255,179,186', min: 50, max: 100 },
  squat: { label: 'Squat (kg)', color: '126,199,255', min: 40, max: 200 },
  bench: { label: 'Bench (kg)', color: '255,194,125', min: 40, max: 160 },
  deadlift: { label: 'Deadlift (kg)', color: '134,255,160', min: 40, max: 220 },
  studyHours: { label: 'Study Hours', color: '140,140,255', min: 0, max: 20 },
  readingMinutes: { label: 'Reading Minutes', color: '200,160,255', min: 0, max: 240 },
  guitarMinutes: { label: 'Guitar Minutes', color: '99,255,200', min: 0, max: 180 }
};

/* Background visibility control (off | subtle | visible) */
const BG_LEVEL_KEY = 'personal_bg_level_v1';
function loadBgLevel() { try { const v = localStorage.getItem(BG_LEVEL_KEY); return v || 'subtle'; } catch (e) { return 'subtle'; } }
function saveBgLevel(v) { try { localStorage.setItem(BG_LEVEL_KEY, v); } catch (e) {} }
function applyBgLevel(level) {
  document.body.classList.remove('bg-off','bg-subtle','bg-visible');
  document.body.classList.add('bg-' + level);
}

let goalsData = {
  "Fitness": [
    { id: 1, title: "Get to 80kg (lean)", timeframe: "yearly", target: "80kg", done: false },
    { id: 2, title: "Hit a 160kg squat", timeframe: "yearly", target: "160kg", done: false },
    { id: 3, title: "Hit 130-135kg bench", timeframe: "yearly", target: "135kg", done: false },
    { id: 4, title: "3× pull-ups at 60kg (clean)", timeframe: "yearly", done: false },
    { id: 5, title: "Do 3×5k runs per week", timeframe: "weekly", done: false },
    { id: 6, title: "Treadmill 10-20 min daily", timeframe: "daily", done: false },
    { id: 7, title: "Improve stretching & mobility", timeframe: "weekly", done: false },
    { id: 8, title: "Follow meal plans & prep", timeframe: "daily", done: false, target: "3200 kcal (example)" }
  ],
  "Habits": [
    { id: 11, title: "Stop smoking weed", timeframe: "daily", done: false },
    { id: 12, title: "No nicotine / vaping", timeframe: "daily", done: false },
    { id: 13, title: "No fast food (strict diet)", timeframe: "daily", done: false }
  ],
  "Work & University": [
    { id: 21, title: "Get a 2:1 or 1st (if possible)", timeframe: "yearly", done: false },
    { id: 22, title: "20 hours/week study", timeframe: "weekly", done: false },
    { id: 23, title: "Apply to at least 50 grad schemes", timeframe: "yearly", done: false },
    { id: 24, title: "Finish coop by late June/ mid July", timeframe: "monthly", done: false },
    { id: 25, title: "Look at jobs in Australia", timeframe: "monthly", done: false },
    { id: 26, title: "Save ~6-7k for next chapter", timeframe: "yearly", target: "6000-7000", done: false }
  ],
  "Finances": [
    { id: 31, title: "Learn crypto & stocks (5h/week)", timeframe: "weekly", done: false },
    { id: 32, title: "Put % into savings & stocks", timeframe: "monthly", done: false },
    { id: 33, title: "Log expenses weekly", timeframe: "weekly", done: false }
  ],
  "Skills": [
    { id: 41, title: "Read 15 minutes/day", timeframe: "daily", done: false },
    { id: 42, title: "Read 2 books/month", timeframe: "monthly", done: false },
    { id: 43, title: "Practice guitar: 4 songs/month", timeframe: "monthly", done: false },
    { id: 44, title: "Martial arts once/week", timeframe: "weekly", done: false },
    { id: 45, title: "Journal daily / weekly", timeframe: "daily", done: false },
    { id: 46, title: "Learn a new language (pick one)", timeframe: "monthly", done: false }
  ],
  "Mental Habits": [
    { id: 51, title: "Stick to routines (standard minimum)", timeframe: "daily", done: false },
    { id: 52, title: "Reduce screen time", timeframe: "daily", done: false },
    { id: 53, title: "Hold myself accountable", timeframe: "weekly", done: false },
    { id: 54, title: "List top daily tasks each morning", timeframe: "daily", done: false }
  ],
  "Knowledge": [
    { id: 61, title: "Critical thinking workout (15 min/week)", timeframe: "weekly", done: false },
    { id: 62, title: "Study history & geopolitics", timeframe: "monthly", done: false },
    { id: 63, title: "Learn money & economics basics", timeframe: "monthly", done: false }
  ],
  "Trips": [
    { id: 71, title: "Plan Canada trip", timeframe: "yearly", done: false },
    { id: 72, title: "Plan Australia trip", timeframe: "yearly", done: false },
    { id: 73, title: "Plan New Zealand / Greenland ideas", timeframe: "yearly", done: false }
  ],
  "Relationship": [
    { id: 81, title: "Apologize and communicate honestly", timeframe: "weekly", done: false },
    { id: 82, title: "Plan a meet-up date to keep spark", timeframe: "monthly", done: false }
  ]
};

function saveGoals() {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goalsData));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
}

function loadGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      goalsData = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load goals', e);
  }
}

/* Dashboard / Checklist / 12-week plans */
const PLANS_KEY = 'personal_plans_v1';
let plansData = []; // array of plans

function savePlans() {
  try { localStorage.setItem(PLANS_KEY, JSON.stringify(plansData)); } catch (e) { console.error('savePlans failed', e); }
}

function loadPlans() {
  try { const raw = localStorage.getItem(PLANS_KEY); if (raw) plansData = JSON.parse(raw); } catch (e) { console.error('loadPlans failed', e); }
}

function computeSummary() {
  const total = Object.values(goalsData).reduce((s, arr) => s + arr.length, 0);
  const completed = Object.values(goalsData).reduce((s, arr) => s + arr.filter(i => i.done).length, 0);
  const byTimeframe = { daily:0, weekly:0, monthly:0, yearly:0 };
  Object.values(goalsData).forEach(arr => arr.forEach(g => { if (g.timeframe && byTimeframe[g.timeframe] !== undefined) byTimeframe[g.timeframe]++; }));
  return { total, completed, byTimeframe };
}

function renderDashboard() {
  const container = document.getElementById('summaryBoxes');
  if (!container) return;
  const summary = computeSummary();
  container.innerHTML = '';
  const boxes = [
    { title: 'Total goals', value: summary.total },
    { title: 'Completed', value: summary.completed },
    { title: 'Daily goals', value: summary.byTimeframe.daily },
    { title: 'Weekly goals', value: summary.byTimeframe.weekly },
    { title: 'Monthly goals', value: summary.byTimeframe.monthly },
    { title: 'Yearly goals', value: summary.byTimeframe.yearly }
  ];
  boxes.forEach(b => {
    const el = document.createElement('div'); el.className = 'summary-box';
    el.innerHTML = `<div class="sb-value">${b.value}</div><div class="sb-title">${b.title}</div>`;
    container.appendChild(el);
  });
}

function renderChecklist(frame='daily') {
  const container = document.getElementById('checklistContainer');
  if (!container) return;
  container.innerHTML = '';
  const items = [];
  Object.keys(goalsData).forEach(cat => {
    goalsData[cat].forEach(g => { if (g.timeframe === frame) items.push({cat, g}); });
  });
  if (items.length === 0) { container.textContent = 'No goals for this timeframe.'; return; }
  const ul = document.createElement('ul'); ul.className = 'task-list';
  items.forEach(({cat, g}) => {
    const li = document.createElement('li');
    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=!!g.done;
    cb.addEventListener('change', () => { toggleGoalDone(cat, g.id); renderDashboard(); });
    const span = document.createElement('span'); span.textContent = `${g.title}` + (g.target ? ` — ${g.target}` : '');
    li.appendChild(cb); li.appendChild(span); ul.appendChild(li);
  });
  container.appendChild(ul);
}

function populatePlanGoalSelect() {
  const sel = document.getElementById('planGoalSelect');
  if (!sel) return;
  sel.innerHTML = '';
  Object.keys(goalsData).forEach(cat => {
    goalsData[cat].forEach(g => {
      const opt = document.createElement('option'); opt.value = `${cat}||${g.id}`; opt.textContent = `${cat} — ${g.title}`;
      sel.appendChild(opt);
    });
  });
}

function create12WeekPlan(category, goalId) {
  // create plan with 12 weeks and basic weekly subtask
  const goal = (goalsData[category] || []).find(g => g.id == goalId);
  if (!goal) return;
  const planId = Date.now();
  const weeks = [];
  for (let i=1;i<=12;i++) {
    weeks.push({ week: i, tasks: [ { id: `${planId}-${i}-1`, title: `Week ${i}: Progress on "${goal.title}"`, done: false } ] });
  }
  const plan = { id: planId, category, goalId, title: goal.title, weeks, created: new Date().toISOString().split('T')[0] };
  plansData.push(plan);
  savePlans();
  renderPlans();
}

function togglePlanTask(planId, weekIndex, taskId) {
  const plan = plansData.find(p => p.id == planId);
  if (!plan) return;
  const task = plan.weeks[weekIndex].tasks.find(t => t.id === taskId);
  if (!task) return;
  task.done = !task.done; savePlans(); renderPlans();
}

function renderPlans() {
  const container = document.getElementById('plansContainer');
  if (!container) return;
  container.innerHTML = '';
  if (plansData.length === 0) { container.textContent = 'No 12-week plans yet.'; return; }
  plansData.forEach(plan => {
    const el = document.createElement('div'); el.className = 'plan-card';
    el.innerHTML = `<h4>${plan.title}</h4><div class="plan-meta">Created: ${plan.created}</div>`;
    const weeksWrap = document.createElement('div'); weeksWrap.className = 'weeks-wrap';
    plan.weeks.forEach((w, idx) => {
      const wEl = document.createElement('div'); wEl.className = 'week';
      const t = w.tasks[0];
      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=!!t.done;
      cb.addEventListener('change', () => togglePlanTask(plan.id, idx, t.id));
      wEl.appendChild(cb);
      const label = document.createElement('span'); label.textContent = t.title; wEl.appendChild(label);
      weeksWrap.appendChild(wEl);
    });
    el.appendChild(weeksWrap);
    container.appendChild(el);
  });
}

function renderGoals() {
  const container = document.getElementById('goalsContainer');
  if (!container) return;
  container.innerHTML = '';

  const filter = window.currentGoalFilter || 'all';
  Object.keys(goalsData).forEach(category => {
    const catEl = document.createElement('div');
    catEl.className = 'goal-category';

    const header = document.createElement('div');
    header.className = 'goal-cat-header';
    header.innerHTML = `<h3>${category}</h3>`;
    catEl.appendChild(header);

    const ul = document.createElement('ul');
    ul.className = 'goal-list';

    (goalsData[category] || []).forEach(item => {
      if (filter !== 'all' && item.timeframe !== filter) return;
      const li = document.createElement('li');
      li.className = 'goal-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!item.done;
      checkbox.addEventListener('change', () => toggleGoalDone(category, item.id));

      const span = document.createElement('span');
      span.className = 'goal-title';
      span.textContent = item.title + (item.target ? ` — ${item.target}` : '') + (item.timeframe ? ` (${item.timeframe})` : '');
      if (item.done) span.classList.add('done');

      const remove = document.createElement('button');
      remove.className = 'goal-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => removeGoal(category, item.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(remove);
      ul.appendChild(li);
    });

    catEl.appendChild(ul);
    container.appendChild(catEl);
  });
}

function addGoal(category, title) {
  const timeframeEl = document.getElementById('goalTimeframe');
  const targetEl = document.getElementById('goalTarget');
  const timeframe = timeframeEl ? timeframeEl.value : '';
  const target = targetEl ? targetEl.value.trim() : '';
  if (!category || !title) return;
  const item = { id: Date.now(), title: title.trim(), done: false, timeframe, target };
  if (!goalsData[category]) goalsData[category] = [];
  goalsData[category].push(item);
  saveGoals();
  renderGoals();
}

function toggleGoalDone(category, id) {
  const list = goalsData[category];
  if (!list) return;
  const item = list.find(i => i.id === id);
  if (!item) return;
  item.done = !item.done;
  saveGoals();
  renderGoals();
}

function removeGoal(category, id) {
  const list = goalsData[category];
  if (!list) return;
  goalsData[category] = list.filter(i => i.id !== id);
  saveGoals();
  renderGoals();
}

// Hook up form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('goalForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = document.getElementById('goalCategory').value;
      const title = document.getElementById('goalTitle').value;
      addGoal(cat, title);
      form.reset();
    });
  }
  // background toggle button
  const bgBtn = document.getElementById('bgToggle');
  if (bgBtn) {
    // initialize
    const current = loadBgLevel();
    applyBgLevel(current);
    bgBtn.textContent = current === 'subtle' ? 'BG' : (current === 'visible' ? 'BG◑' : 'BG✕');
    bgBtn.addEventListener('click', () => {
      const order = ['off','subtle','visible'];
      const cur = loadBgLevel();
      const next = order[(order.indexOf(cur) + 1) % order.length];
      saveBgLevel(next);
      applyBgLevel(next);
      bgBtn.textContent = next === 'subtle' ? 'BG' : (next === 'visible' ? 'BG◑' : 'BG✕');
    });
  }
  // preview button removed — background is subtle by default
  // goal filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const f = e.target.getAttribute('data-filter');
      window.currentGoalFilter = f;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderGoals();
    });
  });
  // checklist tab handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const frame = ev.target.getAttribute('data-frame');
      renderChecklist(frame);
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      ev.target.classList.add('active');
    });
  });

  // create plan button
  const createPlanBtn = document.getElementById('createPlanBtn');
  if (createPlanBtn) {
    createPlanBtn.addEventListener('click', () => {
      const sel = document.getElementById('planGoalSelect');
      if (!sel) return;
      const [cat, id] = sel.value.split('||');
      create12WeekPlan(cat, id);
    });
  }
  // initialize plan goal select
  populatePlanGoalSelect();
});

// Ensure goals are loaded and rendered on page load
window.addEventListener('load', () => {
  loadGoals();
  renderGoals();
  renderDashboard();
  renderChecklist('daily');
  loadPlans();
  renderPlans();
});

// Smooth scrolling for nav links
document.addEventListener('DOMContentLoaded', () => {
  // treat nav links as tabs: show/hide main sections instead of scrolling
  const sections = ['goals','dashboard','metrics','plans','reflection','mood','tasks'];
  function showSection(id) {
    sections.forEach(s => {
      const el = document.getElementById(s);
      if (!el) return;
      if (s === id) { el.style.display = ''; }
      else { el.style.display = 'none'; }
    });
    // update active nav link
    document.querySelectorAll('.site-nav .nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  }

  document.querySelectorAll('.site-nav .nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      showSection(id);
    });
  });

  // Show default section
  showSection('goals');
});

/* Metrics persistence and charting */
function saveMetrics() {
  try { localStorage.setItem(METRICS_KEY, JSON.stringify(metricsData)); } catch (e) { console.error('saveMetrics failed', e); }
}

function loadMetrics() {
  try { const raw = localStorage.getItem(METRICS_KEY); if (raw) metricsData = JSON.parse(raw); } catch (e) { console.error('loadMetrics failed', e); }
}

// Hook metric form and metric selector after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const mform = document.getElementById('metricForm');
  if (mform) {
    mform.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const type = document.getElementById('metricType').value;
      const value = parseFloat(document.getElementById('metricValue').value);
      const dateInput = document.getElementById('metricDate').value;
      const date = dateInput ? dateInput : new Date().toISOString().split('T')[0];
      addMetric(type, date, value);
      mform.reset();
    });
  }

  const metricSelect = document.getElementById('metricSelect');
  if (metricSelect) {
    metricSelect.addEventListener('change', () => renderMetricsChart(metricSelect.value));
  }
});

// Ensure metrics loaded and chart shown on full load
window.addEventListener('load', () => {
  loadMetrics();
  const select = document.getElementById('metricSelect');
  renderMetricsChart(select ? select.value : 'weight');
});

function addMetric(type, date, value) {
  if (!type || isNaN(value)) return;
  if (!metricsData[type]) metricsData[type] = [];
  metricsData[type].push({ date, value: Number(value) });
  metricsData[type].sort((a,b) => (a.date > b.date ? 1 : -1));
  saveMetrics();
  const select = document.getElementById('metricSelect');
  if (select && select.value === type) renderMetricsChart(type);
}

let metricsChart = null;
function renderMetricsChart(type) {
  if (!type) return;
  const canvas = document.getElementById('metricsChart');
  if (!canvas) return;
  const data = metricsData[type] || [];
  const labels = data.map(d => d.date);
  const values = data.map(d => d.value);
  // If no data, clear canvas and show a friendly message
  const ctx = canvas.getContext('2d');
  if (!values || values.length === 0) {
    if (metricsChart) { metricsChart.destroy(); metricsChart = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '14px Inter, system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No data for ' + (METRIC_CONFIGS[type]?.label || type) + '. Add metrics to see the chart.', canvas.width / 2, canvas.height / 2);
    ctx.restore();
    return;
  }

  const cfgColor = METRIC_CONFIGS[type] ? METRIC_CONFIGS[type].color : '14,165,163';
  const labelText = METRIC_CONFIGS[type] ? METRIC_CONFIGS[type].label : type;

  // create a subtle gradient fill for the line
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, `rgba(${cfgColor},0.18)`);
  grad.addColorStop(0.8, `rgba(${cfgColor},0.05)`);

  const dataset = {
    label: labelText,
    data: values,
    tension: 0.24,
    borderWidth: 2.5,
    borderColor: `rgba(${cfgColor},0.95)`,
    backgroundColor: grad,
    fill: true,
    pointRadius: 3.5,
    pointHoverRadius: 6,
    pointBackgroundColor: `rgba(${cfgColor},1)`
  };

  const yCfg = {};
  if (METRIC_CONFIGS[type]) {
    // use suggested min/max that fit common ranges but still allow autoscaling
    yCfg.suggestedMin = METRIC_CONFIGS[type].min;
    yCfg.suggestedMax = METRIC_CONFIGS[type].max;
    yCfg.beginAtZero = false;
  } else {
    yCfg.beginAtZero = true;
  }

  const cfg = {
    type: 'line',
    data: { labels, datasets: [dataset] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,14,20,0.95)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            title: (items) => items && items.length ? (items[0].label) : '',
            label: (ctx) => `${labelText}: ${ctx.formattedValue}`
          }
        }
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Date' }, ticks: { maxRotation: 0, autoSkip: true } },
        y: Object.assign({ display: true, title: { display: true, text: labelText }, ticks: { beginAtZero: false } }, yCfg)
      }
    }
  };

  try {
    if (metricsChart) { metricsChart.destroy(); metricsChart = null; }
    metricsChart = new Chart(ctx, cfg);
  } catch (e) { console.error('Chart render failed', e); }
}
