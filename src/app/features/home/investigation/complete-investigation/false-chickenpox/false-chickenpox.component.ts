import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AnswerOptions } from './../../../../../core/constants';

@Component({
  selector: 'app-false-chickenpox',
  templateUrl: './false-chickenpox.component.html',
  styleUrls: ['./false-chickenpox.component.css']
})
export class FalseChickenpoxComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  answerOptions = AnswerOptions;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  falseChickenpoxForm: FormGroup
  currentId: any;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public datePipe: DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  ngOnInit() {

    this.falseChickenpoxForm = new FormGroup({
      dateOnsetSymptoms: new FormControl(),
      sampleTypeSample1: new FormControl(),
      dateSampleTakenSample1: new FormControl(),
      labTestTypeSample1: new FormControl(),
      resultSample1: new FormControl(),

      sampleTypeSample2: new FormControl(),
      dateSampleTakenSample2: new FormControl(),
      labTestTypeSample2: new FormControl(),
      resultSample2: new FormControl(),
      caseDiagnosis: new FormControl(),
      dateEscelatedToHigherAuthority: new FormControl(),
      treatingPhysicianName: new FormControl(),
      presenceRash: new FormControl(),
      hasOtherSymptoms: new FormControl(),
      otherSymptomsDetails: new FormControl(),
      hasOtherComplications: new FormControl(),
      otherComplicationsDetails: new FormControl(),

      onsetRash: new FormControl(),

      contactConfirmedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactsContacted: new FormControl(),
      hasContactStudentOrEducationalStaff: new FormControl(),
      educationalFacilityName: new FormControl(),
      mandatoryLeaveDuration: new FormControl(),
      numberNonDirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),

      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
      directContactsJson: new FormControl(),
      contacts: new FormArray([]),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
    })
    this.currentId = this.investigationService.currentid
    this.falseChickenpoxForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdFalseChickenpox(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.falseChickenpoxForm.patchValue(v)

        const directContacts = this.safeParseArray(v?.directContactsJson);
        this.contacts.clear();
        if (directContacts.length > 0) {
          directContacts.forEach((contact: any) => {
            const row = this.createContactRow();
            row.patchValue({
              ...contact,
              symptomsDate: this.datePipe.transform(contact?.symptomsDate, 'yyyy-MM-dd'),
            });
            this.contacts.push(row);
          });
          this.reSequenceContacts();
        } else {
          this.addContact();
        }

        this.falseChickenpoxForm.controls['dateOnsetSymptoms'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateOnsetSymptoms, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.controls['dateSampleTakenSample1'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenSample1, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.controls['dateSampleTakenSample2'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenSample2, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.controls['dateEscelatedToHigherAuthority'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateEscelatedToHigherAuthority, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.controls['onsetRash'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.onsetRash, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.controls['investigationDate'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.investigationDate, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ epidemicOutbreak: this.falseChickenpoxForm.value.epidemicOutbreak + "", tc: true });
        this.falseChickenpoxForm.patchValue({ contactConfirmedCase: this.falseChickenpoxForm.value.contactConfirmedCase + "", tc: true });
        this.falseChickenpoxForm.patchValue({ contactsContacted: this.falseChickenpoxForm.value.contactsContacted + "", tc: true });
        this.falseChickenpoxForm.patchValue({ hasContactStudentOrEducationalStaff: this.falseChickenpoxForm.value.hasContactStudentOrEducationalStaff + "", tc: true });

        this.calculateCompletionPercentage();
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    )




  }

  get contacts(): FormArray {
    return this.falseChickenpoxForm.get('contacts') as FormArray;
  }

  createContactRow(): FormGroup {
    return new FormGroup({
      contactSeq: new FormControl(this.contacts.length + 1),
      contactName: new FormControl(),
      contactAge: new FormControl(),
      hasSymptoms: new FormControl(),
      symptomsDate: new FormControl(),
    });
  }

  addContact(): void {
    this.contacts.push(this.createContactRow());
    this.reSequenceContacts();
    this.calculateCompletionPercentage();
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index);
    this.reSequenceContacts();
    this.calculateCompletionPercentage();
  }

  private reSequenceContacts(): void {
    this.contacts.controls.forEach((control, i) => {
      control.get('contactSeq')?.setValue(i + 1, { emitEvent: false });
    });
  }

  private safeParseArray(value: any): any[] {
    if (!value || typeof value !== 'string') {
      return [];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  save() {
    Object.entries(this.falseChickenpoxForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.falseChickenpoxForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.falseChickenpoxForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));

    //console.log(this.rabiesForm.value);
    const payload = { ...this.falseChickenpoxForm.value };
    payload.directContactsJson = JSON.stringify(payload.contacts ?? []);
    delete payload.contacts;

    if (payload.id != null) {
      this.investigationService.updateFalseChickenpox(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    } else {
      this.investigationService.addInvestigationFalseChickenpox(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    }
  }


  calculateCompletionPercentage() {
    // 'contacts' (قائمة المخالطين) is walked recursively below so each contact row's fields
    // count toward the total/filled tallies, and the count grows as rows are added/removed.
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', 'directContactsJson'];
    const value = this.falseChickenpoxForm.value;
    let total = 0;
    let filled = 0;

    const count = (v: any): void => {
      if (Array.isArray(v)) {
        v.forEach((x) => count(x));
        return;
      }
      if (v !== null && typeof v === 'object') {
        Object.keys(v).forEach((k) => {
          if (!excludedFields.includes(k)) {
            total++;
            const fieldValue = v[k];
            const hasValue = Array.isArray(fieldValue)
              ? fieldValue.length > 0
              : fieldValue !== null && fieldValue !== '';
            if (hasValue) {
              filled++;
            }
            if (typeof fieldValue === 'object' && fieldValue !== null) {
              total--;
              if (hasValue) {
                filled--;
              }
              count(fieldValue);
            }
          }
        });
      }
    };

    count(value);
    this.allControllesCount = total;
    this.allFilledControlsCount = filled;
  }
}
