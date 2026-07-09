import { Component, OnInit } from '@angular/core';
import { UiLoadingService } from '../../services/ui-loading.service';

@Component({
    selector: 'page-loading',
    templateUrl: './page-loading.component.html',
    styleUrls: ['./page-loading.component.scss']

})
export class PageLoadingComponent implements OnInit {

    constructor(public loader: UiLoadingService) {
    }

    public readonly isLoading$ = this.loader.isLoading$;

    ngOnInit(): void {
    }

}
