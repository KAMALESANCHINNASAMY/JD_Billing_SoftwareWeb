import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillgstReturnReportsComponent } from './sales-billgst-return-reports.component';

describe('SalesBillgstReturnReportsComponent', () => {
  let component: SalesBillgstReturnReportsComponent;
  let fixture: ComponentFixture<SalesBillgstReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillgstReturnReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillgstReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
