import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewisePurchaseReportsComponent } from './datewise-purchase-reports.component';

describe('DatewisePurchaseReportsComponent', () => {
  let component: DatewisePurchaseReportsComponent;
  let fixture: ComponentFixture<DatewisePurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatewisePurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatewisePurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
