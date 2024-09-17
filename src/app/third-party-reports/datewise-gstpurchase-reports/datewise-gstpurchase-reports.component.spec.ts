import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiseGstpurchaseReportsComponent } from './datewise-gstpurchase-reports.component';

describe('DatewiseGstpurchaseReportsComponent', () => {
  let component: DatewiseGstpurchaseReportsComponent;
  let fixture: ComponentFixture<DatewiseGstpurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatewiseGstpurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatewiseGstpurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
