import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseSalesgstReportsComponent } from './customer-wise-salesgst-reports.component';

describe('CustomerWiseSalesgstReportsComponent', () => {
  let component: CustomerWiseSalesgstReportsComponent;
  let fixture: ComponentFixture<CustomerWiseSalesgstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerWiseSalesgstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerWiseSalesgstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
