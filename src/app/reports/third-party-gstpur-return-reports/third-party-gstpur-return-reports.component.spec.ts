import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyGstpurReturnReportsComponent } from './third-party-gstpur-return-reports.component';

describe('ThirdPartyGstpurReturnReportsComponent', () => {
  let component: ThirdPartyGstpurReturnReportsComponent;
  let fixture: ComponentFixture<ThirdPartyGstpurReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyGstpurReturnReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyGstpurReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
