import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  hidePassword = true;
  returnUrl: string = '';
  errorMessage: string = '';
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    // Si ya está autenticado, redirigir a dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/routes']);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/routes';
    this.initForm();
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['admin', [Validators.required, Validators.minLength(3)]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]]
    });
  }

  private resetForm(): void {
    if (this.loginForm) {
      this.loginForm.reset({
        username: 'admin',
        password: 'admin123'
      });
      this.submitted = false;
      this.errorMessage = '';
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  get isFormValid(): boolean {
    return this.loginForm && this.loginForm.valid && !this.loading;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    if (this.loginForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    const credentials = {
      username: this.loginForm.get('username')?.value?.trim(),
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        },
        complete: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private handleLoginSuccess(response: any): void {
    this.loading = false;
    this.submitted = false;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const message = response?.message || '✓ Sesión iniciada exitosamente';
    this.snackBar.open(message, 'Cerrar', { 
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    // Navegar después de un pequeño delay para visualizar el mensaje
    setTimeout(() => {
      this.router.navigate([this.returnUrl]);
    }, 500);
  }

  private handleLoginError(error: any): void {
    this.loading = false;
    this.cdr.markForCheck();

    let errorMsg = 'Error al iniciar sesión';

    if (error?.error?.message) {
      errorMsg = error.error.message;
    } else if (error?.status === 400) {
      errorMsg = 'Usuario o contraseña incorrectos';
    } else if (error?.status === 401) {
      errorMsg = 'Credenciales inválidas';
    } else if (error?.status === 403) {
      errorMsg = 'Acceso denegado. Contacta al administrador';
    } else if (error?.status === 0 || error?.statusText === 'Unknown Error') {
      errorMsg = 'Error de conexión. ¿Está corriendo el servidor en puerto 8080?';
    } else if (error?.status === 500) {
      errorMsg = 'Error del servidor. Intenta nuevamente';
    } else if (error?.status >= 500) {
      errorMsg = 'Error del servidor. Por favor, intenta más tarde';
    }

    this.errorMessage = errorMsg;
    this.snackBar.open(`✗ ${errorMsg}`, 'Cerrar', { 
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.cdr.markForCheck();
  }

  clearError(): void {
    this.errorMessage = '';
    this.cdr.markForCheck();
  }
}
