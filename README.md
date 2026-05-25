# Dutch score tracker

Application web mobile-first pour compter les points au jeu de cartes **Dutch** (alias *Cabo*). Suivi manche par manche, application automatique du bonus/malus de Dutch (`−10` / `0` / `+5`), détection de fin de partie à 100 points.

> 🚧 Lien de démo en ligne : *à compléter une fois le déploiement Vercel terminé.*

## Fonctionnalités

- Setup 3 à 6 joueurs, saisie des prénoms.
- Saisie des scores manche par manche via un pavé numérique.
- Calcul automatique du bonus/malus du joueur qui annonce Dutch :
  - Seul au plus bas : **−10**
  - À égalité au plus bas : **0**
  - Pas au plus bas : **+5**
- Classement temps réel, historique des manches (avec modification / suppression de la dernière), statistiques Dutch par joueur.
- Persistance locale via `localStorage` (pas besoin de serveur).
- Fin de partie automatique dès qu'un joueur atteint 100 pts.

## Stack

- **React 18** + **TypeScript**
- **Vite** pour le build et le serveur de dev
- **Vitest** pour les tests de la logique de jeu
- Styles inline + variables CSS sur `:root` (design tokens)

## Lancer en local

Prérequis : [Node.js](https://nodejs.org) (LTS, ≥ 18).

```bash
npm install      # installe les dépendances (1ère fois)
npm run dev      # démarre le serveur de dev sur http://localhost:5173
npm test         # lance les tests de la logique de jeu
npm run build    # build de production dans dist/
npm run preview  # sert le build de production en local
```

## Structure

```
src/
├── App.tsx                  # router, modales, useReducer
├── main.tsx                 # entrée React
├── index.css                # tokens CSS, reset, phone-frame
├── types.ts                 # types partagés (State, Round, Draft…)
├── reducer.ts               # state machine + hydratation localStorage
├── game.ts                  # logique pure du jeu (testée)
├── game.test.ts             # tests Vitest des règles
└── components/
    ├── atoms.tsx            # Header, Body, Btn, Card, Num, Modal, NumPad…
    ├── TabBar.tsx           # barre d'onglets persistante
    └── views/               # les 9 écrans
        ├── SetupCount.tsx
        ├── SetupNames.tsx
        ├── Home.tsx
        ├── RoundDutch.tsx
        ├── RoundScores.tsx
        ├── RoundRecap.tsx
        ├── Ranking.tsx
        ├── History.tsx
        └── End.tsx
```

## Origine

L'app est portée depuis un **prototype HTML/JSX** servant de référence design (couleurs, typographie, espacement, interactions). Le code de la logique de jeu et la machine à états ont été repris à l'identique, le reste a été retypé en TypeScript et restructuré en modules ESM.
