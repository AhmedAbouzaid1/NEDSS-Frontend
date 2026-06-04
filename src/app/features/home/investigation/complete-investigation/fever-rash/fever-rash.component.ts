import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fever-rash',
  templateUrl: './fever-rash.component.html',
  styleUrls: ['./fever-rash.component.css'],
})
export class FeverRashComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  feverRashForm: FormGroup;
  currentId: any;
  patientName: string;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;

  constructor(
    private investigationService: InvestigationService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');
    this.feverRashForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupID: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),

      // Section 1: Medical History
      feverOnsetDate: new FormControl(),
      rashOnsetDate: new FormControl(),
      notificationDate: new FormControl(),
      reporterName: new FormControl(),
      reporterPhone: new FormControl(),
      pregnancyWeek: new FormControl(),
      planningPregnancy: new FormControl(),

      // Section 2: Clinical Examination
      rash: new FormControl(false),
      cough: new FormControl(false),
      conjunctivitis: new FormControl(false),
      lymphNodeEnlargement: new FormControl(false),
      jointPain: new FormControl(false),
      tonsillitis: new FormControl(false),
      drugIntake: new FormControl(false),
      drugName: new FormControl(),
      otherSymptoms: new FormControl(),
      hospitalized: new FormControl(),
      hospitalizedDate: new FormControl(),
      hospitalName: new FormControl(),
      initialDiagnosis: new FormControl(),
      examiningPhysician: new FormControl(),
      physicianPhone: new FormControl(),
      specialty: new FormControl(),

      // Section 3: Case Movement & Travel History
      homeVisitDate: new FormControl(),
      confirmedCasesLastMonth: new FormControl(),
      confirmedCasesContact: new FormControl(),
      feverRashCasesLastMonth: new FormControl(),
      feverRashCasesContact: new FormControl(),
      traveledToOutbreak: new FormControl(),
      traveledToOutbreakDate: new FormControl(),

      // Epidemiological Linkage
      sourceCaseName: new FormControl(),
      sourceCaseAddress: new FormControl(),
      sourceCaseCode: new FormControl(),
      sourceCaseRashDate: new FormControl(),
      sourceCaseFinalClassification: new FormControl(),

      // Vaccination Status
      mmrRoutineDoses: new FormControl(),
      mmrCampaignDoses: new FormControl(),
      mmrLastDoseDate: new FormControl(),
      mrCampaignDoses: new FormControl(),
      mrLastDoseDate: new FormControl(),
      measlesRoutineDoses: new FormControl(),
      measlesCampaignDoses: new FormControl(),
      measlesLastDoseDate: new FormControl(),

      // Coverage Data
      coverageVisitDate: new FormControl(),
      coverageUnitName: new FormControl(),
      mmr1Unit: new FormControl(),
      mmr1Admin: new FormControl(),
      mmr2Unit: new FormControl(),
      mmr2Admin: new FormControl(),
      campaign2015Unit: new FormControl(),
      campaign2015Admin: new FormControl(),
      other1Unit: new FormControl(),
      other1Admin: new FormControl(),
      other2Unit: new FormControl(),
      other2Admin: new FormControl(),
      other3Unit: new FormControl(),
      other3Admin: new FormControl(),
      lastCaseDateAdmin: new FormControl(),
      lastCaseDateDirectorate: new FormControl(),

      // Cross Governorate
      crossGovernorate: new FormControl(),
      crossAdministration: new FormControl(),
      crossUnit: new FormControl(),

      // Section 6: Laboratory Examination - First Sample
      firstSampleDate: new FormControl(),
      firstSampleDispatchDate: new FormControl(),
      firstSampleBlood: new FormControl(),
      firstSampleThroatSwab: new FormControl(),

      // Laboratory Examination - Second Sample
      secondSampleDate: new FormControl(),
      secondSampleDispatchDate: new FormControl(),
      secondSampleBlood: new FormControl(),
      secondSampleThroatSwab: new FormControl(),

      // Lab Results
      elisaResult: new FormControl(),
      elisaResultDate: new FormControl(),
      pcrResult: new FormControl(),
      pcrResultDate: new FormControl(),

      // Section 7: Case Follow-up and Final Diagnosis
      diseaseOutcome: new FormControl(),
      complications: new FormControl(),
      finalDiagnosis: new FormControl(),

      // Committee Signatures
      committeeSpecialistName: new FormControl(),
      committeeSpecialistDate: new FormControl(),

      // Final Classification
      finalClassification: new FormControl(),

      // Field Survey
      fieldSurveyGovernorate: new FormControl(),
      fieldSurveyAdministration: new FormControl(),
      fieldSurveyUnit: new FormControl(),
      fieldSurveyCaseName: new FormControl(),
      fieldSurveyCaseCode: new FormControl(),
      fieldSurveyFinalClassification: new FormControl(),
      fieldSurveyCaseAddress: new FormControl(),
      fieldSurveyChildren: new FormArray([]),
      fieldSurveySupervisorName: new FormControl(),
      fieldSurveyPhysicianName: new FormControl(),

      // Sample Submission
      caseBelongsTo: new FormControl(),
      sampleBelongingGovernorateName: new FormControl(),
      caseType: new FormControl(),
      sampleOriginalCaseCode: new FormControl(),
      sampleResponsibleCollection: new FormControl(),
      sampleResponsibleSending: new FormControl(),
      sampleBloodDateCollected: new FormControl(),
      sampleBloodDateSent: new FormControl(),
      sampleBloodFirst: new FormControl(false),
      sampleBloodSecond: new FormControl(false),
      sampleBloodRepeat: new FormControl(false),
      sampleThroatDateCollected: new FormControl(),
      sampleThroatDateSent: new FormControl(),
      sampleThroatFirst: new FormControl(false),
      sampleThroatSecond: new FormControl(false),
      sampleThroatRepeat: new FormControl(false),
      conditionCooler: new FormControl(),
      conditionCoolerNotes: new FormControl(),
      conditionIcePacks: new FormControl(),
      conditionIcePacksNotes: new FormControl(),
      conditionTubes: new FormControl(),
      conditionTubesNotes: new FormControl(),
      conditionNoLeakage: new FormControl(),
      conditionNoLeakageNotes: new FormControl(),
      conditionBloodVolume: new FormControl(),
      conditionBloodVolumeNotes: new FormControl(),
      sampleDelivererName: new FormControl(),
      sampleReceiptDate: new FormControl(),
      sampleReceiptTime: new FormControl(),
      sampleLabNumber: new FormControl(),
      sampleVirologistName: new FormControl(),
      sampleVirologistReceiptDatetime: new FormControl(),

      // Pregnant Contacts & General Contacts
      pregnantContacts: new FormArray([]),
      generalContacts: new FormArray([]),

      // Signatures
      adminOfficerName: new FormControl(),
      adminOfficerSignature: new FormControl(),
      adminOfficerDate: new FormControl(),
      directorateOfficerName: new FormControl(),
      directorateOfficerSignature: new FormControl(),
      directorateOfficerDate: new FormControl(),
      preventiveDirectorName: new FormControl(),
      preventiveDirectorSignature: new FormControl(),
      preventiveDirectorDate: new FormControl(),
    });

    this.feverRashForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());

    this.currentId = this.investigationService.currentid;
    this.feverRashForm.controls['patientID'].setValue(this.currentId);

    this.investigationService.getByIdFeverRash(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        // Convert int (1/0) from API to boolean for checkboxes
        ['rash', 'cough', 'conjunctivitis', 'lymphNodeEnlargement', 'jointPain', 'tonsillitis', 'drugIntake',
          'sampleBloodFirst', 'sampleBloodSecond', 'sampleBloodRepeat', 'sampleThroatFirst', 'sampleThroatSecond', 'sampleThroatRepeat'].forEach(field => {
          if (v[field] !== undefined) v[field] = !!v[field];
        });

        // Convert date strings from API to yyyy-MM-dd for <input type="date">
        const dateFields = [
          'feverOnsetDate', 'rashOnsetDate', 'notificationDate', 'hospitalizedDate',
          'homeVisitDate', 'traveledToOutbreakDate', 'sourceCaseRashDate',
          'mmrLastDoseDate', 'mrLastDoseDate', 'measlesLastDoseDate', 'coverageVisitDate',
          'lastCaseDateAdmin', 'lastCaseDateDirectorate',
          'firstSampleDate', 'firstSampleDispatchDate', 'secondSampleDate', 'secondSampleDispatchDate',
          'elisaResultDate', 'pcrResultDate', 'committeeSpecialistDate',
          'sampleBloodDateCollected', 'sampleBloodDateSent', 'sampleThroatDateCollected', 'sampleThroatDateSent',
          'sampleReceiptDate', 'adminOfficerDate', 'directorateOfficerDate', 'preventiveDirectorDate'
        ];
        dateFields.forEach(field => {
          if (v[field]) v[field] = this.datePipe.transform(v[field], 'yyyy-MM-dd');
        });

        this.feverRashForm.patchValue(v);

        // Deserialize field survey children from JSON
        if (v.fieldSurveyChildrenJson) {
          try {
            const children = JSON.parse(v.fieldSurveyChildrenJson);
            children.forEach((child: any) => {
              this.fieldSurveyChildren.push(new FormGroup({
                childName: new FormControl(child.childName),
                dob: new FormControl(child.dob ? this.datePipe.transform(child.dob, 'yyyy-MM-dd') : null),
                mmr1: new FormControl(!!child.mmr1),
                mmr2: new FormControl(!!child.mmr2),
              }));
            });
          } catch (e) { }
        }

        if (v.pregnantContactsJson) {
          try {
            const items = JSON.parse(v.pregnantContactsJson);
            items.forEach((item: any) => {
              const fmt = (d: any) => d ? this.datePipe.transform(d, 'yyyy-MM-dd') : null;
              this.pregnantContacts.push(new FormGroup({
                name: new FormControl(item.name),
                age: new FormControl(item.age),
                contactLocation: new FormControl(item.contactLocation),
                vaccinated: new FormControl(!!item.vaccinated),
                doses: new FormControl(item.doses),
                pregnancyWeeks: new FormControl(item.pregnancyWeeks),
                visit1: new FormControl(fmt(item.visit1)),
                visitWeek1: new FormControl(fmt(item.visitWeek1)),
                visitWeek2: new FormControl(fmt(item.visitWeek2)),
                visitWeek3: new FormControl(fmt(item.visitWeek3)),
                visitMonth1: new FormControl(fmt(item.visitMonth1)),
                visitMonth2: new FormControl(fmt(item.visitMonth2)),
                visitMonth3: new FormControl(fmt(item.visitMonth3)),
                sampleDate1: new FormControl(fmt(item.sampleDate1)),
                sampleDate2: new FormControl(fmt(item.sampleDate2)),
                sampleResult1: new FormControl(item.sampleResult1),
                sampleResult2: new FormControl(item.sampleResult2),
                symptomAppearanceDate: new FormControl(fmt(item.symptomAppearanceDate)),
                expectedDeliveryDate: new FormControl(fmt(item.expectedDeliveryDate)),
                newbornFollowup: new FormControl(item.newbornFollowup),
              }));
            });
          } catch (e) { }
        }

        if (v.generalContactsJson) {
          try {
            const items = JSON.parse(v.generalContactsJson);
            items.forEach((item: any) => {
              const fmtD = (d: any) => d ? this.datePipe.transform(d, 'yyyy-MM-dd') : null;
              this.generalContacts.push(new FormGroup({
                name: new FormControl(item.name),
                age: new FormControl(item.age),
                sex: new FormControl(item.sex),
                vaccinationStatus: new FormControl(item.vaccinationStatus),
                doses: new FormControl(item.doses),
                contactLocation: new FormControl(item.contactLocation),
                visit1: new FormControl(fmtD(item.visit1)),
                visitWeek1: new FormControl(fmtD(item.visitWeek1)),
                visitWeek2: new FormControl(fmtD(item.visitWeek2)),
                visitWeek3: new FormControl(fmtD(item.visitWeek3)),
                reportingDate: new FormControl(fmtD(item.reportingDate)),
              }));
            });
          } catch (e) { }
        }

        this.calculateCompletionPercentage();
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  get fieldSurveyChildren(): FormArray {
    return this.feverRashForm.get('fieldSurveyChildren') as FormArray;
  }

  get fieldSurveyMmr1TotalCount(): number {
    return this.fieldSurveyChildren.length;
  }

  get fieldSurveyMmr1VaccinatedCount(): number {
    return this.fieldSurveyChildren.controls.filter(c => c.get('mmr1')?.value).length;
  }

  get fieldSurveyMmr2TotalCount(): number {
    return this.fieldSurveyChildren.length;
  }

  get fieldSurveyMmr2VaccinatedCount(): number {
    return this.fieldSurveyChildren.controls.filter(c => c.get('mmr2')?.value).length;
  }

  addFieldSurveyChild() {
    this.fieldSurveyChildren.push(new FormGroup({
      childName: new FormControl(),
      dob: new FormControl(),
      mmr1: new FormControl(false),
      mmr2: new FormControl(false),
    }));
  }

  removeFieldSurveyChild(index: number) {
    this.fieldSurveyChildren.removeAt(index);
  }

  get pregnantContacts(): FormArray {
    return this.feverRashForm.get('pregnantContacts') as FormArray;
  }

  addPregnantContact() {
    this.pregnantContacts.push(new FormGroup({
      name: new FormControl(),
      age: new FormControl(),
      contactLocation: new FormControl(),
      vaccinated: new FormControl(false),
      doses: new FormControl(),
      pregnancyWeeks: new FormControl(),
      visit1: new FormControl(),
      visitWeek1: new FormControl(),
      visitWeek2: new FormControl(),
      visitWeek3: new FormControl(),
      visitMonth1: new FormControl(),
      visitMonth2: new FormControl(),
      visitMonth3: new FormControl(),
      sampleDate1: new FormControl(),
      sampleDate2: new FormControl(),
      sampleResult1: new FormControl(),
      sampleResult2: new FormControl(),
      symptomAppearanceDate: new FormControl(),
      expectedDeliveryDate: new FormControl(),
      newbornFollowup: new FormControl(),
    }));
  }

  removePregnantContact(index: number) {
    this.pregnantContacts.removeAt(index);
  }

  get generalContacts(): FormArray {
    return this.feverRashForm.get('generalContacts') as FormArray;
  }

  addGeneralContact() {
    this.generalContacts.push(new FormGroup({
      name: new FormControl(),
      age: new FormControl(),
      sex: new FormControl(),
      vaccinationStatus: new FormControl(),
      doses: new FormControl(),
      contactLocation: new FormControl(),
      visit1: new FormControl(),
      visitWeek1: new FormControl(),
      visitWeek2: new FormControl(),
      visitWeek3: new FormControl(),
      reportingDate: new FormControl(),
    }));
  }

  removeGeneralContact(index: number) {
    this.generalContacts.removeAt(index);
  }

  save() {
    Object.entries(this.feverRashForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    });
    this.feverRashForm.controls['diseaseGroupID'].setValue(
      this.investigationService.diseaseGroupID
    );
    this.calculateCompletionPercentage();
    this.feverRashForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const payload = {
      ...this.feverRashForm.value,
    };

    // Convert boolean checkboxes to int for API
    const checkboxFields = ['rash', 'cough', 'conjunctivitis', 'lymphNodeEnlargement', 'jointPain', 'tonsillitis', 'drugIntake',
      'sampleBloodFirst', 'sampleBloodSecond', 'sampleBloodRepeat', 'sampleThroatFirst', 'sampleThroatSecond', 'sampleThroatRepeat'];
    checkboxFields.forEach(field => {
      payload[field] = payload[field] ? 1 : 0;
    });

    // Serialize FormArrays to JSON
    payload.fieldSurveyChildrenJson = JSON.stringify(payload.fieldSurveyChildren || []);
    delete payload.fieldSurveyChildren;
    payload.pregnantContactsJson = JSON.stringify(payload.pregnantContacts || []);
    delete payload.pregnantContacts;
    payload.generalContactsJson = JSON.stringify(payload.generalContacts || []);
    delete payload.generalContacts;

    if (payload.id != null) {
      this.investigationService.updateFeverRash(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
    } else {
      this.investigationService.addInvestigationFeverRash(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
    }
  }

  calculateCompletionPercentage(): void {
    this.allFilledControlsCount = 0;
    const data = this.feverRashForm?.value ?? {};
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupID', 'createdDate', 'fieldSurveyChildren', 'pregnantContacts', 'generalContacts'];

    const baseFields = Object.keys(data).filter((key) =>
      !excludedFields.includes(key));
    let totalFields = baseFields.length;
    let filled = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (value !== null && value !== '' && value !== 'null' && value !== false) {
        return acc + 1;
      }
      return acc;
    }, 0);

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filled;
  }
}
