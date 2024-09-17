import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyNongstLedgerComponent } from './third-party-nongst-ledger.component';

describe('ThirdPartyNongstLedgerComponent', () => {
  let component: ThirdPartyNongstLedgerComponent;
  let fixture: ComponentFixture<ThirdPartyNongstLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyNongstLedgerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartyNongstLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
