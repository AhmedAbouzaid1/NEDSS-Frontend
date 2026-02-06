import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedRecordsComponent } from './repeated-records.component';

describe('RepeatedRecordsComponent', () => {
  let component: RepeatedRecordsComponent;
  let fixture: ComponentFixture<RepeatedRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatedRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
