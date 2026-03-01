import { Component, OnDestroy } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routes-import',
  standalone: false,
  templateUrl: './routes-import.component.html',
  styleUrls: ['./routes-import.component.scss']
})
export class RoutesImportComponent implements OnDestroy {
  selectedFile: File | null = null;
  isLoading = false;
  importResult: any = null;
  hasErrors = false;
  errors: any[] = [];
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private routesService: RoutesService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.selectedFile = file;
        this.importResult = null;
        this.hasErrors = false;
        this.errors = [];
      } else {
        this.snackBar.open('Por favor selecciona un archivo Excel (.xlsx o .xls)', 'Cerrar', { duration: 5000 });
      }
    }
  }

  importFile(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Por favor selecciona un archivo', 'Cerrar', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    this.routesService.importRoutes(this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.importResult = response;

          if (response.success) {
            this.successMessage = response.message;
            this.snackBar.open('Rutas importadas exitosamente', 'Cerrar', { duration: 5000 });
            setTimeout(() => {
              this.router.navigate(['/routes']);
            }, 2000);
          } else {
            this.hasErrors = true;
            this.errors = response.errors || [];
            this.snackBar.open('Error en la importación: ' + response.message, 'Cerrar', { duration: 5000 });
          }
        },
        (error) => {
          this.isLoading = false;
          this.hasErrors = true;
          this.errors = [error.error?.detail || 'Error desconocido durante la importación'];
          this.snackBar.open('Error importando rutas', 'Cerrar', { duration: 5000 });
        }
      );
  }

  resetForm(): void {
    this.selectedFile = null;
    this.importResult = null;
    this.hasErrors = false;
    this.errors = [];
    this.successMessage = '';
  }

  downloadTemplate(): void {
    this.snackBar.open('Descargando plantilla...', 'Cerrar', { duration: 3000 });
  }
}
