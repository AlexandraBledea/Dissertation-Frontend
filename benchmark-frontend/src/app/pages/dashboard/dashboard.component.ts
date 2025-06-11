import { Component, OnInit } from '@angular/core';
import { Experiment } from '../../data-types/Experiment';
import { BenchmarkService } from '../../service/benchmark.service';
import { PlotsService } from '../../service/plots.service';
import { Pagination } from '../../data-types/Pagination';
import { NotificationType } from '../../data-types/Notification';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../service/websocket.service';

const INITIAL_PAGINATION = {
  pageNumber: 0,
  pageSize: 5,
  totalNumberOfPages: 0,
  totalNumberOfItems: 0,
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  experiments: Experiment[] = [];
  pagination: Pagination = {...INITIAL_PAGINATION};

  brokers: string[] = ['rabbitmq', 'kafka', 'redis'];

  filters: {broker: string | null, numberOfMessages: number | null, messageSize: number | null } = {
    broker: null,
    numberOfMessages: null,
    messageSize: null,
  }

  experimentSetup: {broker: string | null, numberOfMessages: number | null, messageSize: number | null } = {
    broker: null,
    numberOfMessages: null,
    messageSize: null,
  }

  constructor(private benchmarkService: BenchmarkService,
              private plotsService: PlotsService,
              private notificationService: NotificationService,
              private router: Router,
              private websocketService: WebSocketService) {}

  ngOnInit() {
    this.fetchExperiments();

    this.websocketService.experimentUpdates$.subscribe((experiment) => {
      this.notificationService.notify({
        message: `Update: Experiment ${experiment.id} is now ${experiment.status}`,
        type: NotificationType.success,
      });

      this.fetchExperiments();
    });
  }

  fetchExperiments() {

    this.benchmarkService.getAllExperimentsPaginated(this.pagination, this.filters)
      .subscribe({
        next: ({experiments, pagination}) => {
          this.pagination = pagination;
          this.experiments = experiments;
        },
        error: (errorResponse) => {
          this.experiments = [];
          this.notificationService.notify({
            message: errorResponse.errorMessage || 'An error occurred! Please try again later!',
            type: NotificationType.error,
          });
        }
      })
  }

  isSizeValid(): boolean {
    const val = Number(this.experimentSetup.messageSize);
    return !isNaN(val) && val >= 1 && val <= 500;
  }

  nextPage(): void {
    if (this.pagination.pageNumber < this.pagination.totalNumberOfPages - 1) {
      this.pagination.pageNumber++;
      this.fetchExperiments();
    }
  }

  previousPage(): void {
    if (this.pagination.pageNumber > 0) {
      this.pagination.pageNumber--;
      this.fetchExperiments();
    }
  }

  resetFilters(): void {
    this.filters = {broker: null, messageSize: null, numberOfMessages: null};
    this.pagination = {...INITIAL_PAGINATION}
    this.fetchExperiments();
  }

  startExperiment() {
    const { broker, messageSize, numberOfMessages } = this.experimentSetup;

    if (!broker || !messageSize || !numberOfMessages) {
      return;
    }

    this.benchmarkService
      .startExperiment(broker, +messageSize, +numberOfMessages)
      .subscribe({
        next: () => {
        },
        error: (errorResponse) => {
          let message;
          if (errorResponse.status === 409) {
            message = 'An experiment is already running. Please wait.';
          } else {
            message = 'Unexpected error: ' + errorResponse.message;
          }

          this.notificationService.notify({
            message: errorResponse.error?.text || message,
            type: NotificationType.error,
          });

        }
      });
  }

  viewExperiment(experiment: Experiment): void {
    sessionStorage.setItem('experiment', JSON.stringify(experiment));
    this.router.navigate(['/experiment-details']);
  }

  goToTrendPlots(): void {
    this.router.navigate(['/trend-plots']);
  }

  goToBarPlots(): void {
    this.router.navigate(['/bar-plots']);
  }
}
