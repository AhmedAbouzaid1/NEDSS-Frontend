import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedDataService } from '../../Services/shared-data.service';

@Component({
  selector: 'app-add-preparations',
  templateUrl: './add-preparations.component.html',
  styleUrls: ['./add-preparations.component.css']
})
export class AddPreparationsComponent {
  items: MenuItem[];
  items2: MenuItem[];

  activeItem: MenuItem;
  unitId: number;
  currentLang: string = "";

  constructor(
    private data: SharedDataService
  ) { }

  ngOnInit() {
    this.currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
      if (this.unitId == null || this.unitId == 0) {

      }
      else {
        this.items = [
          { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
          { label: 'بيانات فريق الترصد', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
          { label: 'بيانات الاجهزة', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
        ];
      }
    });
    console.log("ssss  " + this.unitId)
    if (this.unitId == null || this.unitId == 0) {
      this.items = [
        { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
      ];
      this.items2 = [
        { label: 'Data Monitoring Unit', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
      ];
    } else {
      this.items = [
        { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
        { label: 'بيانات فريق الترصد', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
        { label: 'بيانات الاجهزة', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
      ];
      this.items2 = [
        { label: 'Data Monitoring Unit', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
        { label: 'Monitoring Team Data', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
        { label: 'Devices Data', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
      ];
    }

    this.activeItem = this.items[0];
  }
  onActiveItemChange(event) {
    this.activeItem = event;
  }

  onChildNotification() {
    console.log('notified');
    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
      if (this.unitId == null || this.unitId == 0) {

      }
      else {
        this.items = [
          { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
          { label: 'بيانات فريق الترصد', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
          { label: 'بيانات الاجهزة', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
        ];
      }
    });
    console.log("ssss  " + this.unitId)
    if (this.unitId == null || this.unitId == 0) {
      this.items = [
        { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
      ];
      this.items2 = [
        { label: 'Data Monitoring Unit', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
      ];
    } else {
      this.items = [
        { label: 'بيانات وحدة الترصد', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
        { label: 'بيانات فريق الترصد', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
        { label: 'بيانات الاجهزة', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
      ];
      this.items2 = [
        { label: 'Data Monitoring Unit', icon: 'pi pi-fw pi-user', routerLink: ['./preparations-data'] },
        { label: 'Monitoring Team Data', icon: 'pi pi-fw pi-id-card', routerLink: ['./preparations-teem'] },
        { label: 'Devices Data', icon: 'pi pi-fw pi-building', routerLink: ['./preparations-devices'] },
      ];
    }

    this.activeItem = this.items[0];
  }
}
