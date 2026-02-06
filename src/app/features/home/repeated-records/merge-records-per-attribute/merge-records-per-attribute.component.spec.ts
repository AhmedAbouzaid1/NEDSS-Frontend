import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRecordsPerAttributeComponent } from './merge-records-per-attribute.component';

describe('MergeRecordsPerAttributeComponent', () => {
  let component: MergeRecordsPerAttributeComponent;
  let fixture: ComponentFixture<MergeRecordsPerAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeRecordsPerAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeRecordsPerAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
