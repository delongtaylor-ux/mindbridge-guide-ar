import {
  PARTS,
  TASKS,
  CHALLENGES,
  total,
  fraction,
  check,
  mayRecordIndependent,
  makeRecord,
  upsert,
  restore,
  progress,
} from './core.mjs';
const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];
const KEY = 'mindbridge-fraction-workshop-v1';
const colors = { 2: '#81b4a4', 3: '#e7bc63', 4: '#a19bc4' };
let records = [],
  persistent = true;
let showArchived = false;
try {
  records = restore(localStorage.getItem(KEY));
} catch {
  persistent = false;
}
let task = TASKS.whole,
  parts = [],
  assisted = true,
  guidance = true,
  correct = false,
  challengeIndex = 0,
  attempt = '',
  feedback = '',
  saved = '';
const descriptions = {
  whole: [
    'Invite the learner to cover the circle with equal parts. Pause before helping.',
    'What could fill the empty space?',
  ],
  equivalent: [
    'Place two quarters beside a half. Keep their edges aligned, then let the learner compare.',
    'Do these pieces cover the same space?',
  ],
  challenge: [
    'Offer the materials and time to explore. If you show a hint or demonstration, record the attempt as assisted.',
    'How could you check your arrangement?',
  ],
};
function newAttempt() {
  attempt =
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  parts = [];
  correct = false;
  saved = '';
  assisted = task.mode === 'practice';
  guidance = task.mode === 'practice';
  feedback = 'Choose some pieces to begin.';
  $('#demo-area').hidden = true;
  render();
}
function sector(cx, cy, r, start, units) {
  const a = (start / 12) * Math.PI * 2 - Math.PI / 2,
    b = ((start + units) / 12) * Math.PI * 2 - Math.PI / 2;
  return `M${cx} ${cy} L${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} A${r} ${r} 0 ${units > 6 ? 1 : 0} 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)} Z`;
}
function drawBoard() {
  let start = 0;
  const svg = $('#circle');
  // Overflow gets its own labeled circle: no hidden or misleading clipped quantity.
  const overflow = total(parts) > 12;
  const r = overflow ? 67 : 126,
    cy = 150,
    cx = overflow ? 95 : 180;
  let markup = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fcfbf7" stroke="#375d4e" stroke-width="1.8"/>`;
  if (overflow)
    markup += `<circle cx="265" cy="150" r="67" fill="#fcfbf7" stroke="#375d4e" stroke-width="1.8"/><text x="265" y="248" text-anchor="middle" fill="#183e35" font-size="15">Extra pieces</text>`;
  if (task.target < 12)
    markup += `<path d="${sector(cx, cy, r, 0, task.target)}" fill="#c2cfbd" opacity=".6"/>`;
  for (const d of parts) {
    let units = PARTS[d];
    while (units) {
      const circle = Math.floor(start / 12),
        pos = start % 12,
        chunk = Math.min(units, 12 - pos);
      const x = overflow ? (circle === 0 ? 95 : 265) : 180;
      markup += `<path d="${sector(x, cy, r, pos, chunk)}" fill="${colors[d]}"/>`;
      start += chunk;
      units -= chunk;
    }
  }
  if (!parts.length)
    markup += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="#677d6d" font-size="18">${task.target === 12 ? 'one whole' : fraction(task.target)}</text>`;
  svg.innerHTML = markup;
  svg.setAttribute(
    'aria-label',
    `Arrangement: ${parts.length ? parts.map(d => 'one ' + { 2: 'half', 3: 'third', 4: 'quarter' }[d]).join(', ') : 'empty'}. Total ${fraction(total(parts))}; target ${fraction(task.target)}.`
  );
  $('#pieces').replaceChildren(
    ...parts.map((d, i) => {
      const b = document.createElement('button');
      b.textContent = `1/${d} ×`;
      b.setAttribute(
        'aria-label',
        `Remove piece ${i + 1}: one ${d === 2 ? 'half' : d === 3 ? 'third' : 'quarter'}`
      );
      b.onclick = () => {
        parts.splice(i, 1);
        changed();
      };
      return b;
    })
  );
}
function changed() {
  correct = false;
  saved = '';
  feedback = 'Arrangement changed. Check it when you are ready.';
  render();
}
function render() {
  $('#task-title').textContent = task.title;
  $('#instruction').textContent = task.instruction;
  $('#total').textContent = `Total: ${fraction(total(parts))}`;
  $('#feedback').textContent = feedback;
  $('#saved').textContent = saved;
  $('#undo').disabled = !parts.length;
  $('#check').disabled = !parts.length;
  $('#next').hidden = task.mode !== 'challenge';
  $('#mode').textContent =
    task.mode === 'practice'
      ? 'Adult rehearsal · guidance available'
      : assisted
        ? 'Challenge · guidance used on this attempt'
        : 'Independent challenge · guidance hidden';
  const copy = descriptions[task.mode === 'challenge' ? 'challenge' : task.id];
  $('#coach').textContent = copy[0];
  $('#question').textContent = copy[1];
  $('#guidance').hidden = !guidance;
  $('#guidance-toggle').textContent = guidance
    ? 'Hide guidance'
    : task.mode === 'challenge'
      ? 'Show hint'
      : 'Show guidance';
  $('#observation-help').textContent =
    task.mode === 'practice'
      ? 'Practice supports preparation. Use a new challenge to record independent work.'
      : assisted
        ? 'Guidance was used. Choose “With help” or “Try again.”'
        : 'Check the arrangement, then record what you observed. Saving again updates this attempt.';
  $$('[data-piece]').forEach(b => {
    b.disabled =
      !task.allowed.includes(Number(b.dataset.piece)) ||
      total(parts) + PARTS[b.dataset.piece] > 24;
  });
  $$('[data-outcome]').forEach(b => {
    b.disabled =
      b.dataset.outcome === 'independent'
        ? !mayRecordIndependent(task, assisted, correct)
        : !parts.length;
    b.setAttribute(
      'aria-pressed',
      String(
        records.find(r => r.attempt === attempt)?.outcome === b.dataset.outcome
      )
    );
  });
  $$('[data-lesson]').forEach(b => {
    if (
      b.dataset.lesson === (task.mode === 'challenge' ? 'challenge' : task.id)
    )
      b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  drawBoard();
  renderRecords();
}
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, records }));
    persistent = true;
  } catch {
    persistent = false;
  }
}
function renderRecords() {
  $('#progress').textContent = progress(records);
  $('#storage-status').textContent = persistent
    ? 'Notes stay in this browser. No names, accounts, cloud sync, or learner data are sent.'
    : 'Browser storage is unavailable. Notes last only for this page session; use Export notes to keep them.';
  $('#export').disabled = !records.length;
  const archivedCount = records.filter(r => r.archived).length;
  $('#archive-toggle').hidden = archivedCount === 0 && !showArchived;
  $('#archive-toggle').textContent = showArchived
    ? 'Show current notes'
    : `Show archived notes (${archivedCount})`;
  $('#records').replaceChildren(
    ...records
      .filter(r => Boolean(r.archived) === showArchived)
      .slice()
      .reverse()
      .map(r => {
        const row = document.createElement('div');
        row.className = 'record';
        const detail = document.createElement('div'),
          title = document.createElement('strong'),
          meta = document.createElement('small');
        title.textContent = TASKS[r.task].title;
        meta.textContent = `${new Date(r.at).toLocaleString()} · ${r.mode === 'practice' ? 'Rehearsal' : r.assisted ? 'Assisted challenge' : 'Challenge'} · ${r.parts.map(d => '1/' + d).join(' + ')}`;
        detail.append(title, meta);
        const select = document.createElement('select');
        select.setAttribute(
          'aria-label',
          `Correct observation for ${TASKS[r.task].title} on ${new Date(r.at).toLocaleString()}`
        );
        for (const [value, label] of [
          ['independent', 'Independent'],
          ['help', 'With help'],
          ['retry', 'Try again'],
        ]) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = label;
          option.disabled =
            value === 'independent' &&
            !mayRecordIndependent(
              TASKS[r.task],
              r.assisted,
              check(TASKS[r.task], r.parts)
            );
          select.append(option);
        }
        select.value = r.outcome;
        select.onchange = () => {
          records = records.map(item =>
            item.attempt === r.attempt
              ? { ...item, outcome: select.value }
              : item
          );
          persist();
          render();
        };
        const archive = document.createElement('button');
        archive.textContent = r.archived ? 'Restore' : 'Archive';
        archive.setAttribute('aria-label', `${archive.textContent} observation: ${TASKS[r.task].title}`);
        archive.onclick = () => {
          records = records.map(item => item.attempt === r.attempt
            ? { ...item, archived: !r.archived } : item);
          persist();
          render();
        };
        row.append(detail, select, archive);
        return row;
      })
  );
}
$('#archive-toggle').onclick = () => {
  showArchived = !showArchived;
  renderRecords();
};
$$('[data-lesson]').forEach(
  b =>
    (b.onclick = () => {
      task =
        b.dataset.lesson === 'challenge'
          ? TASKS[CHALLENGES[challengeIndex]]
          : TASKS[b.dataset.lesson];
      newAttempt();
    })
);
$$('[data-piece]').forEach(
  b =>
    (b.onclick = () => {
      const d = Number(b.dataset.piece);
      if (task.allowed.includes(d) && total(parts) + PARTS[d] <= 24) {
        parts.push(d);
        changed();
      }
    })
);
$('#undo').onclick = () => {
  parts.pop();
  changed();
};
$('#reset').onclick = newAttempt;
$('#check').onclick = () => {
  correct = check(task, parts);
  feedback = correct
    ? task.mode === 'practice'
      ? 'The pieces match. Invite the learner to explain why.'
      : 'The arrangement matches the challenge. An adult can now record the observation.'
    : total(parts) > task.target
      ? 'There is more than the target. Remove or exchange a piece and try again.'
      : 'There is space left to fill. Compare your pieces with the target and try again.';
  render();
};
$('#guidance-toggle').onclick = () => {
  guidance = !guidance;
  if (guidance) assisted = true;
  render();
};
$('#next').onclick = () => {
  challengeIndex = (challengeIndex + 1) % CHALLENGES.length;
  task = TASKS[CHALLENGES[challengeIndex]];
  newAttempt();
};
$('#demonstrate').onclick = () => {
  assisted = true;
  $('#demo-area').hidden = false;
  const equivalent = task.id === 'equivalent' || task.id === 'half';
  const sequence = equivalent
    ? [4, 4]
    : task.id === 'thirds'
      ? [3, 3]
      : task.id === 'quarters'
        ? [4, 4, 4]
        : task.id === 'mixed'
          ? [3, 3, 3]
          : [2, 2];
  let start = 0;
  let markup =
    '<circle cx="108" cy="68" r="57" fill="#f6f3ea" stroke="#557662"/>';
  for (const d of sequence) {
    markup += `<path class="demo-piece" d="${sector(108, 68, 57, start, PARTS[d])}" fill="${colors[d]}" stroke="#f6f3ea" stroke-width="2"/>`;
    start += PARTS[d];
  }
  markup += '<text x="204" y="76" fill="#183e35" font-size="24">=</text>';
  if (start === 12)
    markup +=
      '<circle cx="293" cy="68" r="57" fill="#81b4a4" stroke="#f6f3ea" stroke-width="2"/>';
  else
    markup += `<path d="${sector(293, 68, 57, 0, start)}" fill="#81b4a4" stroke="#f6f3ea" stroke-width="2"/>`;
  $('#demo').innerHTML = markup;
  $('#demo-caption').textContent =
    `${sequence.map(d => '1/' + d).join(' + ')} = ${fraction(start)}. Your arrangement stays unchanged.`;
  $('#demo').setAttribute('aria-label', $('#demo-caption').textContent);
  render();
};
$$('[data-outcome]').forEach(
  b =>
    (b.onclick = () => {
      try {
        const previous = records.find(r => r.attempt === attempt);
        const record = makeRecord({
          attempt,
          task,
          parts,
          assisted,
          outcome: b.dataset.outcome,
          now: previous?.at || Date.now(),
        });
        records = upsert(records, record);
        persist();
        saved = 'Observation saved. You can correct it in Learning notes.';
        render();
      } catch (e) {
        saved = e.message;
        render();
      }
    })
);
$('#export').onclick = () => {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          app: 'MindBridge Fraction Workshop',
          version: 1,
          exportedAt: new Date().toISOString(),
          records,
        },
        null,
        2
      ),
    ],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = 'MindBridge-learning-notes.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
newAttempt();
