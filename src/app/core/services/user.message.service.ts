import {  Inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserMessageService {
   constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  success(messageDetails:string) {
      this.toastr.success(messageDetails,'',
      {
        positionClass: 'toast-bottom-left',
        enableHtml: true,
        closeButton: true,
        progressBar:true,
        timeOut: 3000,
        disableTimeOut: false
    });
  }

  error(messageDetails:string) {
    this.toastr.error(messageDetails,'',
    {
      positionClass: 'toast-bottom-left',
      enableHtml: true,
      closeButton: true,
      progressBar:true,
      timeOut: 3000,
      disableTimeOut: false
  });
  }

  warn(messageDetails:string) {
    this.toastr.warning(messageDetails,'',
      {
        positionClass: 'toast-bottom-left',
        enableHtml: true,
        closeButton: true,
        timeOut: 3000,
        disableTimeOut: false
    });
  }

  info(messageDetails:string) {
    this.toastr.info(messageDetails,'',
      {
        positionClass: 'toast-bottom-left',
        enableHtml: true,
        closeButton: true,
        timeOut: 3000,
        disableTimeOut: false
    });
  }

}
