import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'build-control',
  templateUrl: './build-control.component.html',
  styleUrls: ['./build-control.component.css']
})
export class BuildControlComponent implements OnInit {

  delimiter = '-';
  @Input() control: any;
  @Input() dataBase: any;
  @Output() onControlProperty = new EventEmitter<any>(); // output create  Change
  @Output() onControlDelete = new EventEmitter<any>(); // output create  Change
  @Output() onModelChange = new EventEmitter<any>(); // output create  Change


  constructor() { }

  ngOnInit(): void {
  }


  getList(item: string) {
    return item.split(this.delimiter);
  }
  test() {
    // alert("s");
  }
  onControlClick(id: any) {
    this.onControlProperty.emit(id);
  }
  onControlDeleteClick(id: any) {
    this.onControlDelete.emit(id);
  }
  onChange(value: any) {
    this.onModelChange.emit(value);
  }


}
