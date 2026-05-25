import {
  Body,
  Bottom,
  Btn,
  Card,
  Header,
  Num,
  SectionLabel,
  StatusBar,
} from '../atoms';

type Props = {
  count: number;
  onSetCount: (n: number) => void;
  onNext: () => void;
  onClose: (() => void) | null;
};

export const SetupCount = ({ count, onSetCount, onNext, onClose }: Props) => (
  <>
    <StatusBar />
    <Header
      title="Nouvelle partie"
      sub="étape 1 sur 2"
      right={
        onClose && (
          <button
            onClick={onClose}
            className="pressable"
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 18,
              color: 'var(--ds-ink-2)',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 10,
            }}
          >
            ✕
          </button>
        )
      }
    />
    <Body>
      <div>
        <div
          style={{
            fontFamily: 'var(--ds-display)',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Combien de joueurs&nbsp;?
        </div>
        <div
          style={{ fontSize: 14, color: 'var(--ds-ink-2)', marginTop: 6 }}
        >
          Entre 3 et 6, autour de la table.
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 2,
        }}
      >
        {[3, 4, 5, 6].map((n) => {
          const sel = n === count;
          return (
            <button
              key={n}
              className="pressable"
              onClick={() => onSetCount(n)}
              style={{
                border: `1px solid ${sel ? 'var(--ds-ink)' : 'var(--ds-line)'}`,
                background: sel ? 'var(--ds-ink)' : '#fff',
                color: sel ? '#fff' : 'var(--ds-ink)',
                borderRadius: 18,
                padding: '22px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: sel
                  ? '0 0 0 3px color-mix(in oklab, var(--ds-accent) 25%, transparent)'
                  : 'none',
              }}
            >
              <Num size={42} weight={600}>
                {n}
              </Num>
              <span style={{ fontSize: 13, opacity: 0.7 }}>joueurs</span>
            </button>
          );
        })}
      </div>
      <Card style={{ padding: '14px 16px' }}>
        <SectionLabel>Comment ça marche</SectionLabel>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--ds-ink-2)',
            marginTop: 6,
          }}
        >
          Annonce <b style={{ color: 'var(--ds-accent)' }}>Dutch</b> avant de
          retourner tes cartes. Seul au plus bas&nbsp;: <Num size={13}>−10</Num>.
          Égalité&nbsp;: <Num size={13}>0</Num>. Pas le plus bas&nbsp;:{' '}
          <Num size={13}>+5</Num>. Fin à <Num size={13}>100</Num>.
        </div>
      </Card>
    </Body>
    <Bottom>
      <Btn variant="primary" onClick={onNext}>
        Continuer →
      </Btn>
    </Bottom>
  </>
);
