import type { Draft, Player, PlayerId } from '../../types';
import {
  Avatar,
  Body,
  Header,
  Num,
  NumPad,
  SectionLabel,
  StatusBar,
  Tag,
} from '../atoms';

type Props = {
  players: Player[];
  draft: Draft;
  activePid: PlayerId | null;
  onSetActive: (pid: PlayerId) => void;
  onKey: (k: string) => void;
  onBack: () => void;
};

export const RoundScores = ({
  players,
  draft,
  activePid,
  onSetActive,
  onKey,
  onBack,
}: Props) => {
  const dutch = players.find((p) => p.id === draft.dutchPid);
  const allFilled = players.every((p) => Number.isFinite(draft.raw[p.id]));
  return (
    <>
      <StatusBar />
      <Header
        title="Saisie des scores"
        sub="étape 2 sur 3"
        onBack={onBack}
      />
      <Body style={{ gap: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {dutch ? (
            <Tag tone="accent">
              DUTCH · {dutch.name} {dutch.suit}
            </Tag>
          ) : (
            <Tag tone="soft">Pas de Dutch ce tour</Tag>
          )}
          <span style={{ fontSize: 12, color: 'var(--ds-ink-3)' }}>
            · score brut de chacun
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {players.map((p) => {
            const v = draft.raw[p.id];
            const set = Number.isFinite(v);
            const active = p.id === activePid;
            const isDutch = p.id === draft.dutchPid;
            return (
              <button
                key={p.id}
                className="pressable"
                onClick={() => onSetActive(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: active ? 'var(--ds-paper)' : '#fff',
                  border: `1px solid ${active ? 'var(--ds-ink)' : 'var(--ds-line)'}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--ds-body)',
                  width: '100%',
                }}
              >
                <Avatar suit={p.suit} ring={isDutch} />
                <div
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: 500,
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.name}
                </div>
                <Num
                  size={24}
                  style={{
                    minWidth: 42,
                    textAlign: 'right',
                    color: set ? 'var(--ds-ink)' : 'var(--ds-ink-3)',
                  }}
                >
                  {set ? v : '·'}
                </Num>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, minHeight: 8 }} />
        <SectionLabel
          right={`${players.filter((p) => Number.isFinite(draft.raw[p.id])).length} / ${players.length} saisis`}
        >
          Pavé numérique
        </SectionLabel>
        <NumPad onKey={onKey} okLabel={allFilled ? 'Récap →' : 'Suivant'} />
      </Body>
    </>
  );
};
