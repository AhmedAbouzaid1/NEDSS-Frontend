import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HepatitisVirusesComponent } from './hepatitis-viruses.component';

describe('HepatitisVirusesComponent', () => {
  let component: HepatitisVirusesComponent;
  let fixture: ComponentFixture<HepatitisVirusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HepatitisVirusesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HepatitisVirusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
