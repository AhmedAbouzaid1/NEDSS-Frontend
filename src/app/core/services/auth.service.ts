import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AuthControllerURL: string =
    environment.baseApiUrl + 'Account/';

  private userLoggedIn = new Subject<boolean>();


  constructor(private APIs: BaseAPIService) {
    this.userLoggedIn.next(false);
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
  gets() {
    return this.APIs.gets();
  }

  login(username: any, password: any) {
    return this.APIs.post(this.AuthControllerURL + `Login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {});
  }
  register(registerModel: any) {
    return this.APIs.post(this.AuthControllerURL + "Register", registerModel);
  }
  logout() {
    return this.APIs.post(this.AuthControllerURL + "Logout", {});
  }

  changePassword(data) {
    return this.APIs.post(this.AuthControllerURL + "ChangePassword", data)
  }

  forgotPassword(username) {
    var model: ForgotPasswordModel = {
      username: username.value,
      frontendUrl: window.location.href
    }
    return this.APIs.post(this.AuthControllerURL + "forgotPassword", model);
  }

  resetPassword(email, newPassword, token) {
    var model: ResetPasswordModel = {
      email: email,
      newPassword: newPassword.value,
      token: token
    }
    return this.APIs.post(this.AuthControllerURL + "resetPassword", model);
  }
}

export interface ForgotPasswordModel {
  username: string;
  frontendUrl: string
}

export interface ResetPasswordModel {
  email: string,
  newPassword: string;
  token: string;
}