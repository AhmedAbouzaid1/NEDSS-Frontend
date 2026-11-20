import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AgeType } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { InvestigationService } from '../../services/investigation.service';
import {
  AEDES_AEGYPTI_KEY,
  EntomologicalVector,
  GenusDef,
  LARVICIDES,
  MOSQUITO_GENERA,
  OTHER_PESTICIDE,
  PesticideDef,
  RESIDUAL_PESTICIDES,
  SAND_FLY_GENERA,
  SPACE_DEVICES,
  SPACE_PESTICIDES,
} from './entomological.constants';

type PesticideKind = 'larvicides' | 'residualSpraying' | 'spaceSpraying';

const PESTICIDES: Record<PesticideKind, PesticideDef[]> = {
  larvicides: LARVICIDES,
  residualSpraying: RESIDUAL_PESTICIDES,
  spaceSpraying: SPACE_PESTICIDES,
};

const COUNT_FIELDS = [
  'larvaeExploredUnits', 'larvaeDipsCount', 'larvaeCollectedCount',
  'positiveUnitsCulicini', 'positiveUnitsAedesAegypti', 'positiveUnitsAnopheles',
  'breedingSiteSewage', 'breedingSiteAgriculturalDrain', 'breedingSitePonds', 'breedingSiteJars',
  'breedingSitePlasticIronTanks', 'breedingSiteCementGroundTanks', 'breedingSiteOther',
  'adultHousesCount', 'adultRoomsOrTrapsCount', 'adultMosquitoCount',
  'sandFlyTrapsDistributed', 'sandFlyTrapsPositive', 'sandFlyCount',
];

const DATE_FIELDS = ['surveyDate', 'departureFromEgyptDate', 'returnToEgyptDate'];

const MOSQUITO_ONLY_FIELDS = COUNT_FIELDS.filter((f) => !f.startsWith('sandFly')).concat('breedingSiteOtherDetails');
const SAND_FLY_ONLY_FIELDS = ['sandFlyTrapsDistributed', 'sandFlyTrapsPositive', 'sandFlyCount'];

const EGYPT_LATITUDE = { min: 21.5, max: 32 };
const EGYPT_LONGITUDE = { min: 24.5, max: 37 };

@Component({
  selector: 'app-entomological',
  host: { class: 'investigation-form' },
  templateUrl: './entomological.component.html',
  styleUrls: ['./entomological.component.css'],
})
export class EntomologicalComponent implements OnInit, OnDestroy {
  readonly vectorEnum = EntomologicalVector;
  readonly otherPesticide = OTHER_PESTICIDE;
  readonly spaceDevices = SPACE_DEVICES;
  readonly pesticides = PESTICIDES;
  readonly mosquitoGenusOptions = MOSQUITO_GENERA;

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined && localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  vector = EntomologicalVector.Mosquito;
  genera: GenusDef[] = MOSQUITO_GENERA;
  currentId: any;
  diseaseGroupID: number;
  diseaseName = '';
  patient: any = {};
  patientName = '';
  countries: any[] = [];
  countriesLoading = false;
  saving = false;
  submitted = false;

  form: FormGroup;
  private rowSubscriptions = new Map<FormGroup, Subscription>();
  private routeSubscription?: Subscription;
  private loadSubscription?: Subscription;

  constructor(
    private investigationService: InvestigationService,
    private generalDataService: GeneralDataService,
    private lookupsService: LookupsGetterService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private userMsg: UserMessageService
  ) {}

  ngOnInit(): void {
    this.vector = Number(this.route.snapshot.data?.['vectorType']) === EntomologicalVector.SandFly
      ? EntomologicalVector.SandFly
      : EntomologicalVector.Mosquito;
    this.genera = this.isMosquito ? MOSQUITO_GENERA : SAND_FLY_GENERA;
    this.currentId = this.investigationService.currentid;
    this.loadCountries();
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      const groupId = Number(params.get('diseaseGroupId'));
      if (groupId) {
        this.investigationService.diseaseGroupID = groupId;
      }
      this.initForDisease(Number(this.investigationService.diseaseGroupID));
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.loadSubscription?.unsubscribe();
    this.clearRowSubscriptions();
  }

  private clearRowSubscriptions(): void {
    this.rowSubscriptions.forEach((s) => s.unsubscribe());
    this.rowSubscriptions.clear();
  }

