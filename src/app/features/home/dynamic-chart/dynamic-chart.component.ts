
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { DynaChart, DynaChartData } from 'src/app/models/dyna-chart';
import { DynaChartService } from '../dyna-chart.service';
import { DynaChartFilter } from 'src/app/models/dyna-chart-filter';
import { Result } from '../../Result';

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css']
})
export class DynamicChartComponent implements OnInit {
  @Output() chartDataOut = new EventEmitter<DynaChartData[]>();
  dynaChartFilter: DynaChartFilter[] = [];
  data: DynaChart[] = [];
  chartData: DynaChartData[] = [];
  noOfCharts: number = 1;
  arr = Array;

  constructor(private dynaChartService: DynaChartService) {
  }
  ngOnInit(): void {
    //this.chartData.dynaCharts = [];
  }
  addRemoveChart() {
    this.dynaChartFilter = [];
    for (let i = 0; i < this.noOfCharts; i++) {
      let x: DynaChartFilter = {};
      this.dynaChartFilter.push(x);
    }
  }
  Update(filter: DynaChartFilter, i: number) {
    this.dynaChartFilter[i] = filter;
  }
  GetFilteredData() {
    //console.log(this.dynaChartFilter);
    if (this.dynaChartFilter == null || this.dynaChartFilter == undefined || this.dynaChartFilter.length < 1) return;
    this.chartData = [];
    for (let i = 0; i < this.dynaChartFilter.length; i++) {
      this.dynaChartService.GetFilteredChart(this.dynaChartFilter[i]).subscribe({
        next: (result: Result<DynaChart[]>) => {
          this.data = result.data;
          let x: DynaChartData = { dynaCharts: this.data, title: result?.messages[0] };
          this.chartData.push(x);
        },
        error: (err) => { console.error(err) },
        complete: () => {
          if (i == this.dynaChartFilter.length - 1) this.chartDataOut.emit(this.chartData);
          console.log(this.chartData);
        }
      });
    }
  }

}
