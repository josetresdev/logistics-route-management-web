import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { Route } from '../../../../shared/models/route.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-routes-list',
  standalone: false,
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutesListComponent implements OnInit, OnDestroy {
  routes: Route[] = [];
  selectedRoutes: number[] = [];
  isLoading = false;
  displayedColumns: string[] = ['select', 'id', 'origin', 'destination', 'distance_km', 'priority', 'status', 'created_at', 'actions'];
  
  private destroy$ = new Subject<void>();

  constructor(
    private routesService: RoutesService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoutes(filters?: any): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.routesService.getRoutes(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: Route[]) => {
          this.routes = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        (error) => {
          this.snackBar.open('Error cargando rutas', 'Cerrar', { duration: 5000 });
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  loadFiltered(filters: any): void {
    this.loadRoutes(filters);
  }

  toggleSelection(id: number): void {
    if (this.selectedRoutes.includes(id)) {
      this.selectedRoutes = this.selectedRoutes.filter(r => r !== id);
    } else {
      this.selectedRoutes.push(id);
    }
    this.cdr.markForCheck();
  }

  toggleAllSelection(): void {
    if (this.selectedRoutes.length === this.routes.length) {
      this.selectedRoutes = [];
    } else {
      this.selectedRoutes = this.routes.map(r => r.id!);
    }
    this.cdr.markForCheck();
  }

  isAllSelected(): boolean {
    return this.selectedRoutes.length === this.routes.length && this.routes.length > 0;
  }

  isSomeSelected(): boolean {
    return this.selectedRoutes.length > 0 && this.selectedRoutes.length < this.routes.length;
  }

  executeSelected(): void {
    if (this.selectedRoutes.length === 0) {
      this.snackBar.open('Selecciona al menos una ruta', 'Cerrar', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    this.routesService.executeRoutes(this.selectedRoutes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.snackBar.open('Rutas ejecutadas exitosamente', 'Cerrar', { duration: 5000 });
          this.selectedRoutes = [];
          this.loadRoutes();
        },
        (error) => {
          this.snackBar.open('Error ejecutando rutas', 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      );
  }

  deleteRoute(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta ruta?')) {
      this.routesService.deleteRoute(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.snackBar.open('Ruta eliminada', 'Cerrar', { duration: 5000 });
            this.loadRoutes();
          },
          (error) => {
            this.snackBar.open('Error eliminando ruta', 'Cerrar', { duration: 5000 });
            this.cdr.markForCheck();
          }
        );
    }
  }

  getStatusLabel(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Pendiente',
      2: 'En Proceso',
      3: 'Completada',
      4: 'Cancelada'
    };
    return statusMap[status] || 'Desconocido';
  }
}
