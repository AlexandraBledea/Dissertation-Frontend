import { Pagination } from './Pagination';

export interface Experiment {
  id: number;
  broker: string;
  numberOfMessages: number;
  messageSizeInKB: number;
  startTime: string;
  endTime: string;
  energy: number;
  averageCpu: number;
  averageMemory: number;
  throughput: number;
  latency: number;
  status: string
}

export interface ExperimentPaginationResponse {
  pagination: Pagination;
  experiments: Experiment[];
}
