import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchistosomiasisComponent } from './schistosomiasis.component';

describe('SchistosomiasisComponent', () => {
  let component: SchistosomiasisComponent;
  let fixture: ComponentFixture<SchistosomiasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchistosomiasisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchistosomiasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
