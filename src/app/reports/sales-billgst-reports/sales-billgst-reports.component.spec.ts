import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillgstReportsComponent } from './sales-billgst-reports.component';

describe('SalesBillgstReportsComponent', () => {
  let component: SalesBillgstReportsComponent;
  let fixture: ComponentFixture<SalesBillgstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillgstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillgstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