  private initForDisease(diseaseGroupId: number): void {
    this.loadSubscription?.unsubscribe();
    this.clearRowSubscriptions();
    this.submitted = false;
    this.diseaseGroupID = diseaseGroupId;
    const disease = (this.investigationService.patientDiseases || []).find(
      (d: any) => Number(d?.diseaseGroupId) === this.diseaseGroupID
    );
    this.diseaseName = disease?.arabicName ?? '';
    this.buildForm();
    this.loadData();
  }

  get isMosquito(): boolean {
    return this.vector === EntomologicalVector.Mosquito;
  }

  label(ar: string, en: string): string {
    return this.currentLang === 'ar' ? ar : en;
  }

  lookupName(item: any): string {
    return this.currentLang === 'ar' ? item?.arabicName : item?.englishName;
  }

  get title(): string {
    const base = this.isMosquito
      ? this.label('تقصى حشرى لحالات اشتباه أمراض منقولة بالبعوض', 'Entomological survey for suspected mosquito-borne disease cases')
      : this.label('تقصى حشرى (ذبابة الرمل) لحالات اشتباه الليشمانيا', 'Entomological survey (sand fly) for suspected leishmaniasis cases');
    return this.diseaseName ? `${base} - ${this.diseaseName}` : base;
  }

  private buildForm(): void {
    const controls: Record<string, any> = { id: new FormControl(null) };
    DATE_FIELDS.forEach((f) => (controls[f] = new FormControl(null)));
    COUNT_FIELDS.forEach((f) => (controls[f] = new FormControl(null)));
    [
      'arrivedFromCountryId', 'isolationPlace', 'breedingSiteOtherDetails', 'workAreaAddressDetails',
      'surveillanceUnitName', 'surveillanceOfficerName', 'vectorControlManagerName', 'endemicDiseasesDirectorName',
    ].forEach((f) => (controls[f] = new FormControl(null)));

    const species: Record<string, FormGroup> = {};
    this.genera.forEach((g) =>
      g.species.forEach(
        (s) => (species[s.key] = new FormGroup({ larvae: new FormControl(null), adults: new FormControl(null) }))
      )
    );
    controls['species'] = new FormGroup(species);
    controls['otherSpecies'] = new FormArray([]);
    controls['larvicides'] = new FormArray([]);
    controls['residualSpraying'] = new FormArray([]);
    controls['spaceSpraying'] = new FormArray([]);
    this.form = new FormGroup(controls);
  }

  speciesGroup(key: string): FormGroup {
    return this.form.get(['species', key]) as FormGroup;
  }

  get otherSpecies(): FormArray {
    return this.form.get('otherSpecies') as FormArray;
  }

  pesticideRows(kind: PesticideKind): FormArray {
    return this.form.get(kind) as FormArray;
  }

  addOtherSpecies(data?: any): void {
    this.otherSpecies.push(
      new FormGroup({
        genus: new FormControl(data?.genus ?? (this.isMosquito ? null : 'phlebotomus')),
        name: new FormControl(data?.name ?? null),
        larvae: new FormControl(data?.larvae ?? null),
        adults: new FormControl(data?.adults ?? null),
      })
    );
  }

  removeOtherSpecies(index: number): void {
    this.otherSpecies.removeAt(index);
  }

  addPesticideRow(kind: PesticideKind, data?: any): void {
    const row = new FormGroup({
      pesticide: new FormControl(data?.pesticide ?? null),
      pesticideName: new FormControl(data?.pesticideName ?? null),
      activeIngredient: new FormControl(data?.activeIngredient ?? null),
      mixRatio: new FormControl(data?.mixRatio ?? null),
      sprayersCount: new FormControl(data?.sprayersCount ?? null),
      solventQuantity: new FormControl(data?.solventQuantity ?? null),
      quantity: new FormControl(data?.quantity ?? null),
      latitude: new FormControl(data?.latitude ?? null),
      longitude: new FormControl(data?.longitude ?? null),
      housesCount: new FormControl(data?.housesCount ?? null),
      deviceType: new FormControl(data?.deviceType ?? null),
    });
    const subscriptions = new Subscription();
    subscriptions.add(row.get('pesticide')!.valueChanges.subscribe((key) => this.applyPesticide(kind, row, key)));
    subscriptions.add(row.get('sprayersCount')!.valueChanges.subscribe(() => this.recalculateQuantity(kind, row)));
    subscriptions.add(row.get('solventQuantity')!.valueChanges.subscribe(() => this.recalculateQuantity(kind, row)));
    this.rowSubscriptions.set(row, subscriptions);
    this.pesticideRows(kind).push(row);
  }

