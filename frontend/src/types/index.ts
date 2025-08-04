/**
 * TypeScript interfaces for the Destiny Engine
 */

export interface UserInput {
  name: string;
  age: number;
  country: string;
  college: string;
  aspiration: string;
}

export interface PredictionResponse {
  predicted_lifetime_nw: number;
  predicted_10_year_nw: number;
  rank_band: string;
  reasoning: string;
  college_tier?: string;
  probability_score: number;
  oracle_confidence: string;
}

export type AppState = 'greeting' | 'asking' | 'processing' | 'revealed';

export interface Question {
  id: keyof UserInput;
  text: string;
  placeholder: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  validation?: (value: any) => boolean;
  errorMessage?: string;
}

export interface CrystalBallProps {
  state: AppState;
  intensity?: number;
  rotation?: [number, number, number];
}

export interface ShareData {
  name: string;
  netWorth: number;
  rank: string;
  aspiration: string;
  university: string;
}
