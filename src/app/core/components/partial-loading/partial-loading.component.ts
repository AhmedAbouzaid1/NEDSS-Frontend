import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'partial-loading',
    templateUrl: './partial-loading.component.html',
    styleUrls: ['./partial-loading.component.scss']
})
export class PartialLoadingComponent implements OnInit {
    @Input() width :any = 0;
    @Input() height : any = 0;
    @Input() color: any;
    @Input() left: any;
    @Input() top: any;
    @Input() pathColor: any;
    constructor() { }

    ngOnInit() {
    }
}
