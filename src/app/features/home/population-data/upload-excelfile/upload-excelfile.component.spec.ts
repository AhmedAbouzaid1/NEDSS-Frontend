import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExcelfileComponent } from './upload-excelfile.component';

describe('UploadExcelfileComponent', () => {
  let component: UploadExcelfileComponent;
  let fixture: ComponentFixture<UploadExcelfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadExcelfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadExcelfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
