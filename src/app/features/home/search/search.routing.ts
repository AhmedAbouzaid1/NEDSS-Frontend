
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemographicDataComponent } from '../general-data/demographic-data/demographic-data.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { generalreportFormComponent } from './advanced-search/general-report-form/general-report-form.component';
import { PlaceOfResidenceComponent } from './advanced-search/place-of-residence/place-of-residence.component';
import { SearchDemoghraphComponent } from './advanced-search/search-demoghraph/search-demoghraph.component';
import { FastSearchComponent } from './fast-search/fast-search.component';
import { SearchComponent } from './search.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard.service';
import { NavigationGuard } from 'src/app/core/guards/navigation.guard.service';


const routes: Routes = [

    { path: 'fast-search', component: FastSearchComponent } ,
    { path: 'advanced-search', component: AdvancedSearchComponent,children:[
      { path: '', component: generalreportFormComponent } ,
      { path: 'general-report', component: generalreportFormComponent } ,
       { path: 'place-residence', component: PlaceOfResidenceComponent } ,
        { path: 'search-demograth', component: SearchDemoghraphComponent } ,
    ] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutes { }
