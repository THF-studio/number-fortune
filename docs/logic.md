# 号运 Algorithm Specification

## Five Elements — Generating and Controlling Cycles

### Generating cycle (相生, each element feeds the next)
```
Wood → Fire → Earth → Metal → Water → Wood
木    火      土       金      水      木
```

### Controlling cycle (相克, each element suppresses the one it skips)
```
Wood → Earth → Water → Fire → Metal → Wood
木    土       水       火      金      木
```

---

## Trigram-to-Element Mapping (8 trigrams)

| Key | Trigram | Symbol | Lines (top→bot) | Element | 卦名 |
|-----|---------|--------|-----------------|---------|------|
| 1 | Qian  | ☰ | 1-1-1 | Metal | 乾 |
| 2 | Dui   | ☱ | 1-1-0 | Metal | 兑 |
| 3 | Li    | ☲ | 1-0-1 | Fire  | 离 |
| 4 | Zhen  | ☳ | 1-0-0 | Wood  | 震 |
| 5 | Xun   | ☴ | 0-1-1 | Wood  | 巽 |
| 6 | Kan   | ☵ | 0-1-0 | Water | 坎 |
| 7 | Gen   | ☶ | 0-0-1 | Earth | 艮 |
| 8 | Kun   | ☷ | 0-0-0 | Earth | 坤 |

Remainder `0` from modulo operations maps to key `8` (Kun ☷).

---

## Digit-to-Element Mapping

| Digits | Element | Notes |
|--------|---------|-------|
| 0, 8   | Earth   | 0 replaced by 8 for calculation; both are Earth |
| 1, 6   | Water   | |
| 2, 7   | Metal (Fire for 7) | — see corrected table below |
| 3, 4   | Wood    | |
| 2, 5   | Earth   | |
| 7      | Metal   | |
| 9      | Fire    | |

### Canonical table

| Digit | Element |
|-------|---------|
| 0     | Earth   |
| 1     | Water   |
| 2     | Earth   |
| 3     | Wood    |
| 4     | Wood    |
| 5     | Earth   |
| 6     | Water   |
| 7     | Metal   |
| 8     | Earth   |
| 9     | Fire    |

---

## 吉凶 Judgment Table

| Relation | Body/Use relationship | Direction | 吉凶 |
|----------|----------------------|-----------|------|
| 生入 | 用生体 | 用 → 体 (用 feeds 体) | 吉 |
| 比旺 | 用比体 | 体 = 用 (same element) | 吉 |
| 克出 | 体克用 | 体 → 用 (体 controls 用) | 吉 |
| 克入 | 用克体 | 用 → 体 (用 controls 体) | 凶 |
| 生出 | 体生用 | 体 → 用 (体 feeds 用) | 凶 |

**Determining body (体) and use (用) elements:**
- Identify the body trigram (体卦) → its element is the **体 element**
- The other trigram is the use trigram (用卦) → its element is the **用 element**
- Apply the generating/controlling cycle between them to determine relation

---

## Golden Rule Checklist

All three conditions must be `true` for a number to pass:

1. **本卦 (base hexagram)**: relation must NOT be 克入 or 生出
2. **互卦 (mutual hexagram)**: relation must NOT be 克入 or 生出
3. **之卦 (changed hexagram)**: relation must NOT be 克入 or 生出

```
hasBlock  = base.info.rel ∈ {克入, 生出}
         || mutual.info.rel ∈ {克入, 生出}
finalOk   = changed.info.rel ∈ {生入, 比旺, 克出}
overallGood = !hasBlock && finalOk
```

---

## Full Pipeline

### Step 1 — Parse and replace zeros
```
displayDigits = phone digits as-is
calcDigits    = displayDigits.map(d => d === 0 ? 8 : d)
```

### Step 2 — Split into groups
```
N      = calcDigits.length
group1 = calcDigits.slice(0, Math.floor(N / 2))
group2 = calcDigits.slice(Math.floor(N / 2))
sum1   = group1.reduce(sum)
sum2   = group2.reduce(sum)
total  = sum1 + sum2
```

### Step 3 — Derive trigram keys
```
upperRem = sum1 % 8 || 8
lowerRem = sum2 % 8 || 8
movRem   = total % 6 || 6
```

### Step 4 — Assign body (体)
```
bodyIsUpper = movRem <= 3
bodyKey     = bodyIsUpper ? upperRem : lowerRem
useKey      = bodyIsUpper ? lowerRem : upperRem
bodyEl      = TG[bodyKey].element
useEl       = TG[useKey].element
```

### Step 5 — Build base hexagram (本卦)
Hexagram name = lookup in HEXDESC by `${upperRem}-${lowerRem}` key.
Relation = `getRelAndJX(bodyEl, useEl)`.

### Step 6 — Build mutual hexagram (互卦)
The 6-line hexagram (lines 1–6, bottom to top):
```
lines from lower trigram: lines[0], lines[1], lines[2]  (positions 1, 2, 3)
lines from upper trigram: lines[3], lines[4], lines[5]  (positions 4, 5, 6)

mutualLowerLines = [allLines[1], allLines[2], allLines[3]]  // lines 2-3-4
mutualUpperLines = [allLines[2], allLines[3], allLines[4]]  // lines 3-4-5

mutualLowerKey = linesToKey(mutualLowerLines)
mutualUpperKey = linesToKey(mutualUpperLines)
```
Body element carries through (same bodyEl/useEl determination based on mutualBody).

### Step 7 — Build changed hexagram (之卦)
```
movingLineIndex = movRem - 1   // 0-based in allLines array
changedLines    = [...allLines]
changedLines[movingLineIndex] ^= 1   // flip the bit

re-derive upper and lower trigram keys from changedLines
```

---

## Hexagram Name Key Format

`HEXDESC` is keyed by `"${upperKey}-${lowerKey}"` e.g. `"4-5"` = 雷风恒.

There are 64 entries covering all upper×lower combinations (1–8 × 1–8).
