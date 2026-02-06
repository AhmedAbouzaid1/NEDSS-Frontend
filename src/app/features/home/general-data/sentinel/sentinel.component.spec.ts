import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentinelComponent } from './sentinel.component';

describe('SentinelComponent', () => {
  let component: SentinelComponent;
  let fixture: ComponentFixture<SentinelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentinelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentinelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
