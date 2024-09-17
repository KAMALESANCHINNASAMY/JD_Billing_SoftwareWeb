import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillEntryDebitnoteComponent } from './sales-bill-entry-debitnote.component';

describe('SalesBillEntryDebitnoteComponent', () => {
  let component: SalesBillEntryDebitnoteComponent;
  let fixture: ComponentFixture<SalesBillEntryDebitnoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillEntryDebitnoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillEntryDebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
