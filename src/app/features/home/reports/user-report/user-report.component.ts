import { Component, OnInit } from '@angular/core';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { Organiztion } from '../../chat/Models/organiztion';
import { GovernmentDTO } from '../../chat/Models/government-dto';
import { HealthAdministrationDTO } from 'src/app/features/Models/health-administration';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { Result } from 'src/app/features/Result';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { FilterHealthAdministrationDto } from '../../epidemiological-thresholds/epidemiological-thresholds-users/Model/filter-health-administration-dto';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { UserService } from '../../users/Services/user.service';
import { OrganizationEnum } from '../../users/models/organization-enum';
import { OrganizationAccessibleParts } from '../../epidemiological-thresholds/epidemiological-thresholds-users/Model/organization-accessible-parts';
import { FilterIncidentSources } from '../../users/models/filter-incident-sources';
import { userReportDTO } from 'src/app/models/user-report-Dto';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css'],
})
export class UserReportComponent implements OnInit {
  //Language Settings
  currentLang: string = '';
  dir: string = '';
  //loading settings
  loadingPanel: boolean = false;
  organizationParts!: OrganizationAccessibleParts;

  //Entities
  organizations: Organiztion[];
  selectedOrgnization: string;
  selectedOrginzationId: number;

  governments: GovernmentDTO[];
  selectedGoverments: any[];

  healthAdministrations: HealthAdministrationDTO[];
  selectedHealthAdministrations: any[];

  branches: any[];
  selectedBranches: any;

  areas: any[];
  selectedAreas: any;

  universities: any[];
  selectedUniversities: any[];

  incidentSources: any[];
  selectedIncidentSources: any;

  roles: any[];
  selectedRoles: any;

  departments: any[];
  selectedDepartments: any;

  positions: any[];
  selectedPositions: any;

  tableData: any;
  showTableData: boolean = false;
  multipleDropdownSettings = {
    ...MultipleDropdownSettings,
    enableCheckAll: false,
  };
  organizationsLoading = false;
  governmentsLoading = false;
  healthAdministrationsLoading = false;
  branchesLoading = false;
  areasLoading = false;
  universitiesLoading = false;
  incidentSourcesLoading = false;
  rolesLoading = false;
  departmentsLoading = false;
  positionsLoading = false;

  constructor(
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private translateService: TranslateService,
    private userService: UserService,
    public generalDataService: GeneralDataService
  ) {
    this.getLanguageConfiguration();
  }

  ngOnInit(): void {
    this.getOrganizations();
    this.getRoles();
    this.getDepartments();
    this.getPositions();
  }

