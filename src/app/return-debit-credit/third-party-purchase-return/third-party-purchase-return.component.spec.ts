import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyPurchaseReturnComponent } from './third-party-purchase-return.component';

describe('ThirdPartyPurchaseReturnComponent', () => {
  let component: ThirdPartyPurchaseReturnComponent;
  let fixture: ComponentFixture<ThirdPartyPurchaseReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyPurchaseReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
