import type { CaseMockKind } from './case-mock';

export type ClickmaxKind = 'max' | 'suggestions' | 'email' | 'pages' | 'marketplace' | 'segments';

export interface CaseFact { label: string; value: string; href?: string; }
export interface CasePhase { period: string; title: string; text: string; current?: boolean; }
export interface CaseHighlight {
  mock:
    | { source: 'clickmax'; kind: ClickmaxKind }
    | { source: 'case'; kind: CaseMockKind }
    | { source: 'image'; src: string; alt: string; fit?: 'cover' | 'contain'; background?: string; position?: string }
    | { source: 'embed'; src: string; title: string; background?: string }
    | { source: 'phones'; screens: { src: string; title: string }[]; background?: string };
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  /** Ocupa a linha inteira; os destaques largos alternam o lado da prévia. */
  wide?: boolean;
}
export interface CaseFoundation { title: string; lead: string; items: { title: string; text: string }[]; }
export interface CaseStackGroup { group: string; items: string[]; }

