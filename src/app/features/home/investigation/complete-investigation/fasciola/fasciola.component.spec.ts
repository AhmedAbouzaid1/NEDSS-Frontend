import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FasciolaComponent } from './fasciola.component';

describe('FasciolaComponent', () => {
  let component: FasciolaComponent;
  let fixture: ComponentFixture<FasciolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FasciolaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FasciolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
