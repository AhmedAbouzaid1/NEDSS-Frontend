import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MumbariPoisoningComponent } from './mumbari-poisoning.component';

describe('MumbariPoisoningComponent', () => {
  let component: MumbariPoisoningComponent;
  let fixture: ComponentFixture<MumbariPoisoningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MumbariPoisoningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MumbariPoisoningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
