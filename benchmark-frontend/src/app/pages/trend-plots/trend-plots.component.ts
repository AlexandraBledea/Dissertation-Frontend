import { Component } from '@angular/core';
import {PlotsService} from '../../service/plots.service';
import {NotificationService} from '../../service/notification.service';
import {NotificationType} from '../../data-types/Notification';
import {PlotData} from '../../data-types/PlotData';

@Component({
  selector: 'app-trend-plots',
  standalone: false,
  templateUrl: './trend-plots.component.html',
  styleUrl: './trend-plots.component.scss'
})
export class TrendPlotsComponent {

  brokers: string[] = ['rabbitmq', 'kafka', 'redis'];

  filters: { broker: string | null, numberOfMessages: number | null } = {
    broker: null,
    numberOfMessages: null,
  }

  plots: PlotData[] = [
    { label: 'Latency', metric: 'latency', loading: false },
    { label: 'Throughput', metric: 'throughput', loading: false },
    { label: 'Energy', metric: 'energy', loading: false },
    { label: 'CPU Usage', metric: 'cpu', loading: false },
    { label: 'Memory Usage', metric: 'memory', loading: false },
    { label: 'Energy per Message', metric: 'energy-per-message', loading: false }
  ];



  constructor(private plotsService: PlotsService,
              private notificationService: NotificationService) {}

  generatePlots(): void {

    if (!this.filters?.broker) {
      this.notificationService.notify({
        message: 'Please select a broker before generating plots.',
        type: NotificationType.error,
      });
      return;
    }

    for (const plot of this.plots) {
      plot.url = undefined;
      plot.loading = true;
      plot.error = undefined;

      let request$;

      if (plot.metric === 'latency') {
        request$ = this.plotsService.getLatencyVsSize(this.filters?.broker, this.filters?.numberOfMessages);
      } else if (plot.metric === 'energy-per-message') {
        request$ = this.plotsService.getEnergyPerMessageVsSize(this.filters?.broker, this.filters?.numberOfMessages);
      } else {
        request$ = this.plotsService.getMetricVsSize(
          this.filters?.broker,
          plot.metric,
          this.filters?.numberOfMessages
        );
      }

      request$.subscribe({
        next: (response) => {
          plot.url = response.image; // base64 directly into <img [src]>
          plot.loading = false;
        },
        error: (err) => {
          plot.loading = false;
          plot.error = 'Failed to generate plot.';
        }
      });



    }
  }

  downloadPlot(plotUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = plotUrl;
    a.download = `experiment_plot.png`;
    a.click();
  }

}
