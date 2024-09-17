import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyGstLedgerComponent } from './third-party-gst-ledger.component';

describe('ThirdPartyGstLedgerComponent', () => {
  let component: ThirdPartyGstLedgerComponent;
  let fixture: ComponentFixture<ThirdPartyGstLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyGstLedgerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyGstLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
