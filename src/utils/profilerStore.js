// PASO 1 · Almacén simple de métricas del <Profiler> (se muestra en MetricsPanel).
// No usamos console.log para medir: el Profiler entrega actualDuration por commit.

let commits = [];

export function recordCommit(id, phase, actualDuration) {
  commits.push({ id, phase, actualDuration });
  if (commits.length > 500) commits = commits.slice(-500);
}

export function resetCommits() {
  commits = [];
}

export function summarize() {
  const map = new Map();
  for (const c of commits) {
    const row = map.get(c.id) ?? { id: c.id, commits: 0, mounts: 0, updates: 0, total: 0, max: 0 };
    row.commits += 1;
    if (c.phase === 'mount') row.mounts += 1;
    else row.updates += 1;
    row.total += c.actualDuration;
    row.max = Math.max(row.max, c.actualDuration);
    map.set(c.id, row);
  }
  return [...map.values()].map((r) => ({ ...r, avg: r.total / r.commits }));
}
