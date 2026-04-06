import { Component, EventEmitter, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-patient-visit-history',
    templateUrl: './patient-visit-history.component.html',
    styleUrls: ['./patient-visit-history.component.css']
})
export class PatientVisitHistoryComponent implements OnChanges, OnDestroy {
    @Input() visits: FormArray;
    @Output() visitsChanged = new EventEmitter<void>();
    private visitsSub?: Subscription;

    ngOnDestroy(): void {
        this.visitsSub?.unsubscribe();
    }

    get visitControls(): FormGroup[] {
        return this.visits?.controls as FormGroup[];
    }

    createVisitGroup(data?: any): FormGroup {
        return new FormGroup({
            id: new FormControl(data?.id || null),
            nameHealthFacility: new FormControl(data?.nameHealthFacility || null),
            healthFacilityBelongs: new FormControl(data?.healthFacilityBelongs || null),
            dateVisit: new FormControl(data?.dateVisit || null),
            initialDiagnosis: new FormControl(data?.initialDiagnosis || null),
            admissionHospital: new FormControl(data?.admissionHospital || null),
            dateEntry: new FormControl(data?.dateEntry || null),
            exitDate: new FormControl(data?.exitDate || null)
        });
    }

    addVisit(): void {
        if (this.visits) {
            this.visits.push(this.createVisitGroup());
            this.visitsChanged.emit();
        }
    }

    removeVisit(index: number): void {
        if (this.visits) {
            this.visits.removeAt(index);
            this.visitsChanged.emit();
        }
    }

    ngOnChanges(): void {
        this.visitsSub?.unsubscribe();
        if (this.visits) {
            this.visitsSub = this.visits.valueChanges.subscribe(() => {
                this.visitsChanged.emit();
            });
        }
    }
}
