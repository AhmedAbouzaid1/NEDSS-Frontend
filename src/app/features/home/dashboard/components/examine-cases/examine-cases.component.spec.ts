import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamineCasesComponent } from './examine-cases.component';


describe('ExamineCasesComponent', () => {
  let component: ExamineCasesComponent;
  let fixture: ComponentFixture<ExamineCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamineCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamineCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
