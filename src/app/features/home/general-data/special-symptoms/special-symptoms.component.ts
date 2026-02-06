import { Component, OnInit } from '@angular/core';
import { PatientModel } from '../models/patient-model';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../services/general-data.service';
import { SharedDataService } from '../services/shared-data.service';
import { DiseaseSpecialSymptomsService } from '../../dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientDiseseAnswerService } from '../../dashboard/components/disease-special-symptoms/services/patient-disease-answer.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-special-symptoms',
  templateUrl: './special-symptoms.component.html',
  styleUrls: ['./special-symptoms.component.css'],
})
export class SpecialSymptomsComponent implements OnInit {
  update: number = 0;
  patient: PatientModel = new PatientModel();
  Fields: any = [];
  isEdit: boolean = false;

  answerDefault: any = {};

  constructor(
    private generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private sharedDataService: SharedDataService,
    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private patientDiseseAnswerService: PatientDiseseAnswerService
  ) {
    //this.routeDataConfig();
  }

  routeDataConfig() {
    this.routerActive.data.subscribe(
      (res: any) => {
        this.Fields = res.data.fields;
        if (this.Fields.length <= 0) {
          this.userMsg.error('من فضلك أذهب لأضافه الأعراض الخاصه لذلك المرض ');
          this.router.navigateByUrl('/home/general-data/diagonistic-info');
        }

        if (res.data.id > 0) this.isEdit = true;
        this.answerDefault = res.data.questionAnswers;
      },
      (err) => {
        this.translateService.get(' ').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      () => {
        this.update++;
      }
    );
  }
  ngOnInit() {
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
      this.Fields = this.patient.fields

    });
    if (this.patient.id > 0) this.isEdit = true;
  }

  OnValidForm(model: any[]) {
    this.patient.patientDiseaseGroupQuestionAnswers = model;
    // this.patient.questionAnswers = this.getModelSend(model);
  }
  getModelSend(model: any) {
    let modelArr: any = [];
    model.forEach((element: any) => {
      let item = this.Fields.filter(
        (a: any) => a.fieldName === element.fieldName
      )[0];
      modelArr.push({
        questionId: item.id,
        questionAnswer: element.fieldValue,
      });
    });

    return modelArr;
  }
}
