export interface AuditUrl {
  id: string;
  name: string;
  path: string;
  type: 'public' | 'protected';
  role?: 'paciente' | 'medico' | 'admin';
  hu: string[];
  rf: string[];
  description: string;
}

export interface LighthouseResult {
  id: string;
  name: string;
  url: string;
  type: string;
  role?: string;
  hu: string[];
  rf: string[];
  description: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  lcp: number;
  fcp: number;
  ttfb: number;
  cls: number;
  inp: number;
  si: number;
  screenshotPath: string;
  reportHtmlPath: string;
  reportJsonPath: string;
  error?: string;
}

export interface PageSpeedResult {
  id: string;
  name: string;
  url: string;
  type: string;
  role?: string;
  hu: string[];
  rf: string[];
  description: string;
  mobilePerformance: number;
  mobileLcp: number;
  mobileFcp: number;
  mobileCls: number;
  mobileInp: number;
  mobileTtfb: number;
  desktopPerformance: number;
  desktopLcp: number;
  desktopFcp: number;
  desktopCls: number;
  desktopInp: number;
  desktopTtfb: number;
  error?: string;
}

export interface ConsolidatedReport {
  fecha: string;
  frontendUrl: string;
  resumen: {
    totalUrls: number;
    publicas: number;
    protegidas: number;
  };
  thresholds: Record<string, { good: number; needsWork: number; unit: string }>;
  lighthouseResults: LighthouseResult[];
  pagespeedResults: PageSpeedResult[];
  cumplimiento: {
    metrica: string;
    urlsQueCumplen: number;
    totalUrls: number;
    porcentaje: number;
    estado: string;
  }[];
  observaciones: string[];
}