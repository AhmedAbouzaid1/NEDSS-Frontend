import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepeatedPatient } from '../ViewModels/repeated-patient';
import { RepeatedService } from '../Repeated.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-merge-repeated-records',
  templateUrl: './merge-repeated-records.component.html',
  styleUrls: ['./merge-repeated-records.component.css']
})
export class MergeRepeatedRecordsComponent {
  patients: RepeatedPatient[];
  mergeMethod: string = '';
  selectRecordId: number;
  constructor(
    private repeatedService: RepeatedService,
    private router: Router,
    private userMsg: UserMessageService,
    private translateService:TranslateService) {
    this.mergeMethod = 'pickOne';
  }

  ngOnInit() {
    this.patients = history.state.patients || [];
    console.log('patientinside the view', this.patients);
  }

  submitPickOne() {
    let unselectedPatientsIds = this.patients.filter(p => p.id != this.selectRecordId).map(p => p.id);
    console.log(unselectedPatientsIds);
    this.repeatedService.deletePatientsByIds(unselectedPatientsIds).subscribe({
      next: (data) => {
        this.translateService
        .get('NEDSS.REPEATED_RECORDS.SUCCESS_MERGE')
        .subscribe((res: string) => {
          this.userMsg.success(res);
        });
        this.router.navigate(['/home/repeated-records']);
      },
      error: (error) => {
        this.translateService
        .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {

      }
    })
  }
}
