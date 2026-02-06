
import { By } from '@angular/platform-browser';
import { DiseasesComponent } from './features/home/dashboard/components/codes/diseases/diseases.component';
import { NumberOnlyDirective } from './number-only.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
describe('NumberOnlyDirective', () => {
  let directive: NumberOnlyDirective;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberOnlyDirective]
    });
    fixture = TestBed.createComponent(DiseasesComponent); // Replace TestComponent with your actual component
    directive = fixture.debugElement.query(By.directive(NumberOnlyDirective)).injector.get(NumberOnlyDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
