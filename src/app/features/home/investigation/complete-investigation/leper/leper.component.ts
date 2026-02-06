import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnswerOptions, contactsBeenDosed, typeLeprosy } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-leper',
  templateUrl: './leper.component.html',
  styleUrls: ['./leper.component.css']
})
export class LeperComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {

  }

  leperData = {
    diseaseGroupId: this.investigationService.diseaseGroupID,
    patientID: null,
    id: null,
    fever: 0,
    feverDurationDay: 0,
    maxTemperature: 0,
    skinLesion: null,
    typeInjury: null,
    patchesSkin: null,
    leatherNecklace: null,
    leak: 0,
    nerveEnlargement: null,
    lossFeeling: null,
    muscleWeakness: null,
    typeLeprosy: null,
    patientCoexistingLongTime: null,
    relationshipWithPatient: null,
    closeContactMedicalCondition: null,
    isTreatmentCompleted: null,
    infectedWithDisease: null,
    dateInjury: null,
    numberContacts: 0,
    contactsBeenDosed: 1,
    dateDoseContacts: null,
    vaccinatedBcgVaccine: null,
  }

  skinLesions = AnswerOptions;
  patchesSkins = AnswerOptions;
  leatherNecklaces = AnswerOptions;
  leaks = AnswerOptions;
  typeLeprosys = typeLeprosy;
  nerveEnlargements = AnswerOptions;
  lossFeelings = AnswerOptions;
  muscleWeaknesss = AnswerOptions;
  patientCoexistingLongTimes = AnswerOptions;
  closeContactMedicalConditions = AnswerOptions;
  isTreatmentCompleteds = AnswerOptions;
  infectedWithDiseases = AnswerOptions;
  vaccinatedBcgVaccines = AnswerOptions;
  contactsBeenDoseds = contactsBeenDosed;
  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.leperData.patientID = this.currentId
    this.investigationService.getByIdleper(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.leperData = v
          this.leperData.dateDoseContacts = this.datePipe.transform(this.leperData.dateDoseContacts, 'yyyy-MM-dd');
          this.leperData.dateInjury = this.datePipe.transform(this.leperData.dateInjury, 'yyyy-MM-dd');
          
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
  save() {
    //console.log(this.rabiesForm.value);

    this.leperData.diseaseGroupId = this.investigationService.diseaseGroupID
    if (this.leperData != null && this.leperData.id != null) {
      this.investigationService.updateSevereleper(this.leperData).subscribe(
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
      this.investigationService.addInvestigationleper(this.leperData).subscribe(
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

}
