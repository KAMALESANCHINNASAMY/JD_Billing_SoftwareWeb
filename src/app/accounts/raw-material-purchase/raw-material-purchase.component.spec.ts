import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialPurchaseComponent } from './raw-material-purchase.component';

describe('RawMaterialPurchaseComponent', () => {
  let component: RawMaterialPurchaseComponent;
  let fixture: ComponentFixture<RawMaterialPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawMaterialPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
