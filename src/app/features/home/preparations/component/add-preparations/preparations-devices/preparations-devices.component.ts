import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PreparationsService } from '../../../Services/preparations.service';
import { SharedDataService } from '../../../Services/shared-data.service';
import { ExportService } from '../../../../../../core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
@Component({
  selector: 'app-preparations-devices',
  templateUrl: './preparations-devices.component.html',
  styleUrls: ['./preparations-devices.component.css']
})
export class PreparationsDevicesComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  unitId: number;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };
  preparationsDevice = {
    id: null,
    monitorUnitId: null,
    deviceCategoryId: null,
    deviceTypeId: null,
    serialNo: null,
    deviceSpecifications: null,
    isDeviceWorking: false,
  };
  singleDropdownSettings = SingleDropdownSettings;
  preparationsDevices!: any[];
  deviceCategorys!: any[];
  deviceTypes!: any[];
  selecteddeviceCategoryId: any;
  preparationsDeviceFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    monitorUnitId: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  currentLang: string;
  underDeleting2 = {
    deviceTypeName: '',
    id: null,

  };
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  pleaseComplete: boolean;

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private preparationsService: PreparationsService,
    private data: SharedDataService,
    private exportService: ExportService,
  ) { }

  ngOnInit() {
    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
    });
    this.preparationsDevice.monitorUnitId = this.unitId;
    this.preparationsDeviceFilter.monitorUnitId = this.unitId;
    this.getPreparationsDevices();
    this.getAllDeviceCategorys();
    this.translateService.get('NEDSS.PREPARATION.MONITOR_UNIT_LIST.PREPARATIONS').subscribe(res => {
      this.screenName = res;
    });
  }
  getAllDeviceCategorys() {
    this.lookupsGetterService.getAllDeviceCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.deviceCategorys = result.data;
          // Add an option at the beginning of the list
          this.deviceCategorys.unshift(
            {
              "id": null,
              "code": null,
              "arabicName": "أختر",
              "englishName": "select",
              "totalCount": null
          }
          );
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }, () => {
      }

    );
  }
  deviceCategorySelected() {
    if (this.preparationsDevice.deviceCategoryId) {
      this.getAllDeviceTypes(this.preparationsDevice.deviceCategoryId);
    } else {
      this.deviceTypes = null;
    }
  }

  getAllDeviceTypes(deviceCategoryId) {
    this.lookupsGetterService.getPageDeviceTypes({
      deviceCategoryId: deviceCategoryId
    }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.deviceTypes = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  search() {
    this.first = 0;
    this.preparationsDeviceFilter.pageIndex = 0;
    this.last =
      this.preparationsDeviceFilter.pageIndex * this.preparationsDeviceFilter.pageSize;
    this.getPreparationsDevices();
  }

  getPreparationsDevices() {
    this.loadingPanel = true;
    this.preparationsService
      .getPagePreparationsDevice(this.preparationsDeviceFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {

            this.preparationsDevices = result.data;

            if (
              this.preparationsDevices != undefined &&
              this.preparationsDevices.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.preparationsDeviceFilter.pageIndex *
                this.preparationsDeviceFilter.pageSize;
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getById(id: number) {
    this.preparationsService.getPreparationDeviceById(id).subscribe(
      (result: any) => {
        this.preparationsDevice = result.data;
        this.selecteddeviceCategoryId = this.deviceCategorys.filter(
          item => item.id === this.preparationsDevice.deviceCategoryId);
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {

    if (
      this.preparationsDevice.monitorUnitId == null ||
      this.preparationsDevice.deviceCategoryId == null ||
      this.preparationsDevice.deviceTypeId == null ||
      this.preparationsDevice.serialNo == null ||
      this.preparationsDevice.deviceSpecifications == null ||
      this.preparationsDevice.isDeviceWorking == null
    ) {
      this.pleaseComplete = true;
    } else {
      this.pleaseComplete = false;
      if (this.preparationsDevice.id == null) {
        this.preparationsService.addPreparationDevice(this.preparationsDevice).subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getPreparationsDevices();

              this.preparationsDevice = {
                id: null,
                monitorUnitId: this.unitId,
                deviceCategoryId: null,
                deviceTypeId: null,
                serialNo: null,
                deviceSpecifications: null,
                isDeviceWorking: null,
              };
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
      } else this.update();
    }


  }

  update() {
    this.preparationsService.updatePreparationDevice(this.preparationsDevice).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getPreparationsDevices();
          this.preparationsDevice = {
            id: null,
            monitorUnitId: this.unitId,
            deviceCategoryId: null,
            deviceTypeId: null,
            serialNo: null,
            deviceSpecifications: null,
            isDeviceWorking: null,
          };
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.UPDATE_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.preparationsDeviceFilter.sortOrder != SortOrder.desc
    ) {
      this.preparationsDeviceFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.preparationsDeviceFilter.sortColumn = event.field;
      this.getPreparationsDevices();
    } else if (
      event.order == 1 &&
      this.preparationsDeviceFilter.sortOrder != SortOrder.asc
    ) {
      this.preparationsDeviceFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.preparationsDeviceFilter.sortColumn = event.field;
      this.getPreparationsDevices();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.preparationsDeviceFilter.pageIndex = event.page;
    this.preparationsDeviceFilter.pageSize = event.rows;
    this.getPreparationsDevices();
  }

  delete(id: number) {
    this.preparationsService.deletePreparationDevice(id).subscribe(
      (result: any) => {
        this.getPreparationsDevices();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  clearSearch() {
    this.preparationsDeviceFilter.searchText = '';
    this.search();
  }


  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    this.exportService.exportTemplateAsPdfLogoTitle(document.getElementById(this.currentConfig),
      'بيانات الاجهزة '
    );
  }
  nameToDelete(ele) {

    this.underDeleting2.id = ele.id;
    this.underDeleting2.deviceTypeName = ele.deviceTypeName;



  }
}


