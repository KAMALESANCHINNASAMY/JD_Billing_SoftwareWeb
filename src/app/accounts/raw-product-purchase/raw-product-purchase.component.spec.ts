import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawProductPurchaseComponent } from './raw-product-purchase.component';

describe('RawProductPurchaseComponent', () => {
  let component: RawProductPurchaseComponent;
  let fixture: ComponentFixture<RawProductPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawProductPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawProductPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
