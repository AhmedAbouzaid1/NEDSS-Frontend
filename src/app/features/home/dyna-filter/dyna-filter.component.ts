import { Idle } from '@ng-idle/core';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { DynaChartFilter, GroupBy } from 'src/app/models/dyna-chart-filter';
import { GovernmentDTO } from '../chat/Models/government-dto';
import { Result } from '../../Result';
import { DiseaseDTO } from 'src/app/models/disease-dto';

@Component({
  selector: 'app-dyna-filter',
  templateUrl: './dyna-filter.component.html',
  styleUrls: ['./dyna-filter.component.css']
})
export class DynaFilterComponent implements OnInit {
  @Output() filterOut = new EventEmitter<DynaChartFilter>();
  govs: GovernmentDTO[] = [];
  diseases: DiseaseDTO[] = [];
  _govs: GovernmentDTO[] = [];
  _diseases: DiseaseDTO[] = [];
  filter: DynaChartFilter = {};
  gBLength: number = 0;
  gBNames: string[] = [];
  gBValues: any[] = [];
  arr = Array;
  groupBy: GroupBy;
  govsLoading = false;
  diseasesLoading = false;

  homeGovIDs: number = 0;

  multipleDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'arabicName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    placeholder: "Choose",
    searchPlaceholderText: "Search Items",
    noDataAvailablePlaceholderText: "No Data",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };

  constructor(private lookUpService: LookupsGetterService) {

  }
  ngOnInit(): void {
    this.loadGovs();
    this.gBLength = Object.keys(GroupBy).length;
    this.gBNames = Object.keys(GroupBy).splice(0, this.gBLength / 2);
    this.gBValues = Object.values(GroupBy).splice(0, this.gBLength / 2);
  }
  loadGovs() {
    this.govsLoading = true;
    this.lookUpService.getAllGovernments().subscribe({
      next: (result: Result<GovernmentDTO[]>) => { this.govs = result.data },
      error: (err) => { this.govsLoading = false; console.error(err) },
      complete: () => { this.govsLoading = false; }
    })
  }
  loadDiseases() {
    this.diseasesLoading = true;
    this.lookUpService.getAllDiseases().subscribe({
      next: (result: Result<DiseaseDTO[]>) => { this.diseases = result.data },
      error: (err) => { this.diseasesLoading = false; console.error(err) },
      complete: () => { this.diseasesLoading = false; }
    })
  }
  SetHomeGovernments(event) {
    this.filter.homeGovIDs = [];
    if (Array.isArray(event)) {
      this._govs = event;
    }
    this._govs.forEach(el => {
      this.filter.homeGovIDs.push(el.id);
    });
    this.send();
  }
  send() {
    this.filterOut.emit(this.filter);
  }
  SetDisease(event) {
    this.filter.diseaseIDs = [];
    if (Array.isArray(event)) {
      this._diseases = event;
    }
    this._diseases.forEach(el => {
      this.filter.diseaseIDs.push(el.id);
    });
    this.send();
  }
  setGroupBy(event) {
    //console.log(event.target.value);
    //console.log(this.filter);
  }
}
