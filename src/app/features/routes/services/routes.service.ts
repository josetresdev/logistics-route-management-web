import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Route, RouteImportResponse, RouteLogs } from '../../../shared/models/route.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private baseUrl = `${environment.apiUrl}/routes`;

  constructor(private http: HttpClient) {}

  getRoutes(params?: any): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.baseUrl}/`, { params });
  }

  getRoute(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.baseUrl}/${id}/`);
  }

  createRoute(data: Route): Observable<Route> {
    return this.http.post<Route>(`${this.baseUrl}/`, data);
  }

  updateRoute(id: number, data: Route): Observable<Route> {
    return this.http.put<Route>(`${this.baseUrl}/${id}/`, data);
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }

  executeRoutes(routeIds: number[]): Observable<Route[]> {
    return this.http.post<Route[]>(`${this.baseUrl}/execute/`, {
      route_ids: routeIds
    });
  }

  importRoutes(file: File): Observable<RouteImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<RouteImportResponse>(`${this.baseUrl}/import_routes/`, formData);
  }

  getLogs(routeId?: number): Observable<RouteLogs[]> {
    const url = routeId ? `${this.baseUrl}/logs/?route_id=${routeId}` : `${this.baseUrl}/logs/`;
    return this.http.get<RouteLogs[]>(url);
  }
}