  removePesticideRow(kind: PesticideKind, index: number): void {
    const row = this.pesticideRows(kind).at(index) as FormGroup;
    this.rowSubscriptions.get(row)?.unsubscribe();
    this.rowSubscriptions.delete(row);
    this.pesticideRows(kind).removeAt(index);
  }

  isKnownPesticide(row: any): boolean {
    const key = row?.get ? row.get('pesticide')?.value : row?.pesticide;
    return !!key && key !== OTHER_PESTICIDE;
  }

  private findPesticide(kind: PesticideKind, key: string): PesticideDef | undefined {
    return PESTICIDES[kind].find((p) => p.key === key);
  }

  private applyPesticide(kind: PesticideKind, row: FormGroup, key: string): void {
    const def = this.findPesticide(kind, key);
    row.patchValue(
      {
        pesticideName: def ? def.name : null,
        activeIngredient: def ? def.activeIngredient : null,
        mixRatio: def ? def.mixRatio : null,
        deviceType: def?.device ?? (kind === 'spaceSpraying' ? row.get('deviceType')!.value : null),
      },
      { emitEvent: false }
    );
    this.recalculateQuantity(kind, row);
  }

  private recalculateQuantity(kind: PesticideKind, row: FormGroup): void {
    const def = this.findPesticide(kind, row.get('pesticide')!.value);
    if (!def) {
      return;
    }
    const base = this.toNumber(row.get(kind === 'spaceSpraying' ? 'solventQuantity' : 'sprayersCount')!.value);
    const quantity = base == null ? null : Math.round(((base * def.perUnit) / def.unitsPerDose) * 100) / 100;
    row.get('quantity')!.setValue(quantity, { emitEvent: false });
  }

  quantityUnit(kind: PesticideKind): string {
    return kind === 'spaceSpraying' ? this.label('سم3', 'cm³') : this.label('جرام', 'g');
  }

  private sumSpecies(predicate: (genus: string, key: string) => boolean, field: 'larvae' | 'adults'): number {
    let total = 0;
    this.genera.forEach((g) =>
      g.species.forEach((s) => {
        if (predicate(g.key, s.key)) {
          total += this.toNumber(this.speciesGroup(s.key).get(field)!.value) ?? 0;
        }
      })
    );
    this.otherSpecies.controls.forEach((c) => {
      if (predicate(c.get('genus')!.value, '')) {
        total += this.toNumber(c.get(field)!.value) ?? 0;
      }
    });
    return total;
  }

  genusTotal(genus: string, field: 'larvae' | 'adults'): number {
    return this.sumSpecies((g) => g === genus, field);
  }

  private ratio(numerator: number | null, denominator: number | null, percent = false): string {
    if (numerator == null || !denominator) {
      return '—';
    }
    const value = (numerator / denominator) * (percent ? 100 : 1);
    const rounded = Math.round(value * 100) / 100;
    return percent ? `${rounded}%` : `${rounded}`;
  }

  private fieldNumber(name: string): number | null {
    return this.toNumber(this.form.get(name)?.value);
  }

