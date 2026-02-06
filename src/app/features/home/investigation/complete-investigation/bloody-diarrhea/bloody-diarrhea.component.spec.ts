import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodyDiarrheaComponent } from './bloody-diarrhea.component';

describe('BloodyDiarrheaComponent', () => {
  let component: BloodyDiarrheaComponent;
  let fixture: ComponentFixture<BloodyDiarrheaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloodyDiarrheaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodyDiarrheaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
