import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandCashEntryComponent } from './hand-cash-entry.component';

describe('HandCashEntryComponent', () => {
  let component: HandCashEntryComponent;
  let fixture: ComponentFixture<HandCashEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandCashEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandCashEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
