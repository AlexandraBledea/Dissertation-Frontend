import { Component } from '@angular/core';
import {PlotsService} from '../../service/plots.service';
import {NotificationService} from '../../service/notification.service';
import {NotificationType} from '../../data-types/Notification';
import {firstValueFrom} from 'rxjs';
import {PlotData} from '../../data-types/PlotData';

@Component({
  selector: 'app-bar-plots',
  standalone: false,
  templateUrl: './bar-plots.component.html',
  styleUrl: './bar-plots.component.scss'
})
export class BarPlotsComponent {
  metrics = ['latency', 'throughput', 'energy', 'cpu', 'memory'];
  barPlots: PlotData[] = [
    { metric: 'latency', label: 'Latency', loading: false },
    { metric: 'throughput', label: 'Throughput', loading: false },
    { metric: 'energy', label: 'Energy', loading: false },
    { metric: 'cpu', label: 'CPU Usage', loading: false },
    { metric: 'memory', label: 'Memory Usage', loading: false }
  ];

  filters: { messageSize: number | null; numberOfMessages: number | null } = {
    messageSize: null,
    numberOfMessages: null,
  };

  constructor(private plotsService: PlotsService, private notificationService: NotificationService) {}

  async generateBarPlots(): Promise<void> {
    const { messageSize, numberOfMessages } = this.filters;

    if (!messageSize) {
      this.notificationService.notify({
        message: 'Please provide a message size to generate comparison plots.',
        type: NotificationType.error,
      });
      return;
    }

    if (!numberOfMessages || ((isNaN(Number(numberOfMessages)) || Number(numberOfMessages) < 0))) {
      this.notificationService.notify({
        message: 'Please provide a number of messages to generate comparison plots.',
        type: NotificationType.error,
      });
      return;
    }

    for (const plot of this.barPlots) {
      plot.loading = true;
      plot.url = undefined;
      plot.error = undefined;

      try {
        const response = await firstValueFrom(
          this.plotsService.getComparisonBar(plot.metric, messageSize, numberOfMessages)
        );
        plot.url = response.image;
      } catch (err: any) {
        plot.error = err.error?.detail || 'Failed to load comparison plot.';
      } finally {
        plot.loading = false;
      }
    }
  }

  downloadPlot(url: string, name: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.png`;
    a.click();
  }
}
