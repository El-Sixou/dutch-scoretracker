import { useEffect, useMemo, useReducer, useState } from 'react';
import { Btn, Modal } from './components/atoms';
import { TabBar } from './components/TabBar';
import { End } from './components/views/End';
import { History } from './components/views/History';
import { Home } from './components/views/Home';
import { Ranking } from './components/views/Ranking';
import { RoundDutch } from './components/views/RoundDutch';
import { RoundRecap } from './components/views/RoundRecap';
import { RoundScores } from './components/views/RoundScores';
import { SetupCount } from './components/views/SetupCount';
import { SetupNames } from './components/views/SetupNames';
import {
  computeAdjustments,
  computeAggregates,
  makeRanking,
} from './game';
import {
  STORAGE_KEY,
  loadInitial,
  reducer,
} from './reducer';
import type { PlayerId } from './types';

type TabId = 'home' | 'ranking' | 'history';
type ModalKind =
  | 'menu'
  | 'confirm-validate'
  | 'confirm-delete'
  | 'confirm-restart'
  | null;

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [modal, setModal] = useState<ModalKind>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const { totals, stats } = useMemo(
    () => computeAggregates(state.players, state.rounds),
    [state.players, state.rounds],
  );
  const ranking = useMemo(
    () => makeRanking(state.players, totals),
    [state.players, totals],
  );
  const dutchCount = state.rounds.filter((r) => r.dutchPid).length;

  const recapComputed = useMemo(() => {
    if (!state.draft) return null;
    const rawNumbers: Record<PlayerId, number> = {};
    Object.entries(state.draft.raw).forEach(([pid, v]) => {
      rawNumbers[pid] = Number.isFinite(v) ? (v as number) : 0;
    });
    const adj = computeAdjustments(rawNumbers, state.draft.dutchPid);
    const totalsAfter: Record<PlayerId, number> = {};
    let willEnd = false;
    state.players.forEach((p) => {
      const finalForPlayer = (rawNumbers[p.id] || 0) + (adj[p.id] || 0);
      let prevContribution = 0;
      if (state.draft?.editingRoundId) {
        const old = state.rounds.find(
          (r) => r.id === state.draft?.editingRoundId,
        );
        if (old) prevContribution = old.final[p.id] || 0;
      }
      const newTotal =
        (totals[p.id] || 0) - prevContribution + finalForPlayer;
      totalsAfter[p.id] = newTotal;
      if (newTotal >= 100) willEnd = true;
    });
    return { adj, totalsAfter, willEnd };
  }, [state.draft, state.players, state.rounds, totals]);

  const showTabBar =
    state.screen === 'home' ||
    state.screen === 'ranking' ||
    state.screen === 'history';
  const tabId: TabId =
    state.screen === 'ranking'
      ? 'ranking'
      : state.screen === 'history'
        ? 'history'
        : 'home';

  const onTabChange = (id: TabId) => {
    if (id === 'home') dispatch({ type: 'GO_HOME' });
    if (id === 'ranking') dispatch({ type: 'GO_RANKING' });
    if (id === 'history') dispatch({ type: 'GO_HISTORY' });
  };

  const renderView = () => {
    switch (state.screen) {
      case 'setup-count':
        return (
          <SetupCount
            count={state.playerCount}
            onSetCount={(n) => dispatch({ type: 'SET_COUNT', count: n })}
            onNext={() => dispatch({ type: 'GO_NAMES' })}
            onClose={
              state.rounds.length > 0
                ? () => dispatch({ type: 'GO_HOME' })
                : null
            }
          />
        );

      case 'setup-names':
        return (
          <SetupNames
            players={state.players}
            onRename={(pid, name) =>
              dispatch({ type: 'RENAME', pid, name })
            }
            onBack={() => dispatch({ type: 'GO_SETUP_COUNT' })}
            onStart={() => dispatch({ type: 'START_GAME' })}
          />
        );

      case 'home':
        return (
          <Home
            ranking={ranking}
            roundCount={state.rounds.length}
            dutchCount={dutchCount}
            onNewRound={() => dispatch({ type: 'START_ROUND' })}
            onMore={() => setModal('menu')}
          />
        );

      case 'round-dutch':
        if (!state.draft) return null;
        return (
          <RoundDutch
            players={state.players}
            draftDutchPid={state.draft.dutchPid}
            onSelect={(pid) => dispatch({ type: 'SET_DUTCH', pid })}
            onSelectNone={() => dispatch({ type: 'SET_DUTCH_NONE' })}
            onBack={() => dispatch({ type: 'CANCEL_ROUND' })}
            onNext={() => dispatch({ type: 'DUTCH_TO_SCORES' })}
            editing={Boolean(state.draft.editingRoundId)}
          />
        );

      case 'round-scores':
        if (!state.draft) return null;
        return (
          <RoundScores
            players={state.players}
            draft={state.draft}
            activePid={state.draft.activePid}
            onSetActive={(pid) => dispatch({ type: 'SET_ACTIVE', pid })}
            onKey={(k) => dispatch({ type: 'NUMPAD_KEY', k })}
            onBack={() => dispatch({ type: 'GO_DUTCH' })}
          />
        );

      case 'round-recap':
        if (!state.draft) return null;
        return (
          <RoundRecap
            players={state.players}
            draft={state.draft}
            computed={
              recapComputed || { adj: {}, totalsAfter: {}, willEnd: false }
            }
            onBack={() => dispatch({ type: 'GO_SCORES' })}
            onAskValidate={() => setModal('confirm-validate')}
            editing={Boolean(state.draft.editingRoundId)}
          />
        );

      case 'ranking':
        return (
          <Ranking
            ranking={ranking}
            stats={stats}
            roundCount={state.rounds.length}
            onBack={() => dispatch({ type: 'GO_HOME' })}
          />
        );

      case 'history':
        return (
          <History
            players={state.players}
            rounds={state.rounds}
            onBack={() => dispatch({ type: 'GO_HOME' })}
            onEditLast={() => {
              const last = state.rounds[state.rounds.length - 1];
              if (last)
                dispatch({ type: 'START_ROUND_EDIT', rid: last.id });
            }}
            onAskDeleteLast={() => setModal('confirm-delete')}
          />
        );

      case 'end':
        return (
          <End
            ranking={ranking}
            stats={stats}
            roundCount={state.rounds.length}
            onRestart={() => setModal('confirm-restart')}
            onShowHistory={() => dispatch({ type: 'GO_HISTORY' })}
            onShowRanking={() => dispatch({ type: 'GO_RANKING' })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="stage">
      <div className="phone-frame">
        {renderView()}

        {showTabBar && (
          <TabBar
            active={tabId}
            onChange={onTabChange}
            hasGame={
              state.status === 'playing' || state.status === 'finished'
            }
          />
        )}

        <Modal open={modal === 'menu'} onClose={() => setModal(null)}>
          <div
            style={{
              fontFamily: 'var(--ds-display)',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              marginBottom: 6,
            }}
          >
            Options de la partie
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ds-ink-2)',
              marginBottom: 12,
            }}
          >
            {state.rounds.length} manche{state.rounds.length > 1 ? 's' : ''}{' '}
            jouée{state.rounds.length > 1 ? 's' : ''}
            {' · '}objectif 100 pts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn
              variant="ghost"
              onClick={() => {
                setModal(null);
                dispatch({ type: 'GO_RANKING' });
              }}
            >
              Voir le classement & stats
            </Btn>
            <Btn
              variant="ghost"
              onClick={() => {
                setModal(null);
                dispatch({ type: 'GO_HISTORY' });
              }}
            >
              Voir l'historique
            </Btn>
            <Btn variant="danger" onClick={() => setModal('confirm-restart')}>
              Recommencer la partie
            </Btn>
            <Btn variant="soft" onClick={() => setModal(null)}>
              Fermer
            </Btn>
          </div>
        </Modal>

        <Modal
          open={modal === 'confirm-validate'}
          onClose={() => setModal(null)}
        >
          <div
            style={{
              fontFamily: 'var(--ds-display)',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            {recapComputed && recapComputed.willEnd
              ? 'Valider et terminer la partie ?'
              : 'Valider la manche ?'}
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ds-ink-2)',
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            {recapComputed && recapComputed.willEnd
              ? 'Au moins un joueur atteint 100 pts. Le classement final sera figé.'
              : "Les scores seront ajoutés au total. Tu pourras encore modifier ou supprimer cette manche depuis l'historique."}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1 }}
              onClick={() => setModal(null)}
            >
              Annuler
            </Btn>
            <Btn
              variant="accent"
              style={{ flex: 1.5 }}
              onClick={() => {
                setModal(null);
                dispatch({ type: 'VALIDATE_ROUND' });
              }}
            >
              Valider ✓
            </Btn>
          </div>
        </Modal>

        <Modal
          open={modal === 'confirm-delete'}
          onClose={() => setModal(null)}
        >
          <div
            style={{
              fontFamily: 'var(--ds-display)',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Supprimer la dernière manche&nbsp;?
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ds-ink-2)',
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            Les scores seront retirés du total et l'éventuel Dutch annulé.
            Cette action est irréversible.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1 }}
              onClick={() => setModal(null)}
            >
              Annuler
            </Btn>
            <Btn
              variant="accent"
              style={{ flex: 1 }}
              onClick={() => {
                setModal(null);
                dispatch({ type: 'DELETE_LAST_ROUND' });
              }}
            >
              Supprimer
            </Btn>
          </div>
        </Modal>

        <Modal
          open={modal === 'confirm-restart'}
          onClose={() => setModal(null)}
        >
          <div
            style={{
              fontFamily: 'var(--ds-display)',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Nouvelle partie&nbsp;?
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ds-ink-2)',
              marginTop: 6,
              lineHeight: 1.45,
            }}
          >
            La partie en cours sera effacée. Les noms des joueurs peuvent être
            réutilisés.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Btn
              variant="ghost"
              style={{ flex: 1 }}
              onClick={() => setModal(null)}
            >
              Annuler
            </Btn>
            <Btn
              variant="accent"
              style={{ flex: 1 }}
              onClick={() => {
                setModal(null);
                dispatch({ type: 'RESET_GAME' });
              }}
            >
              Recommencer
            </Btn>
          </div>
        </Modal>
      </div>
    </div>
  );
}
