import { describe, expect, it } from 'vitest';
import {
  computeAdjustments,
  computeAggregates,
  finalizeRound,
  isGameOver,
  makePlayer,
  makeRanking,
} from './game';

describe('computeAdjustments', () => {
  it('returns all zeros when no caller', () => {
    const adj = computeAdjustments({ p0: 12, p1: 7, p2: 20 }, null);
    expect(adj).toEqual({ p0: 0, p1: 0, p2: 0 });
  });

  it('gives -10 to caller alone at the lowest', () => {
    const adj = computeAdjustments({ p0: 12, p1: 5, p2: 20 }, 'p1');
    expect(adj).toEqual({ p0: 0, p1: -10, p2: 0 });
  });

  it('gives 0 to caller tied at the lowest', () => {
    const adj = computeAdjustments({ p0: 5, p1: 5, p2: 20 }, 'p1');
    expect(adj).toEqual({ p0: 0, p1: 0, p2: 0 });
  });

  it('gives +5 to caller not at the lowest', () => {
    const adj = computeAdjustments({ p0: 12, p1: 7, p2: 20 }, 'p0');
    expect(adj).toEqual({ p0: 5, p1: 0, p2: 0 });
  });
});

describe('finalizeRound', () => {
  it('builds a round with success outcome', () => {
    const r = finalizeRound({ p0: 12, p1: 5, p2: 20 }, 'p1', 0);
    expect(r.outcome).toBe('success');
    expect(r.final).toEqual({ p0: 12, p1: -5, p2: 20 });
    expect(r.dutchPid).toBe('p1');
    expect(r.index).toBe(0);
  });

  it('flags tie outcome', () => {
    const r = finalizeRound({ p0: 5, p1: 5, p2: 20 }, 'p1', 1);
    expect(r.outcome).toBe('tie');
    expect(r.final).toEqual({ p0: 5, p1: 5, p2: 20 });
  });

  it('flags fail outcome', () => {
    const r = finalizeRound({ p0: 5, p1: 12, p2: 20 }, 'p1', 2);
    expect(r.outcome).toBe('fail');
    expect(r.final.p1).toBe(17);
  });

  it('produces no outcome when no caller', () => {
    const r = finalizeRound({ p0: 5, p1: 12 }, null, 0);
    expect(r.outcome).toBeNull();
    expect(r.dutchPid).toBeNull();
  });
});

describe('computeAggregates / makeRanking / isGameOver', () => {
  const players = [makePlayer(0, 'A'), makePlayer(1, 'B'), makePlayer(2, 'C')];

  it('sums totals across rounds', () => {
    const r1 = finalizeRound({ p0: 10, p1: 5, p2: 20 }, 'p1', 0); // p1 -10
    const r2 = finalizeRound({ p0: 4, p1: 8, p2: 12 }, 'p0', 1); // p0 -10
    const { totals, stats } = computeAggregates(players, [r1, r2]);
    expect(totals).toEqual({ p0: 10 + 4 - 10, p1: -5 + 8, p2: 20 + 12 });
    expect(stats.p1).toEqual({ total: 1, ok: 1, ko: 0, eq: 0 });
    expect(stats.p0).toEqual({ total: 1, ok: 1, ko: 0, eq: 0 });
  });

  it('ranks ascending by total', () => {
    const totals = { p0: 30, p1: 12, p2: 50 };
    const ranking = makeRanking(players, totals);
    expect(ranking.map((p) => p.id)).toEqual(['p1', 'p0', 'p2']);
  });

  it('detects end of game at 100', () => {
    expect(isGameOver({ p0: 99, p1: 0 })).toBe(false);
    expect(isGameOver({ p0: 100, p1: 0 })).toBe(true);
    expect(isGameOver({ p0: 120, p1: 0 })).toBe(true);
  });
});
