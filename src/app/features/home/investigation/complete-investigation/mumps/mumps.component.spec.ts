import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MumpsComponent } from './mumps.component';

describe('MumpsComponent', () => {
  let component: MumpsComponent;
  let fixture: ComponentFixture<MumpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MumpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
