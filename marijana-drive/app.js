// =========================================================
// MARIJANA DRIVE — app.js (Kompletna funkcionalna logika)
// =========================================================

const STORAGE_KEY = 'marijana_drive_state_v1';

const STAGES = [
  { id: 'ideja', label: 'Ideja / Brief' },
  { id: 'nacrt', label: 'Nacrt spreman' },
  { id: 'odobreno', label: 'Odobreno' },
  { id: 'zakazano', label: 'Zakazano' },
  { id: 'objavljeno', label: 'Objavljeno' }
];

let state = {
  items: [],
  activePackageId: null,
  currentDraftApproved: false
};

// --- INICIJALIZACIJA ---
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  bindLiveEvents();
  renderProductionBoard();
  if (state.activePackageId) {
    openContentPackage(state.activePackageId);
  }
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
  } catch (e) {
    console.warn('Greška pri učitavanju stanja:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Greška pri čuvanju stanja:', e);
  }
}

function bindLiveEvents() {
  const platformSelect = document.getElementById('platform');
  const previewPlatform = document.getElementById('preview-platform');
  if (platformSelect && previewPlatform) {
    platformSelect.addEventListener('change', () => {
      previewPlatform.textContent = platformSelect.value;
    });
  }

  // Aktivna stavka u meniju
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// --- TOAST OBAVEŠTENJA ---
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.style.opacity = '';
    toast.style.pointerEvents = '';
  }, 3200);
}

// --- CAPTION EDITOR ---
function focusCaption() {
  const section = document.getElementById('caption-editor');
  const topicInput = document.getElementById('topic');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  if (topicInput) setTimeout(() => topicInput.focus(), 300);
}

function generateDraft() {
  const topic = (document.getElementById('topic')?.value || '').trim();
  const platform = document.getElementById('platform')?.value || 'Instagram';
  const goal = document.getElementById('goal')?.value || 'Vrednost / edukacija';
  const tone = document.getElementById('tone')?.value || 'Mirno i samouvereno';
  const context = (document.getElementById('context')?.value || '').trim();

  if (!topic) {
    showToast('Unesi temu ili ideju pre generisanja nacrta.');
    document.getElementById('topic')?.focus();
    return;
  }

  const hooksByTone = {
    'Mirno i samouvereno': `${topic}.\n\nNe moraš da žuriš niti da komplikuješ da bi napravila pomak.`,
    'Stručno': `${topic} — konkretan pristup koji donosi merljiv rezultat.`,
    'Toplo i lično': `Danas želim da podelim nešto važno na temu: ${topic}.`,
    'Direktno': `Prestanimo da komplikujemo: ${topic}.`,
    'Minimalistički': `${topic}.\n\nManje buke. Više jasnoće.`
  };

  const ctaByGoal = {
    'Vrednost / edukacija': 'Sačuvaj ovu objavu da ti bude pri ruci kada zatreba.',
    'Prodaja': 'Ako želiš gotov sistem i podršku korak po korak — javi se u poruci ili pogledaj link u opisu profila.',
    'Lični brend': 'Kako ti gledaš na ovo iz svog iskustva? Piši mi u komentaru.',
    'Angažovanje': 'Koji deo ti je trenutno najkorisniji — 1, 2 ili 3? Napiši ispod.',
    'Promocija proizvoda': 'Detalji i pristup su spremni — klikni na link u opisu profila i kreni danas.'
  };

  const hook = hooksByTone[tone] || hooksByTone['Mirno i samouvereno'];
  const middle = context
    ? `\n\n${context}`
    : `\n\nKada postaviš jasnu strukturu i fokusiraš se na jedan sledeći korak, ceo proces postaje mirniji i pregledniji.`;
  const cta = `\n\n${ctaByGoal[goal] || ctaByGoal['Vrednost / edukacija']}`;
  const tags = `\n\n#${platform.replace(/[^a-zA-Z0-9]/g, '')} #MarijanaDigitalSoul #SadržajSaSvrhom`;

  const output = document.getElementById('caption-output');
  const previewPlatform = document.getElementById('preview-platform');
  const draftState = document.getElementById('draft-state');

  if (previewPlatform) previewPlatform.textContent = platform;
  if (output) output.value = `${hook}${middle}${cta}${tags}`;
  if (draftState) draftState.textContent = 'Nacrt spreman za doradu';

  state.currentDraftApproved = false;
  showToast('Nacrt je generisan. Sada ga doradi po svom glasu.');
}

