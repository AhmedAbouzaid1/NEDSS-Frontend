import { Component, OnInit } from '@angular/core';
import { AnswerOptions, AnswerOptions2, childLess18Months, cookedHowToSaves, distanceWaterSourcesSewage, finalExits, freshHowToWashs, illnessContacts, sampleTakenSewerSystem, typeFoods, waterSamplesPolluted, waterSource } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-diarrhea',
  templateUrl: './diarrhea.component.html',
  styleUrls: ['./diarrhea.component.css']
})
export class DiarrheaComponent implements OnInit {
    currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService) { }
  diarrheaData = {
    patientID: null,
    id: null,
    dateOnsetSymptoms: null,
    tempDegree: 0,
    numberStoolsDay: 0,

    isMucusStool: 0,
    isMucusBlood: null,
    isStoolWatery: null,
    vomit: 0,
    urgeVomit: null,
    meaning: null,
    cough: null,
    jointPain: null,
    colic: null,
    headache: 0,
    muscleAches: 0,
    rednessSkin: 0,
    jerk: null,
    soreThroat: null,
    cramps: null,
    other: null,

    generalSituation: null,
    eyes: null,
    viewingWater: null,
    pinchingSkinAbdomen: null,
    pulseStrength: null,
    anteriorFontanelSlidDown: null,

    otherSign: null,
    otherSymptoms: null,

    childLess18Month: null,
    typeFood: null,
    freshHowToWash: null,
    cookedHowToSave: null,

    antibioticsTakenAdmission: null,
    nameAntithesis: null,

    medicineDiarrhea: null,
    diarrheaMedicineName: null,

    vaccinatedAgainstRotavirus: null,
    vaccinationDate: null,

    numberDoses: null,
    dateLastDose: null,






    otherAnimals: null,

    illnessContact: null,

    sufferImmuneDigestive: null,
    immuneDiseases: null,
    admittedIntensiveCare: null,
    finalExit: null,
    exitDate: null,
    waterSource: null,
    other1: null,
    isWaterStored: null,
    tankType: null,
    changeTasteColorSmellwater: null,
    distanceWaterSourcesSewage: null,
    samplesTakenAnalysisPatient: null,
    other2: null,
    waterSamplesPolluted: null,
    sampleTakenSewerSystem: null,

  }

  isMucusStools = AnswerOptions;
  isMucusBloods = AnswerOptions;
  isStoolWaterys = AnswerOptions;
  vomits = AnswerOptions;
  urgeVomits = AnswerOptions;
  meanings = AnswerOptions;
  coughs = AnswerOptions;
  jointPains = AnswerOptions;
  colics = AnswerOptions;
  headaches = AnswerOptions;
  muscleAchess = AnswerOptions;
  rednessSkins = AnswerOptions;
  jerks = AnswerOptions;
  soreThroats = AnswerOptions;
  crampss = AnswerOptions;

  otherSigns = AnswerOptions;

  childLess18Months = childLess18Months;
  typeFoods = typeFoods;
  freshHowToWashs = freshHowToWashs;
  cookedHowToSaves = cookedHowToSaves;

  antibioticsTakenAdmissions = AnswerOptions;
  medicineDiarrheas = AnswerOptions;
  vaccinatedAgainstRotaviruss = AnswerOptions;

  illnessContacts = illnessContacts;
  sufferImmuneDigestives = AnswerOptions;
  admittedIntensiveCares = AnswerOptions2;
  finalExits = finalExits;
  waterSources = waterSource;
  isWaterStoreds = AnswerOptions;
  changeTasteColorSmellwaters = AnswerOptions;
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  samplesTakenAnalysisPatients = AnswerOptions;
  waterSamplesPolluteds = waterSamplesPolluted;
  sampleTakenSewerSystems = sampleTakenSewerSystem;
  currentId: any;
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.currentId = this.investigationService.currentid
    this.diarrheaData.patientID = this.currentId
    this.investigationService.getByIdDiarrhea(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.diarrheaData = v;
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
    if (this.diarrheaData != null && this.diarrheaData.id != null) {
      this.investigationService.updateSevereDiarrhea(this.diarrheaData).subscribe(
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
      this.investigationService.addInvestigationDiarrhea(this.diarrheaData).subscribe(
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
