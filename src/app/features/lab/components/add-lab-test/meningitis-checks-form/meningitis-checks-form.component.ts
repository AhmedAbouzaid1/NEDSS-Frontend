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

  readonly viralPcrResultOptions = [
    'negative',
    'enterovirus',
    'herpesSimplexVirus',
    'varicellaZosterVirus',
    'cytomegalovirus',
    'ebv',
    'arbovirus',
    'other',
  ];

  readonly ctResultOptions = ['normal', 'abnormal', 'other'];

  readonly mriResultOptions = ['normal', 'infectiousDisease', 'other'];

  readonly finalDiagnosisOtherOptions = [
    'ADEM syndrome',
    'AKI',
    'Auto immune disease',
    'Auto immune encephalitis',
    'Brain abscess',
    'Brain atrophy',
    'Brain edema',
    'Brain trauma',
    'Brain tumor',
    'Bronchitis with meningeal irritation',
    'DKA',
    'Drug intake',
    'Epilepsy',
    'Febrile convulsions',
    'Gastroenteritis',
    'Guillain-Barré Syndrome',
    'Hydrocephalus',
    'Meningeal irritation',
    'Miller Fischer syndrome',
    'Multiple sclerosis (MS)',
    'Otitis with meningeal irritation',
    'Pneumonia with meningeal irritation',
    'Sepsis',
    'Sinusitis with meningeal irritation',
    'Stroke',
    'Septicemia',
    'Septic shock',
  ];

  readonly chronicDiseaseOptions = [
    'أمراض مناعية',
    'التهاب بالمخ مناعي',
    'ضمور بالمخ',
    'إصابة سابقة بالجمجمة أو المخ',
    'تسرب السائل النخاعي الشوكي',
    'التهاب جيوب أنفية مزمن',
    'التهاب أذن وسطى مزمن',
    'مرض نقص المناعة المكتسبة',
    'استسقاء بالمخ',
    'السرطان',
    'ورم بالمخ',
    'أمراض كلى مزمنة',
    'أمراض كبد مزمنة',
    'السكري',
    'أمراض القلب',
    'أمراض الرئة المزمنة',
    'ارتفاع ضغط الدم',
    'خراج بالمخ',
    'تركيب صمام بالمخ',
  ];

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

      viralPcrDone: [null],
      viralPcrResult: [null],
      viralPcrOtherText: [null],

      ctDone: [null],
      ctResult: [null],
      ctOtherText: [null],

      mriDone: [null],
      mriResult: [null],
      mriOtherText: [null],

      finalDiagnosis: [null],
      finalDiagnosisOther: [null],
      finalDiagnosisOtherText: [null],

      hasChronicDiseases: [null],
      chronicDisease: [null],

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
    // Final diagnosis is algorithm-driven (read-only in the UI): recompute it
    // whenever any lab input changes, mirroring the backend calculation.
    this.recomputeFinalDiagnosis();
    this.form.valueChanges.subscribe(() => this.recomputeFinalDiagnosis());
    this.getById();
  }

  private recomputeFinalDiagnosis(): void {
    const v = this.form.getRawValue();
    const computed = this.computeFinalDiagnosis(v);
    if (v.finalDiagnosis !== computed) {
      this.form.get('finalDiagnosis')?.setValue(computed, { emitEvent: false });
    }
  }

  // Derives the meningitis final diagnosis from the entered lab data, following
  // the "algorithm final diagnosis" rules. Kept in sync with MeningitisCheckBusiness.
  private computeFinalDiagnosis(v: any): string | null {
    const done = (x: any) => x === 'yes';
    const pos = (x: any) => x === 'positive';
    const num = (x: any): number | null => {
      if (x === null || x === undefined || x === '') return null;
      const n = parseFloat(String(x).replace(/[^0-9.\-]/g, ''));
      return isNaN(n) ? null : n;
    };

    const csf = done(v.csfCultureDone) ? v.csfCultureResult : null;
    const blood = done(v.bloodCultureDone) ? v.bloodCultureResult : null;
    const bpcr = done(v.pcrDone) ? v.pcrResult : null;
    const vpcr = done(v.viralPcrDone) ? v.viralPcrResult : null;
    const gram = done(v.gramStainDone) ? v.gramStainResult : null;
    const gramOther = (v.gramStainOtherText || '').toString().toLowerCase();

    const isGrowth = (r: any) => !!r && r !== 'noGrowth';
    const bactPos = (r: any) => isGrowth(r) && r !== 'cryptococcus';

    // 1. Fungal meningitis
    if ((done(v.indiaInkDone) && pos(v.indiaInkResult)) ||
      csf === 'cryptococcus' || blood === 'cryptococcus' ||
      (gram === 'other' && (gramOther.includes('yeast') || gramOther.includes('خميرة') ||
        gramOther.includes('hyphae') || gramOther.includes('فطر')))) {
      return 'fungalMeningitis';
    }

    // 2. Tuberculous meningitis
    if ((done(v.znDone) && pos(v.znResult)) || (done(v.genexpertDone) && pos(v.genexpertResult))) {
      return 'tuberculousMeningitis';
    }

    // 3. / 4. Confirmed bacterial (CSF culture, blood culture, or bacterial PCR)
    const epidemicConfirmed = csf === 'nMeningitidis' || blood === 'nMeningitidis' || bpcr === 'nMeningitidis';
    const bacterialConfirmed = bactPos(csf) || bactPos(blood) ||
      (!!bpcr && bpcr !== 'negative' && bpcr !== 'noGrowth');
    if (epidemicConfirmed) return 'confirmedViralBacterialMeningitis';
    if (bacterialConfirmed) return 'confirmedNonViralBacterialMeningitis';

    // 5. Confirmed viral encephalitis (viral PCR positive)
    if (!!vpcr && vpcr !== 'negative') return 'confirmedViralEncephalitis';

    // 6. Probable epidemic bacterial (Gram -ve diplococci)
    if (gram === 'gmNegativeDiplococci') return 'probableViralBacterialMeningitis';

    // 7. Probable non-epidemic bacterial (other Gram-stain organisms)
    const gramPus = gram === 'other' && (gramOther.includes('pus') || gramOther.includes('صديد'));
    const nonEpidemicGram = ['gmNegativeCocobacilli', 'gmNegativeRods', 'gmPositiveCocciPairs', 'gmPositiveCocciClusters'];
    if (nonEpidemicGram.includes(gram) || (gram === 'other' && !gramPus)) {
      return 'probableNonViralBacterialMeningitis';
    }

    // 8. Probable unclassified bacterial (chemistry or pus cells)
    const protein = num(v.protein);
    const glucose = num(v.glucose);
    const chemBacterial = glucose !== null && protein !== null && glucose < 40 && protein > 100;
    if (chemBacterial || gramPus) return 'probableUnclassifiedBacterialMeningitis';

    // 9. Probable viral encephalitis (chemistry pattern or MRI encephalitis)
    const cell = num(v.cellCount);
    const chemViral = protein !== null && glucose !== null &&
      protein >= 50 && protein <= 100 && glucose >= 45 && glucose <= 100 &&
      cell !== null && cell < 100;
    const mriEncephalitis = done(v.mriDone) && v.mriResult === 'infectiousDisease';
    if (chemViral || mriEncephalitis) return 'probableViralEncephalitis';

    // No rule matched.
    return null;
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
