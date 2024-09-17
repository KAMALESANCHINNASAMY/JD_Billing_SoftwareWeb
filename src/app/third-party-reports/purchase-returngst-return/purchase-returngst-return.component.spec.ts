import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturngstReturnComponent } from './purchase-returngst-return.component';

describe('PurchaseReturngstReturnComponent', () => {
  let component: PurchaseReturngstReturnComponent;
  let fixture: ComponentFixture<PurchaseReturngstReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseReturngstReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseReturngstReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
