import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnNongstReturnComponent } from './purchase-return-nongst-return.component';

describe('PurchaseReturnNongstReturnComponent', () => {
  let component: PurchaseReturnNongstReturnComponent;
  let fixture: ComponentFixture<PurchaseReturnNongstReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseReturnNongstReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseReturnNongstReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
