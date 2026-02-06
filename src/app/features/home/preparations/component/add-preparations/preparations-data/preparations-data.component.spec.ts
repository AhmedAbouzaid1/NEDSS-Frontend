import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationsDataComponent } from './preparations-data.component';

describe('PreparationsDataComponent', () => {
  let component: PreparationsDataComponent;
  let fixture: ComponentFixture<PreparationsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparationsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
