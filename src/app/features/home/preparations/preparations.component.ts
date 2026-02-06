import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-preparations',
  templateUrl: './preparations.component.html',
  styleUrls: ['./preparations.component.css']
})
export class PreparationsComponent {
  constructor() {
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
  }
}