function clearEditor() {
  ['topic', 'context', 'caption-output', 'personal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const draftState = document.getElementById('draft-state');
  if (draftState) draftState.textContent = 'Novi nacrt';
  state.currentDraftApproved = false;
  showToast('Editor je očišćen i spreman za novu ideju.');
}

function transformText(mode) {
  const output = document.getElementById('caption-output');
  if (!output || !output.value.trim()) {
    showToast('Nema teksta u editoru za obradu.');
    return;
  }

  let text = output.value.trim();

  if (mode === 'short') {
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length > 2) {
      output.value = `${paragraphs[0]}\n\n${paragraphs[paragraphs.length - 1]}`;
    } else {
      output.value = text.split('. ').slice(0, 2).join('. ') + (text.endsWith('.') ? '' : '.');
    }
    showToast('Tekst je skraćen na suštinu.');
  } else if (mode === 'personal') {
    if (!text.startsWith('Iz mog iskustva:')) {
      output.value = `Iz mog iskustva:\n\n${text}`;
    }
    showToast('Dodat je ličniji uvod.');
  } else if (mode === 'clear') {
    output.value = text
      .replace(/#[a-zA-Z0-9čćžšđČĆŽŠĐ_]+/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    showToast('Uklonjeni su viškovi i hashtagovi.');
  }
}

function removeLastParagraph() {
  const output = document.getElementById('caption-output');
  if (!output || !output.value.trim()) {
    showToast('Nema teksta za brisanje.');
    return;
  }
  const parts = output.value.trim().split(/\n\s*\n/).filter(Boolean);
  if (parts.length <= 1) {
    output.value = '';
  } else {
    parts.pop();
    output.value = parts.join('\n\n');
  }
  showToast('Poslednji pasus je uklonjen.');
}

function addPersonal() {
  const personalInput = document.getElementById('personal');
  const output = document.getElementById('caption-output');
  if (!personalInput || !output) return;

  const note = personalInput.value.trim();
  if (!note) {
    showToast('Napiši svoju misao pre dodavanja.');
    personalInput.focus();
    return;
  }

  output.value = output.value.trim()
    ? `${output.value.trim()}\n\n${note}`
    : note;
  personalInput.value = '';
  showToast('Tvoj lični deo je ubačen u tekst.');
}

// --- ODOBRAVANJE I PREBACIVANJE U PRODUKCIJU ---
function approveDraft() {
  const output = document.getElementById('caption-output');
  const text = (output?.value || '').trim();
  if (!text) {
    showToast('Prvo napiši ili generiši tekst pre odobravanja.');
    return;
  }

  const topic = (document.getElementById('topic')?.value || '').trim() || text.split('\n')[0].slice(0, 50);
  const platform = document.getElementById('platform')?.value || 'Instagram';
  const goal = document.getElementById('goal')?.value || 'Vrednost / edukacija';

  const draftState = document.getElementById('draft-state');
  if (draftState) draftState.textContent = 'Odobreno ✓';
  state.currentDraftApproved = true;

  const newItem = {
    id: 'pkg_' + Date.now(),
    title: topic,
    channel: platform,
    format: 'Objava',
    goal: goal,
    brief: text,
    stage: 'odobreno',
    scheduledAt: '',
    steps: {
      text: true,
      mockup: false,
      calendar: false,
      published: false
    }
  };

  state.items.unshift(newItem);
  saveState();
  renderProductionBoard();
  openContentPackage(newItem.id);
  showToast('Sadržaj je odobren i dodat u Content Production Board!');
}

// --- CONTENT PRODUCTION BOARD ---
function openProductionEditor() {
  const editor = document.getElementById('productionEditor');
  if (editor) {
    editor.hidden = false;
    editor.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('prodTitle')?.focus();
  }
}

function closeProductionEditor() {
  const editor = document.getElementById('productionEditor');
  if (editor) editor.hidden = true;
}

function saveProductionItem() {
  const title = (document.getElementById('prodTitle')?.value || '').trim();
  const channel = document.getElementById('prodChannel')?.value || 'Instagram';
  const format = document.getElementById('prodFormat')?.value || 'Objava';
  const goal = (document.getElementById('prodGoal')?.value || '').trim() || 'Brend & vrednost';
  const brief = (document.getElementById('prodBrief')?.value || '').trim();

  if (!title) {
    showToast('Unesi naslov ili temu za novi sadržaj.');
    document.getElementById('prodTitle')?.focus();
    return;
  }

  const item = {
    id: 'pkg_' + Date.now(),
    title,
    channel,
    format,
    goal,
    brief: brief || `Radni brief za ${channel} (${format}) — cilj: ${goal}.`,
    stage: 'ideja',
    scheduledAt: '',
    steps: {
      text: Boolean(brief),
      mockup: false,
      calendar: false,
      published: false
    }
  };

  state.items.unshift(item);
  saveState();
  renderProductionBoard();

  ['prodTitle', 'prodGoal', 'prodBrief'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  closeProductionEditor();
  openContentPackage(item.id);
  showToast('Novi sadržaj je sačuvan na tabli.');
}

function renderProductionBoard() {
  const board = document.getElementById('productionBoard');
  if (!board) return;

  board.innerHTML = STAGES.map(stage => {
    const stageItems = state.items.filter(item => item.stage === stage.id);
    const cardsHtml = stageItems.length
      ? stageItems.map(item => `
          <div class="prod-card" draggable="true" ondragstart="onDragStart(event, '${item.id}')" style="padding:12px;margin-bottom:10px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
              <small style="opacity:0.75;">${escapeHtml(item.channel)} · ${escapeHtml(item.format)}</small>
              <button type="button" class="text-button" onclick="openContentPackage('${item.id}')">Otvori</button>
            </div>
            <strong style="display:block;margin-bottom:6px;">${escapeHtml(item.title)}</strong>
            <p style="font-size:12px;opacity:0.8;margin:0 0 10px 0;">${escapeHtml(item.brief.slice(0, 95))}${item.brief.length > 95 ? '...' : ''}</p>
            ${item.scheduledAt ? `<small style="display:block;margin-bottom:8px;opacity:0.85;">◷ ${formatDateTime(item.scheduledAt)}</small>` : ''}
            <select onchange="moveItemStage('${item.id}', this.value)" style="width:100%;padding:6px 8px;border-radius:8px;">
              ${STAGES.map(s => `<option value="${s.id}" ${s.id === item.stage ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>
        `).join('')
      : `<p style="font-size:12px;opacity:0.55;margin:8px 0;">Nema stavki u ovoj fazi.</p>`;

    return `
      <div class="prod-column" ondragover="event.preventDefault()" ondrop="onDropStage(event, '${stage.id}')" style="min-width:220px;flex:1;padding:12px;border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <strong>${stage.label}</strong>
          <span class="status">${stageItems.length}</span>
        </div>
        ${cardsHtml}
      </div>
    `;
  }).join('');
}

let draggedItemId = null;
function onDragStart(event, id) {
  draggedItemId = id;
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', id);
  }
}

function onDropStage(event, targetStage) {
  event.preventDefault();
  const id = event.dataTransfer?.getData('text/plain') || draggedItemId;
  if (id) moveItemStage(id, targetStage);
}

function moveItemStage(id, newStage) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  item.stage = newStage;
  if (newStage === 'odobreno') item.steps.text = true;
  if (newStage === 'zakazano') item.steps.calendar = true;
  if (newStage === 'objavljeno') {
    item.steps.text = true;
    item.steps.mockup = true;
    item.steps.calendar = true;
    item.steps.published = true;
  }

  saveState();
  renderProductionBoard();
  if (state.activePackageId === id) {
    openContentPackage(id);
  }
  showToast('Status kartice je ažuriran.');
}

function seedProductionFromCalendar() {
  const dateVal = document.getElementById('schedule-date')?.value;
  const captionVal = (document.getElementById('caption-output')?.value || '').trim();
  const topicVal = (document.getElementById('topic')?.value || '').trim();
  const platform = document.getElementById('platform')?.value || 'Instagram';

  if (!dateVal && !captionVal && !topicVal) {
    showToast('Unesi datum u Kalendaru ili tekst u Editoru da bi uvezla stavku.');
    return;
  }

  const item = {
    id: 'pkg_' + Date.now(),
    title: topicVal || `Zakazana objava (${platform})`,
    channel: platform,
    format: 'Objava',
    goal: document.getElementById('goal')?.value || 'Vrednost / edukacija',
    brief: captionVal || 'Sadržaj uvezen iz kalendara.',
    stage: dateVal ? 'zakazano' : 'nacrt',
    scheduledAt: dateVal || '',
    steps: {
      text: Boolean(captionVal),
      mockup: false,
      calendar: Boolean(dateVal),
      published: false
    }
  };

  state.items.unshift(item);
  saveState();
  renderProductionBoard();
  openContentPackage(item.id);
  showToast('Stavka iz kalendara je dodata na tablu.');
}

function clearProductionBoard() {
  if (!state.items.length) {
    showToast('Tabla je već prazna.');
    return;
  }
  state.items = [];
  state.activePackageId = null;
  saveState();
  renderProductionBoard();
  closeContentPackage();
  showToast('Produkcijska tabla je očišćena.');
}

// --- CONTENT PACKAGE (4 KORAKA) ---
function openContentPackage(id) {
  const item = state.items.find(i => i.id === id);
  const section = document.getElementById('contentPackage');
  if (!item || !section) return;

  state.activePackageId = id;
  saveState();

  section.hidden = false;
  document.getElementById('packageTitle').textContent = item.title;
  document.getElementById('packageMeta').textContent = `${item.channel} · ${item.format} · Cilj: ${item.goal}${item.scheduledAt ? ' · Termin: ' + formatDateTime(item.scheduledAt) : ''}`;
  document.getElementById('packageBrief').textContent = item.brief;

  const stageObj = STAGES.find(s => s.id === item.stage);
  document.getElementById('packageStatus').textContent = stageObj ? stageObj.label : item.stage;

  document.getElementById('packageTextDone').checked = Boolean(item.steps.text);
  document.getElementById('packageMockupDone').checked = Boolean(item.steps.mockup);
  document.getElementById('packageCalendarDone').checked = Boolean(item.steps.calendar);
  document.getElementById('packagePublishedDone').checked = Boolean(item.steps.published);

  // Povezivanje linkova unutar paketa
  const textLink = document.getElementById('packageTextLink');
  if (textLink) {
    textLink.onclick = (e) => {
      e.preventDefault();
      document.getElementById('topic').value = item.title;
      document.getElementById('platform').value = item.channel;
      document.getElementById('caption-output').value = item.brief;
      focusCaption();
    };
  }

  const mockupLink = document.getElementById('packageMockupLink');
  if (mockupLink) {
    mockupLink.href = '../mockup/';
  }

  const calBtn = document.getElementById('packageCalendarLink');
  if (calBtn) {
    calBtn.onclick = () => {
      document.getElementById('kalendar')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('schedule-date')?.focus();
    };
  }

  updatePackageProgress(item);
}

function closeContentPackage() {
  const section = document.getElementById('contentPackage');
  if (section) section.hidden = true;
  state.activePackageId = null;
  saveState();
}

function togglePackageStep(stepKey, isDone) {
  const item = state.items.find(i => i.id === state.activePackageId);
  if (!item) return;

  item.steps[stepKey] = isDone;

  if (item.steps.published) {
    item.stage = 'objavljeno';
  } else if (item.steps.calendar) {
    item.stage = 'zakazano';
  } else if (item.steps.text && item.steps.mockup) {
    item.stage = 'odobreno';
  } else if (item.steps.text) {
    item.stage = 'nacrt';
  } else {
    item.stage = 'ideja';
  }

  saveState();
  renderProductionBoard();
  openContentPackage(item.id);
}

function updatePackageProgress(item) {
  const completed = ['text', 'mockup', 'calendar', 'published'].filter(k => item.steps[k]).length;
  const percent = (completed / 4) * 100;
  const bar = document.getElementById('packageProgressBar');
  const text = document.getElementById('packageProgressText');
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${completed} / 4 koraka`;
}

// --- KALENDAR / ZAKAZIVANJE ---
function scheduleDraft() {
  const dateInput = document.getElementById('schedule-date');
  const dateVal = dateInput?.value;
  if (!dateVal) {
    showToast('Izaberi datum i vreme objave u kalendaru.');
    dateInput?.focus();
    return;
  }

  let targetItem = state.items.find(i => i.id === state.activePackageId);

  if (!targetItem) {
    const captionVal = (document.getElementById('caption-output')?.value || '').trim();
    const topicVal = (document.getElementById('topic')?.value || '').trim();
    const platform = document.getElementById('platform')?.value || 'Instagram';

    if (!captionVal && !topicVal) {
      showToast('Prvo pripremi sadržaj u editoru ili otvori paket koji zakazuješ.');
      return;
    }

    targetItem = {
      id: 'pkg_' + Date.now(),
      title: topicVal || captionVal.split('\n')[0].slice(0, 50),
      channel: platform,
      format: 'Objava',
      goal: document.getElementById('goal')?.value || 'Vrednost / edukacija',
      brief: captionVal || topicVal,
      stage: 'zakazano',
      scheduledAt: dateVal,
      steps: {
        text: true,
        mockup: false,
        calendar: true,
        published: false
      }
    };
    state.items.unshift(targetItem);
  } else {
    targetItem.scheduledAt = dateVal;
    targetItem.stage = 'zakazano';
    targetItem.steps.calendar = true;
  }

  saveState();
  renderProductionBoard();
  openContentPackage(targetItem.id);
  showToast(`Sadržaj je zakazan za ${formatDateTime(dateVal)}.`);
}

// --- POMOĆNE FUNKCIJE ---
function formatDateTime(dtString) {
  if (!dtString) return '';
  const d = new Date(dtString);
  if (isNaN(d.getTime())) return dtString;
  return d.toLocaleString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
