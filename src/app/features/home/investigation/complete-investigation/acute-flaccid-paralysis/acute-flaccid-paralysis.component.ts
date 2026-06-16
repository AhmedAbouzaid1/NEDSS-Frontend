import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  currentLang: string;
  AcuteFlaccidParalysisForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string = '';
  diseaseGroupId: any;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {}

  // #region FormArray Getters
  get caseMovements(): FormArray { return this.AcuteFlaccidParalysisForm.get('caseMovements') as FormArray; }
  get visitorsToArea(): FormArray { return this.AcuteFlaccidParalysisForm.get('visitorsToArea') as FormArray; }
  get afpCasesResidenceArea(): FormArray { return this.AcuteFlaccidParalysisForm.get('afpCasesResidenceArea') as FormArray; }
  get healthAuthoritiesVisited(): FormArray { return this.AcuteFlaccidParalysisForm.get('healthAuthoritiesVisited') as FormArray; }
  get healthFacilityActions(): FormArray { return this.AcuteFlaccidParalysisForm.get('healthFacilityActions') as FormArray; }
  get campaignDoses(): FormArray { return this.AcuteFlaccidParalysisForm.get('campaignDoses') as FormArray; }
  get salkInitiative(): FormArray { return this.AcuteFlaccidParalysisForm.get('salkInitiative') as FormArray; }
  get contacts(): FormArray { return this.AcuteFlaccidParalysisForm.get('contacts') as FormArray; }
  get fieldCoverageChildren(): FormArray { return this.AcuteFlaccidParalysisForm.get('fieldCoverageChildren') as FormArray; }
  get doctorsFollowUpCommittee(): FormArray { return this.AcuteFlaccidParalysisForm.get('doctorsFollowUpCommittee') as FormArray; }
  // #endregion

  // #region CreateRow Methods
  createCaseMovementRow(data?: any): FormGroup {
    return new FormGroup({
      address: new FormControl(data?.address || null),
      areaName: new FormControl(data?.areaName || null),
      fromDate: new FormControl(data?.fromDate || null),
      toDate: new FormControl(data?.toDate || null),
    });
  }

  createAfpCaseRow(data?: any): FormGroup {
    return new FormGroup({
      name: new FormControl(data?.name || null),
      address: new FormControl(data?.address || null),
      dateOnsetParalysis: new FormControl(data?.dateOnsetParalysis || null),
    });
  }

  createVisitorRow(data?: any): FormGroup {
    return new FormGroup({
      visitorName: new FormControl(data?.visitorName || null),
      relevance: new FormControl(data?.relevance || null),
      address: new FormControl(data?.address || null),
      fromDate: new FormControl(data?.fromDate || null),
      toDate: new FormControl(data?.toDate || null),
    });
  }

  createHealthAuthorityVisitedRow(data?: any): FormGroup {
    return new FormGroup({
      healthAuthorityName: new FormControl(data?.healthAuthorityName || null),
      attendingPhysicianName: new FormControl(data?.attendingPhysicianName || null),
      healthFacilityAddress: new FormControl(data?.healthFacilityAddress || null),
      fromDate: new FormControl(data?.fromDate || null),
      toDate: new FormControl(data?.toDate || null),
      immediatelyReported: new FormControl(data?.immediatelyReported || null),
    });
  }

  createHealthFacilityActionRow(data?: any): FormGroup {
    return new FormGroup({
      healthFacility: new FormControl(data?.healthFacility || null),
      actionsTaken: new FormControl(data?.actionsTaken || null),
      date: new FormControl(data?.date || null),
    });
  }

  createCampaignDoseRow(data?: any): FormGroup {
    return new FormGroup({
      date: new FormControl(data?.date || null),
      source: new FormControl(data?.source || null),
    });
  }

  createSalkInitiativeRow(data?: any): FormGroup {
    return new FormGroup({
      date: new FormControl(data?.date || null),
      source: new FormControl(data?.source || null),
    });
  }

  createContactRow(data?: any): FormGroup {
    return new FormGroup({
      contactName: new FormControl(data?.contactName || null),
      ageMonths: new FormControl(data?.ageMonths || null),
      kinship: new FormControl(data?.kinship || null),
      dateSampleTaken: new FormControl(data?.dateSampleTaken || null),
      dateSent: new FormControl(data?.dateSent || null),
    });
  }

  createFieldCoverageChildRow(data?: any): FormGroup {
    return new FormGroup({
      childName: new FormControl(data?.childName || null),
      dateOfBirth: new FormControl(data?.dateOfBirth || null),
      registrationNumber: new FormControl(data?.registrationNumber || null),
      zeroDose: new FormControl(data?.zeroDose || null),
      sabin1: new FormControl(data?.sabin1 || null),
      salk1: new FormControl(data?.salk1 || null),
      sabin2: new FormControl(data?.sabin2 || null),
      salk2: new FormControl(data?.salk2 || null),
      sabin3: new FormControl(data?.sabin3 || null),
      salk3: new FormControl(data?.salk3 || null),
      dose4: new FormControl(data?.dose4 || null),
      dose5: new FormControl(data?.dose5 || null),
      booster: new FormControl(data?.booster || null),
    });
  }

  createDoctorCommitteeRow(data?: any): FormGroup {
    return new FormGroup({
      name: new FormControl(data?.name || null),
      specialization: new FormControl(data?.specialization || null),
      date: new FormControl(data?.date || null),
    });
  }
  // #endregion

  // #region Add/Remove Row Methods
  addCaseMovementRow(): void { this.caseMovements.push(this.createCaseMovementRow()); }
  removeCaseMovementRow(i: number): void { this.caseMovements.removeAt(i); }

  addVisitorRow(): void { this.visitorsToArea.push(this.createVisitorRow()); }
  removeVisitorRow(i: number): void { this.visitorsToArea.removeAt(i); }

  addAfpCaseResidenceAreaRow(): void { this.afpCasesResidenceArea.push(this.createAfpCaseRow()); }
  removeAfpCaseResidenceAreaRow(i: number): void { this.afpCasesResidenceArea.removeAt(i); }

  addHealthAuthorityVisitedRow(): void { this.healthAuthoritiesVisited.push(this.createHealthAuthorityVisitedRow()); }
  removeHealthAuthorityVisitedRow(i: number): void { this.healthAuthoritiesVisited.removeAt(i); }

  addHealthFacilityActionRow(): void { this.healthFacilityActions.push(this.createHealthFacilityActionRow()); }
  removeHealthFacilityActionRow(i: number): void { this.healthFacilityActions.removeAt(i); }

  addCampaignDoseRow(): void { this.campaignDoses.push(this.createCampaignDoseRow()); }
  removeCampaignDoseRow(i: number): void { this.campaignDoses.removeAt(i); }

  addSalkInitiativeRow(): void { this.salkInitiative.push(this.createSalkInitiativeRow()); }
  removeSalkInitiativeRow(i: number): void { this.salkInitiative.removeAt(i); }

  addContactRow(): void { this.contacts.push(this.createContactRow()); }
  removeContactRow(i: number): void { this.contacts.removeAt(i); }

  addFieldCoverageChildRow(): void { this.fieldCoverageChildren.push(this.createFieldCoverageChildRow()); }
  removeFieldCoverageChildRow(i: number): void { this.fieldCoverageChildren.removeAt(i); }

  addDoctorCommitteeRow(): void { this.doctorsFollowUpCommittee.push(this.createDoctorCommitteeRow()); }
  removeDoctorCommitteeRow(i: number): void { this.doctorsFollowUpCommittee.removeAt(i); }
  // #endregion

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');

    this.diseaseGroupId = this.investigationService.diseaseGroupID;

    this.AcuteFlaccidParalysisForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(),
      investigationCompletePercentage: new FormControl(),

      // Form 1 — Fax Notification
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

      // Form 2 — Clinical Examination
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
      rightArmParalysis: new FormControl(),
      leftArmParalysis: new FormControl(),
      rightLegParalysis: new FormControl(),
      leftLegParalysis: new FormControl(),
      otherParalysisSite: new FormControl(),
      asymmetry: new FormControl(),
      paralyzedPartFlaccid: new FormControl(),
      soundSensationParalyzedParts: new FormControl(),
      musclePain: new FormControl(),
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

      // Form 3 — Epidemiological Investigation
      epidemiologicalInvestigationStreetBirthCertificate: new FormControl(),
      epidemiologicalInvestigationHealthUnitBirthCertificate: new FormControl(),
      epidemiologicalInvestigationAdministratioBirthCertificaten: new FormControl(),
      epidemiologicalInvestigationGovernorateBirthCertificate: new FormControl(),
      epidemiologicalInvestigationStreet: new FormControl(),
      epidemiologicalInvestigationHealthUnit: new FormControl(),
      epidemiologicalInvestigationAdministratio: new FormControl(),
      epidemiologicalInvestigationGovernorate: new FormControl(),
      epidemiologicalInvestigationCurrentlyResidingArea: new FormControl(),
      epidemiologicalInvestigationNationality: new FormControl(),
      epidemiologicalInvestigationDateEntryIntoCountry: new FormControl(),
      epidemiologicalInvestigationNameAttendingPhysician: new FormControl(),
      epidemiologicalInvestigationDate: new FormControl(),

      // Dynamic tables
      caseMovements: new FormArray([]),
      visitorsToArea: new FormArray([]),
      afpCasesResidenceArea: new FormArray([]),
      healthAuthoritiesVisited: new FormArray([]),
      healthFacilityActions: new FormArray([]),

      // Vaccination info
      numberDosesBeforeTotal: new FormControl(),
      numberDosesBeforeRoutine: new FormControl(),
      numberDosesBeforeCampaigns: new FormControl(),
      numberDosesBeforeBehaviorInitiative: new FormControl(),

      // Routine doses (fixed)
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

      // Campaign doses + Salk initiative (dynamic)
      campaignDoses: new FormArray([]),
      salkInitiative: new FormArray([]),
      validDosesCount: new FormControl(),

      // Coverage ratio (fixed 3×9)
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
      monthPriorOccurrenceParalysisNumberVaccinatorsStimulant: new FormControl(),
      monthPriorOccurrenceParalysisPercentegeStimulant: new FormControl(),

      // Contacts (dynamic)
      contacts: new FormArray([]),

      // Contacts Sample Form (fixed 3 contacts)
      csfReason: new FormControl(),
      csf1Name: new FormControl(), csf1Age: new FormControl(), csf1Gender: new FormControl(), csf1Relation: new FormControl(),
      csf1WeekBefore: new FormControl(),      csf1RoutineDoses: new FormControl(), csf1CampaignDoses: new FormControl(), csf1SalkDoses: new FormControl(),
      csf1LastDoseDate: new FormControl(), csf1SampleCollectionDate: new FormControl(), csf1SampleSendDate: new FormControl(),
      csf2Name: new FormControl(), csf2Age: new FormControl(), csf2Gender: new FormControl(), csf2Relation: new FormControl(),
      csf2WeekBefore: new FormControl(),      csf2RoutineDoses: new FormControl(), csf2CampaignDoses: new FormControl(), csf2SalkDoses: new FormControl(),
      csf2LastDoseDate: new FormControl(), csf2SampleCollectionDate: new FormControl(), csf2SampleSendDate: new FormControl(),
      csf3Name: new FormControl(), csf3Age: new FormControl(), csf3Gender: new FormControl(), csf3Relation: new FormControl(),
      csf3WeekBefore: new FormControl(),      csf3RoutineDoses: new FormControl(), csf3CampaignDoses: new FormControl(), csf3SalkDoses: new FormControl(),
      csf3LastDoseDate: new FormControl(), csf3SampleCollectionDate: new FormControl(), csf3SampleSendDate: new FormControl(),
      csfCollectorName: new FormControl(), csfSenderName: new FormControl(),
      csfReceiverName: new FormControl(), csfReceiptDate: new FormControl(), csfReceiptTime: new FormControl(), csfNotes: new FormControl(),
      csfQuantity8g: new FormControl(), csfTemp4to8: new FormControl(), csfNoLeakage: new FormControl(),
      csfDesignatedCooler: new FormControl(), csfDesignatedTubes: new FormControl(), csfTempMonitor: new FormControl(), csfSamplesValid: new FormControl(),

      // Cluster Investigation (fixed 3 cases)
      clusterGovernorate: new FormControl(), clusterAdministration: new FormControl(),
      cluster1Name: new FormControl(), cluster1Unit: new FormControl(), cluster1Age: new FormControl(),
      cluster1ParalysisDate: new FormControl(), cluster1SampleAdequacy: new FormControl(), cluster1Vaccination: new FormControl(),
      cluster1UnitCoverage: new FormControl(), cluster1FieldCoverage: new FormControl(), cluster1EndemicVisit: new FormControl(),
      cluster1Fever: new FormControl(), cluster1Symmetry: new FormControl(), cluster1Complete4Days: new FormControl(),
      cluster1OtherTests: new FormControl(), cluster1InitialDiagnosis: new FormControl(),
      cluster1ZeroReporting: new FormControl(), cluster1PositiveSurveillance: new FormControl(),
      cluster1SilentSites: new FormControl(), cluster1UnreportedCases: new FormControl(),
      cluster2Name: new FormControl(), cluster2Unit: new FormControl(), cluster2Age: new FormControl(),
      cluster2ParalysisDate: new FormControl(), cluster2SampleAdequacy: new FormControl(), cluster2Vaccination: new FormControl(),
      cluster2UnitCoverage: new FormControl(), cluster2FieldCoverage: new FormControl(), cluster2EndemicVisit: new FormControl(),
      cluster2Fever: new FormControl(), cluster2Symmetry: new FormControl(), cluster2Complete4Days: new FormControl(),
      cluster2OtherTests: new FormControl(), cluster2InitialDiagnosis: new FormControl(),
      cluster2ZeroReporting: new FormControl(), cluster2PositiveSurveillance: new FormControl(),
      cluster2SilentSites: new FormControl(), cluster2UnreportedCases: new FormControl(),
      cluster3Name: new FormControl(), cluster3Unit: new FormControl(), cluster3Age: new FormControl(),
      cluster3ParalysisDate: new FormControl(), cluster3SampleAdequacy: new FormControl(), cluster3Vaccination: new FormControl(),
      cluster3UnitCoverage: new FormControl(), cluster3FieldCoverage: new FormControl(), cluster3EndemicVisit: new FormControl(),
      cluster3Fever: new FormControl(), cluster3Symmetry: new FormControl(), cluster3Complete4Days: new FormControl(),
      cluster3OtherTests: new FormControl(), cluster3InitialDiagnosis: new FormControl(),
      cluster3ZeroReporting: new FormControl(), cluster3PositiveSurveillance: new FormControl(),
      cluster3SilentSites: new FormControl(), cluster3UnreportedCases: new FormControl(),
      clusterConclusion: new FormControl(),

      // Field Coverage Form
      fieldCoverageRatioVillage: new FormControl(),
      fieldCoverageRatioHealthUnit: new FormControl(),
      fieldCoverageRatioAdministraion: new FormControl(),
      fieldCoverageRatioGovernment: new FormControl(),
      fieldCoverageChildren: new FormArray([]),

      // Field Coverage Rates Summary (stored as JSON)
      fcRateZeroChildren: new FormControl(), fcRateZeroVaccinated: new FormControl(), fcRateZeroPercentage: new FormControl(),
      fcRate1SabinChildren: new FormControl(), fcRate1SabinVaccinated: new FormControl(), fcRate1SabinPercentage: new FormControl(),
      fcRate1SalkChildren: new FormControl(), fcRate1SalkVaccinated: new FormControl(), fcRate1SalkPercentage: new FormControl(),
      fcRate2SabinChildren: new FormControl(), fcRate2SabinVaccinated: new FormControl(), fcRate2SabinPercentage: new FormControl(),
      fcRate2SalkChildren: new FormControl(), fcRate2SalkVaccinated: new FormControl(), fcRate2SalkPercentage: new FormControl(),
      fcRate3SabinChildren: new FormControl(), fcRate3SabinVaccinated: new FormControl(), fcRate3SabinPercentage: new FormControl(),
      fcRate3SalkChildren: new FormControl(), fcRate3SalkVaccinated: new FormControl(), fcRate3SalkPercentage: new FormControl(),
      fcRate4Children: new FormControl(), fcRate4Vaccinated: new FormControl(), fcRate4Percentage: new FormControl(),
      fcRate5Children: new FormControl(), fcRate5Vaccinated: new FormControl(), fcRate5Percentage: new FormControl(),
      fcRateBoosterChildren: new FormControl(), fcRateBoosterVaccinated: new FormControl(), fcRateBoosterPercentage: new FormControl(),

      // Form 4 — Stool Sample Dispatch
      sample1CollectionPlace: new FormControl(),
      sample1CollectionDate: new FormControl(),
      sample1CollectorName: new FormControl(),
      sample1SendDate: new FormControl(),
      sample2CollectionPlace: new FormControl(),
      sample2CollectionDate: new FormControl(),
      sample2CollectorName: new FormControl(),
      sample2SendDate: new FormControl(),
      sampleSenderName: new FormControl(),
      sampleQuantity8g: new FormControl(),
      sampleTemperature4to8: new FormControl(),
      sampleNoLeakage: new FormControl(),
      sampleDesignatedCooler: new FormControl(),
      sampleDesignatedTubes: new FormControl(),
      sampleTemperatureMonitor: new FormControl(),
      sampleAreValid: new FormControl(),
      sampleReceiverName: new FormControl(),
      sampleReceiptDate: new FormControl(),
      sampleReceiptTime: new FormControl(),

      // Form 5 — 60-Day Follow-up
      followUpAfter60DaysFollowUpDate: new FormControl(),
      followUpAfter60DaysFollowUpPlace: new FormControl(),
      followUpAfter60DaysDoctorName: new FormControl(),
      followUpAfter60DaysSpecialty: new FormControl(),
      followUpAfter60DaysFollowUp: new FormControl(),
      followUpAfter60DaysDateDeath: new FormControl(),
      followUpAfter60DaysCauseDeath: new FormControl(),
      followUpAfter60DaysIsFlaccidParalysisAfter60Days: new FormControl(),
      followUpAfter60DaysLocateRemainingParalysis: new FormControl(),
      followUpAfter60DaysMuscleAtrophy: new FormControl(),
      followUpAfter60DaysMuscleAtrophyPlace: new FormControl(),
      followUpAfter60DaysIsFeelingPresentAffectedOrgans: new FormControl(),
      followUpAfter60DaysResultsLaboratoryExaminationStoolSamplesCase: new FormControl(),
      followUpAfter60DaysMixer1: new FormControl(),
      followUpAfter60DaysMixer2: new FormControl(),
      followUpAfter60DaysMixer3: new FormControl(),
      followUpAfter60DaysCt: new FormControl(),
      followUpAfter60DaysEmg: new FormControl(),
      followUpAfter60DaysCsf: new FormControl(),
      followUpAfter60DaysOtherClinicalSigns: new FormControl(),
      followUpAfter60DaysMentionNameDiseaseParalysisReportingCase: new FormControl(),
      doctorsFollowUpCommittee: new FormArray([this.createDoctorCommitteeRow({ specialization: 'طبيب اخصائي الاطفال' })]),
      signPreventiveDirectorName: new FormControl(),
      signPreventiveDirectorDate: new FormControl(),
      signSurveillanceAdminName: new FormControl(),
      signSurveillanceAdminDate: new FormControl(),
      signSurveillanceDirectorateName: new FormControl(),
      signSurveillanceDirectorateDate: new FormControl(),
    });

    // Start each dynamic table with one empty row
    this.addCaseMovementRow();
    this.addVisitorRow();
    this.addAfpCaseResidenceAreaRow();
    this.addHealthAuthorityVisitedRow();
    this.addHealthFacilityActionRow();
    this.addCampaignDoseRow();
    this.addSalkInitiativeRow();
    this.addContactRow();
    this.addFieldCoverageChildRow();
    this.addDoctorCommitteeRow();

    this.currentId = this.investigationService.currentid;
    this.AcuteFlaccidParalysisForm.controls['patientID'].setValue(this.currentId);

    this.calculateCompletionPercentage();
    this.AcuteFlaccidParalysisForm.valueChanges.subscribe(() => {
      this.calculateCompletionPercentage();
    });

    this.investigationService
      .getByIdAcuteFlaccidParalysis(this.currentId)
      .subscribe(
        (res) => {
          var v = res.data;
          if (!v) {
            this.calculateCompletionPercentage();
            return;
          }

          const dateFields = [
            'reportDate', 'dateOnsetParalysis',
            'clinicalExaminationCaseDateAdmissionHospital',
            'clinicalExaminationCaseDateOnsetParalysis',
            'clinicalExaminationCaseDateImmobilizationCompleted',
            'feverDate', 'diarrheaDate', 'vomitDate', 'coryzaDate',
            'epidemiologicalInvestigationDateEntryIntoCountry',
            'epidemiologicalInvestigationDate',
            'routineDosesZeroDate', 'routineSabine1Date', 'routineSalk1Date',
            'routineSabine2Date', 'routineSalk2Date', 'routineSabine3Date', 'routineSalk3Date',
            'routine4Date', 'routine5Date', 'routineStimulantDate',
            'csf1LastDoseDate', 'csf1SampleCollectionDate', 'csf1SampleSendDate',
            'csf2LastDoseDate', 'csf2SampleCollectionDate', 'csf2SampleSendDate',
            'csf3LastDoseDate', 'csf3SampleCollectionDate', 'csf3SampleSendDate',
            'csfReceiptDate',
            'cluster1ParalysisDate', 'cluster2ParalysisDate', 'cluster3ParalysisDate',
            'sample1CollectionDate', 'sample1SendDate',
            'sample2CollectionDate', 'sample2SendDate', 'sampleReceiptDate',
            'followUpAfter60DaysFollowUpDate', 'followUpAfter60DaysDateDeath',
            'signPreventiveDirectorDate', 'signSurveillanceAdminDate', 'signSurveillanceDirectorateDate',
          ];
          dateFields.forEach(field => {
            if (v[field]) {
              v[field] = this.datePipe.transform(v[field], 'yyyy-MM-dd');
            }
          });

          this.AcuteFlaccidParalysisForm.patchValue(v);

          // Deserialize JSON arrays
          const formArrayConfigs = [
            { jsonField: 'caseMovementsJson', array: this.caseMovements, createFn: (d: any) => this.createCaseMovementRow(d) },
            { jsonField: 'visitorsToAreaJson', array: this.visitorsToArea, createFn: (d: any) => this.createVisitorRow(d) },
            { jsonField: 'afpCasesResidenceAreaJson', array: this.afpCasesResidenceArea, createFn: (d: any) => this.createAfpCaseRow(d) },
            { jsonField: 'healthAuthoritiesVisitedJson', array: this.healthAuthoritiesVisited, createFn: (d: any) => this.createHealthAuthorityVisitedRow(d) },
            { jsonField: 'healthFacilityActionsJson', array: this.healthFacilityActions, createFn: (d: any) => this.createHealthFacilityActionRow(d) },
            { jsonField: 'campaignDosesJson', array: this.campaignDoses, createFn: (d: any) => this.createCampaignDoseRow(d) },
            { jsonField: 'salkInitiativeJson', array: this.salkInitiative, createFn: (d: any) => this.createSalkInitiativeRow(d) },
            { jsonField: 'contactsJson', array: this.contacts, createFn: (d: any) => this.createContactRow(d) },
            { jsonField: 'fieldCoverageChildrenJson', array: this.fieldCoverageChildren, createFn: (d: any) => this.createFieldCoverageChildRow(d) },
            { jsonField: 'doctorsFollowUpCommitteeJson', array: this.doctorsFollowUpCommittee, createFn: (d: any) => this.createDoctorCommitteeRow(d) },
          ];

          formArrayConfigs.forEach(config => {
            if (v[config.jsonField]) {
              try {
                const items = JSON.parse(v[config.jsonField]);
                if (Array.isArray(items) && items.length > 0) {
                  while (config.array.length > 0) config.array.removeAt(0);
                  items.forEach((item: any) => config.array.push(config.createFn(item)));
                }
              } catch (e) {}
            }
          });

          // Deserialize field coverage rates summary
          if (v.fieldCoverageRatesSummaryJson) {
            try {
              const rates = JSON.parse(v.fieldCoverageRatesSummaryJson);
              if (rates && typeof rates === 'object') {
                this.AcuteFlaccidParalysisForm.patchValue(rates);
              }
            } catch (e) {}
          }

          // Backward compat: migrate old numbered fields to JSON arrays
          if (this.caseMovements.length <= 1 && !this.hasNonEmptyRow(this.caseMovements)) {
            this.migrateOldMovements(v);
          }
          if (this.visitorsToArea.length <= 1 && !this.hasNonEmptyRow(this.visitorsToArea)) {
            this.migrateOldVisitors(v);
          }
          if (this.afpCasesResidenceArea.length <= 1 && !this.hasNonEmptyRow(this.afpCasesResidenceArea)) {
            if (v.before60daysName || v.before60daysAdress) {
              while (this.afpCasesResidenceArea.length > 0) this.afpCasesResidenceArea.removeAt(0);
              this.afpCasesResidenceArea.push(this.createAfpCaseRow({
                name: v.before60daysName, address: v.before60daysAdress,
                dateOnsetParalysis: v.before60daysDateOnsetParalysis,
              }));
            }
          }
          if (this.healthAuthoritiesVisited.length <= 1 && !this.hasNonEmptyRow(this.healthAuthoritiesVisited)) {
            this.migrateOldHealthAuthorities(v);
          }
          if (this.contacts.length <= 1 && !this.hasNonEmptyRow(this.contacts)) {
            this.migrateOldContacts(v);
          }
          if (this.campaignDoses.length <= 1 && !this.hasNonEmptyRow(this.campaignDoses)) {
            this.migrateOldCampaignDoses(v);
          }
          if (this.doctorsFollowUpCommittee.length <= 1 && !this.hasNonEmptyRow(this.doctorsFollowUpCommittee)) {
            this.migrateOldDoctorsCommittee(v);
          }

          this.calculateCompletionPercentage();
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => { this.userMsg.error(res); });
        }
      );
  }

  // #region Backward Compat Migrations
  private hasNonEmptyRow(arr: FormArray): boolean {
    if (!arr || arr.length === 0) return false;
    return arr.controls.some(row => {
      const val = (row as FormGroup).value;
      return Object.values(val).some(v => v !== null && v !== '' && v !== undefined);
    });
  }

  private migrateOldMovements(v: any): void {
    const rows: any[] = [];
    [1, 2, 3, 4].forEach(i => {
      if (v[`movesAdress${i}`] || v[`movesAreaName${i}`]) {
        rows.push({
          address: v[`movesAdress${i}`], areaName: v[`movesAreaName${i}`],
          fromDate: v[`movesFromDate${i}`], toDate: v[`movesToDate${i}`],
        });
      }
    });
    if (rows.length > 0) {
      while (this.caseMovements.length > 0) this.caseMovements.removeAt(0);
      rows.forEach(r => this.caseMovements.push(this.createCaseMovementRow(r)));
    }
  }

  private migrateOldCases(v: any, target: string): void {
    const arr = this.afpCasesResidenceArea;
    const rows: any[] = [];
    [1, 2, 3, 4].forEach(i => {
      if (v[`casesName${i}`] || v[`casesAdress${i}`]) {
        rows.push({
          name: v[`casesName${i}`], address: v[`casesAdress${i}`],
          dateOnsetParalysis: v[`casesDateOnsetParalysis${i}`],
        });
      }
    });
    if (rows.length > 0) {
      while (arr.length > 0) arr.removeAt(0);
      rows.forEach(r => arr.push(this.createAfpCaseRow(r)));
    }
  }

  private migrateOldVisitors(v: any): void {
    const rows: any[] = [];
    [1, 2, 3].forEach(i => {
      if (v[`visitsName${i}`] || v[`visitsAddress${i}`]) {
        rows.push({
          visitorName: v[`visitsName${i}`], relevance: v[`visitsRelevance${i}`],
          address: v[`visitsAddress${i}`], fromDate: v[`visitsFromDate${i}`], toDate: v[`visitsToDate${i}`],
        });
      }
    });
    if (rows.length > 0) {
      while (this.visitorsToArea.length > 0) this.visitorsToArea.removeAt(0);
      rows.forEach(r => this.visitorsToArea.push(this.createVisitorRow(r)));
    }
  }

  private migrateOldHealthAuthorities(v: any): void {
    const rows: any[] = [];
    [1, 2, 3, 4].forEach(i => {
      if (v[`nameHealthAuthority${i}`] || v[`addressHealthFacility${i}`]) {
        rows.push({
          healthAuthorityName: v[`nameHealthAuthority${i}`],
          attendingPhysicianName: v[`nameAttendingPhysician${i}`],
          healthFacilityAddress: v[`addressHealthFacility${i}`],
          fromDate: v[`healthAuthorityFromDate${i}`], toDate: v[`healthAuthorityToDate${i}`],
          immediatelyReported: v[`immediatelyReportedSituation${i}`] != null ? v[`immediatelyReportedSituation${i}`] + '' : null,
        });
      }
    });
    if (rows.length > 0) {
      while (this.healthAuthoritiesVisited.length > 0) this.healthAuthoritiesVisited.removeAt(0);
      rows.forEach(r => this.healthAuthoritiesVisited.push(this.createHealthAuthorityVisitedRow(r)));
    }
  }

  private migrateOldContacts(v: any): void {
    const rows: any[] = [];
    [1, 2, 3].forEach(i => {
      if (v[`dangerousCases${i}NameContact`]) {
        rows.push({
          contactName: v[`dangerousCases${i}NameContact`], ageMonths: v[`dangerousCases${i}AgeMonths`],
          kinship: v[`dangerousCases${i}Kinship`], dateSampleTaken: v[`dangerousCases${i}DateSampleTaken`],
          dateSent: v[`dangerousCases${i}DateSent`],
        });
      }
    });
    [1, 2].forEach(i => {
      if (v[`casesNotHaveSamples${i}NameContact`]) {
        rows.push({
          contactName: v[`casesNotHaveSamples${i}NameContact`], ageMonths: v[`casesNotHaveSamples${i}AgeMonts`],
          kinship: v[`casesNotHaveSamples${i}Kinship`], dateSampleTaken: v[`casesNotHaveSamples${i}DateSampleTaken`],
          dateSent: v[`casesNotHaveSamples${i}DateSent`],
        });
      }
    });
    if (rows.length > 0) {
      while (this.contacts.length > 0) this.contacts.removeAt(0);
      rows.forEach(r => this.contacts.push(this.createContactRow(r)));
    }
  }

  private migrateOldCampaignDoses(v: any): void {
    const fields = [
      { date: 'campaignDosesZeroDate', source: 'campaignDosesZeroSource' },
      { date: 'campaignSabine1Date', source: 'campaignSabine1Source' },
      { date: 'campaignSalk1Date', source: 'campaignSalk1Source' },
      { date: 'campaignSabine2Date', source: 'campaignSabine2Source' },
      { date: 'campaignSalk2Date', source: 'campaignSalk2Source' },
      { date: 'campaignSabine3Date', source: 'campaignSabine3Source' },
      { date: 'campaignSalk3Date', source: 'campaignSalk3Source' },
      { date: 'campaign4Date', source: 'campaign4Source' },
      { date: 'campaign5Date', source: 'campaign5Source' },
      { date: 'campaignStimulantDate', source: 'campaignStimulantSource' },
    ];
    const rows: any[] = [];
    fields.forEach(f => {
      if (v[f.date] || v[f.source]) {
        rows.push({ date: v[f.date], source: v[f.source] });
      }
    });
    if (rows.length > 0) {
      while (this.campaignDoses.length > 0) this.campaignDoses.removeAt(0);
      rows.forEach(r => this.campaignDoses.push(this.createCampaignDoseRow(r)));
    }
  }

  private migrateOldDoctorsCommittee(v: any): void {
    const rows: any[] = [];
    [1, 2, 3].forEach(i => {
      if (v[`doctorsFollowUpCommitteeName${i}`]) {
        rows.push({
          name: v[`doctorsFollowUpCommitteeName${i}`],
          specialization: v[`doctorsFollowUpCommitteeSpecialization${i}`],
          date: v[`doctorsFollowUpCommitteeDate${i}`],
        });
      }
    });
    if (rows.length > 0) {
      while (this.doctorsFollowUpCommittee.length > 0) this.doctorsFollowUpCommittee.removeAt(0);
      rows.forEach(r => this.doctorsFollowUpCommittee.push(this.createDoctorCommitteeRow(r)));
    }
  }
  // #endregion

  save(): void {
    Object.entries(this.AcuteFlaccidParalysisForm.controls).map(
      ([key, value]) => {
        if (value instanceof FormControl && (value.value == 'null' || value.value === ''))
          value.setValue(null);
      });

    this.calculateCompletionPercentage();
    this.AcuteFlaccidParalysisForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );
    this.AcuteFlaccidParalysisForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);

    const payload: any = { ...this.AcuteFlaccidParalysisForm.value };

    // Serialize field coverage rates summary to JSON
    const fcRateKeys = Object.keys(payload).filter(k => k.startsWith('fcRate'));
    const fcRates: any = {};
    fcRateKeys.forEach(k => { fcRates[k] = payload[k]; delete payload[k]; });
    payload.fieldCoverageRatesSummaryJson = JSON.stringify(fcRates);

    // Serialize FormArrays to JSON
    const formArrayConfigs = [
      { arrayName: 'caseMovements', jsonField: 'caseMovementsJson' },
      { arrayName: 'visitorsToArea', jsonField: 'visitorsToAreaJson' },
      { arrayName: 'afpCasesResidenceArea', jsonField: 'afpCasesResidenceAreaJson' },
      { arrayName: 'healthAuthoritiesVisited', jsonField: 'healthAuthoritiesVisitedJson' },
      { arrayName: 'healthFacilityActions', jsonField: 'healthFacilityActionsJson' },
      { arrayName: 'campaignDoses', jsonField: 'campaignDosesJson' },
      { arrayName: 'salkInitiative', jsonField: 'salkInitiativeJson' },
      { arrayName: 'contacts', jsonField: 'contactsJson' },
      { arrayName: 'fieldCoverageChildren', jsonField: 'fieldCoverageChildrenJson' },
      { arrayName: 'doctorsFollowUpCommittee', jsonField: 'doctorsFollowUpCommitteeJson' },
    ];

    formArrayConfigs.forEach(config => {
      const formArray = this.AcuteFlaccidParalysisForm.get(config.arrayName) as FormArray;
      payload[config.jsonField] = JSON.stringify(formArray.value);
      delete payload[config.arrayName];
    });

    if (payload.id != null) {
      this.investigationService
        .updateAcuteFlaccidParalysis(payload)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => { this.userMsg.success(res); });
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => { this.userMsg.error(res); });
          }
        );
    } else {
      this.investigationService
        .addInvestigationAcuteFlaccidParalysis(payload)
        .subscribe(
          (response: any) => {
            if (response) {
              if (response?.data?.id != null) {
                this.AcuteFlaccidParalysisForm.controls['id'].setValue(response.data.id);
              }
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => { this.userMsg.success(res); });
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => { this.userMsg.error(res); });
          }
        );
    }
  }

  // #region Completion Percentage
  calculateCompletionPercentage(): void {
    const data = this.AcuteFlaccidParalysisForm?.value ?? {};
    const excludedFields = [
      'id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate',
      'caseMovements', 'visitorsToArea', 'afpCasesResidenceArea',
      'healthAuthoritiesVisited', 'healthFacilityActions', 'campaignDoses', 'salkInitiative',
      'contacts', 'fieldCoverageChildren', 'doctorsFollowUpCommittee',
      'fcRateZeroChildren', 'fcRateZeroVaccinated', 'fcRateZeroPercentage',
      'fcRate1SabinChildren', 'fcRate1SabinVaccinated', 'fcRate1SabinPercentage',
      'fcRate1SalkChildren', 'fcRate1SalkVaccinated', 'fcRate1SalkPercentage',
      'fcRate2SabinChildren', 'fcRate2SabinVaccinated', 'fcRate2SabinPercentage',
      'fcRate2SalkChildren', 'fcRate2SalkVaccinated', 'fcRate2SalkPercentage',
      'fcRate3SabinChildren', 'fcRate3SabinVaccinated', 'fcRate3SabinPercentage',
      'fcRate3SalkChildren', 'fcRate3SalkVaccinated', 'fcRate3SalkPercentage',
      'fcRate4Children', 'fcRate4Vaccinated', 'fcRate4Percentage',
      'fcRate5Children', 'fcRate5Vaccinated', 'fcRate5Percentage',
      'fcRateBoosterChildren', 'fcRateBoosterVaccinated', 'fcRateBoosterPercentage',
    ];

    const baseFields = Object.keys(data).filter(key => !excludedFields.includes(key));
    let totalFields = baseFields.length;
    let filledFields = baseFields.reduce((acc, key) => {
      return this.isFieldFilled(data[key]) ? acc + 1 : acc;
    }, 0);

    const arrays: FormArray[] = [
      this.caseMovements, this.visitorsToArea,
      this.afpCasesResidenceArea, this.healthAuthoritiesVisited, this.healthFacilityActions,
      this.campaignDoses, this.salkInitiative, this.contacts,
      this.fieldCoverageChildren, this.doctorsFollowUpCommittee,
    ];
    arrays.forEach(arr => {
      if (arr && arr.controls) {
        const stats = this.countFormArrayCompletion(arr);
        totalFields += stats.totalFields;
        filledFields += stats.filledFields;
      }
    });

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filledFields;
  }

  private countFormArrayCompletion(formArray: FormArray): { totalFields: number; filledFields: number } {
    if (!formArray || !Array.isArray(formArray.controls) || formArray.controls.length === 0) {
      return { totalFields: 0, filledFields: 0 };
    }
    let totalFields = 0;
    let filledFields = 0;
    formArray.controls.forEach((row) => {
      const rowValue = (row as FormGroup).value;
      const rowKeys = Object.keys(rowValue).filter(key => key !== 'id');
      totalFields += rowKeys.length;
      rowKeys.forEach(key => {
        if (this.isFieldFilled(rowValue[key])) filledFields += 1;
      });
    });
    return { totalFields, filledFields };
  }

  private isFieldFilled(value: any): boolean {
    if (value === null || value === undefined || value === '' || value === 'null') return false;
    if (typeof value === 'boolean') return value;
    return true;
  }
  // #endregion
}
