import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ng-dropdown-singl',
  templateUrl: './ng-dropdown-singl.component.html',
  styleUrls: ['./ng-dropdown-singl.component.css']
})
export class NgDropdownSinglComponent {
  @Input() data: any;
  @Output() ngModel = new EventEmitter<any>();
  selectedValue: any;
  @Output() onSelect = new EventEmitter<any>();
  @Output() onDeSelect = new EventEmitter<any>();

  onDropdownChanged() {
    this.onSelect.emit(this.selectedValue)
  }
  onDropdownDeSelect() {
    this.onDeSelect.emit()

  }

}