  get indicators(): { label: string; formula: string; value: string }[] {
    if (!this.isMosquito) {
      return [
        {
          label: this.label('معدل الانتشار لذبابة الرمل', 'Sand fly spread rate'),
          formula: this.label('عدد ذباب الرمل ÷ عدد المصائد', 'Sand flies ÷ traps'),
          value: this.ratio(this.fieldNumber('sandFlyCount'), this.fieldNumber('sandFlyTrapsDistributed')),
        },
      ];
    }
    const explored = this.fieldNumber('larvaeExploredUnits');
    const dips = this.fieldNumber('larvaeDipsCount');
    const roomsOrTraps = this.fieldNumber('adultRoomsOrTrapsCount');
    const aegyptiLarvae = this.sumSpecies((_, key) => key === AEDES_AEGYPTI_KEY, 'larvae');
    const unitsFormula = this.label('÷ عدد الوحدات المستكشفة × 100', '÷ explored units × 100');
    const dipsFormula = this.label('÷ عدد الغرفات', '÷ dips');
    const roomsFormula = this.label('÷ عدد الغرف أو المصائد', '÷ rooms or traps');
    return [
      {
        label: this.label('كثافة الوحدات الإيجابية كيولسيني', 'Culicini positive units density'),
        formula: this.label('عدد الوحدات الإيجابية كيولسيني ', 'Culicini positive units ') + unitsFormula,
        value: this.ratio(this.fieldNumber('positiveUnitsCulicini'), explored, true),
      },
      {
        label: this.label('كثافة الوحدات الإيجابية آيدس ايجبتاي', 'Aedes aegypti positive units density'),
        formula: this.label('عدد الوحدات الإيجابية آيدس ايجبتاي ', 'Aedes aegypti positive units ') + unitsFormula,
        value: this.ratio(this.fieldNumber('positiveUnitsAedesAegypti'), explored, true),
      },
      {
        label: this.label('كثافة الوحدات الإيجابية أنوفليس', 'Anopheles positive units density'),
        formula: this.label('عدد الوحدات الإيجابية أنوفليس ', 'Anopheles positive units ') + unitsFormula,
        value: this.ratio(this.fieldNumber('positiveUnitsAnopheles'), explored, true),
      },
      {
        label: this.label('معدل التوالد للكيولكس (يرقات)', 'Culex breeding rate (larvae)'),
        formula: this.label('عدد اليرقات (كيولكس) ', 'Culex larvae ') + dipsFormula,
        value: this.ratio(this.genusTotal('culex', 'larvae'), dips),
      },
      {
        label: this.label('معدل التوالد للأنوفليس (يرقات)', 'Anopheles breeding rate (larvae)'),
        formula: this.label('عدد اليرقات (للأنوفليس) ', 'Anopheles larvae ') + dipsFormula,
        value: this.ratio(this.genusTotal('anopheles', 'larvae'), dips),
      },
      {
        label: this.label('معدل التوالد للإيجبتاي (يرقات)', 'Aedes aegypti breeding rate (larvae)'),
        formula: this.label('عدد اليرقات (للإيجبتاي) ', 'Aedes aegypti larvae ') + dipsFormula,
        value: this.ratio(aegyptiLarvae, dips),
      },
      {
        label: this.label('معدل الانتشار للبعوض البالغ للكيولكس', 'Culex adult spread rate'),
        formula: this.label('عدد البعوض البالغ للكيولكس ', 'Culex adults ') + roomsFormula,
        value: this.ratio(this.genusTotal('culex', 'adults'), roomsOrTraps),
      },
      {
        label: this.label('معدل الانتشار للبعوض البالغ للأنوفليس', 'Anopheles adult spread rate'),
        formula: this.label('عدد البعوض البالغ للأنوفليس ', 'Anopheles adults ') + roomsFormula,
        value: this.ratio(this.genusTotal('anopheles', 'adults'), roomsOrTraps),
      },
      {
        label: this.label('معدل الانتشار للبعوض البالغ للآيدس', 'Aedes adult spread rate'),
        formula: this.label('عدد البعوض البالغ للآيدس ', 'Aedes adults ') + roomsFormula,
        value: this.ratio(this.genusTotal('aedes', 'adults'), roomsOrTraps),
      },
    ];
  }

  get patientAge(): string {
    const age = this.patient?.age;
    if (age == null || age === '') {
      return '';
    }
    const type = AgeType.find((t) => t.id != null && t.id === Number(this.patient?.ageTypeId));
    return type ? `${age} ${this.lookupName(type)}` : `${age}`;
  }

  get patientAddress(): string {
    const p = this.patient ?? {};
    return [p.livingAddress, p.homeCityName, p.homeHealthAdministrationName, p.homeGovernmentName]
      .filter((x) => !!x && String(x).trim())
      .join(' - ');
  }

  formatDate(value: any): string {
    return value ? this.datePipe.transform(value, 'dd/MM/yyyy') ?? '' : '';
  }

  private toDateInput(value: any): string | null {
    return value ? this.datePipe.transform(value, 'yyyy-MM-dd') : null;
  }

  private toNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private loadCountries(): void {
    this.countriesLoading = true;
    this.lookupsService
      .getAllNationalitys()
      .pipe(finalize(() => (this.countriesLoading = false)))
      .subscribe((result: any) => (this.countries = result?.data ?? []));
  }

