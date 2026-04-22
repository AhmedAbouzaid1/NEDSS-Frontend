import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-investigation-summary',
  templateUrl: './investigation-summary.component.html',
  styleUrls: ['./investigation-summary.component.css']
})
export class InvestigationSummaryComponent implements OnChanges {
  @Input() patientName: string = '';
  @Input() allFilledControlsCount: number = 0;
  @Input() allControllesCount: number = 0;
  completionPercentage: number = 0;

  ngOnChanges(): void {
    if (!this.allControllesCount) {
      this.completionPercentage = 0;
      return;
    }
    this.completionPercentage = (this.allFilledControlsCount / this.allControllesCount) * 100;
  }
}
