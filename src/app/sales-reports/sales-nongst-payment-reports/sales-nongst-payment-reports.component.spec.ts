import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesNongstPaymentReportsComponent } from './sales-nongst-payment-reports.component';

describe('SalesNongstPaymentReportsComponent', () => {
  let component: SalesNongstPaymentReportsComponent;
  let fixture: ComponentFixture<SalesNongstPaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesNongstPaymentReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesNongstPaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