  private loadData(): void {
    this.loadSubscription = forkJoin({
      patient: this.generalDataService.getPatientByIdForInvestigation(this.currentId).pipe(catchError(() => of(null))),
      investigation: this.investigationService.getEntomologicalInvestigation(this.currentId, this.diseaseGroupID),
    }).subscribe(
      ({ patient, investigation }: any) => {
        this.patient = patient?.data ?? {};
        this.patientName = [this.patient.firstName, this.patient.secondName, this.patient.thirdName, this.patient.familyName]
          .filter((x) => !!x)
          .join(' ');
        this.applyInvestigation(investigation?.data);
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
  }

  private applyInvestigation(data: any): void {
    if (!data) {
      this.addPesticideRow('larvicides');
      this.addPesticideRow('residualSpraying');
      this.addPesticideRow('spaceSpraying');
      return;
    }
    const patch: any = { id: data.id ?? null };
    Object.keys(this.form.controls).forEach((key) => {
      if (data[key] !== undefined && !(this.form.get(key) instanceof FormArray) && key !== 'species') {
        patch[key] = data[key];
      }
    });
    DATE_FIELDS.forEach((f) => (patch[f] = this.toDateInput(data[f])));
    this.form.patchValue(patch);

    const speciesData = this.parseJson(data.speciesCountsJson, {});
    const counts = speciesData?.species ?? {};
    Object.keys(counts).forEach((key) => this.speciesGroup(key)?.patchValue(counts[key]));
    (speciesData?.others ?? []).forEach((o: any) => this.addOtherSpecies(o));

    const rows: [PesticideKind, string][] = [
      ['larvicides', 'larvicidesJson'],
      ['residualSpraying', 'residualSprayingJson'],
      ['spaceSpraying', 'spaceSprayingJson'],
    ];
    rows.forEach(([kind, field]) => {
      const items: any[] = this.parseJson(data[field], []);
      items.forEach((item) => this.addPesticideRow(kind, item));
      if (!items.length) {
        this.addPesticideRow(kind);
      }
    });
  }

  private parseJson(value: any, fallback: any): any {
    if (!value) {
      return fallback;
    }
    try {
      return JSON.parse(value) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private hasValue(value: any): boolean {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  private rowHasData(row: any): boolean {
    return Object.keys(row).some((k) => this.hasValue(row[k]));
  }

  private dateValue(name: string): string | null {
    return this.toDateInput(this.form.get(name)?.value);
  }

  get surveyDateError(): string {
    const survey = this.dateValue('surveyDate');
    if (!survey) {
      return this.submitted ? this.label('تاريخ اجراء التقصي الحشري مطلوب', 'Entomological survey date is required') : '';
    }
    const discovery = this.toDateInput(this.patient?.caseDiscoveryDate);
    if (discovery && survey < discovery) {
      return this.label(
        `تاريخ اجراء التقصي الحشري يجب ألا يسبق تاريخ الابلاغ (${this.formatDate(discovery)})`,
        `Survey date cannot be before the notification date (${this.formatDate(discovery)})`
      );
    }
    return '';
  }

  get returnDateError(): string {
    const departure = this.dateValue('departureFromEgyptDate');
    const ret = this.dateValue('returnToEgyptDate');
    return departure && ret && ret < departure
      ? this.label('تاريخ العودة يجب ألا يسبق تاريخ مغادرة مصر', 'Return date cannot be before the departure date')
      : '';
  }

  positiveError(field: string, totalField: string): string {
    const value = this.fieldNumber(field);
    const total = this.fieldNumber(totalField);
    if (value == null || total == null || value <= total) {
      return '';
    }
    return totalField === 'sandFlyTrapsDistributed'
      ? this.label('عدد المصائد الإيجابية أكبر من عدد المصائد الموزعة', 'Positive traps exceed distributed traps')
      : this.label('عدد الوحدات الإيجابية أكبر من عدد الوحدات المستكشفة', 'Positive units exceed explored units');
  }

  coordinateError(row: any, field: 'latitude' | 'longitude'): string {
    const value = this.toNumber(row.get(field)?.value);
    if (value == null) {
      return '';
    }
    const range = field === 'latitude' ? EGYPT_LATITUDE : EGYPT_LONGITUDE;
    return value < range.min || value > range.max
      ? this.label(`القيمة يجب أن تكون بين ${range.min} و ${range.max}`, `Must be between ${range.min} and ${range.max}`)
      : '';
  }

  private negativeError(): string {
    const v = this.form.getRawValue();
    const values: any[] = COUNT_FIELDS.map((f) => v[f]);
    Object.values(v.species ?? {}).forEach((s: any) => values.push(s.larvae, s.adults));
    (v.otherSpecies ?? []).forEach((s: any) => values.push(s.larvae, s.adults));
    (['larvicides', 'residualSpraying', 'spaceSpraying'] as PesticideKind[]).forEach((k) =>
      (v[k] ?? []).forEach((r: any) => values.push(r.sprayersCount, r.solventQuantity, r.quantity, r.housesCount))
    );
    return values.some((x) => this.toNumber(x) != null && this.toNumber(x)! < 0)
      ? this.label('لا يمكن إدخال أعداد سالبة', 'Negative numbers are not allowed')
      : '';
  }

  private validationErrors(): string[] {
    const errors = [this.surveyDateError, this.returnDateError, this.negativeError()];
    if (this.isMosquito) {
      errors.push(
        this.positiveError('positiveUnitsCulicini', 'larvaeExploredUnits'),
        this.positiveError('positiveUnitsAedesAegypti', 'larvaeExploredUnits'),
        this.positiveError('positiveUnitsAnopheles', 'larvaeExploredUnits')
      );
    } else {
      errors.push(this.positiveError('sandFlyTrapsPositive', 'sandFlyTrapsDistributed'));
    }
    (['larvicides', 'residualSpraying', 'spaceSpraying'] as PesticideKind[]).forEach((k) =>
      this.pesticideRows(k).controls.forEach((row) =>
        errors.push(this.coordinateError(row, 'latitude'), this.coordinateError(row, 'longitude'))
      )
    );
    return errors.filter((e) => !!e);
  }

  save(): void {
    this.submitted = true;
    const errors = this.validationErrors();
    if (errors.length) {
      this.userMsg.error(errors[0]);
      return;
    }
    const v = this.form.getRawValue();
    const payload: any = {};
    Object.keys(v).forEach((key) => {
      if (!['species', 'otherSpecies', 'larvicides', 'residualSpraying', 'spaceSpraying'].includes(key)) {
        payload[key] = this.hasValue(v[key]) ? v[key] : null;
      }
    });
    COUNT_FIELDS.forEach((f) => (payload[f] = this.toNumber(payload[f])));
    payload.arrivedFromCountryId = this.toNumber(payload.arrivedFromCountryId);
    (this.isMosquito ? SAND_FLY_ONLY_FIELDS : MOSQUITO_ONLY_FIELDS).forEach((f) => (payload[f] = null));

    const species: Record<string, any> = {};
    Object.entries(v.species ?? {}).forEach(([key, s]: [string, any]) => {
      const larvae = this.isMosquito ? this.toNumber(s.larvae) : null;
      const adults = this.toNumber(s.adults);
      if (larvae != null || adults != null) {
        species[key] = { larvae, adults };
      }
    });
    const others = (v.otherSpecies ?? [])
      .map((o: any) => ({
        genus: o.genus ?? null,
        name: this.hasValue(o.name) ? String(o.name).trim() : null,
        larvae: this.isMosquito ? this.toNumber(o.larvae) : null,
        adults: this.toNumber(o.adults),
      }))
      .filter((o: any) => o.name || o.larvae != null || o.adults != null);
    payload.speciesCountsJson = Object.keys(species).length || others.length ? JSON.stringify({ species, others }) : null;

    const serializeRows = (kind: PesticideKind) => {
      const rows = (v[kind] ?? []).filter((r: any) => this.rowHasData(r));
      return rows.length ? JSON.stringify(rows) : null;
    };
    payload.larvicidesJson = serializeRows('larvicides');
    payload.residualSprayingJson = serializeRows('residualSpraying');
    payload.spaceSprayingJson = serializeRows('spaceSpraying');

    payload.patientID = Number(this.currentId);
    payload.diseaseGroupId = this.diseaseGroupID;
    payload.vectorType = this.vector;

    this.saving = true;
    this.investigationService
      .saveEntomologicalInvestigation(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((response: any) => {
        if (response?.data?.id) {
          this.form.controls['id'].setValue(response.data.id);
        }
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((msg: string) => this.userMsg.success(msg));
      });
  }
}
