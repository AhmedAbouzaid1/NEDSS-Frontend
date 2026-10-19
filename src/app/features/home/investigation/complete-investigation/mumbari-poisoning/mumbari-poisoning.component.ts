import { Component, OnInit } from '@angular/core';
import { AnswerOptions } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import {
  MumbariContactFollowUp,
  MumbariFollowUpVisit,
  clearSymptomsIfNone,
  hasAnySymptom,
  newMumbariContactFollowUp,
  parseMumbariContactFollowUps,
  serializeMumbariContactFollowUps,
} from './mumbari-contact-follow-up';

@Component({
  selector: 'app-mumbari-poisoning',
  host: { class: 'investigation-form' },
  templateUrl: './mumbari-poisoning.component.html',
  styleUrls: ['./mumbari-poisoning.component.css']
})
export class MumbariPoisoningComponent implements OnInit {

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;

  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) { 
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
    }
  mumbariPoisoningData = {
    patientID: null,
    id: null,
    numberDirectContacts: null,
    contactFollowUpsJson: null as string | null,

    patientEatCanned: null,
    foodType: null,
    patientEatsaltedFish: null,
    manufacturingSource: null,
    addressShop: null,
    honeyForInfants: null,
    rawMeat: null,
    bodyWounds: null,
    bodyBurns: null,
    areOtherCasesInfectedFamily: null,
    numberInfectedMembers: null,
    infectedMember1: null,
    confinedHospital: null,
    numberCasesBooked: null,
    patientDoseAntiBotulismSerum: null,
    numberBottlesDosages: null,

    history1: null,
    history2: null,
    history3: null,
    intensiveCareReservation: null,
    intensiveCareReservationDate: null,
    therapeuticInjectionPlace: null,
    productOperationalNumber: null,
    therapeuticInjectionDate: null,
    therapeuticDosesCount: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage:null
  }

  patientEatCanneds = AnswerOptions;
  patientEatsaltedFishs = AnswerOptions;
  areOtherCasesInfectedFamilys = AnswerOptions;
  confinedHospitals = AnswerOptions;
  patientDoseAntiBotulismSerums = AnswerOptions;
  contactFollowUps: MumbariContactFollowUp[] = [];
  currentId: any;

  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.mumbariPoisoningData.patientID = this.currentId;
    this.investigationService.getByIdmumbariPoisoning(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.mumbariPoisoningData = v;
          this.contactFollowUps = parseMumbariContactFollowUps(v.contactFollowUpsJson);

          //history1
          this.mumbariPoisoningData.history1 = this.datePipe.transform(this.mumbariPoisoningData.history1, 'yyyy-MM-dd');
          this.mumbariPoisoningData.history2 = this.datePipe.transform(this.mumbariPoisoningData.history2, 'yyyy-MM-dd');
          this.mumbariPoisoningData.history3 = this.datePipe.transform(this.mumbariPoisoningData.history3, 'yyyy-MM-dd');
          this.calculateCompletionPercentage();
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
    this.normalizeNullLikeValues();
    this.mumbariPoisoningData.contactFollowUpsJson = serializeMumbariContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
    this.mumbariPoisoningData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.mumbariPoisoningData.investigationCompletePercentage= parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    if (this.mumbariPoisoningData != null && this.mumbariPoisoningData.id != null) {
      this.investigationService.updateSeveremumbariPoisoning(this.mumbariPoisoningData).subscribe(
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
        }
      )
    } else {
      this.investigationService.addInvestigationmumbariPoisoning(this.mumbariPoisoningData).subscribe(
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
        }
      )
    }
  }

  addContactFollowUp(): void {
    this.contactFollowUps.push(newMumbariContactFollowUp());
    this.syncContactFollowUps();
  }

  removeContactFollowUp(index: number): void {
    this.contactFollowUps.splice(index, 1);
    this.syncContactFollowUps();
  }

  onHasSymptomsChanged(visit: MumbariFollowUpVisit): void {
    clearSymptomsIfNone(visit);
    this.syncContactFollowUps();
  }

  hasAnySymptom(visit: MumbariFollowUpVisit): boolean {
    return hasAnySymptom(visit);
  }

  syncContactFollowUps(): void {
    this.mumbariPoisoningData.contactFollowUpsJson = serializeMumbariContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
  }

  private normalizeNullLikeValues(): void {
    Object.keys(this.mumbariPoisoningData).forEach((key) => {
      const value = this.mumbariPoisoningData[key];
      if (value === 'null' || value === 'undefined' || value === '') {
        this.mumbariPoisoningData[key] = null;
      }
    });
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.mumbariPoisoningData;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}
