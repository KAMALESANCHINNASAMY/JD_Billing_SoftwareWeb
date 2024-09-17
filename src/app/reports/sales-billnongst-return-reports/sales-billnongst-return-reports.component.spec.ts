import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillnongstReturnReportsComponent } from './sales-billnongst-return-reports.component';

describe('SalesBillnongstReturnReportsComponent', () => {
  let component: SalesBillnongstReturnReportsComponent;
  let fixture: ComponentFixture<SalesBillnongstReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillnongstReturnReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillnongstReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
