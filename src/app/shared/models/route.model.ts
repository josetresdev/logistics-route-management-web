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
  message: string;
  level: 'info' | 'warning' | 'error';
  created_at: string;
}

/* ================= ROUTE IMPORT ================= */

export interface RouteImportError {
  row?: number;
  message: string;
}

export interface RouteImportResponse {
  success: boolean;
  message: string;
  data: {
    created: number;
    updated?: number;
    failed?: number;
  };
  errors?: RouteImportError[];
}