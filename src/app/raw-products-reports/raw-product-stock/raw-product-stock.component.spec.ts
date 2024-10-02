import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawProductStockComponent } from './raw-product-stock.component';

describe('RawProductStockComponent', () => {
  let component: RawProductStockComponent;
  let fixture: ComponentFixture<RawProductStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawProductStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawProductStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
