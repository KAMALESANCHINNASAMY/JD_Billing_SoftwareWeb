import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillEntryNonGstComponent } from './sales-bill-entry-non-gst.component';

describe('SalesBillEntryNonGstComponent', () => {
  let component: SalesBillEntryNonGstComponent;
  let fixture: ComponentFixture<SalesBillEntryNonGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillEntryNonGstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillEntryNonGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
