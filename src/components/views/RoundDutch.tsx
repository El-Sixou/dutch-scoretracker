import type { Player, PlayerId } from '../../types';
import { Body, Bottom, Btn, Header, StatusBar } from '../atoms';

type Props = {
  players: Player[];
  draftDutchPid: PlayerId | null | undefined;
  onSelect: (pid: PlayerId) => void;
  onSelectNone: () => void;
  onBack: () => void;
  onNext: () => void;
  editing: boolean;
};

export const RoundDutch = ({
  players,
  draftDutchPid,
  onSelect,
  onSelectNone,
  onBack,
  onNext,
  editing,
}: Props) => (
  <>
    <StatusBar />
    <Header
      title={editing ? 'Modifier la manche' : 'Manche en cours'}
      sub="étape 1 sur 3"
      onBack={onBack}
    />
    <Body scroll>
      <div>
        <div
          style={{
            fontFamily: 'var(--ds-display)',
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Qui a annoncé{' '}
          <span style={{ color: 'var(--ds-accent)' }}>Dutch&nbsp;?</span>
        </div>
        <div
          style={{ fontSize: 13, color: 'var(--ds-ink-2)', marginTop: 4 }}
        >
          Le bonus/malus s'applique automatiquement à la saisie.
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}
      >
        {players.map((p) => {
          const sel = p.id === draftDutchPid;
          const red = p.suit === '♥' || p.suit === '♦';
          return (
            <button
              key={p.id}
              className="pressable"
              onClick={() => onSelect(p.id)}
              style={{
                padding: '14px 12px',
                background: sel ? 'var(--ds-accent)' : '#fff',
                color: sel ? '#fff' : 'var(--ds-ink)',
                border: `1px solid ${sel ? 'var(--ds-accent)' : 'var(--ds-line)'}`,
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: sel ? '0 6px 14px -8px var(--ds-accent)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    color: sel
                      ? '#fff'
                      : red
                        ? 'var(--ds-accent)'
                        : 'var(--ds-ink)',
                  }}
                >
                  {p.suit}
                </span>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `1.5px solid ${sel ? '#fff' : 'var(--ds-line)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {sel ? '✓' : ''}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.name}
              </div>
            </button>
          );
        })}
      </div>
      <button
        className="pressable"
        onClick={onSelectNone}
        style={{
          padding: '12px 14px',
          border: `1px ${
            draftDutchPid === null
              ? 'solid var(--ds-ink)'
              : 'dashed var(--ds-line)'
          }`,
          background:
            draftDutchPid === null ? 'var(--ds-paper)' : 'transparent',
          borderRadius: 14,
          textAlign: 'center',
          fontSize: 13,
          color:
            draftDutchPid === null ? 'var(--ds-ink)' : 'var(--ds-ink-2)',
          cursor: 'pointer',
          fontFamily: 'var(--ds-body)',
        }}
      >
        Personne n'a annoncé Dutch
      </button>
    </Body>
    <Bottom>
      <Btn
        variant="primary"
        onClick={onNext}
        disabled={draftDutchPid === undefined}
      >
        Saisir les scores →
      </Btn>
    </Bottom>
  </>
);
