import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnnouncmentServiceService } from './announcmentService.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ExportService } from '../../../core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
import { AttachemntApiService } from 'src/app/core/services/attachemnt-api.service';
import { finalize, firstValueFrom, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { LevelsEnum } from '../users/models/levels.enum';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  addAnounceForm: FormGroup;
  otherSubject;
  fileList: any = [];
  listOfFiles: any[] = [];
  currentManualId: any = null;
  file: FormData = new FormData();
  announcments: any;
  editMode: boolean;
  isSubjectTitleValid: boolean = true;
  isSubjectTypeValid: boolean = true;

  dir: string;
  delay: boolean = false;
  timer: any;
  currentLang: string;

  governments: any;
  selectedAdministrationId: number;
  incidentSources: any[];
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  underDeleting = {
    subject: '',
    id: null
  };
  isSuperAdmin: any;
  isCentral: boolean;

  first: number = 0;
  last: number = 0;
  pages: number = 0;
  paginator = {
    pageSize: 10,
    pageIndex: 0
  }
  oldFiles: any[] = [];
  constructor(private announcementService: AnnouncmentServiceService,
    private exportService: ExportService, private translate: TranslateService,
    private userMsg: UserMessageService, private attahcmentService: AttachemntApiService, private http: HttpClient) {

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.addAnounceForm = new FormGroup({
      subject: new FormControl(),
      body: new FormControl(),
      subjectType: new FormControl(),
      subjectTypeOther: new FormControl(),
      id: new FormControl(),

    })

    this.getAllAnounncments()
    this.translate.get('NEDSS.ANNOUNCEMENTS.ANNOUNCEMENTS_NOTES').subscribe(res => {
      this.screenName = res;
    });


    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr'
  }

  ngOnInit(): void {
    this.isSuperAdmin = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.isSuperAdmin;

    this.isCentral = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId == LevelsEnum.Central;

  }


  public get isSuperAdminAndCentral(): boolean {
    return this.isSuperAdmin && this.isCentral
  }


  onFileChanged(input) {
    for (let i = 0; i <= input.files.length - 1; i++) {
      let selectedFile = input.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
      }
    }
  }

  validateAddAnnouncement(): boolean {
    this.isSubjectTitleValid = (this.addAnounceForm.value.subject !== null && this.addAnounceForm.value.subject.trim() !== '' && this.addAnounceForm.value.subject !== undefined);
    this.isSubjectTypeValid = (this.addAnounceForm.value.subjectType !== null && this.addAnounceForm.value.subjectType !== undefined);
    return this.isSubjectTitleValid && this.isSubjectTypeValid;
  }

  async addAnnouncment() {
    if (!this.validateAddAnnouncement()) {
      this.translate.get('NEDSS.COMMON.SENT_FAILD').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    }
    else {
      let files_result: any[] = [];
      if (this.fileList?.length) {
        for (let index = 0; index < this.fileList.length; index++) {
          this.file.append("files", this.fileList[index]);
        }

        let res: any = await firstValueFrom(this.attahcmentService.upload(this.file));
        if (res) {
          files_result = res?.data;
        }
      }
      let obj = { ...this.addAnounceForm.value, filesUrls: [...this.oldFiles, ...files_result] }
      if (this.currentManualId != null) {
        this.addAnounceForm.value.id = this.currentManualId
        this.updateAnnouncement(obj);
      }
      else {

        this.announcementService.addNewAnnouncment(obj).subscribe(
          (res) => {
            this.translate.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe(msg => this.userMsg.success(msg));
            this.getAllAnounncments();
            this.addAnounceForm.reset();
            this.file = new FormData();

            this.listOfFiles = []
            this.fileList = [];
            this.oldFiles = [];
          }
        )
      }
    }
  }

  updateAnnouncement(payload) {

    this.announcementService.updateAnnouncment(payload).pipe(finalize(() => {
      this.editMode = false;
      this.currentManualId = null;
    })).subscribe(
      (res) => {
        this.translate.get('NEDSS.COMMON.UPDATE_SUCESSFULLY').subscribe(msg => this.userMsg.success(msg));
        this.getAllAnounncments();
        this.addAnounceForm.reset();
        this.file = new FormData();
        this.listOfFiles = []
        this.fileList = [];
        this.oldFiles = [];
      }
    )
  }

  getAllAnounncments() {
    this.announcementService.getAllAnnouncment(this.paginator).subscribe(
      (res) => {
        this.announcments = res;
        this.pages = this.announcments?.[0]?.totalCount;
        this.last = this.paginator.pageIndex * this.paginator.pageSize;
      }
    )
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.paginator.pageIndex = event.page;
    this.paginator.pageSize = event.rows;
    this.getAllAnounncments();
  }

  onPaginatorClick(event: MouseEvent) {
    event.preventDefault();
  }

  removeOldSelectedFile(index) {
    this.oldFiles.splice(index, 1);
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);

    this.file.delete("files");

  }

  EditAnnoun(annon) {
    this.addAnounceForm.patchValue({
      subject: annon.subject,
      body: annon.body,
      subjectType: annon.subjectType,
      subjectTypeOther: annon.subjectTypeOther + "",
      id: annon.id
    })
    this.currentManualId = annon.id
    this.listOfFiles = [];
    this.fileList = [];
    this.oldFiles = []
    annon?.filesUrls?.forEach((element) => {
      this.oldFiles.push(element)
    });
    this.editMode = true
    //document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;
  }
  typeChange() {
    this.addAnounceForm.patchValue({
      subjectTypeOther: null
    });
  }

  DeletAnnon(id) {
    this.announcementService.delete(id).subscribe(
      () => {
        this.translate.get('NEDSS.COMMON.DELETED_SUCESSFULLY').subscribe(msg => this.userMsg.success(msg));
        this.getAllAnounncments();
      }
    );
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    this.exportService.exportTemplateAsPdfLogoTitle(document.getElementById(this.currentConfig),
      ' التنويهات و الملاحظات'
    );
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.subject = ele.subject;
  }

}
