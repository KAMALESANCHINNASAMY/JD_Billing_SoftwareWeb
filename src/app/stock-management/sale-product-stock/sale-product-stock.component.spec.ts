import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductStockComponent } from './sale-product-stock.component';

describe('SaleProductStockComponent', () => {
  let component: SaleProductStockComponent;
  let fixture: ComponentFixture<SaleProductStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProductStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleProductStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
