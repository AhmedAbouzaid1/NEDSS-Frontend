import { Component, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  systemUserId = null;
  profile: any = null;
  imageLoaded: boolean = false;
  loaded: boolean = false;
  imageSrc: string = 'assets/upload-image.webp';

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}
  ngOnInit(): void {
    this.systemUserId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userId;
    this.getProfile();
  }
  getProfile() {
    this.profileService.getProfileData(this.systemUserId).subscribe(
      (response: any) => {
        if (response) {
          this.profile = response.data;
        }
      },
      (error) => {
        console.error('Error in subscribe:', error); // Log the error to the console
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  updateProfile() {
    this.profileService
      .updateProfileData({
        profilePicture: this.profile.profilePicture,
        systemUserId: Number(this.systemUserId),
        fullName: this.profile.fullName,
        phoneNo: this.profile.phoneNumber,
        address: this.profile.address,
      })
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            // document.getElementById('profileModal').hidePopover();
            setTimeout(() => {
              this.getProfile();
            }, 200);
          }
        },
        (error) => {
          console.error('Error in subscribe:', error); // Log the error to the console
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  handleImageLoad() {
    this.imageLoaded = true;
  }
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    this.profile.profilePicture = reader.result;
    this.loaded = true;
  }
}
