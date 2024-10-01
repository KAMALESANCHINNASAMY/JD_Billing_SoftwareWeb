import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnSalesProductComponent } from './return-sales-product.component';

describe('ReturnSalesProductComponent', () => {
  let component: ReturnSalesProductComponent;
  let fixture: ComponentFixture<ReturnSalesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnSalesProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnSalesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
