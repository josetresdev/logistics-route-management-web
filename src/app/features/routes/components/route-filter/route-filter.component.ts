import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface RouteFilters {
  origin?: number;
  destination?: number;
  priority?: number;
  status?: number;
  distance_km__gte?: number;
  distance_km__lte?: number;
}

@Component({
  selector: 'app-route-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './route-filter.component.html',
  styleUrls: ['./route-filter.component.scss']
})
export class RouteFilterComponent {

  @Output() filterApplied = new EventEmitter<RouteFilters>();

  filterForm: FormGroup;

  statusOptions = [
    { value: 1, label: 'Pendiente' },
    { value: 2, label: 'En Proceso' },
    { value: 3, label: 'Completada' },
    { value: 4, label: 'Cancelada' }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.filterForm = this.fb.group({
      origin: ['', Validators.pattern(/^\d*$/)],
      destination: ['', Validators.pattern(/^\d*$/)],
      priority: ['', Validators.pattern(/^\d*$/)],
      status: [''],
      minDistance: ['', Validators.pattern(/^\d*\.?\d*$/)],
      maxDistance: ['', Validators.pattern(/^\d*\.?\d*$/)]
    });
  }

  applyFilters(): void {

    if (this.filterForm.invalid) return;

    const formValue = this.filterForm.value;
    const filters: RouteFilters = {};

    if (formValue.origin) filters.origin = Number(formValue.origin);
    if (formValue.destination) filters.destination = Number(formValue.destination);
    if (formValue.priority) filters.priority = Number(formValue.priority);
    if (formValue.status) filters.status = Number(formValue.status);
    if (formValue.minDistance) filters.distance_km__gte = Number(formValue.minDistance);
    if (formValue.maxDistance) filters.distance_km__lte = Number(formValue.maxDistance);

    this.filterApplied.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterApplied.emit({});
  }
}