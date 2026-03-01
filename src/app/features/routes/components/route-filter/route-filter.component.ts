import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-route-filter',
  standalone: false,
  templateUrl: './route-filter.component.html',
  styleUrls: ['./route-filter.component.scss']
})
export class RouteFilterComponent {
  @Output() filterApplied = new EventEmitter<any>();

  filterForm: FormGroup;
  statusOptions = [
    { value: 1, label: 'Pendiente' },
    { value: 2, label: 'En Proceso' },
    { value: 3, label: 'Completada' },
    { value: 4, label: 'Cancelada' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      origin: ['', Validators.pattern(/^\d*$/)],
      destination: ['', Validators.pattern(/^\d*$/)],
      priority: ['', Validators.pattern(/^\d*$/)],
      status: [''],
      minDistance: ['', Validators.pattern(/^\d*\.?\d*$/)],
      maxDistance: ['', Validators.pattern(/^\d*\.?\d*$/)],
    });
  }

  applyFilters(): void {
    const filters: any = {};
    const formValue = this.filterForm.value;

    if (formValue.origin) filters.origin = formValue.origin;
    if (formValue.destination) filters.destination = formValue.destination;
    if (formValue.priority) filters.priority = formValue.priority;
    if (formValue.status) filters.status = formValue.status;
    if (formValue.minDistance) filters.distance_km__gte = formValue.minDistance;
    if (formValue.maxDistance) filters.distance_km__lte = formValue.maxDistance;

    this.filterApplied.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterApplied.emit({});
  }
}
