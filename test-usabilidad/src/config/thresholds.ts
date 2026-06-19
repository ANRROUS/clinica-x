export interface Threshold {
  metric: string;
  good: number;
  needsWork: number;
  unit: string;
}

export const THRESHOLDS: Record<string, Threshold> = {
  performance: { metric: 'Performance Score', good: 90, needsWork: 50, unit: 'score' },
  accessibility: { metric: 'Accessibility Score', good: 90, needsWork: 70, unit: 'score' },
  bestPractices: { metric: 'Best Practices Score', good: 90, needsWork: 50, unit: 'score' },
  lcp: { metric: 'Largest Contentful Paint', good: 2500, needsWork: 4000, unit: 'ms' },
  fcp: { metric: 'First Contentful Paint', good: 1800, needsWork: 3000, unit: 'ms' },
  ttfb: { metric: 'Time to First Byte', good: 800, needsWork: 1800, unit: 'ms' },
  cls: { metric: 'Cumulative Layout Shift', good: 0.1, needsWork: 0.25, unit: '' },
  inp: { metric: 'Interaction to Next Paint', good: 200, needsWork: 500, unit: 'ms' },
  si: { metric: 'Speed Index', good: 3400, needsWork: 5800, unit: 'ms' },
};

export function getStatus(value: number, threshold: Threshold): 'good' | 'needs-work' | 'poor' {
  if (threshold.unit === 'score') {
    if (value >= threshold.good) return 'good';
    if (value >= threshold.needsWork) return 'needs-work';
    return 'poor';
  }
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsWork) return 'needs-work';
  return 'poor';
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'good': return '✅';
    case 'needs-work': return '🟡';
    case 'poor': return '❌';
    default: return '—';
  }
}