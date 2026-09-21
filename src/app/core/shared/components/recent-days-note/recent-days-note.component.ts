import { Component, OnInit } from '@angular/core';
import { LookupsGetterService } from '../../../services/lookups-getter.service';

@Component({
  selector: 'app-recent-days-note',
  templateUrl: './recent-days-note.component.html',
  styleUrls: ['./recent-days-note.component.css'],
})
export class RecentDaysNoteComponent implements OnInit {
  days: number = null;

  constructor(private lookupsService: LookupsGetterService) {}

  ngOnInit() {
    this.lookupsService.getDataDaysLimitValue().subscribe((value) => {
      this.days = value;
    });
  }
}
