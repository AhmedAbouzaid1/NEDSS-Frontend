import { Component, OnInit } from '@angular/core';
import { AnswerOptions, contactType, distanceWaterSourcesSewage } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
interface CholeraFollowUpDay {
  hasSymptoms: number | null;
  diarrhea: boolean;
  vomiting: boolean;
}

interface CholeraContactFollowUp {
  name: string | null;
  age: number | null;
  ageUnit: number;
  telephone: string | null;
  contactType: number | null;
  relationship: string | null;
  days: CholeraFollowUpDay[];
}

@Component({
  selector: 'app-cholera',
  host: { class: 'investigation-form' },
  templateUrl: './cholera.component.html',
  styleUrls: ['./cholera.component.css']
})
export class CholeraComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  // choleraData:any;
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

  choleraData = {
    id: null,
    patientID: null,

    // fever: 0,
    // feverDurationDay: 0,
    // maxTemperature: 0,

    // darkUrine: 0,
    // yellowEyeColor: 0,
    // painRightSideAbdomen: 0,
    // patientHospitalized: 0,
    // bookedIntensiveCare: 0,

    // dateAdmissionHospital: null,

    // contactSuspectedCase: 0,
    // contactConfirmedCase: 0,
    // epidemicOutbreak: 0,
    // contactDeceasedPersonRespiratory: 0,
    // numberDirectContacts: 0,

    // darkUrine: null,
    // yellowEyeColor: null,
    // painRightSideAbdomen: null,
    // patientHospitalized: null,
    // bookedIntensiveCare: null,
    // dateAdmissionHospital: null,

    contactSuspectedCase: null,
    contactConfirmedCase: null,
    epidemicOutbreak: null,
    contactDeceasedPersonRespiratory: null,
    numberDirectContacts: null,
    numberNonDirectContacts: null,

    contactFollowUpsJson: null,

    contaminated: null,
    contaminatedSource: null,
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

    patientOutsideCountry: null,
    country: null,
    travelReason: null,
    travelDate: null,
    travelBackDate: null,

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
    otherSamplesAnalysisPatienhome: null,
    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    canal: null,
    storedWater: null,
    sampledSewerSystemTaken: null,
    sampleResult: null,
    investigationDate: null,
    healthObserverName: null,
    surveillanceOfficerName: null,
    administrationDirectorName: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage: null,

  }

  readonly followUpDays = [1, 2, 3, 4, 5];
  readonly contactTypes = contactType.filter((c) => c.id != null);
  contactFollowUps: CholeraContactFollowUp[] = [];

  patientOutsideCountrys = AnswerOptions;
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.choleraData.patientID = this.currentId
    this.investigationService.getByIdcholera(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.choleraData = v
          this.contactFollowUps = this.parseContactFollowUps(v.contactFollowUpsJson);
          //dateHealthCertificate
          this.choleraData.dateHealthCertificate = this.datePipe.transform(this.choleraData.dateHealthCertificate, 'yyyy-MM-dd');
          //travelDate
          this.choleraData.travelDate = this.datePipe.transform(this.choleraData.travelDate, 'yyyy-MM-dd');
          this.choleraData.travelBackDate = this.datePipe.transform(this.choleraData.travelBackDate, 'yyyy-MM-dd');
          this.choleraData.investigationDate = this.datePipe.transform(this.choleraData.investigationDate, 'yyyy-MM-dd');

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
    this.syncContactFollowUps();
    this.choleraData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.choleraData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    if (this.choleraData != null && this.choleraData.id != null) {
      this.investigationService.updatecholera(this.choleraData).subscribe(
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
      this.investigationService.addInvestigationcholera(this.choleraData).subscribe(
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
    this.contactFollowUps.push({
      name: null,
      age: null,
      ageUnit: 1,
      telephone: null,
      contactType: null,
      relationship: null,
      days: this.followUpDays.map(() => ({ hasSymptoms: null, diarrhea: false, vomiting: false })),
    });
    this.syncContactFollowUps();
  }

  removeContactFollowUp(index: number): void {
    this.contactFollowUps.splice(index, 1);
    this.syncContactFollowUps();
  }

  onHasSymptomsChanged(day: CholeraFollowUpDay): void {
    if (day.hasSymptoms !== 0) {
      day.diarrhea = false;
      day.vomiting = false;
    }
    this.syncContactFollowUps();
  }

  syncContactFollowUps(): void {
    this.choleraData.contactFollowUpsJson = JSON.stringify(this.contactFollowUps);
    if (!this.contactFollowUps.length) {
      this.choleraData.contactFollowUpsJson = null;
    }
    this.calculateCompletionPercentage();
  }

  private parseContactFollowUps(json: string | null): CholeraContactFollowUp[] {
    if (!json) return [];
    try {
      const rows = JSON.parse(json);
      if (!Array.isArray(rows)) return [];
      return rows.map((r: any) => ({
        name: r?.name ?? null,
        age: r?.age ?? null,
        ageUnit: r?.ageUnit ?? 1,
        telephone: r?.telephone ?? null,
        contactType: r?.contactType ?? null,
        relationship: r?.relationship ?? null,
        days: this.followUpDays.map((_, i) => ({
          hasSymptoms: r?.days?.[i]?.hasSymptoms ?? null,
          diarrhea: !!r?.days?.[i]?.diarrhea,
          vomiting: !!r?.days?.[i]?.vomiting,
        })),
      }));
    } catch {
      return [];
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.choleraData;
    console.log(data);
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', 'contactDeceasedPersonRespiratory'];
    const isLegacyFollowUpField = (key: string) => /Day(1|2|7|14)$/.test(key);
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key) && !isLegacyFollowUpField(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && !isLegacyFollowUpField(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}
