import { Component, OnInit } from '@angular/core';
import { contactType, distanceWaterSourcesSewage } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  DiarrheaContactFollowUp,
  DiarrheaFollowUpVisit,
  clearDiarrheaIfNoSymptoms,
  newDiarrheaContactFollowUp,
  parseDiarrheaContactFollowUps,
  serializeDiarrheaContactFollowUps,
} from './diarrhea-contact-follow-up';

@Component({
  selector: 'app-diarrhea',
  host: { class: 'investigation-form' },
  templateUrl: './diarrhea.component.html',
  styleUrls: ['./diarrhea.component.css'],
})
export class DiarrheaComponent implements OnInit {
  private readonly summaryExcludedFields = [
    'id',
    'patientID',
    'investigationCompletePercentage',
    'diseaseGroupId',
    'createdDate',
    'contactDeceasedPersonRespiratory',
  ];
  private readonly dateFields = [
    'dateHealthCertificate',
    'investigationDate',
  ];

  currentLang =
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? (localStorage.getItem('ls.currentLang') ?? 'ar')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string = '';

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    this.patientName = this.getPatientName();
  }

  diarrheaData = {
    diseaseGroupId: this.investigationService.diseaseGroupID,
    patientID: null,
    id: null,
    contactSuspectedCase: null,
    epidemicOutbreak: null,
    contactConfirmedCase: null,
    contactDeceasedPersonRespiratory: null,
    numberDirectContacts: null,
    numberNonDirectContacts: null,
    contactFollowUpsJson: null as string | null,

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
    uncookedFruitsVegetables: null,
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
    samplesAnalysisPatienhome: null,
    entamoebaHistolytica: null,
    shigellaSpecies: null,
    campylobacter: null,
    salmonellaSpecies: null,
    pathogenicColi: null,
    salmonellaTyphi: null,
    vibrioCholera: null,
    other: null,
    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    canal: null,
    storedWater: null,
    sampledSewerSystemTaken: null,
    sampleResult: null,
    investigationDate: null,
    administrationDirectorName: null,
    healthObserverName: null,
    surveillanceOfficerName: null,
    investigationCompletePercentage: null,
  };

  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  contactTypes = contactType;
  contactFollowUps: DiarrheaContactFollowUp[] = [];
  currentId: number | null = null;

  ngOnInit(): void {
    this.calculateCompletionPercentage();
    this.currentId = this.resolveCurrentId();
    this.diarrheaData.patientID = this.currentId;
    this.diarrheaData.diseaseGroupId = this.resolveDiseaseGroupId();
    this.investigationService.getByIdDiarrhea(this.currentId).subscribe(
      (res) => {
        const v = res.data;
        if (v != null) {
          this.diarrheaData = { ...this.diarrheaData, ...v };
          this.normalizeDateFields();
          this.contactFollowUps = parseDiarrheaContactFollowUps(v.contactFollowUpsJson);
        }

        this.calculateCompletionPercentage();
      },
      () => {
        this.calculateCompletionPercentage();
        this.showMessage('NEDSS.COMMON.SENT_FAILD', 'error');
      },
    );
  }

  save() {
    this.currentId = this.resolveCurrentId();
    this.diarrheaData.patientID = this.currentId;
    this.diarrheaData.diseaseGroupId = this.resolveDiseaseGroupId();

    if (this.diarrheaData.patientID == null) {
      this.showMessage('NEDSS.COMMON.SENT_FAILD', 'error');
      return;
    }

    this.diarrheaData.contactFollowUpsJson = serializeDiarrheaContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
    this.diarrheaData.investigationCompletePercentage =
      this.getCompletionPercentage();

    const request =
      this.diarrheaData.id != null
        ? this.investigationService.updateSevereDiarrhea(
            this.diarrheaData,
          )
        : this.investigationService.addInvestigationDiarrhea(
            this.diarrheaData,
          );

    request.subscribe(
      (response: any) => {
        if (response) {
          this.showMessage('NEDSS.COMMON.SENT_SUCESSFULLY', 'success');
        }
      },
      () => { },
    );
  }

  addContactFollowUp(): void {
    this.contactFollowUps.push(newDiarrheaContactFollowUp());
    this.syncContactFollowUps();
  }

  removeContactFollowUp(index: number): void {
    this.contactFollowUps.splice(index, 1);
    this.syncContactFollowUps();
  }

  onHasSymptomsChanged(visit: DiarrheaFollowUpVisit): void {
    clearDiarrheaIfNoSymptoms(visit);
    this.syncContactFollowUps();
  }

  syncContactFollowUps(): void {
    this.diarrheaData.contactFollowUpsJson = serializeDiarrheaContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
  }

  calculateCompletionPercentage() {
    const data = this.diarrheaData as Record<string, any>;
    const trackedFields = Object.keys(data).filter(
      (key) => !this.summaryExcludedFields.includes(key),
    );

    this.allControllesCount = trackedFields.length;
    this.allFilledControlsCount = trackedFields.filter((key) =>
      this.hasValue(data[key]),
    ).length;
  }

  private normalizeDateFields(): void {
    const data = this.diarrheaData as Record<string, any>;

    this.dateFields.forEach((field) => {
      data[field] = this.datePipe.transform(data[field], 'yyyy-MM-dd');
    });
  }

  private getCompletionPercentage(): number {
    if (this.allControllesCount === 0) {
      return 0;
    }

    return parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(
        2,
      ),
    );
  }

  private hasValue(value: any): boolean {
    return value !== null && value !== '' && value !== 'null';
  }

  private getPatientName(): string {
    const patient = this.investigationService.patient;

    if (patient?.firstName == null) {
      return '';
    }

    return [patient.firstName, patient.secondName, patient.thirdName]
      .filter((name) => name != null && name !== '')
      .join(' ');
  }

  private resolveCurrentId(): number | null {
    const currentId = this.normalizeNumericValue(
      this.investigationService.currentid,
    );
    if (currentId != null) {
      return currentId;
    }

    const routeId = this.normalizeNumericValue(this.route.snapshot.paramMap.get('id'));
    if (routeId != null) {
      this.investigationService.currentid = routeId;
    }

    return routeId;
  }

  private resolveDiseaseGroupId(): number | null {
    const diseaseGroupId = this.normalizeNumericValue(
      this.investigationService.diseaseGroupID,
    );
    if (diseaseGroupId != null) {
      return diseaseGroupId;
    }

    const routeDiseaseGroupId = this.normalizeNumericValue(
      this.route.snapshot.paramMap.get('diseaseId'),
    );
    if (routeDiseaseGroupId != null) {
      this.investigationService.diseaseGroupID = routeDiseaseGroupId;
    }

    return routeDiseaseGroupId;
  }

  private normalizeNumericValue(value: any): number | null {
    if (value == null || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }

  private showMessage(messageKey: string, type: 'success' | 'error'): void {
    this.translateService.get(messageKey).subscribe((res: string) => {
      this.userMsg[type](res);
    });
  }
}

