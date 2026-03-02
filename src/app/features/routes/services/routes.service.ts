import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import {
  Route,
  PaginatedResponse,
  RouteLog,
  RouteImportResponse
} from '../../../shared/models/route.model';

export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryParamValue>;

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  // environment.apiUrl = http://localhost:8080/api
  private readonly routesUrl = `${environment.apiUrl}/routes`;
  private readonly executionLogsUrl = `${environment.apiUrl}/execution-logs`;

  constructor(private readonly http: HttpClient) {}

  /* ================= AUTH HEADER ================= */

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* ================= GET ROUTES ================= */

  getRoutes(params?: QueryParams): Observable<PaginatedResponse<Route[]>> {

    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<Route[]>>(
      `${this.routesUrl}/`,
      {
        params: httpParams,
        headers: this.getAuthHeaders()
      }
    );
  }

  /* ================= DELETE ROUTE ================= */

  deleteRoute(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.routesUrl}/${id}/`,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ================= EXECUTE ROUTES ================= */

  executeRoutes(routeIds: number[]): Observable<any> {
    return this.http.post(
      `${this.routesUrl}/execute/`,
      { route_ids: routeIds },
      { headers: this.getAuthHeaders() }
    );
  }

  /* ================= IMPORT ROUTES ================= */

  importRoutes(file: File): Observable<RouteImportResponse> {

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<RouteImportResponse>(
      `${this.routesUrl}/import`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ================= EXECUTION LOGS ================= */

  getExecutionLogs(page: number = 1, pageSize: number = 25): Observable<any> {

    return this.http.get<any>(
      `${this.executionLogsUrl}/`,
      {
        params: {
          page: page,
          page_size: pageSize
        },
        headers: this.getAuthHeaders()
      }
    );
  }
}