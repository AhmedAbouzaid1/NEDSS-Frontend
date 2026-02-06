import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRepeatedRecordsComponent } from './merge-repeated-records.component';

describe('MergeRepeatedRecordsComponent', () => {
  let component: MergeRepeatedRecordsComponent;
  let fixture: ComponentFixture<MergeRepeatedRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeRepeatedRecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeRepeatedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
