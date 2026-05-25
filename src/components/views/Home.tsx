import type { RankedPlayer } from '../../types';
import {
  Avatar,
  Body,
  Bottom,
  Btn,
  Header,
  Num,
  SectionLabel,
  StatusBar,
} from '../atoms';

type Props = {
  ranking: RankedPlayer[];
  roundCount: number;
  dutchCount: number;
  onNewRound: () => void;
  onMore: () => void;
};

export const Home = ({
  ranking,
  roundCount,
  dutchCount,
  onNewRound,
  onMore,
}: Props) => {
  const lead = ranking[0];
  return (
    <>
      <StatusBar />
      <Header
        title="Dutch score"
        sub={`manche ${roundCount + 1} · objectif 100`}
        right={
          <button
            onClick={onMore}
            className="pressable"
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 20,
              color: 'var(--ds-ink-2)',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 10,
            }}
          >
            ⋯
          </button>
        }
      />
      <Body scroll>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SectionLabel>Classement temps réel</SectionLabel>
          <span style={{ fontSize: 11, color: 'var(--ds-ink-3)' }}>
            du + bas au + haut
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranking.map((p, i) => {
            const isLead = lead && p.id === lead.id;
            const pct = Math.min(100, (p.total / 100) * 100);
            return (
              <div
                key={p.id}
                style={{
                  padding: '12px 14px',
                  background: isLead ? 'var(--ds-ink)' : '#fff',
                  color: isLead ? '#fff' : 'var(--ds-ink)',
                  border: `1px solid ${isLead ? 'var(--ds-ink)' : 'var(--ds-line)'}`,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 18,
                    fontSize: 13,
                    fontFamily: 'var(--ds-num)',
                    opacity: 0.6,
                  }}
                >
                  {i + 1}
                </div>
                <Avatar suit={p.suit} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.name}
                    </span>
                    {isLead && roundCount > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: 'var(--ds-accent)',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: 999,
                          letterSpacing: '0.05em',
                          flexShrink: 0,
                        }}
                      >
                        EN TÊTE
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      height: 4,
                      marginTop: 6,
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
                        background: isLead ? '#fff' : 'var(--ds-ink)',
                        borderRadius: 2,
                        transition: 'width .4s ease',
                      }}
                    />
                  </div>
                </div>
                <Num
                  size={32}
                  weight={600}
                  style={{ minWidth: 48, textAlign: 'right' }}
                >
                  {p.total}
                </Num>
              </div>
            );
          })}
        </div>
      </Body>
      <Bottom>
        <Btn variant="accent" onClick={onNewRound}>
          {roundCount === 0 ? 'Démarrer la 1ʳᵉ manche' : '+ Nouvelle manche'}
        </Btn>
        <div
          style={{
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
            fontSize: 12,
            color: 'var(--ds-ink-3)',
          }}
        >
          <span>
            {roundCount} manche{roundCount > 1 ? 's' : ''} jouée
            {roundCount > 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span>
            {dutchCount} Dutch annoncé{dutchCount > 1 ? 's' : ''}
          </span>
        </div>
      </Bottom>
    </>
  );
};
