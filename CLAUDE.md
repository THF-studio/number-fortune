# 号运 Number Fortune — CLAUDE.md

## Project overview

A phone number analysis tool based on I Ching hexagram logic and Five Elements (五行) theory.
Pure client-side React app — no backend, no API calls, no database.

## Tech stack

| Package | Version | Why |
|---|---|---|
| React | 18+ | Concurrent rendering, hooks-first |
| Vite | Latest | Fast HMR, ESM-native bundler |
| TypeScript | Strict | Catch bugs at compile time; all `any` is banned |
| React Router | v6 | Client-side routing, `createBrowserRouter` API |
| Tailwind CSS | v3 | Utility-first, no runtime CSS-in-JS overhead |

No UI component library. All components are hand-built.

## Folder structure

```
src/
├── types/index.ts          ← ALL shared TypeScript interfaces and types live here
├── logic/                  ← Pure calculation only. Zero JSX. Zero React imports.
│   ├── constants.ts        ← TG, HEXDESC, DIGIT_ELEM, ELEM_ZH, ELEM_COLOR, FOCUS_ELEM
│   ├── hexagram.ts         ← linesToKey, getMutual, getChanged, hexName, buildLayer
│   ├── elements.ts         ← getRelAndJX, five-element cycle logic
│   └── scoring.ts          ← focusScore, scoreLabel, focusAnalysis
├── hooks/
│   └── useAnalysis.ts      ← ONLY place that orchestrates logic → returns AnalysisResult
├── components/
│   ├── layout/             ← Layout, Header, Footer, PageWrapper
│   ├── analysis/           ← Presentational result display components
│   └── ui/                 ← Reusable primitives: Toggle, Chip, Badge
├── pages/                  ← Route-level components; wire hooks + layout + components
└── utils/helpers.ts        ← Pure utility functions (parseDigits, replaceZeros)
```

**Rule:** Components never calculate. `useAnalysis` never renders. `logic/` never imports React.

---

## Core algorithm rules — NEVER break these

### 1. Zero replacement
Digit `0` is replaced with `8` **for calculation only**. Display always shows `0`.
```
calcDigits = displayDigits.map(d => d === 0 ? 8 : d)
```

### 2. Number split
Given N digits total:
- Front group (Group 1): first `floor(N/2)` digits
- Back group (Group 2): last `ceil(N/2)` digits

### 3. Upper trigram
```
sum1 = sum of Group 1 calcDigits
upperRem = sum1 % 8
if (upperRem === 0) upperRem = 8   // remainder 0 → 8 = Kun ☷
```

### 4. Lower trigram
```
sum2 = sum of Group 2 calcDigits
lowerRem = sum2 % 8
if (lowerRem === 0) lowerRem = 8   // remainder 0 → 8 = Kun ☷
```

### 5. Moving line
```
total = sum1 + sum2
movRem = total % 6
if (movRem === 0) movRem = 6       // remainder 0 → line 6
```

### 6. Body (体) assignment
- Moving line 1–3 → **upper trigram** is 体 (body)
- Moving line 4–6 → **lower trigram** is 体 (body)

### 7. 吉凶 judgment rules

根据用体关系方程式判断号码的卦象关系：

| Relation | Formula | 吉凶 |
|---|---|---|
| 用生体 → **生入** | 用 → 体，用生体 | 吉 |
| 用比体 → **比旺** | 体 + 体（同类叠加）| 吉 |
| 体克用 → **克出** | 体 → 用，体克用 | 吉 |
| 用克体 → **克入** | 用 → 体，用克体 | 凶（体弱无援则大凶；有援可化解）|
| 体生用 → **生出** | 体 → 用，体生用 | 凶（利人不利己，体被消耗）|

Output order: 本卦 → 互卦 → 之卦, each labelled with relation + 吉凶 result.

### 8. Golden rule
All three stages must have **zero** 克入 or 生出:
- 本卦 (base): must NOT be 克入 or 生出
- 互卦 (mutual): must NOT be 克入 or 生出
- 之卦 (changed): must NOT be 克入 or 生出

`overallGood = hasBlock === false && finalOk === true`

### 9. Mutual hexagram (互卦)
Derived from inner lines of the 6-line hexagram:
- New lower trigram = lines 2-3-4
- New upper trigram = lines 3-4-5

### 10. Changed hexagram (之卦)
Flip the moving line bit (0→1 or 1→0), then re-derive both trigrams from the result.

---

## Coding standards

- **All calculation logic stays in `src/logic/`** — never inside components or hooks bodies
- **Components are presentational only**, fed entirely by `useAnalysis` hook props
- **`useAnalysis.ts`** is the single orchestration point; it calls logic functions and returns `AnalysisResult`
- **Tailwind utility classes only** — no inline styles, no custom CSS unless truly unavoidable
- **All 64 hexagram descriptions** stay in `constants.ts` as `HEXDESC`
- **Colors** defined as Tailwind config custom tokens if needed; never hardcoded inline

## What NOT to do

- Do not add a backend or any API calls
- Do not install a UI component library (no shadcn, MUI, Ant Design, Chakra, etc.)
- Do not put calculation logic inside React components
- Do not use inline styles (`style={{}}`)
- Do not split `constants.ts` into multiple files
- Do not add `any` types — use proper TypeScript types throughout
