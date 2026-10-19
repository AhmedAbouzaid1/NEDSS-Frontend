import { Component, OnInit } from '@angular/core';
import { contactType, distanceWaterSourcesSewage } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import {
  TyphoidContactFollowUp,
  TyphoidFollowUpVisit,
  clearTyphoidSymptomsIfNone,
  hasAnyTyphoidSymptom,
  newTyphoidContactFollowUp,
  parseTyphoidContactFollowUps,
  serializeTyphoidContactFollowUps,
} from './typhoid-contact-follow-up';
@Component({
  selector: 'app-typhoid',
  host: { class: 'investigation-form' },
  templateUrl: './typhoid.component.html',
  styleUrls: ['./typhoid.component.css'],
})

export class TyphoidComponent implements OnInit {
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = [
        this.investigationService.patient.firstName,
        this.investigationService.patient.secondName,
        this.investigationService.patient.thirdName,
      ]
        .filter((name) => name != null && name !== '')
        .join(' ');
    }
  }

  typhoidData = {
    patientID: null,
    id: null,
    contactSuspectedCase: null,
    epidemicOutbreak: null,
    contactConfirmedCase: null,
    contactDeceasedPersonRespiratory: null,
    numberNonDirectContacts: null,
    numberDirectContacts: null,
    contactFollowUpsJson: null as string | null,

    crab: null,
    crabSource: null,
    marineCrustaceans: null,
    marineCrustaceansSource: null,
    otherSeafood: null,
    otherSeafoodSource: null,
    milk: null,
    milkSource: null,
    cheese: null,
    cheeseSource: null,
    otherCheese: null,
    otherCheeseSource: null,
    iceCream: null,
    iceCreamSource: null,
    otherDairyProducts: null,
    otherDairyProductsSource: null,
    UncookedFruitsVegetables: null,
    uncookedFruitsVegetablesSource: null,
    rawEggs: null,
    rawEggsSource: null,
    foodsNotHome: null,
    foodsNotHomeType: null,
    foodsNotHomeSource: null,
    otherFoods: null,
    otherFoodsSource: null,
    isFoodHandler: null,
    isFoodHandlerJob: null,
    isHealthCertificate: null,
    dateHealthCertificate: null,

    waterSourceHouse: null,
    otherWaterSource: null,
    isWaterStored: null,
    tankType: null,
    sewageSystemHome: null,
    distanceWaterSourcesSewage: null,
    maintenanceSewerSystem: null,
    breakPipesDrinkingWater: null,
    overflowSewerSystem: null,
    changeTasteColorSmellwater: null,
    reportsContaminationWater: null,

    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    waterSampleResult: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    samplesAnalysisPatienhome1: null,
    investigationCompletePercentage: null,
  };

  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  contactTypes = contactType;
  contactFollowUps: TyphoidContactFollowUp[] = [];

  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid;
    this.typhoidData.patientID = this.currentId;
    this.investigationService.getByIdtyphoid(this.currentId).subscribe(
      (res) => {
        const data = res.data;

        if (data != null) {
          this.typhoidData = data;
          this.contactFollowUps = parseTyphoidContactFollowUps(data.contactFollowUpsJson);
          this.typhoidData.dateHealthCertificate = this.datePipe.transform(
            this.typhoidData.dateHealthCertificate,
            TyphoidComponent.DATE_FORMAT
          );
          this.calculateCompletionPercentage();
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

  save() {
    this.typhoidData.contactFollowUpsJson = serializeTyphoidContactFollowUps(this.contactFollowUps);
    this.typhoidData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.calculateCompletionPercentage();
    this.typhoidData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));

    if (this.typhoidData.id != null) {
      this.investigationService.updatetyphoid(this.typhoidData).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => { }
      );
    } else {
      this.investigationService
        .addInvestigationtyphoid(this.typhoidData)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => { }
        );
    }
  }

  addContactFollowUp(): void {
    this.contactFollowUps.push(newTyphoidContactFollowUp());
    this.syncContactFollowUps();
  }

  removeContactFollowUp(index: number): void {
    this.contactFollowUps.splice(index, 1);
    this.syncContactFollowUps();
  }

  onHasSymptomsChanged(visit: TyphoidFollowUpVisit): void {
    clearTyphoidSymptomsIfNone(visit);
    this.syncContactFollowUps();
  }

  hasAnySymptom(visit: TyphoidFollowUpVisit): boolean {
    return hasAnyTyphoidSymptom(visit);
  }

  syncContactFollowUps(): void {
    this.typhoidData.contactFollowUpsJson = serializeTyphoidContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.typhoidData;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', 'contactDeceasedPersonRespiratory'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}
