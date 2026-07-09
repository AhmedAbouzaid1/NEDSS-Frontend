import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-travel-history',
  templateUrl: './local-travel-history.component.html',
  styleUrls: ['./local-travel-history.component.css']
})
export class LocalTravelHistoryComponent implements OnChanges, OnDestroy {
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
      placeCityVillage: new FormControl(data?.placeCityVillage || null),
      departureDate: new FormControl(data?.departureDate || null),
      returnDate: new FormControl(data?.returnDate || null)
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
