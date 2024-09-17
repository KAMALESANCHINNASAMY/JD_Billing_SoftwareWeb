import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SareeWiseNongstReportsComponent } from './saree-wise-nongst-reports.component';

describe('SareeWiseNongstReportsComponent', () => {
  let component: SareeWiseNongstReportsComponent;
  let fixture: ComponentFixture<SareeWiseNongstReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SareeWiseNongstReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SareeWiseNongstReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
