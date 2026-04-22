import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-international-travel-history',
  templateUrl: './international-travel-history.component.html',
  styleUrls: ['./international-travel-history.component.css']
})
export class InternationalTravelHistoryComponent implements OnChanges, OnDestroy {
  @Input() travels: FormArray;
  @Output() travelsChanged = new EventEmitter<void>();
  private travelsSub?: Subscription;

  ngOnDestroy(): void {
    this.travelsSub?.unsubscribe();
  }

  get travelControls(): FormGroup[] {
    return this.travels?.controls as FormGroup[];
  }

  createTravelGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      countryName: new FormControl(data?.countryName || null),
      departureDate: new FormControl(data?.departureDate || null),
      returnDate: new FormControl(data?.returnDate || null),
      affectedArea: new FormControl(data?.affectedArea || null)
    });
  }

  addTravel(): void {
    if (this.travels) {
      this.travels.push(this.createTravelGroup());
      this.travelsChanged.emit();
    }
  }

  removeTravel(index: number): void {
    if (this.travels) {
      this.travels.removeAt(index);
      this.travelsChanged.emit();
    }
  }

  ngOnChanges(): void {
    this.travelsSub?.unsubscribe();
    if (this.travels) {
      this.travelsSub = this.travels.valueChanges.subscribe(() => {
        this.travelsChanged.emit();
      });
    }
  }
}
