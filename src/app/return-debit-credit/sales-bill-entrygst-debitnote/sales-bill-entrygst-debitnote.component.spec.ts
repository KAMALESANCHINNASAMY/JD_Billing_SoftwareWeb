import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBillEntrygstDebitnoteComponent } from './sales-bill-entrygst-debitnote.component';

describe('SalesBillEntrygstDebitnoteComponent', () => {
  let component: SalesBillEntrygstDebitnoteComponent;
  let fixture: ComponentFixture<SalesBillEntrygstDebitnoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesBillEntrygstDebitnoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesBillEntrygstDebitnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
