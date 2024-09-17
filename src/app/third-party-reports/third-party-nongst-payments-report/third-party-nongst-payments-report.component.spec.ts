import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyNongstPaymentsReportComponent } from './third-party-nongst-payments-report.component';

describe('ThirdPartyNongstPaymentsReportComponent', () => {
  let component: ThirdPartyNongstPaymentsReportComponent;
  let fixture: ComponentFixture<ThirdPartyNongstPaymentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyNongstPaymentsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyNongstPaymentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
