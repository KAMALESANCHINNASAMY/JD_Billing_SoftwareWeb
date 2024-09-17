import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyGstpurchaseReportsComponent } from './third-party-gstpurchase-reports.component';

describe('ThirdPartyGstpurchaseReportsComponent', () => {
  let component: ThirdPartyGstpurchaseReportsComponent;
  let fixture: ComponentFixture<ThirdPartyGstpurchaseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyGstpurchaseReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyGstpurchaseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
