import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from 'react';

type DivStyle = { style?: CSSProperties };

export const StatusBar = () => null;

type HeaderProps = {
  title: ReactNode;
  sub?: ReactNode;
  onBack?: (() => void) | null;
  right?: ReactNode;
};

export const Header = ({ title, sub, onBack, right }: HeaderProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 14px 10px',
      flexShrink: 0,
    }}
  >
    <button
      className="pressable"
      onClick={onBack ?? undefined}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        color: onBack ? 'var(--ds-ink)' : 'transparent',
        fontSize: 24,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disabled={!onBack}
      aria-label="Retour"
    >
      ‹
    </button>
    <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'var(--ds-display)',
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: 'var(--ds-ink-3)',
            marginTop: 1,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {sub}
        </div>
      )}
    </div>
    <div
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {right || null}
    </div>
  </div>
);

type BodyProps = { children: ReactNode; scroll?: boolean } & DivStyle;

export const Body = ({ children, style, scroll }: BodyProps) => (
  <div
    className={'view-enter ' + (scroll ? 'scroll-y' : '')}
    style={{
      flex: 1,
      padding: '4px 20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflow: scroll ? 'auto' : 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Bottom = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: '4px 20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flexShrink: 0,
      paddingBottom: 'max(22px, env(safe-area-inset-bottom))',
    }}
  >
    {children}
  </div>
);

type BtnVariant = 'primary' | 'accent' | 'ghost' | 'danger' | 'soft';
type BtnSize = 'lg' | 'md' | 'sm';

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: BtnSize;
};

export const Btn = ({
  children,
  variant = 'primary',
  size = 'lg',
  style,
  disabled,
  ...rest
}: BtnProps) => {
  const base: CSSProperties = {
    borderRadius: size === 'sm' ? 10 : 14,
    fontFamily: 'var(--ds-body)',
    fontWeight: 600,
    fontSize: size === 'lg' ? 16 : size === 'sm' ? 12 : 14,
    padding:
      size === 'lg' ? '15px 18px' : size === 'sm' ? '6px 10px' : '10px 14px',
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    letterSpacing: '-0.005em',
    opacity: disabled ? 0.45 : 1,
  };
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background: 'var(--ds-ink)', color: '#fff' },
    accent: { background: 'var(--ds-accent)', color: '#fff' },
    ghost: {
      background: 'transparent',
      color: 'var(--ds-ink)',
      borderColor: 'var(--ds-line)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--ds-accent)',
      borderColor: 'var(--ds-accent)',
    },
    soft: { background: 'var(--ds-paper-2)', color: 'var(--ds-ink)' },
  };
  return (
    <button
      className="pressable"
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </button>
  );
};

export const Suit = ({ s, size = 18 }: { s: string; size?: number }) => {
  const red = s === '♥' || s === '♦';
  return (
    <span
      style={{
        color: red ? 'var(--ds-accent)' : 'var(--ds-ink)',
        fontSize: size,
        lineHeight: 1,
        display: 'inline-block',
      }}
    >
      {s}
    </span>
  );
};

type AvatarProps = { suit: string; ring?: boolean; size?: number };

export const Avatar = ({ suit, ring, size = 34 }: AvatarProps) => {
  const red = suit === '♥' || suit === '♦';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: red
          ? 'color-mix(in oklab, var(--ds-accent) 8%, white)'
          : 'var(--ds-paper-2)',
        color: red ? 'var(--ds-accent)' : 'var(--ds-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.55,
        fontWeight: 500,
        boxShadow: ring
          ? '0 0 0 2px var(--ds-accent)'
          : 'inset 0 0 0 1px var(--ds-line)',
        flexShrink: 0,
      }}
    >
      {suit}
    </div>
  );
};

type CardProps = { children: ReactNode; accent?: boolean } & DivStyle;

export const Card = ({ children, accent, style }: CardProps) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid var(--ds-line)',
      borderRadius: 18,
      boxShadow: accent ? '0 0 0 2px var(--ds-accent)' : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

type TagProps = { children: ReactNode; tone?: 'default' | 'accent' | 'soft' };

export const Tag = ({ children, tone = 'default' }: TagProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background:
        tone === 'accent'
          ? 'var(--ds-accent)'
          : tone === 'soft'
            ? 'var(--ds-paper-2)'
            : '#fff',
      color: tone === 'accent' ? '#fff' : 'var(--ds-ink)',
      border: tone === 'accent' ? 'none' : '1px solid var(--ds-line)',
    }}
  >
    {children}
  </span>
);

type NumProps = {
  children: ReactNode;
  size?: number;
  weight?: number;
} & DivStyle;

export const Num = ({ children, size = 28, weight = 600, style }: NumProps) => (
  <span
    style={{
      fontFamily: 'var(--ds-num)',
      fontWeight: weight,
      fontSize: size,
      letterSpacing: 'var(--ds-num-spacing, -0.02em)',
      lineHeight: 1,
      fontFeatureSettings: '"tnum" 1, "zero" 1',
      ...style,
    }}
  >
    {children}
  </span>
);

export const SectionLabel = ({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '0 2px',
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--ds-ink-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </div>
    {right && (
      <div style={{ fontSize: 11, color: 'var(--ds-ink-3)' }}>{right}</div>
    )}
  </div>
);

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0e0e0e80',
          backdropFilter: 'blur(2px)',
          animation: 'viewIn .18s ease both',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '22px 22px 0 0',
          boxShadow: '0 -20px 50px -10px #00000040',
          padding: '18px 20px 22px',
          width: '100%',
          animation: 'viewIn .22s ease both',
        }}
      >
        {children}
      </div>
    </div>
  );
};

type NumPadProps = {
  onKey: (k: string) => void;
  okLabel?: string;
  okDisabled?: boolean;
};

export const NumPad = ({
  onKey,
  okLabel = '✓',
  okDisabled,
}: NumPadProps) => {
  const keys: (number | 'back' | 'ok')[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0, 'ok',
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 6,
      }}
    >
      {keys.map((k, i) => {
        const isOk = k === 'ok';
        const isBack = k === 'back';
        return (
          <button
            key={i}
            className="pressable"
            onClick={() => onKey(String(k))}
            disabled={isOk && okDisabled}
            style={{
              padding: '14px 0',
              textAlign: 'center',
              border: isOk
                ? '1px solid var(--ds-accent)'
                : '1px solid var(--ds-line)',
              background: isOk ? 'var(--ds-accent)' : '#fff',
              color: isOk ? '#fff' : 'var(--ds-ink)',
              borderRadius: 14,
              fontFamily: isBack ? 'var(--ds-body)' : 'var(--ds-num)',
              fontWeight: 600,
              fontSize: 22,
              cursor: 'pointer',
            }}
          >
            {isBack ? '⌫' : isOk ? okLabel : k}
          </button>
        );
      })}
    </div>
  );
};
