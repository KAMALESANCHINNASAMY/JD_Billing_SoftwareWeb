import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductsPaymentComponent } from './sale-products-payment.component';

describe('SaleProductsPaymentComponent', () => {
  let component: SaleProductsPaymentComponent;
  let fixture: ComponentFixture<SaleProductsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProductsPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleProductsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
