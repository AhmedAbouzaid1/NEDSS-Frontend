import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AriComponent } from './ari.component';

describe('AriComponent', () => {
  let component: AriComponent;
  let fixture: ComponentFixture<AriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
