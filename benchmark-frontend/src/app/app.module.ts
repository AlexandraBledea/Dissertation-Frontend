import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './shared/notification/notification.component';
import {FormsModule} from '@angular/forms';
import { ExperimentComponent } from './pages/experiment/experiment.component';
import {NgxImageZoomModule} from 'ngx-image-zoom';
import { TrendPlotsComponent } from './pages/trend-plots/trend-plots.component';
import { BarPlotsComponent } from './pages/bar-plots/bar-plots.component';
import { InformationComponent } from './pages/information/information.component';
import { LandingComponent } from './pages/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotificationComponent,
    ExperimentComponent,
    TrendPlotsComponent,
    BarPlotsComponent,
    InformationComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxImageZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
