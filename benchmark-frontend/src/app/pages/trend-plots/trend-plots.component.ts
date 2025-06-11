import { Component } from '@angular/core';
import {PlotsService} from '../../service/plots.service';
import {NotificationService} from '../../service/notification.service';
import {NotificationType} from '../../data-types/Notification';
import {PlotData} from '../../data-types/PlotData';
import {firstValueFrom} from 'rxjs';

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

  async generatePlots(): Promise<void> {
    if (!this.filters?.broker) {
      this.notificationService.notify({
        message: 'Please select a broker before generating plots.',
        type: NotificationType.error,
      });
      return;
    }

    if (this.filters.numberOfMessages !== null && (isNaN(Number(this.filters.numberOfMessages)) || Number(this.filters.numberOfMessages) < 0)) {
      this.notificationService.notify({
        message: 'Please enter a valid positive number for number of messages.',
        type: NotificationType.error,
      });
      return;
    }

    for (const plot of this.plots) {
      plot.url = undefined;
      plot.loading = true;
      plot.error = undefined;

      try {
        let response;

        if (plot.metric === 'latency') {
          response = await firstValueFrom(
            this.plotsService.getLatencyVsSize(this.filters.broker, this.filters.numberOfMessages)
          );
        } else if (plot.metric === 'energy-per-message') {
          response = await firstValueFrom(
            this.plotsService.getEnergyPerMessageVsSize(this.filters.broker, this.filters.numberOfMessages)
          );
        } else {
          response = await firstValueFrom(
            this.plotsService.getMetricVsSize(this.filters.broker, plot.metric, this.filters.numberOfMessages)
          );
        }

        plot.url = response.image;
      } catch (err: any) {
        plot.error = err.error?.detail || 'Failed to load comparison plot.';
      } finally {
        plot.loading = false;
      }
    }
  }


  downloadPlot(plotUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = plotUrl;
    a.download = `${filename}.png`;
    a.click();
  }

}
