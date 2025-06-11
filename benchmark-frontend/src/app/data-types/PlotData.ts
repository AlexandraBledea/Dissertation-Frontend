export interface PlotData {
  label: string;
  metric: 'latency' | 'throughput' | 'energy' | 'cpu' | 'memory' | 'energy-per-message';
  url?: string;
  loading: boolean;
  error?: string;
}
