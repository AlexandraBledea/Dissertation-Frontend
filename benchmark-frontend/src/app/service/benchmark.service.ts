import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pagination} from '../data-types/Pagination';
import {ExperimentPaginationResponse} from '../data-types/Experiment';

@Injectable({
  providedIn: 'root'
})
export class BenchmarkService {

  private baseUrl = 'http://localhost:8080/api/experiment'
  private startExp = `${this.baseUrl}/start`;
  private getCSV = `${this.baseUrl}/csv`;
  private filterUrl = `${this.baseUrl}/filter`;

  constructor(private http: HttpClient) {}

  public getExperimentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  public getCsvForExperiment(id: number): Observable<Blob> {
    return this.http.get(`${this.getCSV}/${id}`, { responseType: 'blob' });
  }

  public startExperiment(broker: string, messageSize: number, messageCount: number): Observable<any> {
    const params = new HttpParams()
      .set('sizeKb', messageSize.toString())
      .set('count', messageCount.toString());

    return this.http.post(`${this.startExp}/${broker}`, null, {
      params: params,
      responseType: 'text' as const
    });
  }

  public getAllExperimentsPaginated(
    pagination: Pagination,
    filters?: any
  ): Observable<ExperimentPaginationResponse> {
    const params = this.mapParams(pagination, filters)
    return this.http.get<ExperimentPaginationResponse>(`${this.baseUrl}/all`, { params: params });
  }

  mapParams(pagination: Pagination, filters?: any) {
    return {
      pageNumber: pagination?.pageNumber || 0,
      pageSize: pagination?.pageSize || 10,
      ...(filters?.broker?.length && {broker: filters.broker}),
      ...(filters?.numberOfMessages?.length && {numberOfMessages: filters.numberOfMessages}),
      ...(filters?.messageSize?.length && {messageSize: filters.messageSize})
    }
  }
}
