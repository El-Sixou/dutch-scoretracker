import type { Player, PlayerId } from '../../types';
import {
  Avatar,
  Body,
  Bottom,
  Btn,
  Header,
  StatusBar,
} from '../atoms';

type Props = {
  players: Player[];
  onRename: (pid: PlayerId, name: string) => void;
  onBack: () => void;
  onStart: () => void;
};

export const SetupNames = ({ players, onRename, onBack, onStart }: Props) => {
  const allFilled = players.every((p) => p.name.trim().length > 0);
  return (
    <>
      <StatusBar />
      <Header title="Les joueurs" sub="étape 2 sur 2" onBack={onBack} />
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
            Qui joue&nbsp;?
          </div>
          <div
            style={{ fontSize: 14, color: 'var(--ds-ink-2)', marginTop: 6 }}
          >
            {players.length} joueurs. Saisis chaque prénom.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {players.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                background: '#fff',
                border: `1px solid ${
                  p.name.trim()
                    ? 'var(--ds-line)'
                    : 'color-mix(in oklab, var(--ds-accent) 30%, white)'
                }`,
                borderRadius: 14,
              }}
            >
              <Avatar suit={p.suit} />
              <input
                value={p.name}
                onChange={(e) => onRename(p.id, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--ds-body)',
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'var(--ds-ink)',
                  minWidth: 0,
                }}
                maxLength={14}
              />
              <span
                style={{
                  color: 'var(--ds-ink-3)',
                  fontSize: 12,
                  fontFamily: 'var(--ds-num)',
                }}
              >
                J{i + 1}
              </span>
            </div>
          ))}
        </div>
      </Body>
      <Bottom>
        <Btn variant="primary" disabled={!allFilled} onClick={onStart}>
          {allFilled ? "C'est parti" : 'Saisis tous les noms'}
        </Btn>
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--ds-ink-3)',
          }}
        >
          Les noms restent à l'écran toute la partie.
        </div>
      </Bottom>
    </>
  );
};
