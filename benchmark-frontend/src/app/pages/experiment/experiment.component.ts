import {Component} from '@angular/core';
import {BenchmarkService} from '../../service/benchmark.service';
import {PlotsService} from '../../service/plots.service';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import {Experiment} from '../../data-types/Experiment';
import {NotificationType} from '../../data-types/Notification';

@Component({
  selector: 'app-experiment',
  standalone: false,
  templateUrl: './experiment.component.html',
  styleUrl: './experiment.component.scss'
})
export class ExperimentComponent {

  experiment: Experiment | undefined;
  fullPlotUrl: string | undefined;

  constructor(private benchmarkService: BenchmarkService,
              private plotsService: PlotsService,
              private notificationService: NotificationService,
              private router: Router) {}


  ngOnInit(): void {
    const data = sessionStorage.getItem('experiment');
    if (data) {
      this.experiment = JSON.parse(data);
      this.loadPlot();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadPlot(): void {
    if (!this.experiment) return;
    this.plotsService.getFullPlot(this.experiment.id).subscribe({
      next: (blob) => {
        this.fullPlotUrl = URL.createObjectURL(blob);
      },
      error: (errorResponse) => {
        this.notificationService.notify({
          message: errorResponse.errorMessage || 'An error occurred! Please try again later!',
          type: NotificationType.error,
        });
      }
    });
  }

  downloadCSV(): void {
    if (!this.experiment?.id) return;

    this.benchmarkService.getCsvForExperiment(this.experiment.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment-${this.experiment!.id}.csv`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('CSV download failed:', error);
      }
    });
  }

  downloadPlot(): void {
    if (!this.fullPlotUrl) return;

    const a = document.createElement('a');
    a.href = this.fullPlotUrl;
    a.download = `experiment_${this.experiment?.id}_plot.png`;
    a.click();
  }

}
