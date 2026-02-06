import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UserManualService } from './user-manual.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.css']
})
export class UserManualComponent implements OnInit {
  underDeleting = {
    arabicName: '',
    id: null,
    englishName: ''
  };
  addCaseForm: FormGroup;
  AllAppPages: any;
  loadingPanel: boolean;
  fileList: any = [];
  listOfFiles: any[] = [];
  file: FormData = new FormData();
  Mauals: any[] = [];
  editMode: boolean = false
  currentManualId: any = null; currentLang: string;
  //  upload = new FileUploadWithPreview('my-unique-id');
  constructor(private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService, private userManualService: UserManualService
    , private router: Router
  ) {


  }
  ngOnInit(): void {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.getLookUps();
    this.addCaseForm = new FormGroup({
      mainBranchId: new FormControl(),
      title: new FormControl(),
      content: new FormControl()

    })
  }

  getLookUps() {
    this.getMainBranch();
  }

  getMainBranch() {
    this.lookupsService.getAllAppPages().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.AllAppPages = result.data;
        this.getManuals();
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  isContentValid: boolean = true;
  isTitleValid: boolean = true;
  isBranchValid: boolean = true;
  addHelpDocument() {
    this.isContentValid = true;
    this.isBranchValid = true;
    this.isTitleValid = true;
    this.isContentValid = this.addCaseForm.value.content != null;
    this.isBranchValid = this.addCaseForm.value.mainBranchId != null;
    this.isTitleValid = this.addCaseForm.value.title != null;
    if (this.addCaseForm.value.content == null || this.addCaseForm.value.mainBranchId == null || this.addCaseForm.value.title == null) {
      this.translateService.get('NEDSS.COMMON.UserManual').subscribe((res: string) => {
        this.userMsg.info(res);
      });
    } else {
      if (this.currentManualId != null) {
        this.addCaseForm.value.id = this.currentManualId
      }
      this.listOfFiles.forEach(file => {
        this.removeSelectedFile(file);
      });
      // this.file.append("files",input.files);
      for (let index = 0; index < this.fileList.length; index++) {

        this.file.append("files", this.fileList[index]);
      }


      this.file.append("data", JSON.stringify(this.addCaseForm.value));

      // let data:any ={
      //data : this.addCaseForm.value ,
      // files:this.file[0]
      // }
      // console.log("data "+JSON.stringify(data));
      this.userManualService.addNewManual(this.file).subscribe(
        (res) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.listOfFiles.forEach(file => {
            this.removeSelectedFile(file);
          });
          this.getManuals();
          this.addCaseForm.reset();
        }

      )
    }
  }

  onFileSelect(input) {
    for (var i = 0; i <= input.files.length - 1; i++) {
      var selectedFile = input.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
      }
    }
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);

    this.file.delete("files");

  }

  getManuals() {
    this.userManualService.getAllMauals().subscribe(
      (res) => {
        res.forEach(item => {
          let obj = this.AllAppPages.find(s => s.id == item.mainBranchId);
          item.arabicName = "";
          item.englishName = "";
          if (obj) {
            item.arabicName = obj.arabicName;
            item.englishName = obj.englishName;
          }
        });
        this.Mauals = res;
      }
    )
  }

  editMaual(manual) {
    this.addCaseForm.patchValue({
      mainBranchId: manual.mainBranchId,
      title: manual.title,
      content: manual.content
    });

    this.isContentValid = this.addCaseForm.value.content != null;
    this.isBranchValid = this.addCaseForm.value.mainBranchId != null;
    this.isTitleValid = this.addCaseForm.value.title != null;

    this.currentManualId = manual.id
    manual.optionHelpAttachments.forEach(element => {
      this.listOfFiles.push(element.fileName)
      this.fileList.push(element)

      this.editMode = true
    });

  }
  nameToDelete(ele) {

    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
    this.underDeleting.englishName = ele.englishName;


  }
  deleteManual(id) {
    this.userManualService.delete(id).subscribe(
      () => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getManuals();
      }
    );

  }


}

