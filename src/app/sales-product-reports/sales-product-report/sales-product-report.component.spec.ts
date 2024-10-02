import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProductReportComponent } from './sales-product-report.component';

describe('SalesProductReportComponent', () => {
  let component: SalesProductReportComponent;
  let fixture: ComponentFixture<SalesProductReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesProductReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
