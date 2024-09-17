import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaymentReportsComponent } from './purchase-payment-reports.component';

describe('PurchasePaymentReportsComponent', () => {
  let component: PurchasePaymentReportsComponent;
  let fixture: ComponentFixture<PurchasePaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchasePaymentReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasePaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
