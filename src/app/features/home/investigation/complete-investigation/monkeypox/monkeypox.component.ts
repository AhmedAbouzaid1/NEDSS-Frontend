import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { InvestigationService } from '../../services/investigation.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-monkeypox',
  templateUrl: './monkeypox.component.html',
  styleUrls: ['./monkeypox.component.css']
})
export class MonkeypoxComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  monkeypoxForm: FormGroup;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  governorates: any[] = [];
  countries: any[] = [];
  patientName: string;
  currentId: any;
  diseaseGroupID: any;
  private readonly allowedSymptomChecklistKeys = [
    'symptom_fatigue_nausea',
    'symptom_itchy_lesions',
    'symptom_lymph_node_swelling_armpit',
    'symptom_conjunctivitis',
    'symptom_pharyngitis',
    'symptom_headache',
    'symptom_mouth_ulcers',
    'symptom_fatigue',
    'symptom_chills_sweating',
    'symptom_cough',
    'symptom_muscle_pain',
    'symptom_sensitivity'
  ];

  private readonly dateControlNames: string[] = [
    'symptomsOnsetDate',
    'skinRashOnsetDate',
    'feverOnsetDate',
    'contactDate',
    'deadAnimalContactDate',
    'travelDate',
    'returnDate',
    'sampleCollectionDate',
    'admissionDate',
    'dischargeDate',
    'deathDate',
    'deathDateConfirmed'
  ];

  constructor(private investigationService: InvestigationService, private translateService: TranslateService,
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private route: ActivatedRoute, private Router: Router,
    private datePipe: DatePipe
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id');
    this.diseaseGroupID = this.route.snapshot.paramMap.get('diseaseId');
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
    this.monkeypoxForm = new FormGroup({
      investigationCompletePercentage: new FormControl(),
      illnessGovernorateArea: new FormControl(),
      comingFromAbroadCountry: new FormControl(),
      symptomsOnsetDate: new FormControl(),
      hasSkinRash: new FormControl(),
      skinRashOnsetDate: new FormControl(),
      skinRashType: new FormControl(),
      hasFever: new FormControl(),
      feverOnsetDate: new FormControl(),
      rashStillPresentVariousForms: new FormControl(),
      lesionsSameSize: new FormControl(),
      lesionsDeepAndMany: new FormControl(),
      rashOnPalmsAndSoles: new FormControl(),
      rashOtherAreas: new FormControl(),
      eyeUlcer: new FormControl(),
      lymphNodeSwelling: new FormControl(),
      swellingOtherLocation: new FormControl(),
      symptomChecklist: new FormControl([]),
      symptomBedridden: new FormControl(),
      hivStatus: new FormControl(),
      pregnancyStatus: new FormControl(),
      otherMedicalConditions: new FormControl(),
      hasSmallpoxVaccineScar: new FormControl(),
      preliminaryDiagnosis: new FormControl(),
      preliminaryDiagnosisOther: new FormControl(),
      contactWithSymptomaticPerson: new FormControl(),
      contactPersonName: new FormControl(),
      contactRelationship: new FormControl(),
      contactDate: new FormControl(),
      touchedPatientBodyOrBelongings: new FormControl(),
      animalContact: new FormControl(),
      animalType: new FormControl(),
      animalAppearedNormal: new FormControl(),
      animalSkinRashOrUlcers: new FormControl(),
      touchedDeadAnimal: new FormControl(),
      deadAnimalType: new FormControl(),
      deadAnimalContactDate: new FormControl(),
      contactType: new FormControl(''),
      liveSnakeAtHome: new FormControl(),
      deadAnimalInForest: new FormControl(),
      wildAnimalInArea: new FormControl(),
      otherAnimalExposure: new FormControl(),
      purchasedAnimalsForSlaughter: new FormControl(),
      slaughterLocation: new FormControl(),
      animalTypePurchased: new FormControl(),
      traveledAbroad3weeks: new FormControl(),
      travelDestinationCountry: new FormControl(),
      travelDate: new FormControl(),
      returnDate: new FormControl(),
      traveledDomesticallyDuringIllness: new FormControl(),
      domesticTravelLocations: new FormArray([new FormControl('')]),
      traveledDuringIllness: new FormControl(),
      duringIllnessTravelLocations: new FormArray([new FormControl('')]),
      sampleCollected: new FormControl(),
      sampleCollectionDate: new FormControl(),
      sampleType: new FormControl([]),
      healthFacilityName: new FormControl(),
      patientAdmitted: new FormControl(),
      hospitalType: new FormControl(),
      admittedToWard: new FormControl(),
      wardHospitalName: new FormControl(),
      admissionDate: new FormControl(),
      dischargeDate: new FormControl(),
      deathDate: new FormControl(),
      patientStatus: new FormControl(),
      deathDateConfirmed: new FormControl(),
      deathPlace: new FormControl(),
      burialPlaceVillage: new FormControl(),
      burialPlaceCity: new FormControl(),
      burialPlaceGovernorate: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID)
    });
  }


  ngOnInit() {
    this.loadGovernorates();
    this.loadCountries();
    if (this.currentId != null) {
      this.monkeypoxForm.controls['patientID'].setValue(this.currentId);
      this.getById();
      this.calculateCompletionPercentage();
    } else {
      this.Router.navigateByUrl("/home/investigations");
    }
  }


  getById() {
    this.investigationService.getByIdMonkeypox(this.currentId).subscribe(

      res => {
        const v = res.data as Record<string, unknown>;
        const omitKeys = new Set([
          'symptomChecklist',
          'contactType',
          'sampleType',
          'domesticTravelLocations',
          'duringIllnessTravelLocations'
        ]);
        const patch: Record<string, unknown> = Object.fromEntries(
          Object.entries(v).filter(([k]) => !omitKeys.has(k))
        );
        const rowId = v['id'] ?? v['Id'];
        if (rowId != null && rowId !== '') {
          patch['id'] = typeof rowId === 'string' ? parseInt(rowId as string, 10) : rowId;
        }
        this.monkeypoxForm.patchValue(patch as any);
        this.patchAllDateControls();

        this.monkeypoxForm.controls['symptomChecklist'].setValue(
          this.normalizeSymptomChecklist(v.symptomChecklist)
        );
        this.monkeypoxForm.controls['contactType'].setValue(this.contactTypeFromApi(v.contactType));
        this.monkeypoxForm.controls['sampleType'].setValue(this.parseJsonArray(v.sampleType));
        this.setArrayValues('domesticTravelLocations', this.parseJsonArray(v.domesticTravelLocations));
        this.setArrayValues('duringIllnessTravelLocations', this.parseJsonArray(v.duringIllnessTravelLocations));

        Object.entries(this.monkeypoxForm.controls).forEach(([_, value]) => {
          if (value.value == 'null') {
            value.setValue(null);
          }
        });
        this.calculateCompletionPercentage();
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  private loadGovernorates(): void {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      this.governorates = result?.data ?? [];
    });
  }

  private loadCountries(): void {
    this.lookupsService.getAllNationalitys().subscribe((result: any) => {
      this.countries = result?.data ?? [];
    });
  }

  get domesticTravelLocations(): FormArray {
    return this.monkeypoxForm.get('domesticTravelLocations') as FormArray;
  }

  get duringIllnessTravelLocations(): FormArray {
    return this.monkeypoxForm.get('duringIllnessTravelLocations') as FormArray;
  }

  addDomesticTravelLocation() {
    this.domesticTravelLocations.push(new FormControl(''));
  }

  removeDomesticTravelLocation(index: number) {
    if (this.domesticTravelLocations.length > 1) {
      this.domesticTravelLocations.removeAt(index);
    }
  }

  addDuringIllnessTravelLocation() {
    this.duringIllnessTravelLocations.push(new FormControl(''));
  }

  removeDuringIllnessTravelLocation(index: number) {
    if (this.duringIllnessTravelLocations.length > 1) {
      this.duringIllnessTravelLocations.removeAt(index);
    }
  }

  onMultiCheckboxChange(controlName: string, value: string, isChecked: boolean) {
    const raw = this.monkeypoxForm.get(controlName)?.value;
    const selected = [...this.coerceCheckboxArray(raw)];
    if (isChecked && !selected.includes(value)) {
      selected.push(value);
    } else if (!isChecked) {
      const idx = selected.indexOf(value);
      if (idx > -1) {
        selected.splice(idx, 1);
      }
    }
    this.monkeypoxForm.get(controlName)?.setValue(selected);
    this.calculateCompletionPercentage();
  }

  isSelected(controlName: string, value: string): boolean {
    return this.coerceCheckboxArray(this.monkeypoxForm.get(controlName)?.value).includes(value);
  }

  save() {
    Object.entries(this.monkeypoxForm.controls).forEach(([, value]) => {
      if (value.value === 'null') {
        value.setValue(null);
      }
    });
    this.monkeypoxForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.calculateCompletionPercentage();
    const pct =
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    this.monkeypoxForm.controls['investigationCompletePercentage'].setValue(pct);

    const raw = this.monkeypoxForm.value;
    const patientIdNum = raw.patientID != null && raw.patientID !== '' ? Number(raw.patientID) : raw.patientID;
    const diseaseGroupNum =
      raw.diseaseGroupId != null && raw.diseaseGroupId !== '' ? Number(raw.diseaseGroupId) : raw.diseaseGroupId;
    const idVal = raw.id != null && raw.id !== '' ? Number(raw.id) : raw.id;

    const payload = this.normalizePayloadDates({
      ...raw,
      id: idVal,
      patientID: patientIdNum,
      diseaseGroupId: diseaseGroupNum,
      symptomChecklist: JSON.stringify(this.normalizeSymptomChecklist(raw.symptomChecklist)),
      contactType: (() => {
        const t = String(raw.contactType ?? '').trim();
        return t.length > 0 ? t : null;
      })(),
      sampleType: JSON.stringify(this.coerceCheckboxArray(raw.sampleType)),
      domesticTravelLocations: JSON.stringify(
        (Array.isArray(raw.domesticTravelLocations) ? raw.domesticTravelLocations : []).filter(
          (x: string) => !!x && String(x).trim() !== ''
        )
      ),
      duringIllnessTravelLocations: JSON.stringify(
        (Array.isArray(raw.duringIllnessTravelLocations) ? raw.duringIllnessTravelLocations : []).filter(
          (x: string) => !!x && String(x).trim() !== ''
        )
      )
    } as Record<string, unknown>) as any;

    if (payload.id != null && payload.id !== '' && !Number.isNaN(Number(payload.id))) {
      this.investigationService.updateMonkeypox(payload).subscribe(
        () => {
          document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
        },
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
      return;
    }

    this.investigationService.addInvestigationMonkeypox(payload).subscribe(
      (response: any) => {
        document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
        if (response?.data?.id != null) {
          this.monkeypoxForm.controls['id'].setValue(response.data.id);
          this.getById();
        }
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.monkeypoxForm.value;
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      const value = data[key];
      const hasValue = Array.isArray(value) ? value.length > 0 : value !== null && value !== '' && value !== 'null';
      if (!excludedFields.includes(key) && hasValue) {
        this.allFilledControlsCount++;
      }
    });
  }

  private patchDate(controlName: string) {
    const ctrl = this.monkeypoxForm.get(controlName);
    if (!ctrl) {
      return;
    }
    ctrl.setValue(this.toDateInputString(ctrl.value));
  }

  private patchAllDateControls(): void {
    for (const name of this.dateControlNames) {
      this.patchDate(name);
    }
  }

  private toDateInputString(value: unknown): string | null {
    if (value == null || value === '' || value === 'null') {
      return null;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      const isoDate = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed);
      if (isoDate) {
        return isoDate[1];
      }
    }
    const d = value instanceof Date ? value : new Date(value as string | number);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return this.datePipe.transform(d, 'yyyy-MM-dd');
  }

  private normalizePayloadDates<T extends Record<string, unknown>>(payload: T): T {
    const next = { ...payload };
    for (const name of this.dateControlNames) {
      const v = next[name];
      if (v === '' || v === undefined) {
        (next as any)[name] = null;
      } else if (v != null) {
        (next as any)[name] = this.toDateInputString(v);
      }
    }
    return next;
  }

  private contactTypeFromApi(value: unknown): string {
    if (value == null || value === '' || value === 'null') {
      return '';
    }
    return String(value).trim();
  }

  private coerceCheckboxArray(value: unknown): string[] {
    return this.parseJsonArray(value);
  }

  private parseJsonArray(value: any): string[] {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private setArrayValues(controlName: string, values: string[]) {
    const formArray = this.monkeypoxForm.get(controlName) as FormArray;
    while (formArray.length > 0) {
      formArray.removeAt(0);
    }
    if (!values.length) {
      formArray.push(new FormControl(''));
      return;
    }
    values.forEach((item) => formArray.push(new FormControl(item)));
  }

  private normalizeSymptomChecklist(values: any): string[] {
    const parsed = this.parseJsonArray(values);
    const arr = Array.isArray(parsed) ? parsed : [];
    return arr.filter(
      (x): x is string => typeof x === 'string' && this.allowedSymptomChecklistKeys.includes(x)
    );
  }
}
