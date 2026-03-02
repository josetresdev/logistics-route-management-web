import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpResponse, HttpEvent } from '@angular/common/http';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RoutesService } from '../../services/routes.service';
import { RouteImportResponse, RouteImportData } from '../../../../shared/models/route.model';

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
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './routes-import.component.html',
  styleUrls: ['./routes-import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutesImportComponent implements OnDestroy {

  selectedFile: File | null = null;
  isLoading = false;
  uploadProgress = 0;
  importResult: RouteImportData | null = null;
  hasErrors = false;
  errors: string[] = [];
  errorDetails: any[] = [];
  successMessage = '';
  uploadStatus = '';
  
  // Estados detallados de procesamiento
  processingPhase: 'upload' | 'validation' | 'processing' | 'saving' | null = null;
  recordsProcessed = 0;
  totalRecords = 0;
  recordsPerSecond = 0;
  estimatedTimeRemaining = '—';
  currentAction = 'Preparando carga...';
  processingPhases = [
    { id: 'upload', label: 'Subiendo archivo', icon: 'cloud_upload', completed: false },
    { id: 'validation', label: 'Validando datos', icon: 'check_circle', completed: false },
    { id: 'processing', label: 'Procesando registros', icon: 'processing', completed: false },
    { id: 'saving', label: 'Guardando en base de datos', icon: 'save', completed: false }
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly routesService: RoutesService,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
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
    this.cdr.markForCheck();
  }

  importFile(): void {

    if (!this.selectedFile) {
      this.snackBar.open('Selecciona un archivo', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.uploadProgress = 0;
    this.processingPhase = 'upload';
    this.currentAction = 'Preparando carga...';
    this.recordsProcessed = 0;
    this.totalRecords = 0;
    this.recordsPerSecond = 0;
    this.estimatedTimeRemaining = '—';
    this.resetProcessingPhases();
    this.cdr.markForCheck();

    const startTime = Date.now();

    this.routesService.importRoutes(this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: any) => {
          // Manejar evento de progreso
          const progressData = this.routesService.getUploadProgress(event);

          if (progressData) {
            this.uploadProgress = progressData.progress;
            this.updateProcessingState(progressData, startTime);
            this.cdr.markForCheck();

            // Si completó la subida (HttpResponse)
            if (event instanceof HttpResponse && event.body) {
              const response: RouteImportResponse = event.body;
              const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

              this.isLoading = false;
              this.importResult = response.data;
              this.processingPhase = null;
              this.cdr.markForCheck();

              if (response.success && response.data.created > 0) {
                this.successMessage = `${response.message} (Tiempo total: ${totalTime}s)`;
                this.snackBar.open('✓ Importación exitosa', 'Cerrar', {
                  duration: 4000,
                  panelClass: ['success-snackbar']
                });
              } else if (response.data.failed > 0 || response.data.created === 0) {
                this.hasErrors = true;
                this.errors = [response.message];

                // Si hay detalles de errores
                if (response.data.errors && Array.isArray(response.data.errors)) {
                  this.errorDetails = response.data.errors.map((err: any) => ({
                    row: err.row || 'N/A',
                    message: err.error || err.message || 'Error desconocido'
                  }));
                }

                this.snackBar.open('✗ Error en la importación', 'Cerrar', {
                  duration: 5000,
                  panelClass: ['error-snackbar']
                });
              } else {
                this.successMessage = `${response.message} (Tiempo total: ${totalTime}s)`;
                this.snackBar.open('✓ Importación completada', 'Cerrar', {
                  duration: 4000,
                  panelClass: ['success-snackbar']
                });
              }
            }
          }
        },

        error: (err: any) => {
          this.isLoading = false;
          this.hasErrors = true;
          this.uploadProgress = 0;
          this.processingPhase = null;
          this.cdr.markForCheck();

          const errorMessage = err?.error?.errors?.message ||
                              err?.error?.error ||
                              err?.error?.message ||
                              err?.message ||
                              'Error inesperado durante la importación';

          this.errors = [errorMessage];

          this.snackBar.open('✗ Error importando rutas', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  private updateProcessingState(progressData: any, startTime: number): void {
    const elapsedTime = (Date.now() - startTime) / 1000;
    
    // Determinar la fase actual basado en el progreso
    if (this.uploadProgress < 20) {
      this.processingPhase = 'upload';
      this.currentAction = `Subiendo archivo (${this.uploadProgress}%)`;
    } else if (this.uploadProgress < 40) {
      if (this.processingPhases[0].completed === false) {
        this.processingPhases[0].completed = true;
      }
      this.processingPhase = 'validation';
      this.currentAction = `Validando datos (${this.uploadProgress}%)`;
    } else if (this.uploadProgress < 80) {
      if (!this.processingPhases[0].completed) {
        this.processingPhases[0].completed = true;
      }
      if (!this.processingPhases[1].completed) {
        this.processingPhases[1].completed = true;
      }
      this.processingPhase = 'processing';
      this.currentAction = `Procesando registros (${this.uploadProgress}%)`;
      
      // Estimar registros basado en el progreso
      const estimatedTotal = Math.round(this.totalRecords || 5000);
      this.recordsProcessed = Math.round((this.uploadProgress / 80) * estimatedTotal);
    } else {
      if (!this.processingPhases[0].completed) {
        this.processingPhases[0].completed = true;
      }
      if (!this.processingPhases[1].completed) {
        this.processingPhases[1].completed = true;
      }
      if (!this.processingPhases[2].completed) {
        this.processingPhases[2].completed = true;
      }
      this.processingPhase = 'saving';
      this.currentAction = `Guardando en base de datos (${this.uploadProgress}%)`;
      this.recordsProcessed = this.totalRecords;
    }

    // Calcular velocidad de procesamiento
    if (elapsedTime > 0) {
      this.recordsPerSecond = Math.round(this.recordsProcessed / elapsedTime);
      
      // Estimar tiempo restante
      if (this.recordsPerSecond > 0 && this.recordsProcessed < this.totalRecords) {
        const recordsRemaining = this.totalRecords - this.recordsProcessed;
        const estimatedSeconds = Math.round(recordsRemaining / this.recordsPerSecond);
        if (estimatedSeconds > 0) {
          this.estimatedTimeRemaining = estimatedSeconds > 60 
            ? `${Math.round(estimatedSeconds / 60)}m ${estimatedSeconds % 60}s`
            : `${estimatedSeconds}s`;
        }
      }
    }
  }

  private resetProcessingPhases(): void {
    this.processingPhases = this.processingPhases.map(phase => ({
      ...phase,
      completed: false
    }));
  }

  resetForm(): void {
    this.selectedFile = null;
    this.resetState();
    this.cdr.markForCheck();
  }

  private resetState(): void {
    this.importResult = null;
    this.hasErrors = false;
    this.errors = [];
    this.errorDetails = [];
    this.successMessage = '';
    this.uploadProgress = 0;
    this.uploadStatus = '';
    this.processingPhase = null;
    this.recordsProcessed = 0;
    this.totalRecords = 0;
    this.recordsPerSecond = 0;
    this.estimatedTimeRemaining = '—';
    this.currentAction = '';
    this.resetProcessingPhases();
  }
}