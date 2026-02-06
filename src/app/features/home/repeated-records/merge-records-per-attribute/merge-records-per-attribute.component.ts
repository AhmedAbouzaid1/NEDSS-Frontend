import { Component, Input, OnInit } from '@angular/core';
import { RepeatedPatient } from '../ViewModels/repeated-patient';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { InvestigationService } from '../../investigation/services/investigation.service';
import { Router } from '@angular/router';
import { RepeatedService } from '../Repeated.service';

@Component({
  selector: 'app-merge-records-per-attribute',
  templateUrl: './merge-records-per-attribute.component.html',
  styleUrls: ['./merge-records-per-attribute.component.css']
})
export class MergeRecordsPerAttributeComponent {
  @Input() patients: RepeatedPatient[];
  combinedPatient: Partial<RepeatedPatient> = {}; // Allow partial updates
  selectupdateRecordId: number;
  selectedDiseaseIds: number[] = []; // Array to hold selected disease IDs
  constructor(
    private userMsg: UserMessageService,
    private translateService: TranslateService,
    public InvestigationService: InvestigationService,
    private router: Router,
    private repeatedService: RepeatedService) {
  }



  initForm() {
  }


  // Method to handle selection of attributes via radio buttons
  onSelectAttribute<K extends keyof RepeatedPatient>(property: K, value: RepeatedPatient[K]) {
    this.combinedPatient[property] = value;
  }

  // Method to handle disease selection
  onDiseaseChange(diseaseId: number, event: Event) {
    const target = event.target as HTMLInputElement; // Type assertion

    if (target.checked) {
      // Add to selected disease IDs if checked and not already present
      if (this.selectedDiseaseIds.includes(diseaseId)) {
        this.translateService
          .get('NEDSS.REPEATED_RECORDS.CANT_PICK_SAME_DISEASE')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
        target.checked = false; // Uncheck the checkbox
        return; // Exit the function
      } else {
        this.selectedDiseaseIds.push(diseaseId);
      }
    } else {
      // Remove from selected disease IDs if unchecked
      this.selectedDiseaseIds = this.selectedDiseaseIds.filter(id => id !== diseaseId);
    }

    // Update combinedPatient with selected diseases
    this.combinedPatient.patientDiseasesGroups = this.selectedDiseaseIds.map(id => {
      // Find the corresponding disease object based on the selected ID
      const disease = this.patients.find(patient =>
        patient.patientDiseasesGroups.some(diseaseGroup => diseaseGroup.diseaseGroupId === id)
      )?.patientDiseasesGroups.find(diseaseGroup => diseaseGroup.diseaseGroupId === id);

      return disease;
    });
  }

  goToInvestigation(patientId: number, diseaseGroupId: number, routerLink: string) {
    this.InvestigationService.currentid = patientId;
    this.InvestigationService.diseaseGroupID = diseaseGroupId;
    this.router.navigate(['/home/investigations/compelete-investigation', routerLink]);
  }


  mergePatient() {

    const requiredFields: (keyof RepeatedPatient)[] = [
      'id', 'firstName', 'secondName', 'thirdName', 'familyName',
      'homeGovernmentName', 'nationalId', 'homeHealthAdministrationName',
      'homeHealthOfficeName', 'age', 'caseDiscoveryDate', 'address',
      'ageTypeName'
    ];

    //Get Ids for selected names
    const patientId = this.patients.filter(p => p.id == this.selectupdateRecordId).map(p => p.id)[0];
    console.log('patientId', patientId);

    const homeGovernmentId = this.patients.filter(p => p.homeGovernmentName == this.combinedPatient.homeGovernmentName).map(p => p.homeGovernmentId)[0];
    console.log('homeGovernmentId', homeGovernmentId);

    const homeHealthAdministrationId = this.patients.filter(p => p.homeHealthAdministrationName == this.combinedPatient.homeHealthAdministrationName).map(p => p.homeHealthAdministrationId)[0];
    console.log('homeHealthAdministrationId', homeHealthAdministrationId);

    const homeHealthOfficeId = this.patients.filter(p => p.homeHealthOfficeName == this.combinedPatient.homeHealthOfficeName).map(p => p.homeHealthOfficeId)[0];
    console.log('homeHealthOfficeId', homeHealthOfficeId);

    const ageTypeId = this.patients.filter(p => p.ageTypeName == this.combinedPatient.ageTypeName).map(p => p.ageTypeId)[0];
    console.log('ageTypeId', ageTypeId);

    //assign ids to the combine patient
    this.combinedPatient.id = patientId;
    this.combinedPatient.homeGovernmentId = homeGovernmentId;
    this.combinedPatient.homeHealthAdministrationId = homeHealthAdministrationId;
    this.combinedPatient.homeHealthOfficeId = homeHealthOfficeId;
    this.combinedPatient.ageTypeId = ageTypeId;


    console.log(this.combinedPatient);
    // Check if all required fields are present in combinedPatient
    const allFieldsSelected = requiredFields.every(field =>
      this.combinedPatient[field] !== undefined);

    if (!allFieldsSelected) {
      this.translateService
        .get('NEDSS.REPEATED_RECORDS.ALL_FIELDS_REQUIRED')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
      return;
    }

    if (this.combinedPatient.patientDiseasesGroups?.length == 0 || this.combinedPatient.patientDiseasesGroups == undefined) {
      this.translateService
        .get('NEDSS.REPEATED_RECORDS.PICK_ONE_DISAEASE')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
      return;
    }


    this.combinedPatient.repeatedPatientsIds = this.patients.map(p => p.id);


    console.log('patient to api to merge ', this.combinedPatient);

    this.repeatedService.mergePatientsData(this.combinedPatient).subscribe({
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
    })
  }

}
