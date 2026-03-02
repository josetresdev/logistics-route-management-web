import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Añadir token si está disponible
    const token = this.authService.getToken();
    
    // Para FormData, no especificar Content-Type (el navegador lo maneja automáticamente)
    const isFormData = request.body instanceof FormData;
    
    if (token) {
      const headers: any = {
        'Authorization': `Token ${token}`
      };
      
      // Solo agregar Content-Type si NO es FormData
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      request = request.clone({
        setHeaders: headers
      });
    } else {
      if (!isFormData) {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores de autenticación
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
