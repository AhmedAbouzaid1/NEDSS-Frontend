import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilariasisComponent } from './filariasis.component';

describe('FilariasisComponent', () => {
  let component: FilariasisComponent;
  let fixture: ComponentFixture<FilariasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilariasisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilariasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
