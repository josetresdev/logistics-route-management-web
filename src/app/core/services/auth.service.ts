import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  private tokenExpiryKey = 'token_expiry';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkTokenExpiry();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<BackendAuthResponse>(`${this.apiUrl}/token-auth/`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const token = response.data.token;
            const user = response.data.user;
            
            this.setToken(token);
            if (user) {
              this.setUser(user);
            }
            this.isAuthenticatedSubject.next(true);
            // Configurar auto-refresco de token (ej: 24 horas)
            this.scheduleTokenRefresh();
            
            return { token, user };
          }
          throw new Error('Invalid response structure');
        }),
        catchError(error => {
          console.error('Login error:', error);
          this.isAuthenticatedSubject.next(false);
          throw error;
        })
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.tokenExpiryKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
      // Token expira en 24 horas
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
    }
  }

  private setUser(user: any): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): any {
    if (this.isBrowser()) {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private hasValidToken(): boolean {
    if (!this.isBrowser()) return false;
    
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    
    if (!token || !expiry) return false;
    
    const expiryTime = parseInt(expiry, 10);
    return new Date().getTime() < expiryTime;
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private checkTokenExpiry(): void {
    // Verificar token cada minuto
    timer(60000, 60000).subscribe(() => {
      if (!this.hasValidToken()) {
        this.logout();
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  private scheduleTokenRefresh(): void {
    if (!this.isBrowser()) return;
    
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (expiry) {
      const expiryTime = parseInt(expiry, 10);
      const refreshTime = expiryTime - new Date().getTime() - (5 * 60 * 1000); // Refrescar 5 min antes
      
      if (refreshTime > 0) {
        timer(refreshTime).subscribe(() => {
          this.refreshToken().subscribe(
            () => console.log('Token refrescado'),
            () => this.logout()
          );
        });
      }
    }
  }

  refreshToken(): Observable<LoginResponse> {
    const currentToken = this.getToken();
    return this.http.post<LoginResponse>(`${this.apiUrl}/token-refresh/`, { token: currentToken })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.scheduleTokenRefresh();
        })
      );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }
}

