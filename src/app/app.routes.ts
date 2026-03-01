import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'routes',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/routes/routes.module').then(m => m.RoutesModule)
  },
  { path: '', redirectTo: 'routes', pathMatch: 'full' },
  { path: '**', redirectTo: 'routes' }
];
