import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LabService } from '../../../services/lab.service';

@Component({
  selector: 'app-meningitis-checks-form',
  templateUrl: './meningitis-checks-form.component.html',
  styleUrls: ['./meningitis-checks-form.component.css'],
})
export class MeningitisChecksFormComponent implements OnInit, OnChanges {
  @Input() patientId: any;

  recordId: number | null = null;

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  form: FormGroup;

  readonly symptomItems = [
    { control: 'symptomFever', key: 'fever' },
    { control: 'symptomSevereHeadache', key: 'severeHeadache' },
    { control: 'symptomNeckStiffness', key: 'neckStiffness' },
    { control: 'symptomVomiting', key: 'vomiting' },
    { control: 'symptomConvulsions', key: 'convulsions' },
    { control: 'symptomConsciousnessDisturbance', key: 'consciousnessDisturbance' },
    { control: 'symptomPurpuraPetechiae', key: 'purpuraPetechiae' },
    { control: 'symptomMentalStatusChanges', key: 'mentalStatusChanges' },
    { control: 'symptomMeningealIrritationSigns', key: 'meningealIrritationSigns' },
    { control: 'symptomOthers', key: 'others' },
  ];

  readonly appearanceOptions = ['clear', 'turbid', 'bloody', 'hazy', 'other'];

  readonly gramStainOptions = [
    'gmPositiveCocciClusters',
    'gmPositiveCocciPairs',
    'gmNegativeRods',
    'gmNegativeCocobacilli',
    'gmNegativeDiplococci',
    'noOrganism',
    'other',
  ];

  readonly organismOptions = [
    'pseudomonasAeruginosa',
    'sAureus',
    'hInfluenzae',
    'sPneumoniae',
    'nMeningitidis',
    'listeriaMonocytogenes',
    'sAgalactiae',
    'salmonella',
    'eColi',
    'klebsiella',
    'others',
    'cryptococcus',
    'mrsa',
    'acinetobacter',
    'cons',
    'noGrowth',
  ];

  readonly pcrResultOptions = ['nMeningitidis', 'sPneumoniae', 'hInfluenzae', 'other'];

  readonly ctResultOptions = ['normal', 'abnormal', 'other'];

  readonly mriResultOptions = ['normal', 'infectiousDisease', 'other'];

  readonly finalDiagnosisOptions = [
    'confirmedViralBacterialMeningitis',
    'confirmedNonViralBacterialMeningitis',
    'probableViralBacterialMeningitis',
    'probableNonViralBacterialMeningitis',
    'confirmedViralMeningitis',
    'probableViralMeningitis',
    'confirmedViralEncephalitis',
    'probableViralEncephalitis',
    'probableUnclassifiedBacterialMeningitis',
    'meningoEncephalitis',
    'fungalMeningitis',
    'tuberculousMeningitis',
    'other',
  ];

  readonly complicationGroups = [
    { titleKey: 'organic', items: ['epileptic_episodes', 'convulsive_episodes'] },
    {
      titleKey: 'sensory',
      items: [
        'hearing_loss',
        'hearing_weakness',
        'vision_weakness',
        'vision_loss',
        'speech_weakness',
        'speech_loss',
        'eye_squint',
      ],
    },
    { titleKey: 'mental', items: ['memory_weakness', 'communication_weakness'] },
    { titleKey: 'limb', items: ['limb_weakness', 'limb_paralysis'] },
  ];

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private labService: LabService
  ) {
    this.form = this.fb.group({
      riftValleySampleTaken: [null],

      symptomFever: [false],
      symptomSevereHeadache: [false],
      symptomNeckStiffness: [false],
      symptomVomiting: [false],
      symptomConvulsions: [false],
      symptomConsciousnessDisturbance: [false],
      symptomPurpuraPetechiae: [false],
      symptomMentalStatusChanges: [false],
      symptomMeningealIrritationSigns: [false],
      symptomOthers: [false],

      lumbarPuncture: [null],
      appearance: [null],

      randomBloodGlucoseLevel: [null],
      protein: [null],
      glucose: [null],

      pln: [null],
      rbc: [null],
      monocytePercent: [null],
      eosinophilPercent: [null],
      neutPercent: [null],
      lymphPercent: [null],
      cellCount: [null],

      gramStainDone: [null],
      gramStainResult: [null],
      gramStainOtherText: [null],

      znDone: [null],
      znResult: [null],

      genexpertDone: [null],
      genexpertResult: [null],

      indiaInkDone: [null],
      indiaInkResult: [null],

      csfCultureDone: [null],
      csfCultureResult: [null],
      csfCultureOtherText: [null],

      bloodCultureDone: [null],
      bloodCultureResult: [null],
      bloodCultureOtherText: [null],

      pcrDone: [null],
      pcrResult: [null],
      pcrOtherText: [null],

      ctDone: [null],
      ctResult: [null],
      ctOtherText: [null],

      mriDone: [null],
      mriResult: [null],
      mriOtherText: [null],

      finalDiagnosis: [null],
      finalDiagnosisOtherText: [null],

      complicationsExist: [null],
      complicationDate: [null],
      complicationItems: [[]],
    });
  }

  toggleComplication(item: string, checked: boolean): void {
    const control = this.form.get('complicationItems');
    const currentValues = (control?.value as string[]) ?? [];
    const updated = checked
      ? Array.from(new Set([...currentValues, item]))
      : currentValues.filter((x) => x !== item);
    control?.setValue(updated);
  }

  hasComplication(item: string): boolean {
    const values = (this.form.get('complicationItems')?.value as string[]) ?? [];
    return values.includes(item);
  }

  ngOnInit(): void {
    this.getById();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] && !changes['patientId'].firstChange) {
      this.getById();
    }
  }

  getById(): void {
    if (this.patientId == null) {
      return;
    }
    this.labService.getMeningitisCheckByPatientId(this.patientId).subscribe(
      (res: any) => {
        const data = res?.data;
        if (!data) {
          return;
        }
        this.recordId = data.id ?? null;
        this.form.patchValue({
          ...data,
          complicationItems: data.complicationItems
            ? String(data.complicationItems).split(',').filter((x: string) => x)
            : [],
        });
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => {
          this.userMsg.error(msg);
        });
      }
    );
  }

  save(): void {
    const payload = { ...this.form.value };
    payload.id = this.recordId;
    payload.patientId = this.patientId;
    payload.complicationItems = ((payload.complicationItems as string[]) ?? []).join(',');

    const request$ = this.recordId
      ? this.labService.updateMeningitisCheck(payload)
      : this.labService.addMeningitisCheck(payload);

    request$.subscribe(
      (response: any) => {
        if (!this.recordId && response?.data?.id) {
          this.recordId = response.data.id;
        }
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => {
          this.userMsg.error(msg);
        });
      }
    );
  }
}
