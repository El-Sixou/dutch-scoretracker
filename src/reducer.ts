import {
  computeAggregates,
  finalizeRound,
  isGameOver,
  makePlayer,
} from './game';
import type { PlayerId, State } from './types';

export const STORAGE_KEY = 'dutch-score:v1';

export const initialState: State = {
  screen: 'setup-count',
  status: 'idle',
  playerCount: 4,
  players: [],
  rounds: [],
  draft: null,
};

export type Action =
  | { type: 'HYDRATE'; state: State }
  | { type: 'SET_COUNT'; count: number }
  | { type: 'GO_NAMES' }
  | { type: 'GO_SETUP_COUNT' }
  | { type: 'RENAME'; pid: PlayerId; name: string }
  | { type: 'START_GAME' }
  | { type: 'GO_HOME' }
  | { type: 'GO_RANKING' }
  | { type: 'GO_HISTORY' }
  | { type: 'GO_END' }
  | { type: 'START_ROUND' }
  | { type: 'START_ROUND_EDIT'; rid: string }
  | { type: 'CANCEL_ROUND' }
  | { type: 'SET_DUTCH'; pid: PlayerId }
  | { type: 'SET_DUTCH_NONE' }
  | { type: 'DUTCH_TO_SCORES' }
  | { type: 'SET_ACTIVE'; pid: PlayerId }
  | { type: 'NUMPAD_KEY'; k: string }
  | { type: 'GO_SCORES' }
  | { type: 'GO_RECAP' }
  | { type: 'GO_DUTCH' }
  | { type: 'VALIDATE_ROUND' }
  | { type: 'DELETE_LAST_ROUND' }
  | { type: 'RESET_GAME' };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'SET_COUNT': {
      const count = action.count;
      const players = Array.from({ length: count }, (_, i) => {
        const existing = state.players[i];
        const base = makePlayer(i, '');
        return existing ? { ...base, name: existing.name } : base;
      });
      return { ...state, playerCount: count, players };
    }

    case 'GO_NAMES': {
      if (state.players.length !== state.playerCount) {
        const players = Array.from({ length: state.playerCount }, (_, i) =>
          makePlayer(i, ''),
        );
        return { ...state, players, screen: 'setup-names' };
      }
      return { ...state, screen: 'setup-names' };
    }

    case 'GO_SETUP_COUNT':
      return { ...state, screen: 'setup-count' };

    case 'RENAME': {
      const players = state.players.map((p) =>
        p.id === action.pid ? { ...p, name: action.name } : p,
      );
      return { ...state, players };
    }

    case 'START_GAME':
      return {
        ...state,
        screen: 'home',
        status: 'playing',
        rounds: [],
        draft: null,
      };

    case 'GO_HOME':
      return { ...state, screen: state.status === 'finished' ? 'end' : 'home' };
    case 'GO_RANKING':
      return { ...state, screen: 'ranking' };
    case 'GO_HISTORY':
      return { ...state, screen: 'history' };
    case 'GO_END':
      return { ...state, screen: 'end' };

    case 'START_ROUND': {
      const raw: Record<PlayerId, number | null> = {};
      state.players.forEach((p) => {
        raw[p.id] = null;
      });
      return {
        ...state,
        screen: 'round-dutch',
        draft: {
          dutchPid: undefined,
          raw,
          activePid: null,
          editingRoundId: null,
        },
      };
    }

    case 'START_ROUND_EDIT': {
      const round = state.rounds.find((r) => r.id === action.rid);
      if (!round) return state;
      return {
        ...state,
        screen: 'round-dutch',
        draft: {
          dutchPid: round.dutchPid,
          raw: { ...round.raw },
          activePid: null,
          editingRoundId: round.id,
        },
      };
    }

    case 'CANCEL_ROUND':
      return { ...state, screen: 'home', draft: null };

    case 'SET_DUTCH':
      return state.draft
        ? { ...state, draft: { ...state.draft, dutchPid: action.pid } }
        : state;
    case 'SET_DUTCH_NONE':
      return state.draft
        ? { ...state, draft: { ...state.draft, dutchPid: null } }
        : state;

    case 'DUTCH_TO_SCORES': {
      const d = state.draft;
      if (!d) return state;
      const firstUnfilled = state.players.find(
        (p) => !Number.isFinite(d.raw[p.id]),
      );
      const activePid = firstUnfilled ? firstUnfilled.id : state.players[0].id;
      return { ...state, screen: 'round-scores', draft: { ...d, activePid } };
    }

    case 'SET_ACTIVE':
      return state.draft
        ? { ...state, draft: { ...state.draft, activePid: action.pid } }
        : state;

    case 'NUMPAD_KEY': {
      const d = state.draft;
      if (!d) return state;
      const pid = d.activePid;
      if (!pid) return state;
      const cur = d.raw[pid];

      if (action.k === 'back') {
        const s = Number.isFinite(cur) ? String(cur) : '';
        const t = s.slice(0, -1);
        const next = t === '' ? null : parseInt(t, 10);
        return { ...state, draft: { ...d, raw: { ...d.raw, [pid]: next } } };
      }
      if (action.k === 'ok') {
        const idx = state.players.findIndex((p) => p.id === pid);
        let nextPid: PlayerId | null = null;
        for (let i = 1; i <= state.players.length; i++) {
          const cand = state.players[(idx + i) % state.players.length];
          if (!Number.isFinite(d.raw[cand.id])) {
            nextPid = cand.id;
            break;
          }
        }
        if (!nextPid) return { ...state, screen: 'round-recap' };
        return { ...state, draft: { ...d, activePid: nextPid } };
      }
      const base = Number.isFinite(cur) ? String(cur) : '';
      const merged = (base + action.k).slice(-2);
      const next = parseInt(merged, 10);
      return { ...state, draft: { ...d, raw: { ...d.raw, [pid]: next } } };
    }

    case 'GO_SCORES':
      return { ...state, screen: 'round-scores' };
    case 'GO_RECAP':
      return { ...state, screen: 'round-recap' };
    case 'GO_DUTCH':
      return { ...state, screen: 'round-dutch' };

    case 'VALIDATE_ROUND': {
      const d = state.draft;
      if (!d) return state;
      const rawNumbers: Record<PlayerId, number> = {};
      Object.entries(d.raw).forEach(([pid, v]) => {
        rawNumbers[pid] = Number.isFinite(v) ? (v as number) : 0;
      });
      let rounds;
      let idx;
      if (d.editingRoundId) {
        const existing = state.rounds.find((r) => r.id === d.editingRoundId);
        if (!existing) return state;
        idx = existing.index;
        const replacement = finalizeRound(rawNumbers, d.dutchPid, idx);
        replacement.id = existing.id;
        rounds = state.rounds.map((r) =>
          r.id === existing.id ? replacement : r,
        );
      } else {
        idx = state.rounds.length;
        rounds = [...state.rounds, finalizeRound(rawNumbers, d.dutchPid, idx)];
      }
      const { totals } = computeAggregates(state.players, rounds);
      const over = isGameOver(totals);
      return {
        ...state,
        rounds,
        draft: null,
        screen: over ? 'end' : 'home',
        status: over ? 'finished' : 'playing',
      };
    }

    case 'DELETE_LAST_ROUND': {
      if (!state.rounds.length) return state;
      const rounds = state.rounds.slice(0, -1);
      const { totals } = computeAggregates(state.players, rounds);
      const over = isGameOver(totals);
      return {
        ...state,
        rounds,
        screen: 'history',
        status: over ? 'finished' : 'playing',
      };
    }

    case 'RESET_GAME':
      return { ...initialState, playerCount: state.playerCount };

    default:
      return state;
  }
}

export function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return initialState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}
