import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartygstPaymentsReportComponent } from './third-partygst-payments-report.component';

describe('ThirdPartygstPaymentsReportComponent', () => {
  let component: ThirdPartygstPaymentsReportComponent;
  let fixture: ComponentFixture<ThirdPartygstPaymentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThirdPartygstPaymentsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirdPartygstPaymentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
