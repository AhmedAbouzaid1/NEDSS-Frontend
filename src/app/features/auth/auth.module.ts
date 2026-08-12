import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DialogModule } from 'primeng/dialog';
import { ForgetPasswordComponent } from './forget-password/forget-password/forget-password.component';


@NgModule({
  declarations: [
    AuthComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent
  ],
  imports: [
      TranslateModule,
    CommonModule,
    AuthRoutingModule ,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class AuthModule { }
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
