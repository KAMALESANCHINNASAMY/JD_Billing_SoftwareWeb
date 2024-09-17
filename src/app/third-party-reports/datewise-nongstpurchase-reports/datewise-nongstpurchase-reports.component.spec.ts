import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiseNongstpurchaseReportsComponent } from './datewise-nongstpurchase-reports.component';

describe('DatewiseNongstpurchaseReportsComponent', () => {
  let component: DatewiseNongstpurchaseReportsComponent;
  let fixture: ComponentFixture<DatewiseNongstpurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatewiseNongstpurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatewiseNongstpurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
