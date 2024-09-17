import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialPurchaseReportsComponent } from './raw-material-purchase-reports.component';

describe('RawMaterialPurchaseReportsComponent', () => {
  let component: RawMaterialPurchaseReportsComponent;
  let fixture: ComponentFixture<RawMaterialPurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawMaterialPurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialPurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
