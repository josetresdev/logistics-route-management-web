import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesListComponent } from './pages/routes-list/routes-list.component';
import { RoutesImportComponent } from './pages/routes-import/routes-import.component';
import { RoutesLogsComponent } from './pages/routes-logs/routes-logs.component';

const routes: Routes = [
  { path: '', component: RoutesListComponent },
  { path: 'import', component: RoutesImportComponent },
  { path: 'logs', component: RoutesLogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
