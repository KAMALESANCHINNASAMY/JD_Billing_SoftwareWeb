import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyWiseNongstpurchaseReportsComponent } from './party-wise-nongstpurchase-reports.component';

describe('PartyWiseNongstpurchaseReportsComponent', () => {
  let component: PartyWiseNongstpurchaseReportsComponent;
  let fixture: ComponentFixture<PartyWiseNongstpurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyWiseNongstpurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartyWiseNongstpurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
