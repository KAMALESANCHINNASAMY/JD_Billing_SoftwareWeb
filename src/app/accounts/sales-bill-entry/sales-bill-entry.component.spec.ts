import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillEntryComponent } from './sales-bill-entry.component';

describe('SalesBillEntryComponent', () => {
  let component: SalesBillEntryComponent;
  let fixture: ComponentFixture<SalesBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
