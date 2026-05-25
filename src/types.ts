export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  suit: string;
};

export type Outcome = 'success' | 'tie' | 'fail' | null;

export type Round = {
  id: string;
  index: number;
  dutchPid: PlayerId | null;
  raw: Record<PlayerId, number>;
  adj: Record<PlayerId, number>;
  final: Record<PlayerId, number>;
  outcome: Outcome;
};

export type Draft = {
  dutchPid: PlayerId | null | undefined;
  raw: Record<PlayerId, number | null>;
  activePid: PlayerId | null;
  editingRoundId: string | null;
};

export type Screen =
  | 'setup-count'
  | 'setup-names'
  | 'home'
  | 'round-dutch'
  | 'round-scores'
  | 'round-recap'
  | 'ranking'
  | 'history'
  | 'end';

export type Status = 'idle' | 'playing' | 'finished';

export type State = {
  screen: Screen;
  status: Status;
  playerCount: number;
  players: Player[];
  rounds: Round[];
  draft: Draft | null;
};

export type Stats = { total: number; ok: number; ko: number; eq: number };
export type Aggregates = {
  totals: Record<PlayerId, number>;
  stats: Record<PlayerId, Stats>;
};
export type RankedPlayer = Player & { total: number };
