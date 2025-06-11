import { Component } from '@angular/core';

@Component({
  selector: 'app-information',
  standalone: false,
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent {

  selectedPlot: string = 'comparison';

  plotTypes = [
    { key: 'comparison', label: 'Comparison Bar' },
    { key: 'latency', label: 'Latency vs Size' },
    { key: 'energy-per-msg', label: 'Energy per Msg vs Size' },
    { key: 'cpu', label: 'CPU vs Size' },
    { key: 'memory', label: 'Memory vs Size' },
    { key: 'throughput', label: 'Throughput vs Size' },
    { key: 'energy', label: 'Total Energy vs Size' },
    { key: 'metrics-over-time', label: 'Metrics Over Time' }
  ];

  selectPlot(plotId: string) {
    this.selectedPlot = plotId;
  }

}
