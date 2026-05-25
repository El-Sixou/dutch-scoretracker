import type { Aggregates, RankedPlayer } from '../../types';
import {
  Body,
  Bottom,
  Btn,
  Card,
  Header,
  Num,
  StatusBar,
  Suit,
} from '../atoms';

type Props = {
  ranking: RankedPlayer[];
  stats: Aggregates['stats'];
  roundCount: number;
  onRestart: () => void;
  onShowHistory: () => void;
  onShowRanking: () => void;
};

export const End = ({
  ranking,
  stats,
  roundCount,
  onRestart,
  onShowHistory,
  onShowRanking,
}: Props) => {
  const winner = ranking[0];
  if (!winner) return null;
  return (
    <>
      <StatusBar />
      <Header
        title="Partie terminée"
        sub={`${roundCount} manche${roundCount > 1 ? 's' : ''}`}
      />
      <Body scroll style={{ gap: 14 }}>
        <div style={{ textAlign: 'center', paddingTop: 6 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--ds-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
            }}
          >
            ★ Gagnant·e
          </div>
          <div
            style={{
              fontFamily: 'var(--ds-display)',
              fontSize: 48,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              marginTop: 6,
              lineHeight: 1,
            }}
          >
            {winner.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 6,
              marginTop: 10,
            }}
          >
            <Num size={72} weight={600}>
              {winner.total}
            </Num>
            <span style={{ fontSize: 14, color: 'var(--ds-ink-2)' }}>pts</span>
          </div>
        </div>
        <Card style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--ds-line)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--ds-ink-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Classement final</span>
            <span style={{ textTransform: 'none', letterSpacing: 0 }}>
              Dutch · score
            </span>
          </div>
          {ranking.map((p, i, arr) => {
            const s = stats[p.id] || { total: 0, ok: 0, ko: 0, eq: 0 };
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderBottom:
                    i < arr.length - 1 ? '1px solid var(--ds-line)' : 'none',
                  background:
                    i === 0
                      ? 'color-mix(in oklab, var(--ds-accent) 5%, white)'
                      : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background:
                      i === 0 ? 'var(--ds-accent)' : 'var(--ds-paper-2)',
                    color: i === 0 ? '#fff' : 'var(--ds-ink-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'var(--ds-num)',
                  }}
                >
                  {i + 1}
                </div>
                <Suit s={p.suit} size={14} />
                <div
                  style={{
                    flex: 1,
                    fontWeight: 500,
                    fontSize: 14,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--ds-ink-3)',
                    fontFamily: 'var(--ds-num)',
                  }}
                >
                  {s.ok}/{s.total}
                </span>
                <Num
                  size={20}
                  style={{ minWidth: 36, textAlign: 'right' }}
                >
                  {p.total}
                </Num>
              </div>
            );
          })}
        </Card>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn
            variant="ghost"
            size="md"
            style={{ flex: 1 }}
            onClick={onShowHistory}
          >
            Voir l'historique
          </Btn>
          <Btn
            variant="ghost"
            size="md"
            style={{ flex: 1 }}
            onClick={onShowRanking}
          >
            Stats Dutch
          </Btn>
        </div>
      </Body>
      <Bottom>
        <Btn variant="accent" onClick={onRestart}>
          ↻ Nouvelle partie
        </Btn>
      </Bottom>
    </>
  );
};
