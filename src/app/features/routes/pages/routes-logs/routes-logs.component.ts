import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { RouteLogs } from '../../../../shared/models/route.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-routes-logs',
  standalone: false,
  templateUrl: './routes-logs.component.html',
  styleUrls: ['./routes-logs.component.scss']
})
export class RoutesLogsComponent implements OnInit, OnDestroy {
  logs: RouteLogs[] = [];
  isLoading = false;
  displayedColumns: string[] = ['id', 'route_id', 'action', 'timestamp', 'details'];

  private destroy$ = new Subject<void>();

  constructor(
    private routesService: RoutesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.routesService.getLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: RouteLogs[]) => {
          this.logs = data;
          this.isLoading = false;
        },
        (error) => {
          this.snackBar.open('Error cargando logs', 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      );
  }

  refreshLogs(): void {
    this.loadLogs();
  }

  getActionLabel(action: string): string {
    const actionMap: { [key: string]: string } = {
      'create': 'Creada',
      'update': 'Actualizada',
      'execute': 'Ejecutada',
      'delete': 'Eliminada'
    };
    return actionMap[action] || action;
  }
}
