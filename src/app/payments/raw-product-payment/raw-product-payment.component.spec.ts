import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawProductPaymentComponent } from './raw-product-payment.component';

describe('RawProductPaymentComponent', () => {
  let component: RawProductPaymentComponent;
  let fixture: ComponentFixture<RawProductPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawProductPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawProductPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
