
export type ScreenState = 'landing' | 'quiz' | 'email' | 'result' | 'checkout' | 'pix' | 'success' | 'create-account' | 'reset-password' | 'dashboard' | 'seven-steps' | 'generator' | 'examples' | 'ai-secretary';

export interface QuizAnswers {
  contactsRange: string | number;
  ticketRange: string | number;
  conversionRate: string | number;
  responseTime: string;
}

export interface CalculationResult {
  monthlyLoss: number;
  annualLoss: number;
  mainProblem: 'tempo_resposta' | 'falta_processo';
  potentialRate: number;
  currentRate: number;
}

export interface PixPaymentData {
  qrCode: string;
  copiaECola: string;
  cobrancaId: string;
  valor: number;
}

export interface BusinessInfo {
  businessType: string;
  businessName: string;
  whatYouDo: string;
  hours: string;
  closingMethod: string;
  differentiator: string;
}

export interface GeneratedScriptVersion {
  nome?: string;
  texto: string;
}

export interface GeneratedScript {
  numero: number;
  titulo: string;
  texto?: string; // For single version scripts
  versoes?: GeneratedScriptVersion[]; // For multi-version scripts
}

export interface SavedScriptsData {
  formData: BusinessInfo;
  scripts: GeneratedScript[];
  date: string;
}

export const CONTACT_RANGES = [
  { label: 'Menos de 30', value: 'menos_30', avg: 20 },
  { label: '30 a 50', value: '30_50', avg: 40 },
  { label: '50 a 100', value: '50_100', avg: 75 },
  { label: '100 a 200', value: '100_200', avg: 150 },
  { label: 'Mais de 200', value: 'mais_200', avg: 250 },
];

export const TICKET_RANGES = [
  { label: 'Até R$ 150 (procedimentos simples)', value: 'ate_150', avg: 100 },
  { label: 'R$ 150 a R$ 300', value: '150_300', avg: 225 },
  { label: 'R$ 300 a R$ 500', value: '300_500', avg: 400 },
  { label: 'R$ 500 a R$ 1.000', value: '500_1000', avg: 750 },
  { label: 'R$ 1.000 a R$ 2.000', value: '1000_2000', avg: 1500 },
  { label: 'Acima de R$ 2.000', value: 'acima_2000', avg: 2500 },
];

export const CONVERSION_RANGES = [
  { label: '7 ou mais (ótimo!)', value: '7_mais', rate: 0.70 },
  { label: '5 a 6', value: '5_6', rate: 0.55 },
  { label: '3 a 4', value: '3_4', rate: 0.35 },
  { label: '1 a 2', value: '1_2', rate: 0.15 },
  { label: 'Quase nenhuma agenda', value: 'quase_nada', rate: 0.05 },
  { label: 'Não sei dizer', value: 'nao_sei', rate: 0.10 },
];

export const RESPONSE_TIMES = [
  { label: 'Menos de 5 minutos', value: 'menos_5min' },
  { label: 'Entre 5 e 30 minutos', value: '5_30min' },
  { label: 'Entre 30 minutos e 2 horas', value: '30min_2h' },
  { label: 'Mais de 2 horas', value: 'mais_2h' },
  { label: 'Depende do dia', value: 'depende' },
];