export interface Route {
  id: number;
  origin: string;
  destination: string;
  distance_km: number;
  priority: number;
  status: number;
  created_at: string;
}

/* ================= PAGINATION ================= */

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  pagination: PaginationMeta;
}

/* ================= API STRUCTURE ================= */

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ApiMeta;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiResult<T>;
}

/* ================= ROUTE LOGS ================= */

export interface RouteLog {
  id: number;
  route_id: number;
  action: string;
  message: string;
  timestamp: string;
  result?: 'success' | 'error';
  execution_ms?: number;
}

/* ================= ROUTE IMPORT ================= */

export interface RouteImportError {
  row?: number;
  message?: string;
  error?: string;
  data?: any;
}

export interface RouteImportData {
  batch_id: number;
  batch_name: string;
  total: number;
  created: number;
  updated?: number;
  failed: number;
  status: string;
  errors?: RouteImportError[];
  created_at?: string;
}

export interface RouteImportResponse {
  success: boolean;
  message: string;
  data: RouteImportData;
  errors?: RouteImportError[];
}