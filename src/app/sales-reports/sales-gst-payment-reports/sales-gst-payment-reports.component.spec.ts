import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGstPaymentReportsComponent } from './sales-gst-payment-reports.component';

describe('SalesGstPaymentReportsComponent', () => {
  let component: SalesGstPaymentReportsComponent;
  let fixture: ComponentFixture<SalesGstPaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesGstPaymentReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesGstPaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
