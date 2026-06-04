import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';

import { MeningealComponent } from './meningeal.component';

describe('MeningealComponent', () => {
  let component: MeningealComponent;
  let fixture: ComponentFixture<MeningealComponent>;
  const investigationServiceMock = {
    currentid: 1,
    diseaseGroupID: 1,
    patient: {},
    getByIdMeningeal: jasmine.createSpy('getByIdMeningeal').and.returnValue(of({ data: {} })),
    updateSevereMeningeal: jasmine.createSpy('updateSevereMeningeal').and.returnValue(of({})),
    addInvestigationMeningeal: jasmine.createSpy('addInvestigationMeningeal').and.returnValue(of({ data: { id: 1 } })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeningealComponent],
      imports: [ReactiveFormsModule],
      providers: [
        DatePipe,
        { provide: InvestigationService, useValue: investigationServiceMock },
        { provide: UserMessageService, useValue: { success: () => {}, error: () => {} } },
        { provide: TranslateService, useValue: { get: () => of('ok') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 1 } } } },
        { provide: Router, useValue: { navigateByUrl: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeningealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
