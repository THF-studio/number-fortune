# AGENTS.md — Rules for AI agents working on this codebase

## Before making any changes

1. **Read `CLAUDE.md` first** — it contains algorithm rules that must never be broken.
2. **Read `src/logic/` files** before touching any calculation code.
3. **Read `src/types/index.ts`** — all shared types live there; don't duplicate them.

---

## Golden rules

1. **Read CLAUDE.md before making any changes.**
2. **Read `src/logic/` files before touching any calculation.**
3. **Never modify `getRelAndJX()`, `getMutual()`, or `getChanged()` without explicit user confirmation.**
4. **Components must never import from each other's folders** — no cross-folder component imports, no circular dependencies.
5. **All new pages must be added to both `src/router.tsx` AND `src/components/layout/Header.tsx`.**

---

## Safe to change without confirmation

- UI layout and Tailwind class adjustments
- Text labels, Chinese/English copy
- Score weights in `scoring.ts` (values, not structure)
- Adding new pages (follow rule 5 above)
- Placeholder component content
- Colors and visual styling

## Requires explicit user confirmation before changing

- Any file under `src/logic/` — especially `hexagram.ts` and `elements.ts`
- `HEXDESC` entries in `constants.ts`
- 吉凶 rules or the relation→label mapping
- Digit-to-element mapping (`DIGIT_ELEM`)
- The body (体) assignment logic (moving line 1–3 vs 4–6)
- The zero-replacement rule (0 → 8)
- The group-split formula (floor/ceil)

---

## Reference test case — must always pass

This test case validates the full algorithm pipeline. Any change to `src/logic/` must be verified against it.

```
Input phone:  89123343
Display digits: [8, 9, 1, 2, 3, 3, 4, 3]
Calc digits:    [8, 9, 1, 2, 3, 3, 4, 3]  (no zeros)

N = 8 digits
Group 1 (front, floor(8/2)=4): [8, 9, 1, 2]  → sum1 = 20
Group 2 (back,  ceil(8/2)=4):  [3, 3, 4, 3]  → sum2 = 13

Total = 33

Upper trigram: 20 ÷ 8 = rem 4 → 震 Zhen (Wood) ☳
Lower trigram: 13 ÷ 8 = rem 5 → 巽 Xun  (Wood) ☴
Moving line:   33 ÷ 6 = rem 3 → line 3 → upper trigram is 体

本卦 (base):    雷风恒  (震 upper / 巽 lower)
互卦 (mutual):  泽天夬  (derived from inner lines - 兑 upper / 乾 lower)
之卦 (changed): 雷水解  (moving line 3 flipped - 震 upper / 坎 lower)

本卦 (base):    震 (Wood) -> 巽 （Wood）= 比旺
互卦 (mutual):  兑（Metal）-> 乾 （Metal）= 比旺
之卦 (changed): 震 (Wood) -> 坎 （Water）= 生入

```

```
Input phone:  0168981698
Display digits: [0，1，6，8，9，8，1，6，9，8]
Calc digits:    [8，1，6，8，9，8，1，6，9，8]  (replace 0 with 8 so no zeros)

N = 10 digits
Group 1 (front, floor(10/2)=5): [8, 1, 6, 8, 9]  → sum1 = 32
Group 2 (back,  ceil(10/2)=5):  [8, 1, 6, 9，8]  → sum2 = 32

Total = 64

Upper trigram: 32 ÷ 8 = rem 0 = 8 → 坤 Kun (Earth) ☷
Lower trigram: 32 ÷ 8 = rem 0 = 8 → 坤 Kun (Earth) ☷ 
Moving line:   64 ÷ 6 = rem 4 → line 4 → lower trigram is 体

本卦 (base):    坤为地  (坤 upper / 坤 lower)
互卦 (mutual):  坤为地  (derived from inner lines - 坤 upper / 坤 lower)
之卦 (changed): 雷地豫  (moving line 1 flipped - 震 upper / 坤 lower)
```

If any of these values change after a logic edit, the edit is wrong.

---

## Architecture reminder

```
src/logic/      ← pure functions, no React, no JSX
src/hooks/      ← useAnalysis orchestrates logic, returns AnalysisResult
src/components/ ← presentational only, receive typed props, never calculate
src/pages/      ← compose layout + components, call hooks
src/types/      ← single source of truth for all TypeScript types
```
