import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { AttachemntApiService } from 'src/app/core/services/attachemnt-api.service';
import { firstValueFrom } from 'rxjs';

export interface RiftAttachmentGroup {
  key: 'authoritiesNotificationAttachmentUrls' | 'animalDeathsVetNotificationAttachmentUrls' | 'caseVetNotificationAttachmentUrls';
  oldFiles: string[];
  pendingFiles: File[];
}

@Component({
  selector: 'app-rift-valley',
  templateUrl: './rift-valley.component.html',
  styleUrls: ['./rift-valley.component.css']
})
export class RiftValleyComponent implements OnInit {
  riftValley: FormGroup;
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName = '';
  currentId: any;

  readonly maxAttachmentFiles = 3;
  authoritiesAttachments: RiftAttachmentGroup = { key: 'authoritiesNotificationAttachmentUrls', oldFiles: [], pendingFiles: [] };
  animalDeathsVetAttachments: RiftAttachmentGroup = { key: 'animalDeathsVetNotificationAttachmentUrls', oldFiles: [], pendingFiles: [] };
  caseVetAttachments: RiftAttachmentGroup = { key: 'caseVetNotificationAttachmentUrls', oldFiles: [], pendingFiles: [] };

  private get attachmentGroups(): RiftAttachmentGroup[] {
    return [this.authoritiesAttachments, this.animalDeathsVetAttachments, this.caseVetAttachments];
  }

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private attachmentApi: AttachemntApiService,
  ) { }

  hasAttachments(group: RiftAttachmentGroup): boolean {
    return group.oldFiles.length > 0 || group.pendingFiles.length > 0;
  }

  onAttachmentSelect(group: RiftAttachmentGroup, input: EventTarget | null): void {
    const el = input as HTMLInputElement;
    if (!el?.files || el.files.length === 0) {
      return;
    }
    const availableSlots = this.maxAttachmentFiles - (group.oldFiles.length + group.pendingFiles.length);
    if (availableSlots <= 0) {
      this.userMsg.error(`الحد الأقصى ${this.maxAttachmentFiles} ملفات`);
      el.value = '';
      return;
    }
    let addedCount = 0;
    for (let i = 0; i < el.files.length && addedCount < availableSlots; i++) {
      const file = el.files[i];
      if (!group.pendingFiles.some((f) => f.name === file.name)) {
        group.pendingFiles.push(file);
        addedCount++;
      }
    }
    if (el.files.length > availableSlots) {
      this.userMsg.error(`تم قبول ${availableSlots} ملفات فقط (الحد الأقصى ${this.maxAttachmentFiles})`);
    }
    if (addedCount > 0) {
      this.userMsg.success('تم اختيار الملف بنجاح');
    }
    el.value = '';
  }

  openPendingAttachment(group: RiftAttachmentGroup, index: number): void {
    const file = group.pendingFiles[index];
    if (file) {
      window.open(URL.createObjectURL(file), '_blank');
    }
  }

  openSavedAttachment(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  removePendingAttachment(group: RiftAttachmentGroup, index: number): void {
    group.pendingFiles.splice(index, 1);
  }

  removeSavedAttachment(group: RiftAttachmentGroup, index: number): void {
    group.oldFiles.splice(index, 1);
  }

  private async uploadFiles(files: File[]): Promise<string[] | null> {
    if (!files.length) {
      return [];
    }
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const res: any = await firstValueFrom(this.attachmentApi.upload(fd));
      const urls = res?.data || res?.Data || [];
      if (!urls.length) {
        this.userMsg.error('لم يتم رفع الملفات. حاول مرة أخرى.');
        return null;
      }
      return urls;
    } catch {
      this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
      return null;
    }
  }

  ngOnInit() {
    this.patientName = [
      this.investigationService.patient.firstName,
      this.investigationService.patient.secondName,
      this.investigationService.patient.thirdName,
    ]
      .filter((name) => name != null && name !== '')
      .join(' ');

    this.riftValley = new FormGroup({
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedUnknownDisease: new FormControl(),
      followD1Type: new FormControl(),
      followD1MixingType: new FormControl(),
      painEyeSocket: new FormControl(),
      veterinaryServices: new FormControl(),
      neighboringHouses: new FormControl(),
      hemorrhagicRash: new FormControl(),
      bloodyVomiting: new FormControl(),
      followD1RelationshipSituation: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
      id: new FormControl(),
    });

    this.riftValley.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.currentId = this.investigationService.currentid;
    this.riftValley.controls['patientID'].setValue(this.currentId);
    this.riftValley.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);

    this.investigationService.getByIdRiftValley(this.currentId).subscribe(
      (res) => {
        const data = res.data;
        this.riftValley.patchValue(data || {});
        this.attachmentGroups.forEach((group) => {
          const pascal = group.key.charAt(0).toUpperCase() + group.key.slice(1);
          group.oldFiles = [...(data?.[group.key] ?? data?.[pascal] ?? [])];
          group.pendingFiles = [];
        });
        this.riftValley.controls['diseaseGroupId'].setValue(
          data?.diseaseGroupId ?? this.investigationService.diseaseGroupID
        );
        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((message: string) => {
            this.userMsg.error(message);
          });
      }
    );
  }

  async save() {
    Object.values(this.riftValley.controls).forEach((control) => {
      if (control.value === 'null') {
        control.setValue(null);
      }
    });

    if (this.attachmentGroups.some((g) => g.oldFiles.length + g.pendingFiles.length > this.maxAttachmentFiles)) {
      this.userMsg.error(`الحد الأقصى ${this.maxAttachmentFiles} ملفات لكل مرفق`);
      return;
    }
    const uploaded = await Promise.all(this.attachmentGroups.map((g) => this.uploadFiles(g.pendingFiles)));
    if (uploaded.some((u) => u === null)) {
      return;
    }
    const attachmentPayload: Record<string, string[]> = {};
    this.attachmentGroups.forEach((g, i) => {
      attachmentPayload[g.key] = [...g.oldFiles, ...(uploaded[i] as string[])];
    });
    const onSaved = () => {
      this.attachmentGroups.forEach((g) => {
        g.oldFiles = attachmentPayload[g.key];
        g.pendingFiles = [];
      });
      this.translateService
        .get('NEDSS.COMMON.SENT_SUCESSFULLY')
        .subscribe((message: string) => {
          this.userMsg.success(message);
        });
    };

    this.calculateCompletionPercentage();
    this.riftValley.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.riftValley.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const payload = { ...this.riftValley.value, ...attachmentPayload };
    if (payload.id != null) {
      this.investigationService.updateRiftValley(payload).subscribe(onSaved, () => { });
    } else {
      this.investigationService.addInvestigationRiftValley(payload).subscribe(onSaved, () => { });
    }
  }

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.riftValley?.value ?? {};
    const excludedFields = ['id', 'patientID', 'diseaseGroupId', 'investigationCompletePercentage', 'createdDate'];
    this.allControllesCount = Object.keys(data).filter((key) => !excludedFields.includes(key)).length;

    Object.keys(data).forEach((key) => {
      if (
        !excludedFields.includes(key) &&
        data[key] !== null &&
        data[key] !== '' &&
        data[key] !== 'null'
      ) {
        this.allFilledControlsCount++;
      }
    });
  }
}
