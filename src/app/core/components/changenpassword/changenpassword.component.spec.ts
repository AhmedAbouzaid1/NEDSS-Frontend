import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangenpasswordComponent } from './changenpassword.component';

describe('ChangenpasswordComponent', () => {
  let component: ChangenpasswordComponent;
  let fixture: ComponentFixture<ChangenpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangenpasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangenpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
