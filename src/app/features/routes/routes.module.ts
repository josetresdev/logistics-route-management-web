import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RoutesRoutingModule } from './routes-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { RoutesListComponent } from './pages/routes-list/routes-list.component';
import { RoutesImportComponent } from './pages/routes-import/routes-import.component';
import { RoutesLogsComponent } from './pages/routes-logs/routes-logs.component';
import { RouteFilterComponent } from './components/route-filter/route-filter.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RoutesRoutingModule,
    SharedModule,
    MatExpansionModule,
    MatMenuModule,

    // Standalone components
    RoutesListComponent,
    RoutesImportComponent,
    RoutesLogsComponent,
    RouteFilterComponent
  ]
})
export class RoutesModule {}