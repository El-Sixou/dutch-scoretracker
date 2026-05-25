import type {
  Aggregates,
  Player,
  PlayerId,
  RankedPlayer,
  Round,
} from './types';

export const SUITS = ['♠', '♥', '♦', '♣', '★', '✦'] as const;

export function makePlayer(idx: number, name: string): Player {
  return {
    id: 'p' + idx,
    name: name || '',
    suit: SUITS[idx % SUITS.length],
  };
}

// Compute the Dutch adjustment for each player given raw scores and the
// optional caller. Returns a map { pid: adjustment }.
//   - dutch caller alone at the lowest raw → -10
//   - dutch caller tied at the lowest raw → 0
//   - dutch caller not lowest → +5
//   - all other players → 0
//   - no caller → all 0
export function computeAdjustments(
  raw: Record<PlayerId, number>,
  dutchPid: PlayerId | null | undefined,
): Record<PlayerId, number> {
  const adj: Record<PlayerId, number> = {};
  Object.keys(raw).forEach((p) => {
    adj[p] = 0;
  });
  if (!dutchPid) return adj;
  const values = Object.values(raw);
  const min = Math.min(...values);
  const lowest = Object.entries(raw)
    .filter(([, v]) => v === min)
    .map(([p]) => p);
  if (lowest.includes(dutchPid)) {
    if (lowest.length === 1) adj[dutchPid] = -10;
  } else {
    adj[dutchPid] = +5;
  }
  return adj;
}

export function finalizeRound(
  rawByPid: Record<PlayerId, number>,
  dutchPid: PlayerId | null | undefined,
  idx: number,
): Round {
  const adj = computeAdjustments(rawByPid, dutchPid);
  const final: Record<PlayerId, number> = {};
  Object.keys(rawByPid).forEach((p) => {
    final[p] = rawByPid[p] + adj[p];
  });
  let outcome: Round['outcome'] = null;
  if (dutchPid) {
    if (adj[dutchPid] === -10) outcome = 'success';
    else if (adj[dutchPid] === 0) outcome = 'tie';
    else outcome = 'fail';
  }
  return {
    id: 'r' + idx + '-' + Date.now(),
    index: idx,
    dutchPid: dutchPid || null,
    raw: { ...rawByPid },
    adj,
    final,
    outcome,
  };
}

export function computeAggregates(
  players: Player[],
  rounds: Round[],
): Aggregates {
  const totals: Record<PlayerId, number> = {};
  const stats: Aggregates['stats'] = {};
  players.forEach((p) => {
    totals[p.id] = 0;
    stats[p.id] = { total: 0, ok: 0, ko: 0, eq: 0 };
  });
  rounds.forEach((r) => {
    players.forEach((p) => {
      totals[p.id] += r.final[p.id] ?? 0;
    });
    if (r.dutchPid) {
      const s = stats[r.dutchPid];
      if (s) {
        s.total++;
        if (r.outcome === 'success') s.ok++;
        else if (r.outcome === 'fail') s.ko++;
        else if (r.outcome === 'tie') s.eq++;
      }
    }
  });
  return { totals, stats };
}

export function makeRanking(
  players: Player[],
  totals: Record<PlayerId, number>,
): RankedPlayer[] {
  return [...players]
    .map((p) => ({ ...p, total: totals[p.id] ?? 0 }))
    .sort((a, b) => a.total - b.total);
}

export function isGameOver(totals: Record<PlayerId, number>): boolean {
  return Object.values(totals).some((v) => v >= 100);
}
