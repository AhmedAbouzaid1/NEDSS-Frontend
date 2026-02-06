import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { NgxPrintModule } from 'ngx-print';
import { ExportAsModule } from 'ngx-export-as';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchRoutes } from './search.routing';
import { FastSearchComponent } from './fast-search/fast-search.component';
import { generalreportFormComponent } from './advanced-search/general-report-form/general-report-form.component';
import { PlaceOfResidenceComponent } from './advanced-search/place-of-residence/place-of-residence.component';
import { SearchDemoghraphComponent } from './advanced-search/search-demoghraph/search-demoghraph.component';
import { MaterialModule } from 'src/app/core/shared/material-module';
import { PaginatorModule } from 'primeng/paginator';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InputTextModule } from 'primeng/inputtext';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SearchComponent,
    FastSearchComponent,
    AdvancedSearchComponent,
    generalreportFormComponent,
    PlaceOfResidenceComponent,
    SearchDemoghraphComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    SearchRoutes,
    FormsModule,
    PaginatorModule,
    RouterModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    NgxPrintModule,
    ExportAsModule,
    MatTreeModule,
    ReactiveFormsModule,
    TableModule,
    TabMenuModule,
    SharedModule,
    CalendarModule,
    InputTextModule,
    // ngx-translate and the loader module
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'ar',
    }),
  ],
})
export class SearchModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
