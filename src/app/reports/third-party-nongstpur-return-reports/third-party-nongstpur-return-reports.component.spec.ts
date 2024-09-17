import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyNongstpurReturnReportsComponent } from './third-party-nongstpur-return-reports.component';

describe('ThirdPartyNongstpurReturnReportsComponent', () => {
  let component: ThirdPartyNongstpurReturnReportsComponent;
  let fixture: ComponentFixture<ThirdPartyNongstpurReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartyNongstpurReturnReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyNongstpurReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
