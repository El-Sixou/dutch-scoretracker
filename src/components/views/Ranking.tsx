import type { Aggregates, RankedPlayer } from '../../types';
import { Avatar, Body, Header, Num, StatusBar } from '../atoms';

type Props = {
  ranking: RankedPlayer[];
  stats: Aggregates['stats'];
  roundCount: number;
  onBack: () => void;
};

export const Ranking = ({ ranking, stats, roundCount, onBack }: Props) => (
  <>
    <StatusBar />
    <Header
      title="Classement"
      sub={`après manche ${roundCount}`}
      onBack={onBack}
    />
    <Body scroll>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ranking.map((p, i) => {
          const s = stats[p.id] || { total: 0, ok: 0, ko: 0, eq: 0 };
          const pct = s.total ? Math.round((s.ok / s.total) * 100) : 0;
          const isLead = i === 0;
          return (
            <div
              key={p.id}
              style={{
                padding: '12px 14px',
                background: isLead ? 'var(--ds-ink)' : '#fff',
                color: isLead ? '#fff' : 'var(--ds-ink)',
                border: '1px solid var(--ds-line)',
                borderRadius: 16,
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <Num size={14} style={{ width: 18, opacity: 0.5 }}>
                  {i + 1}
                </Num>
                <Avatar suit={p.suit} />
                <div
                  style={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: 15,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </div>
                <Num size={28}>{p.total}</Num>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,1fr)',
                  gap: 6,
                  marginTop: 10,
                  paddingLeft: 36,
                }}
              >
                {(
                  [
                    ['Dutch', s.total],
                    ['Réussis', s.ok],
                    ['Ratés', s.ko],
                    ['Égalités', s.eq],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        opacity: 0.55,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {k}
                    </div>
                    <Num size={16} style={{ marginTop: 2 }}>
                      {v}
                    </Num>
                  </div>
                ))}
              </div>
              {s.total > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8,
                    paddingLeft: 36,
                    fontSize: 11,
                    opacity: 0.8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: isLead ? '#ffffff20' : 'var(--ds-paper-2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: pct + '%',
                        background: isLead ? '#fff' : 'var(--ds-accent)',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <Num size={11} weight={500}>
                    {pct}%
                  </Num>
                  <span style={{ opacity: 0.7 }}>réussite</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Body>
  </>
);
