// Twelfths represent every supported fraction exactly. No floating point equality.
export const PARTS = Object.freeze({ 2: 6, 3: 4, 4: 3 });
export const DAY = 24 * 60 * 60 * 1000;
export const TASKS = Object.freeze({
  whole: {
    id: 'whole',
    title: 'Build one whole',
    instruction: 'Choose pieces to fill the circle.',
    target: 12,
    allowed: [2, 3, 4],
    mode: 'practice',
  },
  equivalent: {
    id: 'equivalent',
    title: 'Find an equivalent',
    instruction: 'Use quarters to cover the same space as one half.',
    target: 6,
    allowed: [4],
    mode: 'practice',
  },
  quarters: {
    id: 'quarters',
    title: 'Build three quarters',
    instruction: 'Make 3/4 using quarter pieces.',
    target: 9,
    allowed: [4],
    mode: 'challenge',
  },
  thirds: {
    id: 'thirds',
    title: 'Build two thirds',
    instruction: 'Make 2/3 using third pieces.',
    target: 8,
    allowed: [3],
    mode: 'challenge',
  },
  mixed: {
    id: 'mixed',
    title: 'A different whole',
    instruction: 'Make one whole without using half pieces.',
    target: 12,
    allowed: [3, 4],
    mode: 'challenge',
  },
  half: {
    id: 'half',
    title: 'Another way to make a half',
    instruction: 'Make 1/2 using quarter pieces.',
    target: 6,
    allowed: [4],
    mode: 'challenge',
  },
});
export const CHALLENGES = ['quarters', 'thirds', 'mixed', 'half'];
export function total(parts) {
  return parts.reduce((n, d) => n + (PARTS[d] || 0), 0);
}
export function fraction(units) {
  if (units === 0) return '0 / 1';
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const g = gcd(units, 12);
  return units % 12 === 0 ? String(units / 12) : `${units / g} / ${12 / g}`;
}
export function check(task, parts) {
  return (
    parts.length > 0 &&
    parts.every(d => task.allowed.includes(d)) &&
    total(parts) === task.target
  );
}
export function mayRecordIndependent(task, assisted, correct) {
  return task.mode === 'challenge' && !assisted && correct;
}
export function makeRecord({
  attempt,
  task,
  parts,
  assisted,
  outcome,
  now = Date.now(),
}) {
  if (!['independent', 'help', 'retry'].includes(outcome))
    throw new Error('Choose an observation.');
  if (
    outcome === 'independent' &&
    !mayRecordIndependent(task, assisted, check(task, parts))
  )
    throw new Error(
      'Independent evidence needs a correct challenge without guidance.'
    );
  return {
    attempt,
    task: task.id,
    parts: [...parts],
    assisted: !!assisted,
    outcome,
    mode: task.mode,
    at: now,
  };
}
export function upsert(records, record) {
  return [...records.filter(r => r.attempt !== record.attempt), record].slice(
    -200
  );
}
export function restore(raw) {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.records)) return [];
    return data.records.slice(-200).filter(r => {
      const task = TASKS[r.task];
      return (
        task &&
        typeof r.attempt === 'string' &&
        r.attempt.length < 120 &&
        Array.isArray(r.parts) &&
        r.parts.length <= 8 &&
        r.parts.every(d => [2, 3, 4].includes(d)) &&
        typeof r.assisted === 'boolean' &&
        r.mode === task.mode &&
        Number.isFinite(r.at) &&
        r.at > 0 &&
        ['independent', 'help', 'retry'].includes(r.outcome) &&
        (r.outcome !== 'independent' ||
          mayRecordIndependent(task, r.assisted, check(task, r.parts)))
      );
    });
  } catch {
    return [];
  }
}
export function progress(records, now = Date.now()) {
  const independent = records
    .filter(
      r => !r.archived && r.outcome === 'independent' && r.mode === 'challenge' && r.at <= now
    )
    .sort((a, b) => a.at - b.at);
  const distinct = new Set(independent.map(r => r.task)).size;
  const later = independent.some((r, i) =>
    independent
      .slice(0, i)
      .some(first => r.task !== first.task && r.at - first.at >= DAY)
  );
  if (later)
    return 'A later independent check is recorded. Review the observations before deciding the next lesson.';
  if (independent.length) {
    const due = independent[0].at + DAY;
    return `${distinct} distinct challenge${distinct === 1 ? '' : 's'} completed independently. ${now >= due ? 'Try a different challenge for a later check.' : 'Return after ' + new Date(due).toLocaleString() + ' for a different challenge.'}`;
  }
  return 'Start with practice, then try a new challenge without guidance. These notes support adult judgment; they do not certify mastery.';
}
