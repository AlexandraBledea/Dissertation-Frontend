import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlotsService {

  private baseUrl = 'http://localhost:8000/plot'
  private plotFull = `${this.baseUrl}/full`;
  private plotLatencyVsSize = `${this.baseUrl}/trend/latency-vs-size`;
  private plotEnergyPerMessageVsSize = `${this.baseUrl}/trend/energy-per-message-vs-size`;
  private plotMetricVsSize = `${this.baseUrl}/trend/metric-vs-size`;
  private plotComparisonBar = `${this.baseUrl}/comparison-bar`;

  constructor(private http: HttpClient) { }

  getFullPlot(experimentId: number) {
    return this.http.get(`${this.plotFull}/${experimentId}`, { responseType: 'blob' });
  }

  // getLatencyVsSize(broker: string, messageCount?: number | null) {
  //   let params = new HttpParams().set('broker', broker);
  //   if (messageCount) params = params.set('message_count', messageCount.toString());
  //   return this.http.get(this.plotLatencyVsSize, { params, responseType: 'blob' });
  // }
  //
  // getEnergyPerMessageVsSize(broker: string, messageCount?: number | null) {
  //   let params = new HttpParams().set('broker', broker);
  //   if (messageCount) params = params.set('message_count', messageCount.toString());
  //   return this.http.get(this.plotEnergyPerMessageVsSize, { params, responseType: 'blob' });
  // }

  // getMetricVsSize(broker: string, metric: string, messageCount?: number | null) {
  //   let params = new HttpParams()
  //     .set('broker', broker)
  //     .set('metric', metric);
  //   if (messageCount) params = params.set('message_count', messageCount.toString());
  //   return this.http.get(this.plotMetricVsSize, { params, responseType: 'blob' });
  // }

  getLatencyVsSize(broker: string, messageCount?: number | null): Observable<{ image: string }> {
    let params = new HttpParams().set('broker', broker);
    if (messageCount) {
      params = params.set('message_count', messageCount.toString());
    }
    return this.http.get<{ image: string }>(this.plotLatencyVsSize, { params });
  }

  getEnergyPerMessageVsSize(broker: string, messageCount?: number | null): Observable<{ image: string }> {
    let params = new HttpParams().set('broker', broker);
    if (messageCount) {
      params = params.set('message_count', messageCount.toString());
    }
    return this.http.get<{ image: string }>(this.plotEnergyPerMessageVsSize, { params });
  }

  getMetricVsSize(broker: string, metric: string, messageCount?: number | null): Observable<{ image: string }> {
    let params = new HttpParams()
      .set('broker', broker)
      .set('metric', metric);
    if (messageCount) {
      params = params.set('message_count', messageCount.toString());
    }

    return this.http.get<{ image: string }>(this.plotMetricVsSize, { params });
  }


  getComparisonBar(metric: string, messageSize: number, messageCount?: number | null) {
    let params = new HttpParams()
      .set('metric', metric)
      .set('message_size', messageSize.toString());
    if (messageCount) params = params.set('message_count', messageCount.toString());
    return this.http.get(this.plotComparisonBar, { params, responseType: 'blob' });
  }
}
