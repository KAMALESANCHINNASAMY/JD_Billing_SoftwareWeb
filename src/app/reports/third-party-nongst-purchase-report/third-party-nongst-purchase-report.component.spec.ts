import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyNongstPurchaseReportComponent } from './third-party-nongst-purchase-report.component';

describe('ThirdPartyNongstPurchaseReportComponent', () => {
  let component: ThirdPartyNongstPurchaseReportComponent;
  let fixture: ComponentFixture<ThirdPartyNongstPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyNongstPurchaseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyNongstPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
