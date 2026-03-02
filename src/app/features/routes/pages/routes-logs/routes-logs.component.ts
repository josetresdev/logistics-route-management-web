import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { RoutesService } from '../../services/routes.service';
import { RouteLog } from '../../../../shared/models/route.model';

@Component({
  selector: 'app-routes-logs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './routes-logs.component.html',
  styleUrls: ['./routes-logs.component.scss']
})
export class RoutesLogsComponent implements OnInit, OnDestroy {

  logs: RouteLog[] = [];
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'route_id',
    'action',
    'message',
    'result',
    'timestamp',
    'execution_ms'
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly routesService: RoutesService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= LOAD LOGS ================= */

  loadLogs(page: number = 1, pageSize: number = 25): void {

    this.isLoading = true;
    this.cdr.markForCheck();

    this.routesService.getExecutionLogs(page, pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (response: any) => {
          const result = response?.results;

          if (!result?.success) {
            this.snackBar.open(
              result?.message || 'Error cargando logs',
              'Cerrar',
              { duration: 4000 }
            );
            return;
          }

          this.logs = Array.isArray(result.data) ? result.data : [];
        },

        error: (err) => {
          console.error('Error cargando logs:', err);
          this.snackBar.open('Error cargando logs', 'Cerrar', { duration: 4000 });
        }
      });
  }

  refreshLogs(): void {
    this.loadLogs();
  }

  /* ================= HELPERS ================= */

  getActionLabel(action: string): string {
    const map: Record<string, string> = {
      create: 'Creación',
      update: 'Actualización',
      delete: 'Eliminación',
      execute: 'Ejecución'
    };

    return map[action] ?? action;
  }

  getActionIcon(action: string): string {
    const map: Record<string, string> = {
      create: 'add_circle',
      update: 'edit',
      delete: 'delete_forever',
      execute: 'play_circle'
    };

    return map[action] ?? 'info';
  }

  trackById(_: number, item: RouteLog): number {
    return item.id ?? 0;
  }
}