export type ScreenState = 'landing' | 'quiz' | 'email' | 'result' | 'checkout' | 'pix' | 'success' | 'dashboard' | 'seven-steps' | 'generator' | 'examples';

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
];

export const TICKET_RANGES = [
  { label: 'Menos de R$100', value: 'menos_100', avg: 70 },
  { label: 'R$100 a R$300', value: '100_300', avg: 200 },
  { label: 'R$300 a R$500', value: '300_500', avg: 400 },
  { label: 'R$500 a R$1.000', value: '500_1000', avg: 750 },
  { label: 'R$1.000 a R$2.000', value: '1000_2000', avg: 1500 },
];

export const CONVERSION_RANGES = [
  { label: 'A cada 3 contatos (33%)', value: 'cada_3', rate: 0.33 },
  { label: 'A cada 5 contatos (20%)', value: 'cada_5', rate: 0.20 },
  { label: 'A cada 10 contatos (10%)', value: 'cada_10', rate: 0.10 },
  { label: 'A cada 15 contatos (7%)', value: 'cada_15', rate: 0.07 },
  { label: 'A cada 20 contatos (5%)', value: 'cada_20', rate: 0.05 },
  { label: 'A cada 30 contatos (3%)', value: 'cada_30_mais', rate: 0.03 },
];

export const RESPONSE_TIMES = [
  { label: 'Menos de 5 minutos', value: 'menos_5min' },
  { label: 'Entre 5 e 30 minutos', value: '5_30min' },
  { label: 'Entre 30 minutos e 2 horas', value: '30min_2h' },
  { label: 'Mais de 2 horas', value: 'mais_2h' },
  { label: 'Depende do dia', value: 'depende' },
];