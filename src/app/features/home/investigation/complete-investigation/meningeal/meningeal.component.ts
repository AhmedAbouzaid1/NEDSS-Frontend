import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { InvestigationService } from '../../services/investigation.service';
import { finalize } from 'rxjs/operators';

type FollowUpRoundId = '48h' | '2weeks' | '4weeks';

@Component({
  selector: 'app-meningeal',
  host: { class: 'investigation-form' },
  templateUrl: './meningeal.component.html',
  styleUrls: ['./meningeal.component.css'],
})
export class MeningealComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName: string;
  currentId: any;
  diseaseGroupID: any;
  patient: any = {};
  investigationEntryDate: string | null = null;
  governorates: any[] = [];
  facilityHealthAdministrations: any[] = [];
  countries: any[] = [];
  governoratesLoading = false;
  facilityHealthAdministrationsLoading = false;
  countriesLoading = false;
  homeHealthAdministrations: any[] = [];
  homeCities: any[] = [];
  jobCategories: any[] = [];
  incidentSources: any[] = [];
  finalResults: any[] = [];
  homeHealthAdministrationsLoading = false;
  homeCitiesLoading = false;
  jobCategoriesLoading = false;
  incidentSourcesLoading = false;
  finalResultsLoading = false;
  private suppressFacilityAdministrationReset = false;
  private suppressHomeReset = false;

  readonly yesNoOptions = [
    { value: 1, label: 'نعم', labelEn: 'Yes' },
    { value: 2, label: 'لا', labelEn: 'No' },
  ];
  readonly yesNoUnknownOptions = [
    { value: 1, label: 'نعم', labelEn: 'Yes' },
    { value: 2, label: 'لا', labelEn: 'No' },
    { value: 3, label: 'غير معروف', labelEn: 'Unknown' },
  ];
  readonly diseaseTypeOptions = [
    { value: 1, label: 'اشتباه التهاب سحائي', labelEn: 'Suspected meningitis' },
    { value: 2, label: 'اشتباه التهاب بالمخ', labelEn: 'Suspected encephalitis' },
  ];
  readonly currentHealthStatusOptions = [
    { value: 1, label: 'وفاة', labelEn: 'Death' },
    { value: 2, label: 'سيئة', labelEn: 'Poor' },
    { value: 3, label: 'نفس الوضع', labelEn: 'Unchanged' },
    { value: 4, label: 'تحسن', labelEn: 'Improved' },
  ];
  readonly contactTypeOptions = [
    { value: 1, label: 'منزل', labelEn: 'Home' },
    { value: 2, label: 'عمل', labelEn: 'Work' },
    { value: 3, label: 'مدرسة', labelEn: 'School' },
    { value: 4, label: 'أخرى', labelEn: 'Other' },
  ];
  readonly timeUnitOptions = [
    { value: 1, label: 'ساعة', labelEn: 'Hour' },
    { value: 2, label: 'يوم', labelEn: 'Day' },
  ];
  readonly movementFacilitiesCountOptions = [
    { value: 1, label: '2 منشأة', labelEn: '2 facilities' },
    { value: 2, label: '3 منشآت أو أكثر', labelEn: '3 or more facilities' },
  ];
  readonly followUpDoneOptions = [
    { value: 1, label: 'تمت', labelEn: 'Done' },
    { value: 2, label: 'لم تتم', labelEn: 'Not done' },
  ];
  readonly complicationGroups = [
    {
      titleKey: 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.NEUROLOGICAL_COMPLICATIONS',
      items: ['convulsive_episodes', 'epileptic_episodes'],
    },
    {
      titleKey: 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.SENSORY_COMPLICATIONS',
      items: ['hearing', 'vision', 'speech', 'eye_squint'],
    },
    {
      titleKey: 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.COGNITIVE_COMPLICATIONS',
      items: ['memory_weakness', 'communication_weakness'],
    },
    {
      titleKey: 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.LIMB_COMPLICATIONS',
      items: ['limb_weakness', 'limb_paralysis'],
    },
    {
      titleKey: 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.OTHER_COMPLICATIONS',
      items: ['other_complications'],
    },
  ];
  readonly genderOptions = [
    { value: 1, label: 'ذكر', labelEn: 'Male' },
    { value: 2, label: 'أنثى', labelEn: 'Female' },
  ];
  readonly ageTypeOptions = [
    { value: 1, label: 'يوم', labelEn: 'Day' },
    { value: 2, label: 'شهر', labelEn: 'Month' },
    { value: 3, label: 'سنة', labelEn: 'Year' },
  ];
  private readonly jobCategoriesWithoutJobName = [1, 5, 6, 7];

  meningealForm: FormGroup;
  patientForm: FormGroup;

  constructor(
    private investigationService: InvestigationService,
    private generalDataService: GeneralDataService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private lookupsService: LookupsGetterService,
    private route: ActivatedRoute,
    private router: Router,
    private userMsg: UserMessageService
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id');
    this.diseaseGroupID = this.route.snapshot.paramMap.get('diseaseId');
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID === undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    const cachedPatient = this.investigationService.patient;
    if (cachedPatient?.firstName != null) {
      this.patientName = [cachedPatient.firstName, cachedPatient.secondName, cachedPatient.thirdName]
        .filter((x) => !!x)
        .join(' ');
    }

    this.meningealForm = this.fb.group({
      id: new FormControl(),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      investigationCompletePercentage: new FormControl(0),
      diseaseType: new FormControl(null),
      investigationDate: new FormControl(null),
      lastFacilityVisitDate: new FormControl(null),
      facilityGovernorateId: new FormControl(null),
      facilityHealthAdministrationId: new FormControl(null),
      facilityVillageOrStreet: new FormControl(null),
      traveledAbroad: new FormControl(null),
      travelCountryId: new FormControl(null),
      travelArrivalDate: new FormControl(null),
      lastFollowUpDate: new FormControl(null),
      currentHealthStatus: new FormControl(null),
      contactWithSimilarCase: new FormControl(null),
      contactCaseName: new FormControl(null),
      contactType: new FormControl(null),
      contactTypeOther: new FormControl(null),
      contactHospitalized: new FormControl(null),
      contactHospitalName: new FormControl(null),
      contactHospitalAdmissionDate: new FormControl(null),
      contactFinalDiagnosis: new FormControl(null),
      contactTraveledAbroad: new FormControl(null),
      contactTravelCountryId: new FormControl(null),
      contactArrivalDate: new FormControl(null),
      hibVaccinated: new FormControl(null),
      hibLastDoseDate: new FormControl(null),
      meningococcalSchoolVaccinated: new FormControl(null),
      meningococcalSchoolLastDoseDate: new FormControl(null),
      meningococcalTravelVaccinated: new FormControl(null),
      meningococcalTravelLastDoseDate: new FormControl(null),
      wentToHospitalOnOnset: new FormControl(null),
      timeToDoctorValue: new FormControl(null),
      timeToDoctorUnit: new FormControl(null),
      firstFacilityVisitDate: new FormControl(null),
      visitedMultipleFacilities: new FormControl(null),
      facilitiesVisitedCount: new FormControl(null),
      firstFacilityName: new FormControl(null),
      currentHospitalName: new FormControl(null),
      movedBetweenFacilities: new FormControl(null),
      movementFacilitiesCount: new FormControl(null),
      contactsTracedAndManaged: new FormControl(null),
      chemoprophylaxisGiven: new FormControl(null),
      chemoprophylaxisContactsCount: new FormControl(null),
      relatedCasesIdentified: new FormControl(null),
      totalContactsCount: new FormControl(null),
      investigatorName: new FormControl(null),
      surveillanceOfficerName: new FormControl(null),
      preventiveDirectorName: new FormControl(null),
      administrationDirectorName: new FormControl(null),
      followUpRounds: this.fb.array([]),
    });

    this.meningealForm.get('facilityGovernorateId')?.valueChanges.subscribe((value) => {
      this.loadFacilityHealthAdministrations(value, this.suppressFacilityAdministrationReset);
    });

    this.patientForm = this.fb.group({
      firstName: new FormControl(null),
      secondName: new FormControl(null),
      thirdName: new FormControl(null),
      familyName: new FormControl(null),
      age: new FormControl(null),
      ageTypeId: new FormControl(null),
      genderId: new FormControl(null),
      phoneNo1: new FormControl(null),
      nationalityId: new FormControl(null),
      homeGovernmentId: new FormControl(null),
      homeHealthAdministrationId: new FormControl(null),
      homeCityId: new FormControl(null),
      livingAddress: new FormControl(null),
      patientJobCategoryId: new FormControl(null),
      patientJobName: new FormControl(null),
      incidentSourceId: new FormControl(null),
      infectionDate: new FormControl(null),
      finalResultId: new FormControl(null),
    });

    this.patientForm.get('homeGovernmentId')?.valueChanges.subscribe((value) => {
      this.loadHomeLookups(value, this.suppressHomeReset);
    });
    this.patientForm.get('patientJobCategoryId')?.valueChanges.subscribe((value) => {
      if (this.jobCategoriesWithoutJobName.includes(Number(value))) {
        this.patientForm.get('patientJobName')?.setValue(null);
      }
    });
  }

  ngOnInit(): void {
    this.ensureDefaultFollowUps();
    this.loadGovernorates();
    this.loadCountries();
    this.loadJobCategories();
    this.loadFinalResults();
    if (this.currentId != null) {
      this.loadPatient();
      this.getById();
    } else {
      this.router.navigateByUrl('/home/investigations');
    }
  }

  get followUpRounds(): FormArray {
    return this.meningealForm.get('followUpRounds') as FormArray;
  }

  get isStudentOrGathering(): boolean {
    if (Number(this.patientForm.get('patientJobCategoryId')?.value) === 1) {
      return true;
    }
    const categoryName = this.jobCategories.find(
      (c) => c.id === this.patientForm.get('patientJobCategoryId')?.value
    )?.arabicName;
    const job = `${this.patientForm.get('patientJobName')?.value ?? ''} ${categoryName ?? ''}`;
    return job.includes('طالب') || job.includes('تجمع');
  }

  get showJobName(): boolean {
    const category = this.patientForm.get('patientJobCategoryId')?.value;
    return category != null && !this.jobCategoriesWithoutJobName.includes(Number(category));
  }

  get identityLockedByNationalId(): boolean {
    return (
      this.patient?.relationShipDegreeId === 0 &&
      Number(this.patient?.nationalityId) === 59 &&
      !!this.patient?.nationalId
    );
  }

  get phoneError(): string {
    const phone = this.patientForm.get('phoneNo1')?.value;
    if (!phone) {
      return '';
    }
    const mode = this.generalDataService.isInternationalPhoneFormat(phone) ? 'international' : 'local';
    return this.generalDataService.validatePhoneNumber(String(phone), false, mode);
  }

  get onsetDateError(): string {
    const onset = this.patientForm.get('infectionDate')?.value;
    if (!onset) {
      return '';
    }
    if (!this.generalDataService.isDateOnOrAfter(onset, this.patient?.birthDate)) {
      return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ONSET_BEFORE_BIRTH';
    }
    if (!this.generalDataService.checkFeverDateNotAfterDiscovery(onset, this.patient?.caseDiscoveryDate)) {
      return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ONSET_AFTER_DISCOVERY';
    }
    if (!this.generalDataService.isDateOnOrAfter(this.patient?.hospitalEntryDate, onset)) {
      return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ONSET_AFTER_ADMISSION';
    }
    return '';
  }

  get finalDiagnosisDisplay(): string {
    if (this.patient?.finalDiagonistics) {
      return this.patient.finalDiagonistics;
    }
    const data = this.patient?.finalDiagonisticsData ?? [];
    return data.map((d: any) => d.finalResult).filter((x: any) => !!x).join(' , ');
  }

  get reportDurationDays(): number | null {
    return this.daysBetween(this.meningealForm.get('investigationDate')?.value, this.investigationEntryDate);
  }

  get onsetToAdmissionDays(): number | null {
    return this.daysBetween(this.patientForm.get('infectionDate')?.value, this.patient?.hospitalEntryDate);
  }

  createFollowUpRound(round: FollowUpRoundId): FormGroup {
    const group = this.fb.group({
      round: new FormControl(round),
      followupDone: new FormControl(null),
      followUpDate: new FormControl(null),
      complicationsOccurred: new FormControl(null),
      complicationDate: new FormControl(null),
      complications: new FormControl([]),
      otherComplicationsDetails: new FormControl(null),
    });
    group.get('complicationsOccurred')?.valueChanges.subscribe((value) => {
      if (value !== 1 && (group.get('complications')?.value ?? []).length > 0) {
        group.get('complications')?.setValue([]);
        group.get('otherComplicationsDetails')?.setValue(null);
        this.calculateCompletionPercentage();
      }
    });
    return group;
  }

  private ensureDefaultFollowUps(): void {
    const expected: FollowUpRoundId[] = ['48h', '2weeks', '4weeks'];
    const existing = this.followUpRounds.controls.map((c) => c.get('round')?.value);
    expected
      .filter((r) => !existing.includes(r))
      .forEach((r) => this.followUpRounds.push(this.createFollowUpRound(r)));
  }

  private toDateInput(value: any): string | null {
    if (!value) {
      return null;
    }
    return this.datePipe.transform(value, 'yyyy-MM-dd');
  }

  private daysBetween(from: any, to: any): number | null {
    if (!from || !to) {
      return null;
    }
    const start = new Date(this.toDateInput(from) as string).getTime();
    const end = new Date(this.toDateInput(to) as string).getTime();
    if (isNaN(start) || isNaN(end)) {
      return null;
    }
    return Math.round((end - start) / 86400000);
  }

  private applyFormData(data: any): void {
    const followUps = this.safeParseArray(data?.followUpRoundsJson);
    this.investigationEntryDate = data?.createdDate ?? null;

    this.followUpRounds.clear();
    this.suppressFacilityAdministrationReset = true;

    const { followUpRoundsJson, createdDate, ...rest } = data ?? {};
    this.meningealForm.patchValue({
      ...rest,
      investigationDate: this.toDateInput(data?.investigationDate),
      lastFacilityVisitDate: this.toDateInput(data?.lastFacilityVisitDate),
      travelArrivalDate: this.toDateInput(data?.travelArrivalDate),
      lastFollowUpDate: this.toDateInput(data?.lastFollowUpDate),
      contactHospitalAdmissionDate: this.toDateInput(data?.contactHospitalAdmissionDate),
      contactArrivalDate: this.toDateInput(data?.contactArrivalDate),
      hibLastDoseDate: this.toDateInput(data?.hibLastDoseDate),
      meningococcalSchoolLastDoseDate: this.toDateInput(data?.meningococcalSchoolLastDoseDate),
      meningococcalTravelLastDoseDate: this.toDateInput(data?.meningococcalTravelLastDoseDate),
      firstFacilityVisitDate: this.toDateInput(data?.firstFacilityVisitDate),
    });
    this.suppressFacilityAdministrationReset = false;

    followUps.forEach((roundData: any) => {
      const round = this.createFollowUpRound((roundData?.round as FollowUpRoundId) || '48h');
      round.patchValue({
        ...roundData,
        followUpDate: this.toDateInput(roundData?.followUpDate),
        complicationDate: this.toDateInput(roundData?.complicationDate),
        complications: Array.isArray(roundData?.complications) ? roundData.complications : [],
      });
      this.followUpRounds.push(round);
    });
    this.ensureDefaultFollowUps();
  }

  private loadPatient(): void {
    this.generalDataService.getPatientByIdForInvestigation(this.currentId).subscribe((res: any) => {
      this.patient = res?.data ?? {};
      if (this.patient?.firstName) {
        this.patientName = [this.patient.firstName, this.patient.secondName, this.patient.thirdName]
          .filter((x) => !!x)
          .join(' ');
        const cached = this.investigationService.patient;
        cached.firstName = this.patient.firstName;
        cached.secondName = this.patient.secondName;
        cached.thirdName = this.patient.thirdName;
        cached.familyName = this.patient.familyName;
        cached.phoneNo1 = this.patient.phoneNo1;
        cached.livingAddress = this.patient.livingAddress;
      }
      this.applyPatientData();
    });
  }

  private applyPatientData(): void {
    const p = this.patient ?? {};
    this.suppressHomeReset = true;
    this.patientForm.patchValue({
      firstName: p.firstName ?? null,
      secondName: p.secondName ?? null,
      thirdName: p.thirdName ?? null,
      familyName: p.familyName ?? null,
      age: p.age ?? null,
      ageTypeId: p.ageTypeId ?? null,
      genderId: p.genderId ?? null,
      phoneNo1: this.generalDataService.toLocalPhoneNumber(p.phoneNo1) || null,
      nationalityId: p.nationalityId ?? null,
      homeGovernmentId: p.homeGovernmentId ?? null,
      homeHealthAdministrationId: p.homeHealthAdministrationId ?? null,
      homeCityId: p.homeCityId ?? null,
      livingAddress: p.livingAddress ?? null,
      patientJobCategoryId: p.patientJobCategoryId ?? null,
      patientJobName: p.patientJobName ?? null,
      incidentSourceId: p.incidentSourceId ?? null,
      infectionDate: this.toDateInput(p.infectionDate),
      finalResultId: p.finalResultId ?? null,
    });
    this.suppressHomeReset = false;
    ['age', 'ageTypeId', 'genderId'].forEach((name) => {
      const control = this.patientForm.get(name);
      this.identityLockedByNationalId ? control?.disable({ emitEvent: false }) : control?.enable({ emitEvent: false });
    });
    this.patientForm.markAsPristine();
    this.loadIncidentSources();
  }

  private loadHomeLookups(governorateId: any, preserveSelection = false): void {
    if (!preserveSelection) {
      this.patientForm.get('homeHealthAdministrationId')?.setValue(null, { emitEvent: false });
      this.patientForm.get('homeCityId')?.setValue(null, { emitEvent: false });
    }
    if (!governorateId) {
      this.homeHealthAdministrations = [];
      this.homeCities = [];
      return;
    }
    this.homeHealthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: Number(governorateId) })
      .pipe(finalize(() => (this.homeHealthAdministrationsLoading = false)))
      .subscribe((result: any) => {
        this.homeHealthAdministrations = result?.data ?? [];
      });
    this.homeCitiesLoading = true;
    this.lookupsService
      .getPageCitys({ governmentID: Number(governorateId) })
      .pipe(finalize(() => (this.homeCitiesLoading = false)))
      .subscribe((result: any) => {
        this.homeCities = result?.data ?? [];
      });
  }

  private loadJobCategories(): void {
    this.jobCategoriesLoading = true;
    this.lookupsService
      .getAllPatientJobCategorys()
      .pipe(finalize(() => (this.jobCategoriesLoading = false)))
      .subscribe((result: any) => {
        this.jobCategories = (result?.data ?? []).filter((x: any) => x?.id > 0);
      });
  }

  private loadFinalResults(): void {
    this.finalResultsLoading = true;
    this.lookupsService
      .getAllFinalResults()
      .pipe(finalize(() => (this.finalResultsLoading = false)))
      .subscribe((result: any) => {
        this.finalResults = (result?.data ?? []).filter((x: any) => x?.id > 0);
      });
  }

  private loadIncidentSources(): void {
    const healthAdministrationId = Number(this.patient?.incidentHealthAdministrationId);
    const current = this.patient?.incidentSourceId
      ? [{ id: this.patient.incidentSourceId, arabicName: this.patient.incidentSourceName, englishName: this.patient.incidentSourceName }]
      : [];
    if (!(healthAdministrationId > 0)) {
      this.incidentSources = current;
      return;
    }
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationId, forHome: false })
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
      .subscribe((result: any) => {
        const data = Array.isArray(result?.data) ? result.data : result?.data?.items ?? [];
        const rows = data.filter((x: any) => x?.id > 0);
        this.incidentSources = current.length && !rows.some((x: any) => x.id === current[0].id)
          ? [...current, ...rows]
          : rows;
      });
  }

  private patientValidationError(): string {
    if (!this.patientForm.get('firstName')?.value?.toString().trim()) {
      return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.FIRST_NAME_REQUIRED';
    }
    const age = this.patientForm.get('age')?.value;
    if (age != null && age !== '' && (Number(age) < 0 || this.patientForm.get('ageTypeId')?.value == null)) {
      return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.AGE_INVALID';
    }
    return this.phoneError || this.onsetDateError;
  }

  private buildPatientPayload(): any {
    const value = this.patientForm.getRawValue();
    const toNumber = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v));
    return {
      ...value,
      patientId: Number(this.currentId),
      age: toNumber(value.age),
      ageTypeId: toNumber(value.ageTypeId),
      genderId: toNumber(value.genderId),
      nationalityId: toNumber(value.nationalityId),
      homeGovernmentId: toNumber(value.homeGovernmentId),
      homeHealthAdministrationId: toNumber(value.homeHealthAdministrationId),
      homeCityId: toNumber(value.homeCityId),
      patientJobCategoryId: toNumber(value.patientJobCategoryId),
      patientJobName: this.showJobName ? value.patientJobName : null,
      incidentSourceId: toNumber(value.incidentSourceId),
      finalResultId: toNumber(value.finalResultId),
    };
  }

  private loadGovernorates(): void {
    this.governoratesLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governoratesLoading = false)))
      .subscribe((result: any) => {
        this.governorates = result?.data ?? [];
      });
  }

  private loadCountries(): void {
    this.countriesLoading = true;
    this.lookupsService
      .getAllNationalitys()
      .pipe(finalize(() => (this.countriesLoading = false)))
      .subscribe((result: any) => {
        this.countries = result?.data ?? [];
      });
  }

  private loadFacilityHealthAdministrations(governorateId: any, preserveSelection = false): void {
    if (!preserveSelection) {
      this.meningealForm.get('facilityHealthAdministrationId')?.setValue(null, { emitEvent: false });
    }
    if (!governorateId) {
      this.facilityHealthAdministrations = [];
      return;
    }
    this.facilityHealthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: Number(governorateId) })
      .pipe(finalize(() => (this.facilityHealthAdministrationsLoading = false)))
      .subscribe((result: any) => {
        this.facilityHealthAdministrations = result?.data ?? [];
      });
  }

  private safeParseArray(value: any): any[] {
    if (!value || typeof value !== 'string') {
      return [];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  getById(): void {
    this.investigationService.getByIdMeningeal(this.currentId).subscribe(
      (res) => {
        this.applyFormData(res?.data ?? {});
        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => {
          this.userMsg.error(msg);
        });
      }
    );
  }

  save(): void {
    if (!this.patientForm.dirty) {
      this.saveInvestigation();
      return;
    }
    const error = this.patientValidationError();
    if (error) {
      this.translateService.get(error).subscribe((msg: string) => this.userMsg.error(msg));
      return;
    }
    this.generalDataService.updateFromInvestigation(this.buildPatientPayload()).subscribe(() => {
      this.patientForm.markAsPristine();
      this.loadPatient();
      this.saveInvestigation();
    });
  }

  private saveInvestigation(): void {
    const payload = { ...this.meningealForm.value };
    payload.patientID = this.currentId;
    payload.diseaseGroupId = this.diseaseGroupID;

    this.prepareConditionalPayload(payload);
    payload.followUpRoundsJson = JSON.stringify(payload.followUpRounds ?? []);
    delete payload.followUpRounds;

    this.calculateCompletionPercentage();
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / (this.allControllesCount || 1)) * 100).toFixed(2)
    );

    const request$ = payload.id
      ? this.investigationService.updateSevereMeningeal(payload)
      : this.investigationService.addInvestigationMeningeal(payload);

    request$.subscribe(
      (response: any) => {
        if (!payload.id && response?.data?.id) {
          this.meningealForm.controls['id'].setValue(response.data.id);
          this.investigationEntryDate = response.data.createdDate ?? new Date().toISOString();
        }
        document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
        this.calculateCompletionPercentage();
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((msg: string) => {
          this.userMsg.success(msg);
        });
      },
      () => {}
    );
  }

  private prepareConditionalPayload(payload: any): void {
    if (!this.isStudentOrGathering) {
      payload.lastFacilityVisitDate = null;
      payload.facilityGovernorateId = null;
      payload.facilityHealthAdministrationId = null;
      payload.facilityVillageOrStreet = null;
    }
    if (payload.traveledAbroad !== 1) {
      payload.travelCountryId = null;
      payload.travelArrivalDate = null;
    }
    if (payload.contactWithSimilarCase !== 1) {
      payload.contactCaseName = null;
      payload.contactType = null;
      payload.contactTypeOther = null;
      payload.contactHospitalized = null;
      payload.contactFinalDiagnosis = null;
    }
    if (payload.contactType !== 4) {
      payload.contactTypeOther = null;
    }
    if (payload.contactHospitalized !== 1) {
      payload.contactHospitalName = null;
      payload.contactHospitalAdmissionDate = null;
    }
    if (payload.contactTraveledAbroad !== 1) {
      payload.contactTravelCountryId = null;
      payload.contactArrivalDate = null;
    }
    if (payload.hibVaccinated !== 1) {
      payload.hibLastDoseDate = null;
    }
    if (payload.meningococcalSchoolVaccinated !== 1) {
      payload.meningococcalSchoolLastDoseDate = null;
    }
    if (payload.meningococcalTravelVaccinated !== 1) {
      payload.meningococcalTravelLastDoseDate = null;
    }
    if (payload.visitedMultipleFacilities !== 1) {
      payload.facilitiesVisitedCount = null;
    }
    if (payload.movedBetweenFacilities !== 1) {
      payload.movementFacilitiesCount = null;
    }
    if (payload.contactsTracedAndManaged !== 1) {
      payload.totalContactsCount = null;
    }
    if (payload.chemoprophylaxisGiven !== 1) {
      payload.chemoprophylaxisContactsCount = null;
    }

    (payload.followUpRounds ?? []).forEach((round: any) => {
      if (round.followupDone !== 1) {
        round.followUpDate = null;
        round.complicationsOccurred = null;
      }
      if (round.complicationsOccurred !== 1) {
        round.complicationDate = null;
        round.complications = [];
      }
      if (!(round.complications ?? []).includes('other_complications')) {
        round.otherComplicationsDetails = null;
      }
    });
  }

  toggleComplication(roundIndex: number, complication: string, checked: boolean): void {
    const control = this.followUpRounds.at(roundIndex).get('complications');
    const current = (control?.value as string[]) ?? [];
    const updated = checked
      ? Array.from(new Set([...current, complication]))
      : current.filter((x) => x !== complication);
    control?.setValue(updated);
    if (!updated.includes('other_complications')) {
      this.followUpRounds.at(roundIndex).get('otherComplicationsDetails')?.setValue(null);
    }
    this.calculateCompletionPercentage();
  }

  hasComplication(roundIndex: number, complication: string): boolean {
    const values = (this.followUpRounds.at(roundIndex).get('complications')?.value as string[]) ?? [];
    return values.includes(complication);
  }

  getRoundLabel(round: string): string {
    if (round === '48h') return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ROUND_48H';
    if (round === '2weeks') return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ROUND_2WEEKS';
    return 'NEDSS.COMPLETE_INVESTEGATION.MENINGEAL.ROUND_4WEEKS';
  }

  label(ar: string, en: string): string {
    return this.currentLang === 'ar' ? ar : en;
  }

  optionLabel(option: { label: string; labelEn: string }): string {
    return this.label(option.label, option.labelEn);
  }

  calculateCompletionPercentage(): void {
    const excludedFields = [
      'id',
      'patientID',
      'diseaseGroupId',
      'investigationCompletePercentage',
      'round',
    ];
    let total = 0;
    let filled = 0;

    const count = (v: any): void => {
      if (Array.isArray(v)) {
        v.forEach((x) => count(x));
        return;
      }
      if (v !== null && typeof v === 'object') {
        Object.keys(v).forEach((k) => {
          if (excludedFields.includes(k)) {
            return;
          }
          const fieldValue = v[k];
          if (Array.isArray(fieldValue) && fieldValue.some((x) => x !== null && typeof x === 'object')) {
            count(fieldValue);
            return;
          }
          total++;
          const hasValue = Array.isArray(fieldValue)
            ? fieldValue.length > 0
            : fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
          if (hasValue) {
            filled++;
          }
        });
      }
    };

    count(this.meningealForm.value);
    this.allControllesCount = total;
    this.allFilledControlsCount = filled;
  }
}
