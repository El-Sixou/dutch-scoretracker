type TabId = 'home' | 'ranking' | 'history';

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
  hasGame: boolean;
};

export const TabBar = ({ active, onChange, hasGame }: Props) => {
  const tabs: { id: TabId; label: string; glyph: string }[] = [
    { id: 'home', label: 'Partie', glyph: '♠' },
    { id: 'ranking', label: 'Classement', glyph: '#' },
    { id: 'history', label: 'Historique', glyph: '≡' },
  ];
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 14px 16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--ds-line)',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            className="pressable"
            onClick={() => onChange(t.id)}
            disabled={!hasGame}
            style={{
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '4px 10px',
              color: on ? 'var(--ds-ink)' : 'var(--ds-ink-3)',
              cursor: 'pointer',
              fontFamily: 'var(--ds-body)',
              opacity: hasGame ? 1 : 0.4,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: on ? 'var(--ds-ink)' : 'transparent',
                color: on ? '#fff' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              {t.glyph}
            </div>
            <span style={{ fontSize: 11, fontWeight: on ? 600 : 500 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
