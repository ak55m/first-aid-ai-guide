
export interface FirstAidGuidance {
  id: string;
  title: string;
  keywords: string[];
  dos: string[];
  donts: string[];
  steps: string[];
  medications?: string[];
  note?: string;
}
