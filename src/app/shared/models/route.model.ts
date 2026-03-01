export interface Route {
  id?: number;
  origin: number;
  destination: number;
  distance_km: number;
  priority: number;
  time_window_start: string;
  time_window_end: string;
  status: number;
  created_at?: string;
}

export interface RouteImportResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}

export interface RouteLogs {
  id: number;
  route_id: number;
  action: string;
  timestamp: string;
  details: any;
}
