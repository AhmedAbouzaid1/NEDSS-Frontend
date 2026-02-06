import { PatientChecksComponent } from './components/patient-checks/patient-checks.component';
import { AddLabPatientComponent } from './components/add-lab-patient/add-lab-patient.component';
import { LabViewComponent } from './components/lab-view/lab-view.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddLabTestComponent } from './components/add-lab-test/add-lab-test.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard.service';

const routes: Routes = [
  { path: 'lab', component: LabViewComponent ,canActivate: [AuthGuard] , data: { types: [1,2] } ,
  children:[
    { path: 'add-patient', component: AddLabPatientComponent ,canActivate: [AuthGuard] , data: { types: [1,2] } } ,
    { path: 'patient-checks', component: PatientChecksComponent ,canActivate: [AuthGuard] , data: { types: [1,2] } } ,
    { path: 'add-checks/:id', component: AddLabTestComponent ,canActivate: [AuthGuard] , data: { types: [1,2] } },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabRoutes { }

