import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { InvestigationService } from '../../services/investigation.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-meningeal',
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
  governorates: any[] = [];
  schoolDistricts: any[] = [];
  countries: any[] = [];
  governoratesLoading: boolean = false;
  schoolDistrictsLoading: boolean = false;
  countriesLoading: boolean = false;
  private suppressSchoolDistrictReset = false;
  readonly yesNoOptions = ['yes', 'no'];
  readonly yesNoUnknownOptions = ['yes', 'no', 'unknown'];
  readonly diseaseTypeOptions = [
    'suspected_meningitis',
    'suspected_encephalitis',
  ];
  readonly complicationOptions = [
    'convulsive_episodes',
    'epileptic_episodes',
    'hearing_weakness',
    'hearing_loss',
    'vision_weakness',
    'vision_loss',
    'speech_weakness',
    'speech_loss',
    'eye_squint',
    'memory_weakness',
    'communication_weakness',
    'limb_weakness',
    'limb_paralysis',
  ];
  readonly complicationGroups = [
    {
      titleAr: 'مضاعفات عصبية',
      titleEn: 'Neurological complications',
      items: ['convulsive_episodes', 'epileptic_episodes'],
    },
    {
      titleAr: 'ضعف/فقدان الحواس',
      titleEn: 'Sensory weakness/loss',
      items: [
        'hearing_weakness',
        'hearing_loss',
        'vision_weakness',
        'vision_loss',
        'speech_weakness',
        'speech_loss',
        'eye_squint',
      ],
    },
    {
      titleAr: 'مضاعفات ذهنية',
      titleEn: 'Cognitive complications',
      items: ['memory_weakness', 'communication_weakness'],
    },
    {
      titleAr: 'ضعف/فقدان الأطراف',
      titleEn: 'Limb weakness/loss',
      items: ['limb_weakness', 'limb_paralysis'],
    },
  ];

  meningealForm: FormGroup;

  constructor(
    private investigationService: InvestigationService,
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
    if (
      this.investigationService.patient.firstName != null &&
      this.investigationService.patient.firstName !== undefined
    ) {
      this.patientName =
        this.investigationService.patient.firstName +
        ' ' +
        this.investigationService.patient.secondName +
        ' ' +
        this.investigationService.patient.thirdName;
    }

    this.meningealForm = this.fb.group({
      id: new FormControl(),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      investigationCompletePercentage: new FormControl(0),
      diseaseType: new FormControl(null),
      investigationDate: new FormControl(null),
      schoolOrGatheringName: new FormControl(null),
      lastVisitDate: new FormControl(null),
      schoolGovernorate: new FormControl(null),
      schoolAdministrationArea: new FormControl(null),
      traveledAbroad: new FormControl(null),
      travelDestinationCountry: new FormControl(null),
      arrivalDate: new FormControl(null),
      vaccinationHibStatus: new FormControl(null),
      vaccinationHibLastDoseDate: new FormControl(null),
      vaccinationMeningococcalSchoolsStatus: new FormControl(null),
      vaccinationMeningococcalSchoolsLastDoseDate: new FormControl(null),
      vaccinationMeningococcalTravelersStatus: new FormControl(null),
      vaccinationMeningococcalTravelersLastDoseDate: new FormControl(null),
      contactWithSimilarCase: new FormControl(null),
      contactPatientName: new FormControl(null),
      contactRelationship: new FormControl(null),
      contactHospitalized: new FormControl(null),
      contactHospitalName: new FormControl(null),
      contactHospitalAdmissionDate: new FormControl(null),
      contactFinalDiagnosis: new FormControl(null),
      contactTraveledAbroad: new FormControl(null),
      contactTravelCountry: new FormControl(null),
      contactArrivalDate: new FormControl(null),
      caseMovements: new FormControl(null),
      totalContactsCount: new FormControl(null),
      directContactsJson: new FormControl(null),
      followUpRoundsJson: new FormControl(null),
      caseSummary: new FormControl(null),
      notes: new FormControl(null),
      contacts: this.fb.array([]),
      followUpRounds: this.fb.array([]),
    });

    this.meningealForm.get('schoolGovernorate')?.valueChanges.subscribe((value) => {
      this.loadSchoolDistricts(value, this.suppressSchoolDistrictReset);
      if (!this.suppressSchoolDistrictReset) {
        this.meningealForm.get('schoolAdministrationArea')?.setValue(null, {
          emitEvent: false,
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();
    this.loadCountries();
    if (this.currentId != null) {
      this.getById();
    } else {
      this.router.navigateByUrl('/home/investigations');
    }
  }

  get contacts(): FormArray {
    return this.meningealForm.get('contacts') as FormArray;
  }

  get followUpRounds(): FormArray {
    return this.meningealForm.get('followUpRounds') as FormArray;
  }

  createContactRow(): FormGroup {
    return this.fb.group({
      contactSeq: new FormControl(this.contacts.length + 1),
      contactName: new FormControl(null),
      contactAge: new FormControl(null),
      contactRelationshipToCase: new FormControl(null),
      contactVaccinationStatus: new FormControl(null),
      contactChemoprophylaxisGiven: new FormControl(null),
      contactDrugUsed: new FormControl(null),
      contactDose: new FormControl(null),
    });
  }

  createFollowUpRound(round: '48h' | '2weeks' | '4weeks'): FormGroup {
    return this.fb.group({
      round: new FormControl(round),
      followupDone: new FormControl(null),
      complicationsOccurred: new FormControl(null),
      complicationDate: new FormControl(null),
      complications: new FormControl([]),
    });
  }

  addContact(): void {
    this.contacts.push(this.createContactRow());
    this.reSequenceContacts();
    this.calculateCompletionPercentage();
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index);
    this.reSequenceContacts();
    this.calculateCompletionPercentage();
  }

  private reSequenceContacts(): void {
    this.contacts.controls.forEach((control, i) => {
      control.get('contactSeq')?.setValue(i + 1, { emitEvent: false });
    });
  }

  private ensureDefaultFollowUps(): void {
    const expectedRounds: Array<'48h' | '2weeks' | '4weeks'> = [
      '48h',
      '2weeks',
      '4weeks',
    ];
    if (this.followUpRounds.length === 0) {
      expectedRounds.forEach((r) => this.followUpRounds.push(this.createFollowUpRound(r)));
    }
  }

  private toDateInput(value: any): string | null {
    if (!value) {
      return null;
    }
    return this.datePipe.transform(value, 'yyyy-MM-dd');
  }

  private applyFormData(data: any): void {
    const directContacts = this.safeParseArray(data?.directContactsJson);
    const followUps = this.safeParseArray(data?.followUpRoundsJson);

    this.contacts.clear();
    this.followUpRounds.clear();
    this.suppressSchoolDistrictReset = true;

    this.meningealForm.patchValue({
      ...data,
      investigationDate: this.toDateInput(data?.investigationDate),
      lastVisitDate: this.toDateInput(data?.lastVisitDate),
      arrivalDate: this.toDateInput(data?.arrivalDate),
      vaccinationHibLastDoseDate: this.toDateInput(data?.vaccinationHibLastDoseDate),
      vaccinationMeningococcalSchoolsLastDoseDate: this.toDateInput(
        data?.vaccinationMeningococcalSchoolsLastDoseDate
      ),
      vaccinationMeningococcalTravelersLastDoseDate: this.toDateInput(
        data?.vaccinationMeningococcalTravelersLastDoseDate
      ),
      contactHospitalAdmissionDate: this.toDateInput(data?.contactHospitalAdmissionDate),
      contactArrivalDate: this.toDateInput(data?.contactArrivalDate),
    });
    this.loadSchoolDistricts(data?.schoolGovernorate, true);
    this.suppressSchoolDistrictReset = false;

    if (directContacts.length > 0) {
      directContacts.forEach((contact: any) => {
        const row = this.createContactRow();
        row.patchValue(contact);
        this.contacts.push(row);
      });
      this.reSequenceContacts();
    } else {
      this.addContact();
    }

    if (followUps.length > 0) {
      followUps.forEach((roundData: any) => {
        const roundId = roundData?.round as '48h' | '2weeks' | '4weeks';
        const round = this.createFollowUpRound(roundId || '48h');
        round.patchValue({
          ...roundData,
          complicationDate: this.toDateInput(roundData?.complicationDate),
          complications: Array.isArray(roundData?.complications)
            ? roundData.complications
            : [],
        });
        this.followUpRounds.push(round);
      });
    }
    this.ensureDefaultFollowUps();
  }

  private loadGovernorates(): void {
    this.governoratesLoading = true;
    this.lookupsService.getAllGovernments()
      .pipe(finalize(() => (this.governoratesLoading = false)))
      .subscribe((result: any) => {
        const options = result?.data ?? [];
        this.governorates = options;
      });
  }

  private loadCountries(): void {
    this.countriesLoading = true;
    this.lookupsService.getAllNationalitys()
      .pipe(finalize(() => (this.countriesLoading = false)))
      .subscribe((result: any) => {
        const options = result?.data ?? [];
        this.countries = options;
      });
  }

  private loadSchoolDistricts(governorateId: any, preserveCurrentSelection = false): void {
    if (!governorateId) {
      this.schoolDistricts = [];
      if (!preserveCurrentSelection) {
        this.meningealForm.get('schoolAdministrationArea')?.setValue(null, {
          emitEvent: false,
        });
      }
      return;
    }
    this.schoolDistrictsLoading = true;
    this.lookupsService
      .getPageCitys({ governmentID: Number(governorateId) })
      .pipe(finalize(() => (this.schoolDistrictsLoading = false)))
      .subscribe((result: any) => {
        this.schoolDistricts = result?.data ?? [];
        if (!preserveCurrentSelection) {
          this.meningealForm.get('schoolAdministrationArea')?.setValue(null, {
            emitEvent: false,
          });
        }
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
        const data = res?.data ?? {};
        this.applyFormData(data);
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
    const payload = { ...this.meningealForm.value };
    payload.patientID = this.currentId;
    payload.diseaseGroupId = this.diseaseGroupID;

    this.prepareConditionalPayload(payload);
    payload.directContactsJson = JSON.stringify(payload.contacts ?? []);
    payload.followUpRoundsJson = JSON.stringify(payload.followUpRounds ?? []);
    delete payload.contacts;
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
        }
        document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
        this.calculateCompletionPercentage();
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((msg: string) => {
          this.userMsg.success(msg);
        });
      },
      () => { }
    );
  }

  private prepareConditionalPayload(payload: any): void {
    if (payload.traveledAbroad !== 'yes') {
      payload.travelDestinationCountry = null;
      payload.arrivalDate = null;
    }

    if (payload.vaccinationHibStatus !== 'yes') {
      payload.vaccinationHibLastDoseDate = null;
    }
    if (payload.vaccinationMeningococcalSchoolsStatus !== 'yes') {
      payload.vaccinationMeningococcalSchoolsLastDoseDate = null;
    }
    if (payload.vaccinationMeningococcalTravelersStatus !== 'yes') {
      payload.vaccinationMeningococcalTravelersLastDoseDate = null;
    }

    if (payload.contactWithSimilarCase !== 'yes') {
      payload.contactPatientName = null;
      payload.contactRelationship = null;
      payload.contactHospitalized = null;
      payload.contactHospitalName = null;
      payload.contactHospitalAdmissionDate = null;
      payload.contactFinalDiagnosis = null;
    } else if (payload.contactHospitalized !== 'yes') {
      payload.contactHospitalName = null;
      payload.contactHospitalAdmissionDate = null;
    }

    if (payload.contactTraveledAbroad !== 'yes') {
      payload.contactTravelCountry = null;
      payload.contactArrivalDate = null;
    }

    (payload.contacts ?? []).forEach((contact: any) => {
      if (contact.contactChemoprophylaxisGiven !== 'yes') {
        contact.contactDrugUsed = null;
        contact.contactDose = null;
      }
    });

    (payload.followUpRounds ?? []).forEach((round: any) => {
      if (round.followupDone !== 'yes') {
        round.complicationsOccurred = null;
        round.complicationDate = null;
        round.complications = [];
      } else if (round.complicationsOccurred !== 'yes') {
        round.complicationDate = null;
        round.complications = [];
      }
    });
  }

  toggleComplication(roundIndex: number, complication: string, checked: boolean): void {
    const control = this.followUpRounds.at(roundIndex).get('complications');
    const currentValues = (control?.value as string[]) ?? [];
    const updated = checked
      ? Array.from(new Set([...currentValues, complication]))
      : currentValues.filter((x) => x !== complication);
    control?.setValue(updated);
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

  yesNoLabel(value: string): string {
    if (value === 'yes') return this.label('نعم', 'Yes');
    if (value === 'no') return this.label('لا', 'No');
    return this.label('غير معروف', 'Unknown');
  }

  diseaseTypeLabel(value: string): string {
    return value === 'suspected_meningitis'
      ? this.label('اشتباه التهاب سحائي', 'Suspected meningitis')
      : this.label('اشتباه التهاب بالمخ', 'Suspected encephalitis');
  }

  complicationLabel(value: string): string {
    const labels: { [key: string]: [string, string] } = {
      convulsive_episodes: ['نوبات تشنجية', 'Convulsive Episodes'],
      epileptic_episodes: ['نوبات صرعية', 'Epileptic Episodes'],
      hearing_weakness: ['ضعف السمع', 'Hearing Weakness'],
      hearing_loss: ['فقدان السمع', 'Hearing Loss'],
      vision_weakness: ['ضعف الرؤية', 'Vision Weakness'],
      vision_loss: ['فقدان الرؤية', 'Vision Loss'],
      speech_weakness: ['ضعف الكلام', 'Speech Weakness'],
      speech_loss: ['فقدان الكلام', 'Speech Loss'],
      eye_squint: ['حول بالعين', 'Eye Squint (Strabismus)'],
      memory_weakness: ['ضعف الذاكرة', 'Memory Weakness'],
      communication_weakness: ['ضعف التواصل', 'Communication Weakness'],
      limb_weakness: ['ضعف الأطراف', 'Limb Weakness'],
      limb_paralysis: ['شلل بالأطراف', 'Limb Paralysis'],
    };
    const pair = labels[value] || [value, value];
    return this.label(pair[0], pair[1]);
  }

  calculateCompletionPercentage(): void {
    const excludedFields = [
      'id',
      'patientID',
      'diseaseGroupId',
      'investigationCompletePercentage',
      'directContactsJson',
      'followUpRoundsJson',
      'createdDate',
    ];
    const value = this.meningealForm.value;
    let total = 0;
    let filled = 0;

    const count = (v: any): void => {
      if (Array.isArray(v)) {
        v.forEach((x) => count(x));
        return;
      }
      if (v !== null && typeof v === 'object') {
        Object.keys(v).forEach((k) => {
          if (!excludedFields.includes(k)) {
            total++;
            const fieldValue = v[k];
            const hasValue = Array.isArray(fieldValue)
              ? fieldValue.length > 0
              : fieldValue !== null && fieldValue !== '';
            if (hasValue) {
              filled++;
            }
            if (typeof fieldValue === 'object' && fieldValue !== null) {
              total--;
              if (hasValue) {
                filled--;
              }
              count(fieldValue);
            }
          }
        });
      }
    };

    count(value);
    this.allControllesCount = total;
    this.allFilledControlsCount = filled;
  }
}
