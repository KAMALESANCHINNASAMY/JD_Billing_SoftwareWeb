import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFromThirdPartyComponent } from './purchase-from-third-party.component';

describe('PurchaseFromThirdPartyComponent', () => {
  let component: PurchaseFromThirdPartyComponent;
  let fixture: ComponentFixture<PurchaseFromThirdPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseFromThirdPartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseFromThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
