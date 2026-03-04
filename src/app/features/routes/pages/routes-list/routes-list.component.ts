import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  RoutesService,
  QueryParams
} from '../../services/routes.service';

import {
  Route,
  PaginatedResponse
} from '../../../../shared/models/route.model';

import { RouteFilterComponent } from '../../components/route-filter/route-filter.component';
import { RouteFilters } from '../../components/route-filter/route-filter.component';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    RouteFilterComponent,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutesListComponent implements OnInit, OnDestroy {

  routes: Route[] = [];
  selectedRoutes: number[] = [];
  isLoading = false;

  displayedColumns: string[] = [
    'select',
    'id',
    'origin',
    'destination',
    'distance_km',
    'priority',
    'status',
    'created_at',
    'actions'
  ];

  currentPage = 1;
  pageSize = 25;
  totalItems = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly routesService: RoutesService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= LOAD ================= */

  loadRoutes(filters?: QueryParams): void {

    this.isLoading = true;
    this.cdr.markForCheck();

    const params: QueryParams = {
      page: this.currentPage,
      page_size: this.pageSize,
      ...(filters ?? {})
    };

    this.routesService.getRoutes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Route[]>) => {

          const result = response?.results;

          if (!result?.success) {
            this.snackBar.open(
              result?.message || 'Error cargando rutas',
              'Cerrar',
              { duration: 4000 }
            );
            this.isLoading = false;
            this.cdr.markForCheck();
            return;
          }

          this.routes = Array.isArray(result.data) ? result.data : [];
          this.totalItems = result.meta?.pagination?.total_items ?? 0;
          this.selectedRoutes = [];

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error cargando rutas:', err);
          this.snackBar.open('Error cargando rutas', 'Cerrar', { duration: 4000 });
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  loadFiltered(filters: RouteFilters): void {
    this.currentPage = 1;
    this.loadRoutes(filters as QueryParams);
  }

  /* ================= SELECTION ================= */

  toggleSelection(id?: number): void {
    if (typeof id !== 'number') return;

    this.selectedRoutes = this.selectedRoutes.includes(id)
      ? this.selectedRoutes.filter(r => r !== id)
      : [...this.selectedRoutes, id];

    this.cdr.markForCheck();
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selectedRoutes = [];
    } else {
      this.selectedRoutes = this.routes
        .filter(r => typeof r.id === 'number')
        .map(r => r.id as number);
    }
    this.cdr.markForCheck();
  }

  isAllSelected(): boolean {
    return this.routes.length > 0 &&
           this.selectedRoutes.length === this.routes.length;
  }

  isSomeSelected(): boolean {
    return this.selectedRoutes.length > 0 &&
           this.selectedRoutes.length < this.routes.length;
  }

  /* ================= ACTIONS ================= */

  executeSelected(): void {

    if (!this.selectedRoutes.length) {
      this.snackBar.open('Selecciona al menos una ruta', 'Cerrar', { duration: 3000 });
      return;
    }

    this.routesService.executeRoutes(this.selectedRoutes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Rutas ejecutadas correctamente', 'Cerrar', { duration: 3000 });
        this.loadRoutes();
      });
  }

  deleteRoute(id?: number): void {

    if (typeof id !== 'number') return;
    if (!confirm('¿Eliminar esta ruta?')) return;

    this.routesService.deleteRoute(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Ruta eliminada', 'Cerrar', { duration: 3000 });
        this.loadRoutes();
      });
  }

  /* ================= HELPERS ================= */

  getStatusLabel(status: number): string {
    const map: Record<number, string> = {
      1: 'Pendiente',
      2: 'En Proceso',
      3: 'Completada',
      4: 'Cancelada'
    };
    return map[status] ?? 'Desconocido';
  }

  getStatusIcon(status: number): string {
    const map: Record<number, string> = {
      1: 'hourglass-end',
      2: 'hourglass-end',
      3: 'check-circle',
      4: 'circle-xmark'
    };
    return map[status] ?? 'question-circle';
  }

  trackById(_: number, item: Route): number {
    return item.id ?? 0;
  }
}