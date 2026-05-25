import type { Player, Round } from '../../types';
import {
  Body,
  Btn,
  Card,
  Header,
  Num,
  StatusBar,
  Suit,
} from '../atoms';

type Props = {
  players: Player[];
  rounds: Round[];
  onBack: () => void;
  onEditLast: () => void;
  onAskDeleteLast: () => void;
};

export const History = ({
  players,
  rounds,
  onBack,
  onEditLast,
  onAskDeleteLast,
}: Props) => {
  const lastId = rounds.length ? rounds[rounds.length - 1].id : null;
  return (
    <>
      <StatusBar />
      <Header
        title="Historique"
        sub={`${rounds.length} manche${rounds.length > 1 ? 's' : ''}`}
        onBack={onBack}
      />
      <Body scroll>
        {rounds.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--ds-ink-3)',
              fontSize: 14,
            }}
          >
            Aucune manche jouée pour l'instant.
          </div>
        )}
        {[...rounds].reverse().map((r) => {
          const dutch = players.find((p) => p.id === r.dutchPid);
          const adj = dutch ? r.adj[dutch.id] : 0;
          const isLast = r.id === lastId;
          return (
            <Card key={r.id} style={{ padding: '12px 14px' }} accent={isLast}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--ds-display)',
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Manche {r.index + 1}
                  {isLast && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 9,
                        fontWeight: 600,
                        color: 'var(--ds-accent)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      · DERNIÈRE
                    </span>
                  )}
                </div>
                {dutch ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--ds-ink-2)',
                      display: 'flex',
                      gap: 4,
                      alignItems: 'center',
                    }}
                  >
                    Dutch <Suit s={dutch.suit} size={12} />{' '}
                    <b
                      style={{
                        maxWidth: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {dutch.name}
                    </b>
                    <span
                      style={{
                        color:
                          adj < 0
                            ? 'var(--ds-accent)'
                            : adj > 0
                              ? '#a35a00'
                              : 'var(--ds-ink-2)',
                        fontWeight: 600,
                        fontFamily: 'var(--ds-num)',
                      }}
                    >
                      {adj === 0 ? '·' : adj < 0 ? adj : '+' + adj}
                    </span>
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--ds-ink-3)' }}>
                    Pas de Dutch
                  </span>
                )}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {players.map((p) => {
                  const isCaller = r.dutchPid === p.id;
                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '6px 4px',
                        background: isCaller
                          ? 'color-mix(in oklab, var(--ds-accent) 10%, white)'
                          : 'var(--ds-paper-2)',
                        borderRadius: 8,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: 'var(--ds-ink-3)',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </div>
                      <Num size={15} style={{ marginTop: 2 }}>
                        {r.final[p.id]}
                      </Num>
                    </div>
                  );
                })}
              </div>
              {isLast && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <Btn variant="ghost" size="sm" onClick={onEditLast}>
                    Modifier
                  </Btn>
                  <Btn variant="danger" size="sm" onClick={onAskDeleteLast}>
                    Supprimer
                  </Btn>
                </div>
              )}
            </Card>
          );
        })}
      </Body>
    </>
  );
};
