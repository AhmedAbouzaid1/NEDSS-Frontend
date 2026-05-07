import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { AttachemntApiService } from 'src/app/core/services/attachemnt-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rabies',
  templateUrl: './rabies.component.html',
  styleUrls: ['./rabies.component.css']
})
export class RabiesComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  rabiesForm: FormGroup
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupId: any;

  incidentGovernments: any[] = [];
  incidentHealthAdministrations: any[] = [];
  incidentHealthOffices: any[] = [];

  private readonly maxRabiesAttachmentFiles = 3;
  bittenPersonsFileList: File[] = [];
  bittenPersonsListOfFiles: string[] = [];
  bittenPersonsOldFiles: string[] = [];

  massBiteFileList: File[] = [];
  massBiteListOfFiles: string[] = [];
  massBiteOldFiles: string[] = [];

  veterinaryNotifyFileList: File[] = [];
  veterinaryNotifyListOfFiles: string[] = [];
  veterinaryNotifyOldFiles: string[] = [];

  private restoreIncidentAdminId: number | null = null;
  private restoreIncidentOfficeId: number | null = null;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private lookupsService: LookupsGetterService,
    private attachmentApi: AttachemntApiService,
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }

    if (this.diseaseGroupId == null || this.diseaseGroupId == undefined) {
      this.diseaseGroupId = this.investigationService.diseaseGroupID;
    }
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
  }

  get biteIncidentRows(): FormArray {
    return this.rabiesForm.get('biteIncidents') as FormArray;
  }

  get patientFacilityVisitRows(): FormArray {
    return this.rabiesForm.get('patientFacilityVisits') as FormArray;
  }

  createBiteRow(data?: any): FormGroup {
    const biteLocationOnBody = data?.biteLocationOnBody ?? data?.BiteLocationOnBody ?? null;
    const rawDesc = data?.biteDescription ?? data?.BiteDescription;
    const desc =
      rawDesc != null && rawDesc !== ''
        ? String(rawDesc)
        : null;
    return new FormGroup({
      biteLocationOnBody: new FormControl(biteLocationOnBody),
      biteDescription: new FormControl(desc),
    });
  }

  createPatientFacilityVisitRow(data?: any): FormGroup {
    const healthFacilityName = data?.healthFacilityName ?? data?.HealthFacilityName ?? null;
    const visitDateRaw = data?.visitDate ?? data?.VisitDate;
    const visitDate = visitDateRaw
      ? this.datePipe.transform(visitDateRaw, 'yyyy-MM-dd')
      : null;
    const notes = data?.notes ?? data?.Notes ?? null;
    return new FormGroup({
      healthFacilityName: new FormControl(healthFacilityName),
      visitDate: new FormControl(visitDate),
      notes: new FormControl(notes),
    });
  }

  addBiteRow(): void {
    this.biteIncidentRows.push(this.createBiteRow());
    this.calculateCompletionPercentage();
  }

  removeBiteRow(index: number): void {
    this.biteIncidentRows.removeAt(index);
    this.calculateCompletionPercentage();
  }

  addPatientFacilityVisitRow(): void {
    this.patientFacilityVisitRows.push(this.createPatientFacilityVisitRow());
    this.calculateCompletionPercentage();
  }

  removePatientFacilityVisitRow(index: number): void {
    this.patientFacilityVisitRows.removeAt(index);
    this.calculateCompletionPercentage();
  }

  private patchFormArraysFromApi(v: any): void {
    const bites = this.rabiesForm.get('biteIncidents') as FormArray;
    bites.clear();
    const biteList = v?.biteIncidents ?? v?.BiteIncidents ?? [];
    if (biteList.length === 0) {
      bites.push(this.createBiteRow());
    } else {
      biteList.forEach((item: any) => bites.push(this.createBiteRow(item)));
    }

    const visits = this.rabiesForm.get('patientFacilityVisits') as FormArray;
    visits.clear();
    const visitList = v?.patientFacilityVisits ?? v?.PatientFacilityVisits ?? [];
    if (visitList.length === 0) {
      visits.push(this.createPatientFacilityVisitRow());
    } else {
      visitList.forEach((item: any) => visits.push(this.createPatientFacilityVisitRow(item)));
    }
  }

  ngOnInit() {
    this.rabiesForm = new FormGroup({
      patientExposedVenom: new FormControl(),
      kindOfAnimal: new FormControl(),
      incidentGovernmentId: new FormControl(-1),
      incidentHealthAdministrationId: new FormControl(-1),
      incidentHealthOfficeId: new FormControl(-1),
      incidentVillageOrStreet: new FormControl(),
      biteIncidents: new FormArray([]),
      patientFacilityVisits: new FormArray([]),
      dateIncident: new FormControl(),
      woundBeenWashed: new FormControl(),
      reasonNotMentioned: new FormControl(),
      woundSuturedDone: new FormControl(),
      reasonIsNotMentioned: new FormControl(),
      vaccinatedAgainstRabies: new FormControl(),
      firstDose: new FormControl(),
      secondDose: new FormControl(),
      thirdDose: new FormControl(),
      fourthDose: new FormControl(),
      fifthDose: new FormControl(),
      firstDoseHealthFacility: new FormControl(),
      secondDoseHealthFacility: new FormControl(),
      thirdDoseHealthFacility: new FormControl(),
      fourthDoseHealthFacility: new FormControl(),
      fifthDoseHealthFacility: new FormControl(),
      reasonNotReceivingDoses: new FormControl(),
      patientReceiveSerum: new FormControl(),
      patientReceiveSerumReason: new FormControl(),
      unitDose: new FormControl(),
      patientWeight: new FormControl(),
      dateTheSerum: new FormControl(),
      nameHealthFacility: new FormControl(),
      barrenAnimal: new FormControl(),
      changeBehaviorAnimal: new FormControl(),
      animalReceiveVaccinations: new FormControl(),
      waAnimalExcited: new FormControl(),
      bittenBySameAnimal: new FormControl(),
      patientBitOthersAfterSymptoms: new FormControl(),
      veterinaryUnitsNotified: new FormControl(),
      barrenAnimalCaptured: new FormControl(),
      testedLaboratory: new FormControl(),
      suffersFromRabies: new FormControl(),
      dateOfDeath: new FormControl(),
      deathPlace: new FormControl(),
      placeMentioned: new FormControl(),
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid;
    this.rabiesForm.controls['patientID'].setValue(this.currentId);
    this.rabiesForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    this.patchFormArraysFromApi({});
    this.prefillIncidentLocationDropdowns();
    this.investigationService.getByIdRabies(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        const loc = this.readIncidentLocationIds(v);
        this.restoreIncidentAdminId = loc.adm > 0 ? loc.adm : null;
        this.restoreIncidentOfficeId = loc.office > 0 ? loc.office : null;

        this.rabiesForm.patchValue(v);
        this.rabiesForm.patchValue(
          {
            incidentGovernmentId: loc.gov > 0 ? loc.gov : -1,
            incidentHealthAdministrationId: loc.adm > 0 ? loc.adm : -1,
            incidentHealthOfficeId: loc.office > 0 ? loc.office : -1,
          },
          { emitEvent: false },
        );
        this.normalizeIncidentLocationIdsForUi();

        // Dates shown in <input type="date">
        this.rabiesForm.controls['dateIncident'].setValue(this.datePipe.transform(this.rabiesForm.value.dateIncident, 'yyyy-MM-dd'));
        this.rabiesForm.controls['firstDose'].setValue(this.datePipe.transform(this.rabiesForm.value.firstDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['secondDose'].setValue(this.datePipe.transform(this.rabiesForm.value.secondDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['thirdDose'].setValue(this.datePipe.transform(this.rabiesForm.value.thirdDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['fourthDose'].setValue(this.datePipe.transform(this.rabiesForm.value.fourthDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['fifthDose'].setValue(this.datePipe.transform(this.rabiesForm.value.fifthDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['dateTheSerum'].setValue(this.datePipe.transform(this.rabiesForm.value.dateTheSerum, 'yyyy-MM-dd'));
        this.rabiesForm.controls['dateOfDeath'].setValue(this.datePipe.transform(this.rabiesForm.value.dateOfDeath, 'yyyy-MM-dd'));

        this.patchFormArraysFromApi(v);
        this.prefillIncidentLocationDropdowns();

        this.bittenPersonsOldFiles = v?.bittenPersonsAttachmentUrls?.length
          ? [...v.bittenPersonsAttachmentUrls]
          : v?.BittenPersonsAttachmentUrls?.length
            ? [...v.BittenPersonsAttachmentUrls]
            : [];
        this.bittenPersonsFileList = [];
        this.bittenPersonsListOfFiles = [];

        this.massBiteOldFiles = v?.massBiteReportAttachmentUrls?.length
          ? [...v.massBiteReportAttachmentUrls]
          : v?.MassBiteReportAttachmentUrls?.length
            ? [...v.MassBiteReportAttachmentUrls]
            : [];
        this.massBiteFileList = [];
        this.massBiteListOfFiles = [];

        this.veterinaryNotifyOldFiles = v?.veterinaryNotificationAttachmentUrls?.length
          ? [...v.veterinaryNotificationAttachmentUrls]
          : v?.VeterinaryNotificationAttachmentUrls?.length
            ? [...v.VeterinaryNotificationAttachmentUrls]
            : [];
        this.veterinaryNotifyFileList = [];
        this.veterinaryNotifyListOfFiles = [];

        const pb = this.rabiesForm.value.patientBitOthersAfterSymptoms;
        if (pb !== null && pb !== undefined && pb !== '') {
          this.rabiesForm.patchValue({ patientBitOthersAfterSymptoms: pb + '', tc: true });
        }

        this.calculateCompletionPercentage();
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
  private normalizeLookupId(v: any): number | null {
    if (v === null || v === undefined || v === '' || v === -1 || v === '-1') {
      return null;
    }
    const n = Number(v);
    return Number.isNaN(n) || n <= 0 ? null : n;
  }

  private readIncidentLocationIds(v: any): { gov: number; adm: number; office: number } {
    const pick = (camel: string, pascal: string) => {
      const x = v?.[camel] ?? v?.[pascal];
      const n = Number(x);
      return Number.isFinite(n) && n > 0 ? n : -1;
    };
    return {
      gov: pick('incidentGovernmentId', 'IncidentGovernmentId'),
      adm: pick('incidentHealthAdministrationId', 'IncidentHealthAdministrationId'),
      office: pick('incidentHealthOfficeId', 'IncidentHealthOfficeId'),
    };
  }

  private normalizeLookupOption(row: any): any {
    if (!row || typeof row !== 'object') {
      return row;
    }
    return {
      ...row,
      id: row.id ?? row.Id,
      arabicName: row.arabicName ?? row.ArabicName,
      englishName: row.englishName ?? row.EnglishName,
    };
  }

  private withIncidentSelectOption(rows: any[] | null | undefined): any[] {
    const normalized = (rows || []).map((r) => this.normalizeLookupOption(r));
    return [{ id: -1, arabicName: 'إختر', englishName: 'Select' }, ...normalized];
  }

  private normalizeIncidentLocationIdsForUi(): void {
    ['incidentGovernmentId', 'incidentHealthAdministrationId', 'incidentHealthOfficeId'].forEach((key) => {
      const val = this.rabiesForm.get(key)?.value;
      if (val === null || val === undefined || val === '') {
        this.rabiesForm.get(key)?.setValue(-1, { emitEvent: false });
      }
    });
  }

  prefillIncidentLocationDropdowns(): void {
    this.lookupsService.getAllGovernments().subscribe({
      next: (result: any) => {
        this.incidentGovernments = this.withIncidentSelectOption(result?.data);
        const govId = this.rabiesForm.get('incidentGovernmentId')?.value;
        if (govId != null && govId > 0) {
          this.fetchIncidentHealthAdministrations(govId, () => {
            const admId = this.rabiesForm.get('incidentHealthAdministrationId')?.value;
            if (admId != null && admId > 0) {
              this.fetchIncidentHealthOffices(admId);
            } else {
              this.incidentHealthOffices = this.withIncidentSelectOption([]);
            }
          });
        } else {
          this.incidentHealthAdministrations = this.withIncidentSelectOption([]);
          this.incidentHealthOffices = this.withIncidentSelectOption([]);
        }
      },
      error: () => {
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((msg: string) => {
          this.userMsg.error(msg);
        });
      },
    });
  }

  private fetchIncidentHealthAdministrations(governmentId: number, done?: () => void): void {
    this.lookupsService.getPageHealthAdministrations({ governmentID: governmentId }).subscribe({
      next: (result: any) => {
        this.incidentHealthAdministrations = this.withIncidentSelectOption(result?.data);
        setTimeout(() => {
          if (this.restoreIncidentAdminId != null) {
            this.rabiesForm.patchValue(
              { incidentHealthAdministrationId: this.restoreIncidentAdminId },
              { emitEvent: false },
            );
            this.restoreIncidentAdminId = null;
          }
          done?.();
        }, 0);
      },
      error: () => {
        this.incidentHealthAdministrations = this.withIncidentSelectOption([]);
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((msg: string) => {
          this.userMsg.error(msg);
        });
      },
    });
  }

  private fetchIncidentHealthOffices(healthAdministrationId: number): void {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationId,
        forHome: true,
      })
      .subscribe({
        next: (result: any) => {
          this.incidentHealthOffices = this.withIncidentSelectOption(result?.data);
          setTimeout(() => {
            if (this.restoreIncidentOfficeId != null) {
              this.rabiesForm.patchValue(
                { incidentHealthOfficeId: this.restoreIncidentOfficeId },
                { emitEvent: false },
              );
              this.restoreIncidentOfficeId = null;
            }
          }, 0);
        },
        error: () => {
          this.incidentHealthOffices = this.withIncidentSelectOption([]);
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((msg: string) => {
            this.userMsg.error(msg);
          });
        },
      });
  }

  onIncidentGovernmentChanged(): void {
    this.restoreIncidentAdminId = null;
    this.restoreIncidentOfficeId = null;
    const id = this.rabiesForm.get('incidentGovernmentId')?.value;
    this.rabiesForm.patchValue(
      {
        incidentHealthAdministrationId: -1,
        incidentHealthOfficeId: -1,
      },
      { emitEvent: false },
    );
    this.incidentHealthOffices = this.withIncidentSelectOption([]);
    if (id != null && id > 0) {
      this.fetchIncidentHealthAdministrations(id);
    } else {
      this.incidentHealthAdministrations = this.withIncidentSelectOption([]);
    }
    this.calculateCompletionPercentage();
  }

  onIncidentHealthAdministrationChanged(): void {
    this.restoreIncidentOfficeId = null;
    const id = this.rabiesForm.get('incidentHealthAdministrationId')?.value;
    this.rabiesForm.patchValue({ incidentHealthOfficeId: -1 }, { emitEvent: false });
    if (id != null && id > 0) {
      this.fetchIncidentHealthOffices(id);
    } else {
      this.incidentHealthOffices = this.withIncidentSelectOption([]);
    }
    this.calculateCompletionPercentage();
  }

  onIncidentHealthOfficeChanged(): void {
    this.calculateCompletionPercentage();
  }

  onBittenPersonsFileSelect(input: EventTarget | null): void {
    this.onRabiesAttachmentMultiFileSelect(
      input,
      this.bittenPersonsOldFiles,
      this.bittenPersonsFileList,
      this.bittenPersonsListOfFiles,
    );
  }

  onMassBiteReportFileSelect(input: EventTarget | null): void {
    this.onRabiesAttachmentMultiFileSelect(
      input,
      this.massBiteOldFiles,
      this.massBiteFileList,
      this.massBiteListOfFiles,
    );
  }

  onVeterinaryNotificationFileSelect(input: EventTarget | null): void {
    this.onRabiesAttachmentMultiFileSelect(
      input,
      this.veterinaryNotifyOldFiles,
      this.veterinaryNotifyFileList,
      this.veterinaryNotifyListOfFiles,
    );
  }

  private onRabiesAttachmentMultiFileSelect(
    input: EventTarget | null,
    oldUrls: string[],
    pendingFiles: File[],
    pendingNames: string[],
  ): void {
    const el = input as HTMLInputElement;
    if (!el?.files || el.files.length === 0) {
      return;
    }
    const availableSlots = this.maxRabiesAttachmentFiles - (oldUrls.length + pendingFiles.length);
    if (availableSlots <= 0) {
      this.userMsg.error(`الحد الأقصى ${this.maxRabiesAttachmentFiles} ملفات`);
      el.value = '';
      return;
    }
    let addedCount = 0;
    for (let i = 0; i < el.files.length; i++) {
      if (addedCount >= availableSlots) {
        break;
      }
      const selectedFile = el.files[i];
      if (pendingNames.indexOf(selectedFile.name) === -1) {
        pendingFiles.push(selectedFile);
        pendingNames.push(selectedFile.name);
        addedCount++;
      }
    }
    if (el.files.length > availableSlots) {
      this.userMsg.error(`تم قبول ${availableSlots} ملفات فقط (الحد الأقصى ${this.maxRabiesAttachmentFiles})`);
    }
    if (addedCount > 0) {
      this.userMsg.success('تم اختيار الملف بنجاح');
    }
    this.calculateCompletionPercentage();
    el.value = '';
  }

  openBittenPersonsSelectedFile(index: number): void {
    this.openPendingAttachmentFile(index, this.bittenPersonsFileList);
  }

  openMassBiteSelectedFile(index: number): void {
    this.openPendingAttachmentFile(index, this.massBiteFileList);
  }

  openVeterinaryNotifySelectedFile(index: number): void {
    this.openPendingAttachmentFile(index, this.veterinaryNotifyFileList);
  }

  private openPendingAttachmentFile(index: number, fileList: File[]): void {
    const selectedFile = fileList[index];
    if (!selectedFile) {
      return;
    }
    const fileUrl = URL.createObjectURL(selectedFile);
    window.open(fileUrl, '_blank');
  }

  openBittenPersonsExistingFile(fileUrl: string): void {
    this.openSavedAttachmentUrl(fileUrl);
  }

  openMassBiteExistingFile(fileUrl: string): void {
    this.openSavedAttachmentUrl(fileUrl);
  }

  openVeterinaryNotifyExistingFile(fileUrl: string): void {
    this.openSavedAttachmentUrl(fileUrl);
  }

  private openSavedAttachmentUrl(fileUrl: string): void {
    if (!fileUrl) {
      return;
    }
    window.open(fileUrl, '_blank');
  }

  removeBittenPersonsSelectedFile(index: number): void {
    this.removePendingAttachmentFile(index, this.bittenPersonsFileList, this.bittenPersonsListOfFiles);
  }

  removeMassBiteSelectedFile(index: number): void {
    this.removePendingAttachmentFile(index, this.massBiteFileList, this.massBiteListOfFiles);
  }

  removeVeterinaryNotifySelectedFile(index: number): void {
    this.removePendingAttachmentFile(index, this.veterinaryNotifyFileList, this.veterinaryNotifyListOfFiles);
  }

  private removePendingAttachmentFile(index: number, fileList: File[], nameList: string[]): void {
    if (index < 0 || index >= fileList.length) {
      return;
    }
    fileList.splice(index, 1);
    nameList.splice(index, 1);
    this.calculateCompletionPercentage();
  }

  removeBittenPersonsOldFile(index: number): void {
    this.removeSavedAttachmentUrl(index, this.bittenPersonsOldFiles);
  }

  removeMassBiteOldFile(index: number): void {
    this.removeSavedAttachmentUrl(index, this.massBiteOldFiles);
  }

  removeVeterinaryNotifyOldFile(index: number): void {
    this.removeSavedAttachmentUrl(index, this.veterinaryNotifyOldFiles);
  }

  private removeSavedAttachmentUrl(index: number, oldUrls: string[]): void {
    if (index < 0 || index >= oldUrls.length) {
      return;
    }
    oldUrls.splice(index, 1);
    this.calculateCompletionPercentage();
  }

  private async uploadFilesList(files: File[]): Promise<string[] | null> {
    if (!files?.length) {
      return [];
    }
    try {
      const fd = new FormData();
      for (let index = 0; index < files.length; index++) {
        fd.append('files', files[index]);
      }
      const res: any = await firstValueFrom(this.attachmentApi.upload(fd));
      const files_result = res?.data || res?.Data || [];
      if (!files_result || files_result.length === 0) {
        this.userMsg.error('لم يتم رفع الملفات. حاول مرة أخرى.');
        return null;
      }
      return files_result;
    } catch {
      this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => {
        this.userMsg.error(msg);
      });
      return null;
    }
  }

  private buildRabiesPayload(): any {
    const raw = this.rabiesForm.getRawValue();
    return {
      ...raw,
      incidentGovernmentId: this.normalizeLookupId(raw.incidentGovernmentId),
      incidentHealthAdministrationId: this.normalizeLookupId(raw.incidentHealthAdministrationId),
      incidentHealthOfficeId: this.normalizeLookupId(raw.incidentHealthOfficeId),
      biteIncidents: (raw.biteIncidents || []).map((r: any) => ({
        biteLocationOnBody: r.biteLocationOnBody ?? null,
        biteDescription:
          r.biteDescription === '' || r.biteDescription === undefined || r.biteDescription === null
            ? null
            : Number(r.biteDescription),
      })),
      patientFacilityVisits: (raw.patientFacilityVisits || []).map((r: any) => ({
        healthFacilityName: r.healthFacilityName ?? null,
        visitDate: r.visitDate ?? null,
        notes: r.notes ?? null,
      })),
    };
  }

  async save() {
    this.normalizeNullStrings(this.rabiesForm);
    const groups = [
      { old: this.bittenPersonsOldFiles, pending: this.bittenPersonsFileList },
      { old: this.massBiteOldFiles, pending: this.massBiteFileList },
      { old: this.veterinaryNotifyOldFiles, pending: this.veterinaryNotifyFileList },
    ];
    for (const g of groups) {
      if (g.old.length + g.pending.length > this.maxRabiesAttachmentFiles) {
        this.userMsg.error(`الحد الأقصى ${this.maxRabiesAttachmentFiles} ملفات لكل مرفق`);
        return;
      }
    }
    const [uploadedBitten, uploadedMass, uploadedVet] = await Promise.all([
      this.uploadFilesList(this.bittenPersonsFileList),
      this.uploadFilesList(this.massBiteFileList),
      this.uploadFilesList(this.veterinaryNotifyFileList),
    ]);
    if (uploadedBitten === null || uploadedMass === null || uploadedVet === null) {
      return;
    }
    this.calculateCompletionPercentage();
    this.rabiesForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.rabiesForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    const payload = {
      ...this.buildRabiesPayload(),
      bittenPersonsAttachmentUrls: [...this.bittenPersonsOldFiles, ...uploadedBitten],
      massBiteReportAttachmentUrls: [...this.massBiteOldFiles, ...uploadedMass],
      veterinaryNotificationAttachmentUrls: [...this.veterinaryNotifyOldFiles, ...uploadedVet],
    };
    if (payload.id != null) {
      this.investigationService.updateRabies(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.bittenPersonsOldFiles = payload.bittenPersonsAttachmentUrls || [];
            this.bittenPersonsFileList = [];
            this.bittenPersonsListOfFiles = [];
            this.massBiteOldFiles = payload.massBiteReportAttachmentUrls || [];
            this.massBiteFileList = [];
            this.massBiteListOfFiles = [];
            this.veterinaryNotifyOldFiles = payload.veterinaryNotificationAttachmentUrls || [];
            this.veterinaryNotifyFileList = [];
            this.veterinaryNotifyListOfFiles = [];
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
      this.investigationService.addInvestigationRabies(payload).subscribe(
        (response: any) => {

          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.bittenPersonsOldFiles = payload.bittenPersonsAttachmentUrls || [];
            this.bittenPersonsFileList = [];
            this.bittenPersonsListOfFiles = [];
            this.massBiteOldFiles = payload.massBiteReportAttachmentUrls || [];
            this.massBiteFileList = [];
            this.massBiteListOfFiles = [];
            this.veterinaryNotifyOldFiles = payload.veterinaryNotificationAttachmentUrls || [];
            this.veterinaryNotifyFileList = [];
            this.veterinaryNotifyListOfFiles = [];
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

  private normalizeNullStrings(control: FormControl | FormGroup | FormArray): void {
    if (control instanceof FormControl) {
      if (control.value === 'null')
        control.setValue(null);
      return;
    }
    if (control instanceof FormArray) {
      control.controls.forEach((c) => this.normalizeNullStrings(c as FormGroup));
      return;
    }
    Object.values((control as FormGroup).controls).forEach((c) => this.normalizeNullStrings(c as FormControl | FormGroup | FormArray));
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    this.allControllesCount = 0;
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const lookupIdFields = new Set([
      'incidentGovernmentId',
      'incidentHealthAdministrationId',
      'incidentHealthOfficeId',
    ]);

    const isFilled = (val: any) =>
      val !== null && val !== undefined && val !== '' && val !== 'null';

    const walk = (obj: any) => {
      if (obj === null || obj === undefined) return;
      if (Array.isArray(obj)) {
        obj.forEach((item) => walk(item));
        return;
      }
      if (typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          if (excludedFields.includes(key)) return;
          const val = obj[key];
          if (Array.isArray(val)) {
            walk(val);
          } else if (val !== null && typeof val === 'object') {
            walk(val);
          } else {
            this.allControllesCount++;
            const idUnset = lookupIdFields.has(key) && (val === -1 || val === '-1');
            if (isFilled(val) && !idUnset) this.allFilledControlsCount++;
          }
        });
      }
    };

    walk(this.rabiesForm.value);
  }
}
