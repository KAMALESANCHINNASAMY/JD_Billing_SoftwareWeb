import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLedgerNongstComponent } from './sales-ledger-nongst.component';

describe('SalesLedgerNongstComponent', () => {
  let component: SalesLedgerNongstComponent;
  let fixture: ComponentFixture<SalesLedgerNongstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesLedgerNongstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesLedgerNongstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
