import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillnongstReportsComponent } from './sales-billnongst-reports.component';

describe('SalesBillnongstReportsComponent', () => {
  let component: SalesBillnongstReportsComponent;
  let fixture: ComponentFixture<SalesBillnongstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillnongstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillnongstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
