import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpProgressEvent, HttpResponse } from '@angular/common/http';
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

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  // environment.apiUrl = http://localhost:8080/api
  private readonly routesUrl = `${environment.apiUrl}/routes`;
  private readonly executionLogsUrl = `${environment.apiUrl}/execution-logs`;

  constructor(private readonly http: HttpClient) {}

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
      { params: httpParams }
    );
  }

  /* ================= DELETE ROUTE ================= */

  deleteRoute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.routesUrl}/${id}/`);
  }

  /* ================= EXECUTE ROUTES ================= */

  executeRoutes(routeIds: number[]): Observable<any> {
    return this.http.post(
      `${this.routesUrl}/execute/`,
      { route_ids: routeIds }
    );
  }

  /* ================= IMPORT ROUTES ================= */

  importRoutes(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.routesUrl}/import`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );
  }

  /**
   * Calcula el progreso de carga del archivo
   * @param event - Evento HTTP
   * @returns Objeto con progreso (0-100) y estado
   */
  getUploadProgress(event: any): UploadProgress | null {
    if (event.type === 1) {
      // HttpProgressEvent (type 1)
      if (event.total) {
        const progress = Math.round((event.loaded / event.total) * 100);
        return {
          progress,
          status: 'uploading',
          message: `Subiendo: ${progress}%`
        };
      }
    } else if (event instanceof HttpResponse) {
      return {
        progress: 100,
        status: 'success',
        message: 'Archivo subido completamente'
      };
    }
    return null;
  }

  /* ================= EXECUTION LOGS ================= */

  getExecutionLogs(page: number = 1, pageSize: number = 25): Observable<PaginatedResponse<RouteLog[]>> {
    return this.http.get<PaginatedResponse<RouteLog[]>>(
      `${this.executionLogsUrl}/`,
      {
        params: {
          page: page,
          page_size: pageSize
        }
      }
    );
  }
}