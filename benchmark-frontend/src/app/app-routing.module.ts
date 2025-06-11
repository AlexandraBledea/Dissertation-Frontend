import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExperimentComponent} from './pages/experiment/experiment.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TrendPlotsComponent} from './pages/trend-plots/trend-plots.component';
import {BarPlotsComponent} from './pages/bar-plots/bar-plots.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'experiment-details', component: ExperimentComponent },
  { path: 'trend-plots', component: TrendPlotsComponent },
  { path: 'bar-plots', component: BarPlotsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
