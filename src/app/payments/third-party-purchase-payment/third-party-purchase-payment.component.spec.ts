import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyPurchasePaymentComponent } from './third-party-purchase-payment.component';

describe('ThirdPartyPurchasePaymentComponent', () => {
  let component: ThirdPartyPurchasePaymentComponent;
  let fixture: ComponentFixture<ThirdPartyPurchasePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyPurchasePaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyPurchasePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
