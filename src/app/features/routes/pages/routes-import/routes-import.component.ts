import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoutesService } from '../../services/routes.service';
import { RouteImportResponse } from '../../../../shared/models/route.model';

@Component({
  selector: 'app-routes-import',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './routes-import.component.html',
  styleUrls: ['./routes-import.component.scss']
})
export class RoutesImportComponent implements OnDestroy {

  selectedFile: File | null = null;
  isLoading = false;
  importResult: RouteImportResponse | null = null;
  hasErrors = false;
  errors: string[] = [];
  successMessage = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly routesService: RoutesService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.snackBar.open(
        'Selecciona un archivo Excel válido (.xlsx o .xls)',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }

    this.selectedFile = file;
    this.resetState();
  }

  importFile(): void {

    if (!this.selectedFile) {
      this.snackBar.open('Selecciona un archivo', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.routesService.importRoutes(this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (response: RouteImportResponse) => {

          this.isLoading = false;
          this.importResult = response;

          if (response.success) {
            this.successMessage = response.message;
            this.snackBar.open('Importación exitosa', 'Cerrar', { duration: 3000 });
          } else {
            this.hasErrors = true;
            this.errors = Array.isArray(response.data)
              ? response.data
              : [response.message];

            this.snackBar.open('Error en la importación', 'Cerrar', { duration: 4000 });
          }
        },

        error: () => {
          this.isLoading = false;
          this.hasErrors = true;
          this.errors = ['Error inesperado durante la importación'];
          this.snackBar.open('Error importando rutas', 'Cerrar', { duration: 4000 });
        }
      });
  }

  resetForm(): void {
    this.selectedFile = null;
    this.resetState();
  }

  private resetState(): void {
    this.importResult = null;
    this.hasErrors = false;
    this.errors = [];
    this.successMessage = '';
  }
}