import { LabModule } from './features/lab/lab.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import ngx-translate and the http loader
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from './core/shared/material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';

//import { StringConverterPipe } from './core/Pipes/string-converter.pipe';
import { HomeModule } from './features/home/home.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgDropdownSinglComponent } from './core/components/ng-dropdown-singl/ng-dropdown-singl.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatepickerMaxTodayDirective } from './datepicker-max-today.directive';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkFailureComponent } from './features/errors/network-failure/network-failure.component';
import { SharedModule } from './core/shared/shared.module';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    NgDropdownSinglComponent,
    DatepickerMaxTodayDirective,
    NetworkFailureComponent,

    // StringConverterPipe,
  ],
  imports: [
    NgbAccordionModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    MaterialModule,
    HomeModule,
    LabModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    NgIdleKeepaliveModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      includeTitleDuplicates: true,
      maxOpened: 4,
      autoDismiss: true,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MultiSelectModule,
    InputTextModule,
    ConfirmDialogModule,
    SharedModule,
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
