import type { Draft, Player, PlayerId } from '../../types';
import {
  Body,
  Bottom,
  Btn,
  Card,
  Header,
  Num,
  SectionLabel,
  StatusBar,
  Suit,
} from '../atoms';

export type RecapComputed = {
  adj: Record<PlayerId, number>;
  totalsAfter: Record<PlayerId, number>;
  willEnd: boolean;
};

type Props = {
  players: Player[];
  draft: Draft;
  computed: RecapComputed;
  onBack: () => void;
  onAskValidate: () => void;
  editing: boolean;
};

export const RoundRecap = ({
  players,
  draft,
  computed,
  onBack,
  onAskValidate,
  editing,
}: Props) => {
  const dutch = players.find((p) => p.id === draft.dutchPid);
  const outcomeLabel = !dutch
    ? null
    : computed.adj[dutch.id] === -10
      ? 'Dutch réussi'
      : computed.adj[dutch.id] === 0
        ? 'Dutch à égalité'
        : 'Dutch raté';
  const outcomeColor = !dutch
    ? undefined
    : computed.adj[dutch.id] === -10
      ? 'var(--ds-accent)'
      : computed.adj[dutch.id] === 0
        ? 'var(--ds-ink-2)'
        : '#a35a00';
  return (
    <>
      <StatusBar />
      <Header
        title="Récap de la manche"
        sub="étape 3 sur 3"
        onBack={onBack}
      />
      <Body scroll>
        {dutch ? (
          <Card
            style={{
              padding: '14px 16px',
              background: 'color-mix(in oklab, var(--ds-accent) 8%, white)',
              borderColor:
                'color-mix(in oklab, var(--ds-accent) 25%, white)',
            }}
          >
            <SectionLabel>
              <span style={{ color: outcomeColor }}>● {outcomeLabel}</span>
            </SectionLabel>
            <div
              style={{
                fontFamily: 'var(--ds-display)',
                fontSize: 22,
                fontWeight: 600,
                marginTop: 4,
                letterSpacing: '-0.02em',
              }}
            >
              {dutch.name} {dutch.suit} ·{' '}
              <span style={{ color: outcomeColor }}>
                {computed.adj[dutch.id] === 0
                  ? '0'
                  : (computed.adj[dutch.id] > 0 ? '+' : '') +
                    computed.adj[dutch.id]}{' '}
                pts
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ds-ink-2)',
                marginTop: 4,
              }}
            >
              {computed.adj[dutch.id] === -10 &&
                'Seul au plus bas — bonus auto.'}
              {computed.adj[dutch.id] === 0 &&
                'À égalité au plus bas — pas de bonus.'}
              {computed.adj[dutch.id] === 5 &&
                "N'est pas au plus bas — malus auto."}
            </div>
          </Card>
        ) : (
          <Card style={{ padding: '14px 16px' }}>
            <SectionLabel>Pas de Dutch</SectionLabel>
            <div
              style={{
                fontSize: 13,
                color: 'var(--ds-ink-2)',
                marginTop: 4,
              }}
            >
              Aucun ajustement appliqué cette manche.
            </div>
          </Card>
        )}
        <Card style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 44px 44px 56px',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--ds-ink-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '10px 14px',
              borderBottom: '1px solid var(--ds-line)',
            }}
          >
            <span>Joueur</span>
            <span style={{ textAlign: 'right' }}>brut</span>
            <span style={{ textAlign: 'right' }}>±</span>
            <span style={{ textAlign: 'right' }}>total</span>
          </div>
          {players.map((p, i, arr) => {
            const raw = draft.raw[p.id];
            const adj = computed.adj[p.id];
            const tot = computed.totalsAfter[p.id];
            const isDutch = p.id === draft.dutchPid;
            const willEnd = tot >= 100;
            return (
              <div
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 44px 44px 56px',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom:
                    i < arr.length - 1 ? '1px solid var(--ds-line)' : 'none',
                  background: isDutch
                    ? 'color-mix(in oklab, var(--ds-accent) 5%, white)'
                    : 'transparent',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    minWidth: 0,
                  }}
                >
                  <Suit s={p.suit} size={14} />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.name}
                  </span>
                </span>
                <Num
                  size={14}
                  style={{ textAlign: 'right', color: 'var(--ds-ink-2)' }}
                >
                  {raw}
                </Num>
                <Num
                  size={14}
                  style={{
                    textAlign: 'right',
                    color:
                      adj < 0
                        ? 'var(--ds-accent)'
                        : adj > 0
                          ? '#a35a00'
                          : 'var(--ds-ink-3)',
                  }}
                >
                  {adj === 0 ? '·' : adj > 0 ? '+' + adj : adj}
                </Num>
                <Num
                  size={20}
                  style={{
                    textAlign: 'right',
                    color: willEnd ? 'var(--ds-accent)' : 'var(--ds-ink)',
                  }}
                >
                  {tot}
                </Num>
              </div>
            );
          })}
        </Card>
        {computed.willEnd && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'color-mix(in oklab, var(--ds-accent) 10%, white)',
              border:
                '1px solid color-mix(in oklab, var(--ds-accent) 30%, white)',
              fontSize: 13,
              color: 'var(--ds-ink)',
            }}
          >
            ⚐ Au moins un joueur va atteindre <Num size={13}><b>100</b></Num>.
            La partie se terminera après validation.
          </div>
        )}
      </Body>
      <Bottom>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" style={{ flex: 1 }} onClick={onBack}>
            ‹ Modifier
          </Btn>
          <Btn
            variant="accent"
            style={{ flex: 1.6 }}
            onClick={onAskValidate}
          >
            {editing ? 'Enregistrer' : 'Valider ✓'}
          </Btn>
        </div>
      </Bottom>
    </>
  );
};
