import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFilterComponent } from './chat-filter.component';

describe('ChatFilterComponent', () => {
  let component: ChatFilterComponent;
  let fixture: ComponentFixture<ChatFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
