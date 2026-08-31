import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
@Component({
  selector: 'app-hiv',
  templateUrl: './hiv.component.html',
  styleUrls: ['./hiv.component.css']
})
export class HivComponent implements OnInit {
  hivForm: FormGroup
  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  private readonly medicalExaminationReasonFields = [
    'suspectedSymptoms',
    'injectionDrugAddict',
    'bloodDonation',
    'tuberculosisPatient',
    'affectedSpousePartner',
    'dialysis',
    'venerealDisease',
    'injuredMother',
    'travelAbroad',
    'FollowUpPregnancy',
    'voluntaryExamination',
    'otherReasons'
  ];
  private readonly exposureModeFields = [
    'sexualRelationshipWithAnotherGender',
    'commercialSex',
    'motherOfInjuredChild',
    'sexualRelationshipWithSpouse',
    'drugInjection',
    'undefined',
    'sameSexSexualRelationship',
    'injuredMotherExposure'
  ];

  constructor(private investigationService: InvestigationService, public generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private route: ActivatedRoute, private Router: Router,
    public datePipe: DatePipe) {
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
    this.hivForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(this.currentId),
      investigationCompletePercentage: new FormControl(),

      name: new FormControl(),
      laboratoryName: new FormControl(),
      positiveCaseHistory: new FormControl(),
      dateEpidemiologicalInvestigation: new FormControl(),

      husbandName: new FormControl(),
      aidsTest: new FormControl(),
      dateIfYes: new FormControl(),
      kidsNumber: new FormControl(),
      pregnancy: new FormControl(),

      suspectedSymptoms: new FormControl(),
      injectionDrugAddict: new FormControl(),
      bloodDonation: new FormControl(),
      tuberculosisPatient: new FormControl(),
      affectedSpousePartner: new FormControl(),
      dialysis: new FormControl(),
      venerealDisease: new FormControl(),
      injuredMother: new FormControl(),
      travelAbroad: new FormControl(),
      FollowUpPregnancy: new FormControl(),
      voluntaryExamination: new FormControl(),
      otherReasons: new FormControl(),

      sexualRelationshipWithAnotherGender: new FormControl(),
      commercialSex: new FormControl(),
      motherOfInjuredChild: new FormControl(),
      sexualRelationshipWithSpouse: new FormControl(),
      drugInjection: new FormControl(),
      undefined: new FormControl(),
      sameSexSexualRelationship: new FormControl(),
      injuredMotherExposure: new FormControl(),
      motherName: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      administrationDirectorName: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });

    this.calculateCompletionPercentage();
  }
  ngOnInit() {
    if (this.currentId != null) {
      this.hivForm.controls['patientID'].setValue(this.currentId);
      this.getById();
    } else {
      this.Router.navigateByUrl("/home/investigations");
    }
  }

  getById() {

    this.investigationService.getByIdhiv(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.hivForm.patchValue(v)
        this.hivForm.controls['positiveCaseHistory'].setValue(this.datePipe.transform(this.hivForm.value.positiveCaseHistory, 'yyyy-MM-dd'));
        this.hivForm.controls['dateEpidemiologicalInvestigation'].setValue(this.datePipe.transform(this.hivForm.value.dateEpidemiologicalInvestigation, 'yyyy-MM-dd'));
        this.hivForm.controls['dateIfYes'].setValue(this.datePipe.transform(this.hivForm.value.dateIfYes, 'yyyy-MM-dd'));
        this.hivForm.controls['investigationDate'].setValue(this.datePipe.transform(this.hivForm.value.investigationDate, 'yyyy-MM-dd'));
        this.calculateCompletionPercentage();
        this.hivForm.controls['investigationCompletePercentage'].setValue(this.controlsCount);

        Object.entries(this.hivForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        this.calculateCompletionPercentage();
        this.hivForm.controls['investigationCompletePercentage'].setValue(this.controlsCount);
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
  /**
   * Calculate the percentage
   * @returns
   */

  calculateCompletionPercentage() {
    const groupedCheckboxFields = [
      ...this.medicalExaminationReasonFields,
      ...this.exposureModeFields
    ];
    const excludedFields = [
      'id',
      'patientID',
      'investigationCompletePercentage',
      'diseaseGroupId',
      'createdDate',
      ...groupedCheckboxFields
    ];

    if (!this.isAnswered(this.hivForm.get('injuredMotherExposure')?.value)) {
      excludedFields.push('motherName');
    }

    const stats = calculateCompletionStats(this.hivForm.getRawValue(), {
      excludedFields
    });

    const medicalExaminationReasonAnswered = this.isAnyAnswered(this.medicalExaminationReasonFields) ? 1 : 0;
    const exposureModeAnswered = this.isAnyAnswered(this.exposureModeFields) ? 1 : 0;

    this.allControllesCount = stats.totalFields + 2;
    this.allFilledControlsCount = stats.filledFields + medicalExaminationReasonAnswered + exposureModeAnswered;
    this.controlsCount = this.allControllesCount
      ? parseInt(((this.allFilledControlsCount / this.allControllesCount) * 100).toString())
      : 0;
  }

  calculateCompletePercentage() {
    this.calculateCompletionPercentage();
  }

  private buildSavePayload(): any {
    this.calculateCompletionPercentage();

    const payload = { ...this.hivForm.getRawValue() };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === 'null' || payload[key] === undefined) {
        payload[key] = null;
      }
    });

    payload.patientID = this.currentId;
    payload.diseaseGroupId = this.diseaseGroupID;
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)
    );

    return payload;
  }

  private isAnyAnswered(controlNames: string[]): boolean {
    return controlNames.some((controlName) => this.isAnswered(this.hivForm.get(controlName)?.value));
  }

  private isAnswered(value: any): boolean {
    if (value === true || value === 1 || value === '1' || value === 'true') {
      return true;
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      return trimmedValue !== '' && trimmedValue !== 'null' && trimmedValue !== 'false';
    }

    return false;
  }

  save() {
    const payload = this.buildSavePayload();

    if (payload.id != null) {
      this.investigationService.updateSeverehiv(payload).subscribe(
        (response: any) => {
          if (response) {
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;

            this.calculateCompletionPercentage();
            this.hivForm.controls['investigationCompletePercentage'].setValue(this.controlsCount);
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
        }
      )
    } else {
      this.investigationService.addInvestigationhiv(payload).subscribe(
        (response: any) => {
          if (response) {
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;

            this.hivForm.controls['id'].setValue(response.data.id);
            this.currentId = response.data.patientID;
            this.getById();
            this.calculateCompletionPercentage();
            this.hivForm.controls['investigationCompletePercentage'].setValue(this.controlsCount);
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
        }
      )
    }
  }
}
