import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SareewiseNongstCustomerwiseSalesComponent } from './sareewise-nongst-customerwise-sales.component';

describe('SareewiseNongstCustomerwiseSalesComponent', () => {
  let component: SareewiseNongstCustomerwiseSalesComponent;
  let fixture: ComponentFixture<SareewiseNongstCustomerwiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SareewiseNongstCustomerwiseSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SareewiseNongstCustomerwiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
