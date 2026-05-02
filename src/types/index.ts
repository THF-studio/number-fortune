// Five elements
export type Element = 'Metal' | 'Wood' | 'Water' | 'Fire' | 'Earth';
export type FocusArea = 'career' | 'romance' | 'health' | 'wealth' | 'overall';
export type Relation = '生入' | '比旺' | '克出' | '克入' | '生出';
export type JiXiong = '吉' | '凶';
export type JiXiongLabel = '吉' | '吉' | '吉' | '凶';

// Trigram
export interface Trigram {
  name: string;        // Chinese character e.g. 乾
  zh: string;          // Pinyin e.g. Qian
  lines: [number, number, number];
  element: Element;
}

// Relation result
export interface RelationResult {
  rel: Relation;
  jx: JiXiong;
  jxLabel: JiXiongLabel;
  desc: string;
  bodyEl: Element;
  useEl: Element;
}

// Single hexagram layer result
export interface HexagramLayer {
  upperKey: number;
  lowerKey: number;
  hexName: string;
  info: RelationResult;
}

// Per-digit analysis
export interface DigitAnalysis {
  orig: number;
  element: Element;
  state: 'favor' | 'avoid' | 'neutral';
}

// Per-focus text analysis
export interface FocusSectionText {
  title: string;
  base: string;
  mutual: string;
  changed: string;
  elem: string;
}

// Full analysis result
export interface AnalysisResult {
  phone: string;
  displayDigits: number[];
  calcDigits: number[];
  group1: number[];
  group2: number[];
  sum1: number;
  sum2: number;
  total: number;
  upperRem: number;
  lowerRem: number;
  movRem: number;
  movingLine: number;
  bodyIsUpper: boolean;
  base: HexagramLayer;
  mutual: HexagramLayer;
  changed: HexagramLayer;
  hasBlock: boolean;
  finalOk: boolean;
  overallGood: boolean;
  digitAnalysis: DigitAnalysis[];
  favorCount: number;
  avoidCount: number;
  neutralCount: number;
  focusScores: Record<FocusArea, number>;
  overallScore: number;
  focusText: Record<FocusArea, FocusSectionText>;
}

// Hexagram description entry
export interface HexDesc {
  name: string;
  xiang: string;
  yun: string;
  ai: string;
  bing: string;
  shici: string;
}

// User input state
export interface AnalysisInput {
  phone: string;
  favorElements: Element[];
  avoidElements: Element[];
}

// Life Path Number feature
export interface LifePathDOBInput {
  year: string
  month: string
  day: string
}

export type DigitStatus = 'present' | 'missing' | 'lifepath'

export interface DigitPresence {
  digit: number
  count: number
  status: DigitStatus
  traitNote: string
}

export interface LifePathProfile {
  number: number
  label: string
  traitSummary: string
  keywords: string[]
  personality: string
  lifeLessons: string
  talents: string[]
  suitableDirections: string
}

export interface LifePathResult {
  dateString: string
  lifePathNumber: number
  personalYear: number
  reductionSteps: string[]
  presentDigits: number[]
  missingDigits: number[]
  profile: LifePathProfile
  digitPresence: DigitPresence[]
}
