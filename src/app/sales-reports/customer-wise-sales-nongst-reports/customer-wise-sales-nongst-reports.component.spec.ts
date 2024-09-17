import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseSalesNongstReportsComponent } from './customer-wise-sales-nongst-reports.component';

describe('CustomerWiseSalesNongstReportsComponent', () => {
  let component: CustomerWiseSalesNongstReportsComponent;
  let fixture: ComponentFixture<CustomerWiseSalesNongstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerWiseSalesNongstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerWiseSalesNongstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
