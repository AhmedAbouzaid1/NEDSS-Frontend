import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPreparationsComponent } from './list-preparations.component';

describe('ListPreparationsComponent', () => {
  let component: ListPreparationsComponent;
  let fixture: ComponentFixture<ListPreparationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPreparationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPreparationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
