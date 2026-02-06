import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialLoadingComponent } from './partial-loading.component';

describe('PartialLoadingComponent', () => {
  let component: PartialLoadingComponent;
  let fixture: ComponentFixture<PartialLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