  //Page Configuration
  getLanguageConfiguration() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
  }

  getOrganizationAccessibleParts(orginzationId: number) {
    this.lookupsService
      .getOrganizationAccessibleParts(orginzationId)
      .subscribe({
        next: (response: Result<OrganizationAccessibleParts>) => {
          this.organizationParts = response.data;
        },
        error: (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
        complete: () => {
          this.getPartData(orginzationId);
        },
      });
  }

  getPartData(orginzationId: number) {
    this.selectedOrginzationId = orginzationId;
    if (
      orginzationId == OrganizationEnum.ministryOfHealth ||
      OrganizationEnum.generalOrganizationForTeachingHospitalsAndInstitutes ||
      orginzationId == OrganizationEnum.amanHospitals
    ) {
      this.getGovernments();
    }
    if (orginzationId == OrganizationEnum.healthInsurance) {
      this.getAllBranchesForUsers();
    }
    if (orginzationId == OrganizationEnum.universityHospitals) {
      this.getAllUniversitiesForUsers();
    }

    if (orginzationId == OrganizationEnum.healthCareAuthority) {
      this.getAllBranchesForUsers();
    }
  }

  getOrganizations() {
    this.organizationsLoading = true;
    this.lookupsService.getAllOrganizations().subscribe({
      next: (response: Result<Organiztion[]>) => {
        let selectionObject = {
          id: -1,
          englishName: 'Select',
          arabicName: 'أختر',
          code: '',
          totalCount: -1,
        };
        this.organizations = response.data;
        this.organizations.unshift(selectionObject);
        this.organizationsLoading = false;
        this.loadingPanel = false;
      },
      error: (error) => {
        this.organizationsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => (this.loadingPanel = false),
    });
  }

  onOrganizationChange(event: any) {
    this.reset();
    if (event.value.id === -1) {
      this.organizationParts.showAreas = false;
      this.organizationParts.showBranches = false;
      this.organizationParts.showGovernments = false;
      this.organizationParts.showHealthAdministrations = false;
      this.organizationParts.showSources = false;
      this.organizationParts.showUniversities = false;
      this.selectedOrginzationId = null;
      return;
    }
    const organizationId = event.value.id;
    this.getPartData(organizationId);
    this.getOrganizationAccessibleParts(organizationId);
  }

  reset() {
    this.selectedAreas = [];
    this.selectedBranches = [];
    this.incidentSources = [];
    this.selectedIncidentSources = [];
    this.selectedDepartments = [];
    this.selectedGoverments = [];
    this.selectedHealthAdministrations = [];
    this.universities = [];
    this.areas = [];
    this.branches = [];
    this.healthAdministrations = [];
    this.governments = [];
    this.selectedUniversities = [];
    this.selectedRoles = [];
    this.selectedPositions = [];
    this.tableData = [];
    this.showTableData = false;
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernmentsForUser(true).subscribe({
      next: (result: Result<GovernmentDTO[]>) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      error: (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }

  onGovernmentChanged() {
    if (this.selectedGoverments?.length) {
      const govIds = this.selectedGoverments.map((x) => x.id);

      if (this.selectedOrginzationId == OrganizationEnum.ministryOfHealth) {
        this.getHealthAdministration(govIds);
        this.selectedHealthAdministrations = [];
      }

      if (
        this.selectedOrginzationId ==
          OrganizationEnum.generalOrganizationForTeachingHospitalsAndInstitutes ||
        this.selectedOrginzationId == OrganizationEnum.amanHospitals
      ) {
        let filterIncidentSources: FilterIncidentSources =
          {} as FilterIncidentSources;
        filterIncidentSources.governmentsIds = this.selectedGoverments.map(
          (g) => g.id
        );
        filterIncidentSources.organizationId = this.selectedOrginzationId;
        filterIncidentSources.forSystemUser = true;
        this.getIncidentSources(filterIncidentSources);
      }
    } else {
      this.healthAdministrations = [];
    }
  }

  getHealthAdministration(governmentIDs: number[]) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getHealthAdministrationsIncidentByGovernmentsIds({
        governmentsIds: governmentIDs,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
          }
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministrations?.length) {
      let filterIncidentSources: FilterIncidentSources =
        {} as FilterIncidentSources;
      filterIncidentSources.healthAdministrationsIds =
        this.selectedHealthAdministrations.map((x) => x.id);
      filterIncidentSources.organizationId = this.selectedOrginzationId;
      filterIncidentSources.forSystemUser = true;
      this.getIncidentSources(filterIncidentSources);
    } else {
      this.incidentSources = [];
    }
  }

  getIncidentSources(filterIncidentSources: FilterIncidentSources) {
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getIncidentSourceHospitalsByGovernmentsIds(filterIncidentSources)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
          }
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getRoles() {
    this.rolesLoading = true;
    this.userService.getAllRoles().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.roles = result.data;
        }
        this.rolesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.rolesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getDepartments() {
    this.departmentsLoading = true;
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = result.data;
        }
        this.departmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.departmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getPositions() {
    this.positionsLoading = true;
    this.lookupsService.getAllPositions().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.positions = result.data;
        }
        this.positionsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.positionsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  //Start of Branch الفروع
  getAllBranchesForUsers() {
    this.branchesLoading = true;
    this.lookupsService
      .getAllBranchesForUsers(this.selectedOrginzationId, true)
      .subscribe({
        next: (response) => {
          if (response != null && response != undefined) {
            this.branches = response.data;
          }
          this.branchesLoading = false;
          this.loadingPanel = false;
        },
        error: (error) => {
          this.branchesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
        complete: () => {},
      });
  }

  getAllUniversitiesForUsers() {
    this.universitiesLoading = true;
    this.lookupsService
      .getAllBranchesForUsers(this.selectedOrginzationId, true)
      .subscribe({
        next: (response) => {
          if (response != null && response != undefined) {
            this.universities = response.data;
          }
          this.universitiesLoading = false;
          this.loadingPanel = false;
        },
        error: (error) => {
          this.universitiesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
        complete: () => {},
      });
  }

  onUniveristiesChange() {
    if (this.selectedUniversities?.length > 0) {
      let filterIncidentSources: FilterIncidentSources =
        {} as FilterIncidentSources;
      filterIncidentSources.organizationId = this.selectedOrginzationId;
      filterIncidentSources.branchsIds = this.selectedUniversities?.map(
        (g) => g.id
      );
      filterIncidentSources.forSystemUser = true;
      this.getIncidentSources(filterIncidentSources);
    }
  }

  onBranchesSelectionChange() {
    let isAreaExist: boolean =
      this.selectedOrginzationId == OrganizationEnum.healthInsurance
        ? true
        : false;
    if (this.selectedBranches?.length > 0) {
      let selectedBranchesIds = this.selectedBranches.map((g) => g.id);
      if (isAreaExist) {
        let areaFilter: any = {};
        areaFilter.branchsIds = selectedBranchesIds;
        areaFilter.forSystemUser = true;
        this.getAreasByBranchFilter(areaFilter);
      } else {
        let filterIncidentSources: FilterIncidentSources =
          {} as FilterIncidentSources;
        filterIncidentSources.organizationId = this.selectedOrginzationId;
        filterIncidentSources.forSystemUser = true;
        filterIncidentSources.branchsIds = selectedBranchesIds;
        this.getIncidentSources(filterIncidentSources);
      }
    }
  }

  getAreasByBranchFilter(areaFilter: any) {
    this.areasLoading = true;
    this.lookupsService.getAreasByBranchFilter(areaFilter).subscribe({
      next: (response) => {
        if (response != null && response != undefined) {
          this.areas = response.data;
        }
        this.areasLoading = false;
        this.loadingPanel = false;
      },
      error: (error) => {
        this.areasLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => {},
    });
  }

  onAreaSelectionChange() {
    if (this.selectedAreas?.length > 0) {
      if (this.selectedOrginzationId && this.selectedOrginzationId != -1) {
        let filterIncidentSources: FilterIncidentSources =
          {} as FilterIncidentSources;
        filterIncidentSources.areasIds = this.selectedAreas.map((g) => g.id);
        filterIncidentSources.organizationId = this.selectedOrginzationId;
        filterIncidentSources.forSystemUser = true;
        this.getIncidentSources(filterIncidentSources);
      }
    }
  }

  validateData(organization: OrganizationEnum): boolean {
    switch (organization) {
      case OrganizationEnum.ministryOfHealth:
        return this.validateMinistryOfHealthData();

      case OrganizationEnum.healthInsurance:
        return this.validateHealthInsuranceData();

      case OrganizationEnum.universityHospitals:
        return this.validateUniversityHospitalsData();

      case OrganizationEnum.generalOrganizationForTeachingHospitalsAndInstitutes:
        return this.validateTeachingHospitalsData();

      case OrganizationEnum.amanHospitals:
        return this.validateAmanHospitalsData();

      case OrganizationEnum.healthCareAuthority:
        return this.validateHealthCareAuthorityData();

      default:
        console.error('Unknown organization type');
        return false;
    }
  }

  getReportResult() {
    // const isValid = this.validateData(this.selectedOrginzationId);
    // if (!isValid) {
    //   this.translateService
    //     .get('NEDSS.COMMON.FILL_REQUIRED')
    //     .subscribe((res: string) => {
    //       this.userMsg.warn(res);
    //     });
    //   return;
    // }

    let userReportDto: userReportDTO = {} as userReportDTO;
    userReportDto.organizationId = this.selectedOrginzationId;
    userReportDto.governmentsIds = this.selectedGoverments?.map((g) => g.id);
    userReportDto.healthAdministrationsIds =
      this.selectedHealthAdministrations?.map((g) => g.id);
    userReportDto.incidentSourcesIds = this.selectedIncidentSources?.map(
      (g) => g.id
    );
    userReportDto.branchsIds = this.selectedBranches?.map((g) => g.id);
    userReportDto.areasIds = this.selectedAreas?.map((g) => g.id);
    userReportDto.rolesIds = this.selectedRoles?.map((g) => g.id);
    userReportDto.positionsIds = this.selectedPositions?.map((g) => g.id);
    userReportDto.departmentsIds = this.selectedDepartments?.map((g) => g.id);

    this.lookupsService.getUsersReport(userReportDto).subscribe({
      next: (response) => {
        this.tableData = response.data;
        this.showTableData = true;
      },
      error: (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => {},
    });
  }

  exportToPdf() {
    // this.loadingPanel = true;
    var element = document.getElementById('pdfTable');
    var clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.display = 'block';

    var opt = {
      margin: 0,
      filename: 'تقرير المستخدمين',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1, useCORS: true },
      pagebreak: { mode: 'always', after: ['#break'] },
      jsPDF: { unit: 'cm', format: 'a3', orientation: 'landscape' },
    };
    const self = this;
    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save()
      .then(function () {
        // self.loadingPanel = false;
        clonedElement.remove();
      });
  }

  print() {
    var element = document.getElementById('pdfTable');
    var clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.display = 'block';
    setTimeout(() => {
      window.print();
    }, 2000);
  }

  generateReportToExcel() {
    this.lookupsService.ExportDiseasesReportToExcel({
      //   governmentsIds: this.selectedgovernment.map((x) => x.id),
      //   HomeGovernmentsIds: this.selectedHomeGovernment.map((x) => x.id),
      //   healthAdministrationsIds: this.selectedhealthAdministration.map(
      //     (x) => x.id
      //   ),
      //   HomeHealthAdministrationsIds: this.selectedHomeHealthAdministration.map(
      //     (x) => x.id
      //   ),
      //   incidentSourcesIds: this.selectedIncidentSource.map((x) => x.id),
      //   HomeHealthOfficesIds: this.selectedHomeIncidentSource.map((x) => x.id),
      //   diseasesIds: this.selectedDiseases.map((x) => x.id),
      //   diseaseGroupsIds: this.selectedPrimaryDiseases.map((x) => x.id),
      //   reportType: ReportsEnum.DiseaseBasedOnGenederReport,
      //   fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      //   toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      // })
      // .subscribe((res) => {
      //   if (res?.data) {
      //     const response = res?.data;
      //     let file = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response}`;
      //     const fileName = 'تقرير الامراض طبقا للنوع.xlsx';
      //     saveAs(file, fileName);
      //     this.userMsg.success('تمت التنزيل بنجاح');
      //     this.nodata = false;
      //   } else {
      //     this.nodata = true;
      //   }
    });
  }

  //#region Valdiation

  validateMinistryOfHealthData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedGoverments?.length > 0 &&
      this.selectedHealthAdministrations?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  validateHealthInsuranceData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedBranches?.length > 0 &&
      this.selectedAreas?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  validateUniversityHospitalsData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedUniversities?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  validateTeachingHospitalsData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedGoverments?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  validateAmanHospitalsData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedGoverments?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  validateHealthCareAuthorityData(): boolean {
    return (
      this.selectedOrginzationId &&
      this.selectedBranches?.length > 0 &&
      this.selectedIncidentSources?.length > 0 &&
      this.selectedRoles?.length > 0 &&
      this.selectedDepartments?.length > 0 &&
      this.selectedPositions?.length > 0
    );
  }

  //#endregion
}
