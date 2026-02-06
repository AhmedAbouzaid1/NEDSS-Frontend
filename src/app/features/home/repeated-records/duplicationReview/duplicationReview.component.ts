import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Gender, AgeType } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { RepeatedService } from '../Repeated.service';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { formatDate } from '@angular/common';
import { Patient } from '../../search/models/patient';

@Component({
  selector: 'app-duplicationReview',
  templateUrl: './duplicationReview.component.html',
  styleUrls: ['./duplicationReview.component.css']
})
export class DuplicationReviewComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  migrationForm: FormGroup
  list: any[];
  IdsTodelete: any[] = [];
  loadingPanel: boolean;
  AgeTypes = AgeType;
  genders;
  SelectionCategories = new FormControl()
  RecordToKeep = new FormControl()
  deleteString: string = "";
  constructor(private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService, private repeatedService: RepeatedService, private router: Router) { }

  ngOnInit() {
    this.list = this.repeatedService.confilctsToSolve;
    // this.IdsTodelete=this.list.splice(1,1)
    // console.log(this.IdsTodelete);
    this.genders = Gender
    this.migrationForm = new FormGroup({
      id: new FormControl(),
      lastUpdateDate: new FormControl(),
      governmentId: new FormControl(),
      healthAdminstrationId: new FormControl(),
      reportSourceId: new FormControl(),
      firstName: new FormControl(),
      secondName: new FormControl(),
      thirdName: new FormControl(),
      familyName: new FormControl(),
      nationalId: new FormControl(),
      phone: new FormControl(),
      gender: new FormControl(),
      age: new FormControl(),
      ageCategoryId: new FormControl(),
      healthOfficeId: new FormControl()
    })

    for (let i = 0; i < this.list.length; i++) {
      this.list[i].caseDiscoveryDate = this.formatDateForInput(this.list[i].caseDiscoveryDate);
    }

    this.getlookups()
  }

  getlookups() {
    this.getAllHealthOffices();
  }

  SolveConflict() {

    if (this.SelectionCategories.value == 'vars') {
      if (
        this.migrationForm.value.lastUpdateDate == null ||
        this.migrationForm.value.governmentId == null ||
        this.migrationForm.value.healthAdminstrationId == null ||
        this.migrationForm.value.reportSourceId == null ||
        this.migrationForm.value.firstName == null ||
        this.migrationForm.value.secondName == null ||
        this.migrationForm.value.thirdName == null ||
        this.migrationForm.value.familyName == null ||
        this.migrationForm.value.nationalId == null ||
        this.migrationForm.value.phone == null ||
        this.migrationForm.value.gender == null ||
        this.migrationForm.value.age == null ||
        this.migrationForm.value.ageCategoryId == null ||
        this.migrationForm.value.healthOfficeId == null
      ) {
        this.userMsg.error("يجب اختار كل الحقول");
      } else {

        let objToSubmit: Patient = {
          caseDiscoveryDate: this.reformatDate(this.list.filter(o => o.id == this.migrationForm.value.lastUpdateDate)[0].caseDiscoveryDate),
          homeGovernmentId: this.list.filter(o => o.id == this.migrationForm.value.governmentId)[0].governmentId,
          homeHealthAdministrationId: this.list.filter(o => o.id == this.migrationForm.value.healthAdminstrationId)[0].healthAdministrationId,
          incidentSourceId: this.list.filter(o => o.id == this.migrationForm.value.reportSourceId)[0].incidentSourceId,
          firstName: this.list.filter(o => o.id == this.migrationForm.value.firstName)[0].firstName,
          secondName: this.list.filter(o => o.id == this.migrationForm.value.secondName)[0].secondName,
          thirdName: this.list.filter(o => o.id == this.migrationForm.value.thirdName)[0].thirdName,
          familyName: this.list.filter(o => o.id == this.migrationForm.value.familyName)[0].familyName,
          nationalId: this.list.filter(o => o.id == this.migrationForm.value.nationalId)[0].nationalId,
          phoneNo1: this.list.filter(o => o.id == this.migrationForm.value.phone)[0].phone,
          genderId: this.list.filter(o => o.id == this.migrationForm.value.gender)[0] ? parseInt(this.list.filter(o => o.id == this.migrationForm.value.gender)[0]) : 1, //can't find gender in model no time to fix
          age: this.list.filter(o => o.id == this.migrationForm.value.age)[0].age,
          ageTypeId: this.list.filter(o => o.id == this.migrationForm.value.ageCategoryId)[0].ageTypeId,
          homeHealthOfficeId: this.list.filter(o => o.id == this.migrationForm.value.healthOfficeId)[0].incidentSourceId
        }

        //end shref

        this.repeatedService.add(objToSubmit).subscribe((result: any) => {
          if (result != null && result != undefined) {
            this.list.forEach(element => {
              this.deleteString += element.id + ','
            });
            this.deleteString = this.deleteString.substring(0, this.deleteString.length - 1);

            this.userMsg.success("تم التعديل بنجاح ");
            this.repeatedService.delete(this.deleteString).subscribe(
              (res) => {
                if (res) {
                  this.userMsg.success("تم الحفظ بنجاح ");
                  this.router.navigateByUrl('/home/repeated-records')
                }
              }, error => {
                this.loadingPanel = false;
                this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }
            )

          }

          this.loadingPanel = false;

        }, error => {
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          });
        });
      }
    } else {


      const index = this.RecordToKeep.value;
      if (index > -1) { // only splice array when item is found
        delete this.list[index]; // 2nd parameter means remove one item only
      }
      this.list.forEach(element => {
        this.deleteString = element.id + ','
      });
      this.list = this.list[index]
      this.deleteString = this.deleteString.substring(0, this.deleteString.length - 1);
      this.repeatedService.delete(this.deleteString).subscribe(
        (res) => {
          if (res) {
            this.userMsg.success("تم التعديل بنجاح ");
            this.router.navigateByUrl('/home/repeated-records')

          }
        }, error => {
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          });
        }
      );
    }


  }

  getHealthOffice(healthAdministrationId): Observable<any> {
    //, reportingOrResidence: 2
    return this.lookupsService.getPageIncidentSourceHospitals({
      healthAdministrationId: healthAdministrationId
    }).pipe(
      map((result: any) => {
        if (result != null && result != undefined) {
          return result.data;
        }
        this.loadingPanel = false;
        return null;
      })
    );
  }

  allHealthOffices: any[] = [];
  getAllHealthOffices() {
    for (let i = 0; i < this.list.length; i++) {
      var currentHealthAdministrationId = this.list[i].healthAdministrationId;
      this.getHealthOffice(currentHealthAdministrationId).subscribe(
        data => {
          if (data != null) {
            this.allHealthOffices.push(data);
          }
          else {
            this.allHealthOffices.push([]);
          }
        }
      )
    }
  }

  formatDateForInput(date: string): string {
    let parsedDate = new Date(date);
    return formatDate(parsedDate, 'dd/MM/yyyy', 'en-US');
  }

  reformatDate(date: string): Date {
    const parts = date.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const parsedDate = new Date(`${year}-${this.padZero(month)}-${this.padZero(day)}T00:00:00`);
    return parsedDate;
  }

  padZero(value: string): string {
    return value.length === 1 ? `0${value}` : value;
  }
}
