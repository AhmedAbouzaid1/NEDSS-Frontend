
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreparationsComponent } from './preparations.component';
import { PreparationsTeamComponent } from './component/add-preparations/preparations-team/preparations-team.component';
import { PreparationsDataComponent } from './component/add-preparations/preparations-data/preparations-data.component';
import { PreparationsDevicesComponent } from './component/add-preparations/preparations-devices/preparations-devices.component';
import { AddPreparationsComponent } from './component/add-preparations/add-preparations.component';
import { ListPreparationsComponent } from './component/list-preparations/list-preparations.component';



const routes: Routes = [
  {
    path: '', component: PreparationsComponent, children: [
      { path: '', component: ListPreparationsComponent },
      { path: 'list-preparations', component: ListPreparationsComponent },
      {
        path: 'add-preparations', component: AddPreparationsComponent, children: [
          { path: '', component: PreparationsDataComponent },
          { path: 'edit-preparations-data/:id', component: PreparationsDataComponent },
          { path: 'preparations-data', component: PreparationsDataComponent },
          { path: 'preparations-teem', component: PreparationsTeamComponent },
          { path: 'preparations-devices', component: PreparationsDevicesComponent },
        ]
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreparationsRoutes { }
