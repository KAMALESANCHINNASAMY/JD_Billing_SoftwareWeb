import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWiseReportComponent } from './date-wise-report.component';

describe('DateWiseReportComponent', () => {
  let component: DateWiseReportComponent;
  let fixture: ComponentFixture<DateWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateWiseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
