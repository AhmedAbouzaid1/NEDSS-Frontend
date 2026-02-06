import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDropdownSinglComponent } from './ng-dropdown-singl.component';

describe('NgDropdownSinglComponent', () => {
  let component: NgDropdownSinglComponent;
  let fixture: ComponentFixture<NgDropdownSinglComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgDropdownSinglComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgDropdownSinglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
