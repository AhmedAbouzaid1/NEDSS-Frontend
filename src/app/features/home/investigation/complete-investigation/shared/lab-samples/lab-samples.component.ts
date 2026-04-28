import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lab-samples',
  templateUrl: './lab-samples.component.html',
  styleUrls: ['./lab-samples.component.css'],
})
export class LabSamplesComponent {
  @Input() labSamples: FormArray;
  @Output() labSamplesChanged = new EventEmitter<void>();

  get sampleControls(): FormGroup[] {
    return (this.labSamples?.controls as FormGroup[]) || [];
  }

  createLabSampleGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      sampleType: new FormControl(data?.sampleType || null),
      sampleNumber: new FormControl(data?.sampleNumber || null),
      sampleCollectionDate: new FormControl(data?.sampleCollectionDate || null),
      sampleTestDate: new FormControl(data?.sampleTestDate || null),
      labResult: new FormControl(data?.labResult || null),
    });
  }

  addLabSample(): void {
    if (!this.labSamples) {
      return;
    }

    this.labSamples.push(this.createLabSampleGroup());
    this.labSamplesChanged.emit();
  }

  removeLabSample(index: number): void {
    if (!this.labSamples) {
      return;
    }

    this.labSamples.removeAt(index);
    this.labSamplesChanged.emit();
  }
}
