import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChildrenOutletContexts } from '@angular/router';
import { Gender } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-acute-flaccid-paralysis',
  templateUrl: './acute-flaccid-paralysis.component.html',
  styleUrls: ['./acute-flaccid-paralysis.component.css'],
})
export class AcuteFlaccidParalysisComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  AcuteFlaccidParalysisForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupId: any;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { 
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
    
    if (this.diseaseGroupId == null || this.diseaseGroupId == undefined) {
      this.diseaseGroupId = this.investigationService.diseaseGroupID;
    }
  }
  ngOnInit() {
    this.AcuteFlaccidParalysisForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(),
      investigationCompletePercentage:new FormControl(),
      suddenRelaxationAffectedOrgans: new FormControl(),
      babinskiSign1: new FormControl(),
      mentionParalyzedOrgans: new FormControl(),
      symmetryAffectedOrgans1: new FormControl(),
      completeParalysisWithinFourDays: new FormControl(),
      feelingAffectedOrgans1: new FormControl(),
      isConditionDangerous: new FormControl(),
      childLessFiveYears: new FormControl(),
      memberAsymmetry: new FormControl(),
      speedCompleteParalysis: new FormControl(),
      feelingSafeAffectedOrgans: new FormControl(),
      isChildReceiveInjections3DaysBeforeOnsetParalysis: new FormControl(),
      mentionInjectionSiteMechanism: new FormControl(),
      geographicalLocationInjectionMade: new FormControl(),
      isSiteAware1: new FormControl(),
      nationalityMentioned: new FormControl(),
      dateEntryIntoCountry: new FormControl(),
      directorateReportingCase: new FormControl(),
      administration: new FormControl(),
      nameInformant: new FormControl(),
      reportingSite: new FormControl(),
      reportDate: new FormControl(),
      reportedHealthAuthority: new FormControl(),
      dateOnsetParalysis: new FormControl(),
      isParalysisFlaccid: new FormControl(),
      paralyzedMembers: new FormControl(),
      symmetryAffectedOrgans: new FormControl(),
      presenceHighTemperatureParalysisBegins: new FormControl(),
      completeParalysisWithinFourDays1: new FormControl(),
      feelingAffectedOrgans: new FormControl(),
      isCaseDangerous: new FormControl(),
      //genderDay1: new FormControl(), //تمت الاضافة
      administrationMonitoringOfficerName1: new FormControl(),
      administrationMonitoringOfficerSignature1: new FormControl(),
      administrationMonitoringOfficerDate1: new FormControl(),
      monitoringOfficerDirectorateName1: new FormControl(),
      monitoringOfficerDirectorateSignature1: new FormControl(),
      monitoringOfficerDirectorateDate1: new FormControl(),
      preventiveDirectorDirectorateName1: new FormControl(),
      preventiveDirectorDirectorateSignature1: new FormControl(),
      preventiveDirectorDirectorateDate1: new FormControl(),

      clinicalExaminationCaseName: new FormControl(),
      clinicalExaminationCaseNationaId: new FormControl(),
      clinicalExaminationCaseDateBirth: new FormControl(),
      clinicalExaminationCaseAgeMonths: new FormControl(),
      clinicalExaminationCaseGender: new FormControl(),
      clinicalExaminationCaseNameExaminingDoctor: new FormControl(),
      clinicalExaminationCaseSpecialty: new FormControl(),
      clinicalExaminationCaseWhereExaminePatient: new FormControl(),
      clinicalExaminationCaseDateAdmissionHospital: new FormControl(),
      clinicalExaminationCaseDateOnsetParalysis: new FormControl(),
      clinicalExaminationCaseDateImmobilizationCompleted: new FormControl(),
      clinicalExaminationCaseCompleteParalysis4Days: new FormControl(),
      clinicalExaminationCaseIsParalysisPresentBirth: new FormControl(),
      clinicalExaminationCaseIsParalysisAccidentFracture: new FormControl(),
      clinicalExaminationCaseStateReason: new FormControl(),

      childReceiveInjections3Days: new FormControl(),
      mentionPlaceInjectionBody: new FormControl(),
      injectionSite: new FormControl(),
      isSiteAware: new FormControl(),
      asymmetry: new FormControl(),
      paralyzedPartFlaccid: new FormControl(),
      soundSensationParalyzedParts: new FormControl(),
      fever: new FormControl(),
      feverDate: new FormControl(),
      diarrhea: new FormControl(),
      diarrheaDate: new FormControl(),
      vomit: new FormControl(),
      vomitDate: new FormControl(),
      coryza: new FormControl(),
      coryzaDate: new FormControl(),

      sphincterControl: new FormControl(),
      stiffNeck: new FormControl(),
      convulsions: new FormControl(),
      babinskiSign: new FormControl(),
      reactions: new FormControl(),
      muscleStrength: new FormControl(),
      otherClinicalSigns: new FormControl(),
      initialDiagnosisCondition: new FormControl(),

      administrationMonitoringOfficerName2: new FormControl(),
      administrationMonitoringOfficerSignature2: new FormControl(),
      administrationMonitoringOfficerDate2: new FormControl(),

      monitoringOfficerDirectorateName2: new FormControl(),
      monitoringOfficerDirectorateSignature2: new FormControl(),
      monitoringOfficerDirectorateDate2: new FormControl(),

      preventiveDirectorDirectorateName2: new FormControl(),
      preventiveDirectorDirectorateSignature2: new FormControl(),
      preventiveDirectorDirectorateDate2: new FormControl(),

      epidemiologicalInvestigationCaseName: new FormControl(),
      epidemiologicalInvestigationNationalId: new FormControl(),
      epidemiologicalInvestigationDateBirth: new FormControl(),
      epidemiologicalInvestigationAgeMonths: new FormControl(),
      epidemiologicalInvestigationGender: new FormControl(),

      epidemiologicalInvestigationAddressBirthCertificate: new FormControl(),
      epidemiologicalInvestigationStreetBirthCertificate: new FormControl(),
      epidemiologicalInvestigationHealthUnitBirthCertificate: new FormControl(),
      epidemiologicalInvestigationAdministratioBirthCertificaten:
        new FormControl(),
      epidemiologicalInvestigationGovernorateBirthCertificate:
        new FormControl(),

      epidemiologicalInvestigationAddress: new FormControl(),
      epidemiologicalInvestigationStreet: new FormControl(),
      epidemiologicalInvestigationHealthUnit: new FormControl(),
      epidemiologicalInvestigationAdministratio: new FormControl(),
      epidemiologicalInvestigationGovernorate: new FormControl(),

      epidemiologicalInvestigationCurrentlyResidingArea: new FormControl(),
      epidemiologicalInvestigationphoneNumber: new FormControl(),

      epidemiologicalInvestigationNationality: new FormControl(),

      epidemiologicalInvestigationDateEntryIntoCountry: new FormControl(),
      epidemiologicalInvestigationNameInformant: new FormControl(),
      epidemiologicalInvestigationReportingDate: new FormControl(),
      epidemiologicalInvestigationNameAttendingPhysician: new FormControl(),
      epidemiologicalInvestigationDate: new FormControl(),
      epidemiologicalInvestigationDateOnsetParalysis: new FormControl(),

      movesAdress1: new FormControl(),
      movesAreaName1: new FormControl(),
      movesFromDate1: new FormControl(),
      movesToDate1: new FormControl(),
      movesAdress2: new FormControl(),
      movesAreaName2: new FormControl(),
      movesFromDate2: new FormControl(),
      movesToDate2: new FormControl(),
      movesAdress3: new FormControl(),
      movesAreaName3: new FormControl(),
      movesFromDate3: new FormControl(),
      movesToDate3: new FormControl(),
      movesAdress4: new FormControl(),
      movesAreaName4: new FormControl(),
      movesFromDate4: new FormControl(),
      movesToDate4: new FormControl(),

      casesName1: new FormControl(),
      casesAdress1: new FormControl(),
      casesDateOnsetParalysis1: new FormControl(),
      casesName2: new FormControl(),
      casesAdress2: new FormControl(),
      casesDateOnsetParalysis2: new FormControl(),
      casesName3: new FormControl(),
      casesAdress3: new FormControl(),
      casesDateOnsetParalysis3: new FormControl(),
      casesName4: new FormControl(),
      casesAdress4: new FormControl(),
      casesDateOnsetParalysis4: new FormControl(),

      visitsName1: new FormControl(),
      visitsRelevance1: new FormControl(),
      visitsAddress1: new FormControl(),
      visitsFromDate1: new FormControl(),
      visitsToDate1: new FormControl(),

      visitsName2: new FormControl(),
      visitsRelevance2: new FormControl(),
      visitsAddress2: new FormControl(),
      visitsFromDate2: new FormControl(),
      visitsToDate2: new FormControl(),

      visitsName3: new FormControl(),
      visitsRelevance3: new FormControl(),
      visitsAddress3: new FormControl(),
      visitsFromDate3: new FormControl(),
      visitsToDate3: new FormControl(),

      before60daysName: new FormControl(),
      before60daysAdress: new FormControl(),
      before60daysDateOnsetParalysis: new FormControl(),

      nameHealthAuthority1: new FormControl(),
      nameAttendingPhysician1: new FormControl(),
      addressHealthFacility1: new FormControl(),
      healthAuthorityFromDate1: new FormControl(),
      healthAuthorityToDate1: new FormControl(),
      // immediatelyReportedSituation1: new FormControl('2'),
      immediatelyReportedSituation1: new FormControl(),

      nameHealthAuthority2: new FormControl(),
      nameAttendingPhysician2: new FormControl(),
      addressHealthFacility2: new FormControl(),
      healthAuthorityFromDate2: new FormControl(),
      healthAuthorityToDate2: new FormControl(),
      // immediatelyReportedSituation2: new FormControl('2'),
      immediatelyReportedSituation2: new FormControl(),

      nameHealthAuthority3: new FormControl(),
      nameAttendingPhysician3: new FormControl(),
      addressHealthFacility3: new FormControl(),
      healthAuthorityFromDate3: new FormControl(),
      healthAuthorityToDate3: new FormControl(),
      // immediatelyReportedSituation3: new FormControl('2'),
      immediatelyReportedSituation3: new FormControl(),

      nameHealthAuthority4: new FormControl(),
      nameAttendingPhysician4: new FormControl(),
      addressHealthFacility4: new FormControl(),
      healthAuthorityFromDate4: new FormControl(),
      healthAuthorityToDate4: new FormControl(),
      // immediatelyReportedSituation4: new FormControl('2'),
      immediatelyReportedSituation4: new FormControl(),

      healthAuthority: new FormControl(),
      actionsTaken: new FormControl(),
      differentReportingMethods: new FormControl(),
      specialProceduresDate: new FormControl(),

      numberDosesBeforeTotal: new FormControl(),
      numberDosesBeforeRoutine: new FormControl(),
      numberDosesBeforeCampaigns: new FormControl(),
      numberDosesBeforeBehaviorInitiative: new FormControl(),

      routineDosesZeroDate: new FormControl(),
      routineDosesZeroSource: new FormControl(),

      routineSabine1Date: new FormControl(),
      routineSabine1Source: new FormControl(),
      routineSalk1Date: new FormControl(),
      routineSalk1Source: new FormControl(),
      routineSabine2Date: new FormControl(),
      routineSabine2Source: new FormControl(),
      routineSalk2Date: new FormControl(),
      routineSalk2Source: new FormControl(),
      routineSabine3Date: new FormControl(),
      routineSabine3Source: new FormControl(),
      routineSalk3Date: new FormControl(),
      routineSalk3Source: new FormControl(),
      routine4Date: new FormControl(),
      routine4Source: new FormControl(),
      routine5Date: new FormControl(),
      routine5Source: new FormControl(),
      routineStimulantDate: new FormControl(),
      routineStimulantSource: new FormControl(),

      campaignDosesZeroDate: new FormControl(),
      campaignDosesZeroSource: new FormControl(),

      campaignSabine1Date: new FormControl(),
      campaignSabine1Source: new FormControl(),
      campaignSalk1Date: new FormControl(),
      campaignSalk1Source: new FormControl(),
      campaignSabine2Date: new FormControl(),
      campaignSabine2Source: new FormControl(),
      campaignSalk2Date: new FormControl(),
      campaignSalk2Source: new FormControl(),
      campaignSabine3Date: new FormControl(),
      campaignSabine3Source: new FormControl(),
      campaignSalk3Date: new FormControl(),
      campaignSalk3Source: new FormControl(),
      campaign4Date: new FormControl(),
      campaign4Source: new FormControl(),
      campaign5Date: new FormControl(),
      campaign5Source: new FormControl(),
      campaignStimulantDate: new FormControl(),
      campaignStimulantSource: new FormControl(),

      monthPriorOnsetParalysisnumberChildren3: new FormControl(),
      monthPriorOnsetParalysisNumberVaccinators3: new FormControl(),
      monthPriorOnsetParalysisPercentege3: new FormControl(),

      fieldNumberChildren3: new FormControl(),
      fieldNumberVaccinators3: new FormControl(),
      fieldPercentege3: new FormControl(),

      monthPriorOccurrenceParalysisNumberChildren3: new FormControl(),
      monthPriorOccurrenceParalysisNumberVaccinators3: new FormControl(),
      monthPriorOccurrenceParalysisPercentege3: new FormControl(),

      monthPriorOnsetParalysisnumberChildren4: new FormControl(),
      monthPriorOnsetParalysisNumberVaccinators4: new FormControl(),
      monthPriorOnsetParalysisPercentege4: new FormControl(),

      fieldNumberChildren4: new FormControl(),
      fieldNumberVaccinators4: new FormControl(),
      fieldPercentege4: new FormControl(),

      monthPriorOccurrenceParalysisNumberChildren4: new FormControl(),
      monthPriorOccurrenceParalysisNumberVaccinators4: new FormControl(),
      monthPriorOccurrenceParalysisPercentege4: new FormControl(),

      monthPriorOnsetParalysisnumberChildrenStimulant: new FormControl(),
      monthPriorOnsetParalysisNumberVaccinatorsStimulant: new FormControl(),
      monthPriorOnsetParalysisPercentegeStimulant: new FormControl(),

      fieldNumberChildrenStimulant: new FormControl(),
      fieldNumberVaccinatorsStimulant: new FormControl(),
      fieldPercentegeStimulant: new FormControl(),

      monthPriorOccurrenceParalysisNumberChildrenStimulant: new FormControl(),
      monthPriorOccurrenceParalysisNumberVaccinatorsStimulant:
        new FormControl(),
      monthPriorOccurrenceParalysisPercentegeStimulant: new FormControl(),

      dangerousCases1NameContact: new FormControl(),
      dangerousCases1AgeMonths: new FormControl(),
      dangerousCases1Kinship: new FormControl(),
      dangerousCases1DateSampleTaken: new FormControl(),
      dangerousCases1DateSent: new FormControl(),

      dangerousCases2NameContact: new FormControl(),
      dangerousCases2AgeMonths: new FormControl(),
      dangerousCases2Kinship: new FormControl(),
      dangerousCases2DateSampleTaken: new FormControl(),
      dangerousCases2DateSent: new FormControl(),

      dangerousCases3NameContact: new FormControl(),
      dangerousCases3AgeMonths: new FormControl(),
      dangerousCases3Kinship: new FormControl(),
      dangerousCases3DateSampleTaken: new FormControl(),
      dangerousCases3DateSent: new FormControl(),

      casesNotHaveSamples1NameContact: new FormControl(),
      casesNotHaveSamples1AgeMonts: new FormControl(),
      casesNotHaveSamples1Kinship: new FormControl(),
      casesNotHaveSamples1DateSampleTaken: new FormControl(),
      casesNotHaveSamples1DateSent: new FormControl(),

      casesNotHaveSamples2NameContact: new FormControl(),
      casesNotHaveSamples2AgeMonts: new FormControl(),
      casesNotHaveSamples2Kinship: new FormControl(),
      casesNotHaveSamples2DateSampleTaken: new FormControl(),
      casesNotHaveSamples2DateSent: new FormControl(),

      administrationMonitoringOfficerName3: new FormControl(),
      administrationMonitoringOfficerSignature3: new FormControl(),
      administrationMonitoringOfficerDate3: new FormControl(),

      monitoringOfficerDirectorateName3: new FormControl(),
      monitoringOfficerDirectorateSignature3: new FormControl(),
      monitoringOfficerDirectorateDate3: new FormControl(),

      preventiveDirectorDirectorateName3: new FormControl(),
      preventiveDirectorDirectorateSignature3: new FormControl(),
      preventiveDirectorDirectorateDate3: new FormControl(),

      fieldCoverageRatioCaseName: new FormControl(),
      fieldCoverageRatioNationalId: new FormControl(),
      fieldCoverageRatioVillage: new FormControl(),
      fieldCoverageRatioHealthUnit: new FormControl(),
      fieldCoverageRatioAdministraion: new FormControl(),
      fieldCoverageRatioGovernment: new FormControl(),

      dosesZeroDate: new FormControl(),
      dosesZeroSource: new FormControl(),

      sabine1Date: new FormControl(),
      sabine1Source: new FormControl(),
      salk1Date: new FormControl(),
      salk1Source: new FormControl(),
      sabine2Date: new FormControl(),
      sabine2Source: new FormControl(),
      salk2Date: new FormControl(),
      salk2Source: new FormControl(),
      sabine3Date: new FormControl(),
      sabine3Source: new FormControl(),
      salk3Date: new FormControl(),
      salk3Source: new FormControl(),
      date4: new FormControl(),
      source4: new FormControl(),
      date5: new FormControl(),
      source5: new FormControl(),
      stimulantDate: new FormControl(),
      stimulantSource: new FormControl(),

      healthBureauObserver: new FormControl(),
      managementMonitor: new FormControl(),
      managementOversightOfficer: new FormControl(),
      directorateVaccinationOfficer: new FormControl(),
      preventiveDirector: new FormControl(),

      followUpAfter60DaysName: new FormControl(),
      followUpAfter60DaysNationalId: new FormControl(),
      followUpAfter60DaysDateBirth: new FormControl(),
      followUpAfter60DaysAgeMonths: new FormControl(),
      followUpAfter60DaysGender: new FormControl(),
      followUpAfter60DaysAddress: new FormControl(),
      followUpAfter60DaysGovernorate: new FormControl(),
      followUpAfter60DaysDateParalysisBegan: new FormControl(),
      followUpAfter60DaysFollowUpDate: new FormControl(),
      followUpAfter60DaysDoctorName: new FormControl(),
      followUpAfter60DaysSpecialty: new FormControl(),
      followUpAfter60DaysFollowUpPlace: new FormControl(),
      followUpAfter60DaysFollowUp: new FormControl(),
      followUpAfter60DaysDateDeath: new FormControl(),
      followUpAfter60DaysCauseDeath: new FormControl(),
      followUpAfter60DaysIsFlaccidParalysisAfter60Days: new FormControl(),
      followUpAfter60DaysLocateRemainingParalysis: new FormControl(),
      followUpAfter60DaysMuscleAtrophy: new FormControl(),
      followUpAfter60DaysMuscleAtrophyPlace: new FormControl(),
      followUpAfter60DaysIsFeelingPresentAffectedOrgans: new FormControl(),
      followUpAfter60DaysResultsLaboratoryExaminationStoolSamplesCase:
        new FormControl(),
      followUpAfter60DaysMixer1: new FormControl(),
      followUpAfter60DaysMixer2: new FormControl(),
      followUpAfter60DaysMixer3: new FormControl(),
      followUpAfter60DaysCt: new FormControl(),
      followUpAfter60DaysEmg: new FormControl(),
      followUpAfter60DaysCsf: new FormControl(),
      followUpAfter60DaysOtherClinicalSigns: new FormControl(),
      followUpAfter60DaysMentionNameDiseaseParalysisReportingCase:
        new FormControl(),

      doctorsFollowUpCommitteeName1: new FormControl(),
      doctorsFollowUpCommitteeSpecialization1: new FormControl(),
      doctorsFollowUpCommitteeDate1: new FormControl(),
      doctorsFollowUpCommitteeSignature1: new FormControl(),

      doctorsFollowUpCommitteeName2: new FormControl(),
      doctorsFollowUpCommitteeSpecialization2: new FormControl(),
      doctorsFollowUpCommitteeDate2: new FormControl(),
      doctorsFollowUpCommitteeSignature2: new FormControl(),

      doctorsFollowUpCommitteeName3: new FormControl(),
      doctorsFollowUpCommitteeSpecialization3: new FormControl(),
      doctorsFollowUpCommitteeDate3: new FormControl(),
      doctorsFollowUpCommitteeSignature3: new FormControl(),
    });

    this.currentId = this.investigationService.currentid;
    this.AcuteFlaccidParalysisForm.controls['patientID'].setValue(
      this.currentId
    );
    this.investigationService
      .getByIdAcuteFlaccidParalysis(this.currentId)
      .subscribe(
        (res) => {
          //console.log(res);
          var v = res.data;
          this.AcuteFlaccidParalysisForm.patchValue(v);
          // this.AcuteFlaccidParalysisForm.patchValue(v);
          // if (v.immediatelyReportedSituation1 == null) {
          //   v.immediatelyReportedSituation1 = 2;
          // }
          // if (v.immediatelyReportedSituation2 == null) {
          //   v.immediatelyReportedSituation2 = 2;
          // }
          // if (v.immediatelyReportedSituation3 == null) {
          //   v.immediatelyReportedSituation3 = 2;
          // }
          // if (v.immediatelyReportedSituation4 == null) {
          //   v.immediatelyReportedSituation4 = 2;
          // }
          this.AcuteFlaccidParalysisForm.patchValue({
            immediatelyReportedSituation1:
              this.AcuteFlaccidParalysisForm.value
                .immediatelyReportedSituation1 + '',
            tc: true,
          });
          this.AcuteFlaccidParalysisForm.patchValue({
            immediatelyReportedSituation2:
              this.AcuteFlaccidParalysisForm.value
                .immediatelyReportedSituation2 + '',
            tc: true,
          });
          this.AcuteFlaccidParalysisForm.patchValue({
            immediatelyReportedSituation3:
              this.AcuteFlaccidParalysisForm.value
                .immediatelyReportedSituation3 + '',
            tc: true,
          });
          this.AcuteFlaccidParalysisForm.patchValue({
            immediatelyReportedSituation4:
              this.AcuteFlaccidParalysisForm.value
                .immediatelyReportedSituation4 + '',
            tc: true,
          });
          this.AcuteFlaccidParalysisForm.controls[
            'dateEntryIntoCountry'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dateEntryIntoCountry,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['reportDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.reportDate,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls[
            'dateOnsetParalysis'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dateOnsetParalysis,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'administrationMonitoringOfficerDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .administrationMonitoringOfficerDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'monitoringOfficerDirectorateDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .monitoringOfficerDirectorateDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'preventiveDirectorDirectorateDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .preventiveDirectorDirectorateDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'clinicalExaminationCaseDateBirth'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .clinicalExaminationCaseDateBirth,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'clinicalExaminationCaseDateAdmissionHospital'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .clinicalExaminationCaseDateAdmissionHospital,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'clinicalExaminationCaseDateOnsetParalysis'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .clinicalExaminationCaseDateOnsetParalysis,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'clinicalExaminationCaseDateOnsetParalysis'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .clinicalExaminationCaseDateImmobilizationCompleted,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['feverDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.feverDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['vomitDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.vomitDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'administrationMonitoringOfficerDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .administrationMonitoringOfficerDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['vomitDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.vomitDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'administrationMonitoringOfficerDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .administrationMonitoringOfficerDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'preventiveDirectorDirectorateDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .preventiveDirectorDirectorateDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'epidemiologicalInvestigationDateBirth'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .epidemiologicalInvestigationDateBirth,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'epidemiologicalInvestigationDateEntryIntoCountry'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .epidemiologicalInvestigationDateEntryIntoCountry,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'epidemiologicalInvestigationDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .epidemiologicalInvestigationDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'epidemiologicalInvestigationDateOnsetParalysis'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .epidemiologicalInvestigationDateOnsetParalysis,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate4'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['vomitDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.vomitDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['coryzaDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.coryzaDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['diarrheaDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.diarrheaDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'monitoringOfficerDirectorateDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .monitoringOfficerDirectorateDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate1'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate2'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate3,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls['movesFromDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesFromDate4'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesFromDate4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesDateOnsetParalysis1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesDateOnsetParalysis1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesDateOnsetParalysis3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesDateOnsetParalysis3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesDateOnsetParalysis4'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesDateOnsetParalysis4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsFromDate1'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsFromDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsToDate1'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsToDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsFromDate2'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsFromDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsFromDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsFromDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityFromDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityFromDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityFromDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityFromDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityFromDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityFromDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityToDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityToDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityFromDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityFromDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityFromDate4'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityFromDate4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityToDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityToDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityToDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityToDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'specialProceduresDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.specialProceduresDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'specialProceduresDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.specialProceduresDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'routineDosesZeroDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineDosesZeroDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['routineSalk1Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSalk1Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'routineSabine1Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSabine1Date,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls['routineSalk2Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSalk2Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'routineSabine2Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSabine2Date,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls['routineSalk3Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSalk3Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'routineSabine3Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineSabine3Date,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls['routine4Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routine4Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['routine5Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routine5Date,
              'yyyy-MM-dd'
            )
          );

          this.AcuteFlaccidParalysisForm.controls[
            'routineStimulantDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.routineStimulantDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'campaignDosesZeroDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignDosesZeroDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'campaignSabine1Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSabine1Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['campaignSalk1Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSalk1Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'campaignSabine2Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSabine2Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['campaignSalk2Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSalk2Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'campaignSabine3Date'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSabine3Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['campaignSalk3Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignSalk3Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['campaign4Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaign4Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['campaign5Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaign5Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'campaignStimulantDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.campaignStimulantDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases1DateSampleTaken'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .dangerousCases1DateSampleTaken,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases1DateSent'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dangerousCases1DateSent,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases2DateSampleTaken'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .dangerousCases2DateSampleTaken,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases2DateSent'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dangerousCases2DateSent,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases3DateSampleTaken'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .dangerousCases3DateSampleTaken,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'dangerousCases3DateSent'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dangerousCases3DateSent,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesNotHaveSamples1DateSampleTaken'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .casesNotHaveSamples1DateSampleTaken,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesNotHaveSamples1DateSent'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesNotHaveSamples1DateSent,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesNotHaveSamples2DateSampleTaken'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .casesNotHaveSamples2DateSampleTaken,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesNotHaveSamples2DateSent'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesNotHaveSamples2DateSent,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'administrationMonitoringOfficerDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .administrationMonitoringOfficerDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'monitoringOfficerDirectorateDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .monitoringOfficerDirectorateDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'preventiveDirectorDirectorateDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .preventiveDirectorDirectorateDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['dosesZeroDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.dosesZeroDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['sabine1Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.sabine1Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['salk1Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.salk1Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['sabine2Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.sabine2Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['salk2Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.salk2Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['sabine3Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.sabine3Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['salk3Date'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.salk3Date,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['date4'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.date4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['date5'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.date5,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['stimulantDate'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.stimulantDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'followUpAfter60DaysDateBirth'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.followUpAfter60DaysDateBirth,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'followUpAfter60DaysDateParalysisBegan'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .followUpAfter60DaysDateParalysisBegan,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'followUpAfter60DaysFollowUpDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .followUpAfter60DaysFollowUpDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'followUpAfter60DaysDateDeath'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.followUpAfter60DaysDateDeath,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'doctorsFollowUpCommitteeDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .doctorsFollowUpCommitteeDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'doctorsFollowUpCommitteeDate2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .doctorsFollowUpCommitteeDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'doctorsFollowUpCommitteeDate3'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .doctorsFollowUpCommitteeDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'epidemiologicalInvestigationReportingDate'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .epidemiologicalInvestigationReportingDate,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesToDate1'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesToDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesToDate2'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesToDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesToDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesToDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['movesToDate4'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.movesToDate4,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'casesDateOnsetParalysis2'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.casesDateOnsetParalysis2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsToDate2'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsToDate2,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls['visitsToDate3'].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.visitsToDate3,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'before60daysDateOnsetParalysis'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value
                .before60daysDateOnsetParalysis,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityToDate1'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityToDate1,
              'yyyy-MM-dd'
            )
          );
          this.AcuteFlaccidParalysisForm.controls[
            'healthAuthorityToDate4'
          ].setValue(
            this.datePipe.transform(
              this.AcuteFlaccidParalysisForm.value.healthAuthorityToDate4,
              'yyyy-MM-dd'
            )
          );
        this.calculateCompletionPercentage();
          //routineSabine1Date
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
    Object.entries(this.AcuteFlaccidParalysisForm.controls).map(
      ([key, value], index) => {
        if (value.value == 'null')
          value.setValue(null);
      });
    this.calculateCompletionPercentage();
    this.AcuteFlaccidParalysisForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.AcuteFlaccidParalysisForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    if (this.AcuteFlaccidParalysisForm.value.id != null) {
      this.investigationService
        .updateAcuteFlaccidParalysis(this.AcuteFlaccidParalysisForm.value)
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
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    } else {
      this.investigationService
        .addInvestigationAcuteFlaccidParalysis(
          this.AcuteFlaccidParalysisForm.value
        )
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

    //BL
    calculateCompletionPercentage() {
      this.allFilledControlsCount = 0;
      const data = this.AcuteFlaccidParalysisForm.value;
      //Exclude fields you don't want to count (like 'id')
      const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate','genderDay1'];
      const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
  
      this.allControllesCount = totalFields;
  
      Object.keys(data).forEach((key) => {
        if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
          this.allFilledControlsCount++;
        }
      });
    }
}
