import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeversWiseReportComponent } from './wevers-wise-report.component';

describe('WeversWiseReportComponent', () => {
  let component: WeversWiseReportComponent;
  let fixture: ComponentFixture<WeversWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeversWiseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeversWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
