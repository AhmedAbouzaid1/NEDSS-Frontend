import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepeatedService } from '../Repeated.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { RepeatedPatient } from '../ViewModels/repeated-patient';

@Component({
  selector: 'app-duplicationView',
  templateUrl: './duplicationView.component.html',
  styleUrls: ['./duplicationView.component.css'],
})
export class DuplicationViewComponent implements OnInit {
  currentIds: string;
  repeatedIds:number[];
  repeatedPatient:RepeatedPatient[];
  // Allchecked: boolean = false;
  // data: any;
  // searchObj;
  constructor(
    private activatedRouter: ActivatedRoute,
    private repeatedService: RepeatedService,
    private router:Router,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit() {
    this.currentIds = this.activatedRouter.snapshot.paramMap.get('id');
    this.repeatedIds = this.currentIds.split(',').map(id => +id);
    console.log('repeated Ids',this.repeatedIds);
    this.getSplitPatientsRepeatedData(this.repeatedIds);
    // if (this.currentId != null) {
    //   console.log(this.currentId);
    // }
    // this.searchObj = this.repeatedService.passedObj;
    // this.searchObj.id = this.currentId;
    // console.log('this is search object');
    // console.log(this.searchObj);
    //this.getRepeatedPatients(this.searchObj);
  }

  getSplitPatientsRepeatedData(ids:number[]){
    this.repeatedService.getSplitPatientsRepeatedData(ids).subscribe({
      next:(data) => {
        this.repeatedPatient = data.data;
        console.log('repeated Patient',this.repeatedPatient);
      },
      error:(error) => {
        console.log(error);
      },
      complete:() => {

      }
    })
  }

  getDiseaseGroupNames(groups: any[]): string {
    return groups ? groups.map(g => g.diseaseGroupName).join(' - ') : '';
  }

  selectedPatientIds: number[] = [];
  toggleSelection(patientId: number, event: any) {
    if (event.target.checked) {
      this.selectedPatientIds.push(patientId);
    } else {
      this.selectedPatientIds = this.selectedPatientIds.filter(id => id !== patientId);
    }
    console.log(this.selectedPatientIds);
  }

  submitSelectedPatients() {
    const selectedPatients = this.repeatedPatient.filter(patient => this.selectedPatientIds.includes(patient.id));
    this.router.navigate(['/home/merge-records'], { state: { patients: selectedPatients } });
  }

}








  // Old Methods

  
  // getById(searchObj) {
  //   this.repeatedService.getById(searchObj).subscribe(
  //     (result: any) => {
  //       if (result != null && result != undefined) {
  //         this.data = result.data;
  //         console.log('data received from api to solve');
  //         console.log(result.data);
  //         for (let i = 0; i < this.data.length; i++) {
  //           this.data[i].checked = false;
  //         }
  //       }
  //     },
  //     (error) => {
  //       this.translateService
  //         .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
  //         .subscribe((res: string) => {
  //           this.userMsg.error(res);
  //         });
  //     }
  //   );
  // }

  // onSelectAll(e: EventTarget): void {
  //   const checkbox = e as HTMLInputElement;
  //   const checked = checkbox.checked;
  //   this.Allchecked = checked;
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.data[i].checked = checked;
  //   }
  // }

  // patientsIdsToAdd: any[] = [];
  // onSelected(e: EventTarget, obj) {
  //   const checkbox = e as HTMLInputElement;
  //   const checked = checkbox.checked;
  //   console.log(`setting ${obj.id} to ${checked}`);
  //   console.log(obj);
  //   console.log(checked);
  //   for (let i = 0; i < this.data.length; i++) {
  //     if (this.data[i].id == obj.id) {
  //       this.data[i].checked = checked;
  //       break;
  //     }
  //   }
  //   if (this.data.filter((o) => o.checked == true).length == this.data.length) {
  //     this.Allchecked = true;
  //   } else {
  //     this.Allchecked = false;
  //   }
  // }

  // pushToReview() {
  //   this.repeatedService.confilctsToSolve = this.data.filter((o) => o.checked);
  // }
